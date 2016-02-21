var Q = require('q'),
    _ = require('underscore'),
    Oriento = require('oriento'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    md5 = require('md5');

var server = Oriento({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'demo'
});

var db = server.use({
    name: 'potluck',
    username: 'root',
    password: 'demo'
});

var getRid = function(res) {
    var resultArray = [];
    resultArray.push(res.results[0].content);
    var result = _.flatten(resultArray);
    return "#" + result[0].cluster + ":" + result[0].position;
}

// var insertIntoDishAllocation = function(uID, eID, dID) {
//     var dishAllocationPromise = Q.defer();
//     var queryToInsertInDishAllocationTable;
//     if (_.isNull(dID) || _.isUndefined(dID) || _.isEmpty(dID)) { // Friends whom dish is not allocated they are invited but no dish allocation for them
//         queryToInsertInDishAllocationTable = 'insert into potluck_dish_allocation(event_id,user_id)values([' + eID + '],[' + uID + ']) RETURN @rid';
//     } else {
//         queryToInsertInDishAllocationTable = 'insert into potluck_dish_allocation(dish_id,event_id,user_id)values([' + dID + '],[' + eID + '],[' + uID + ']) RETURN @rid';
//     }
//     db.exec(queryToInsertInDishAllocationTable).then(function(res) {
//         var dishAllocationID = getRid(res);
//         dishAllocationPromise.resolve(dishAllocationID);
//     }, function(err) {
//         dishAllocationPromise.reject(err);
//     });
//     return dishAllocationPromise.promise;
// };

var saveInviteFriend = function(friendEmail, event_id) {
    var inviteFriendPromise = Q.defer();
    var userID, obj = {};
    var query = 'insert into potluck_invite_friends(email_id,event_id,registerd) values ("' + friendEmail + '", [' + event_id + '],0) RETURN @rid';
    db.exec(query).then(function(res) {
        invite_id = getRid(res);
        obj = {
            "invite_id": invite_id
        }
        inviteFriendPromise.resolve(obj);
    }, function(err) {
        console.log("some problem", err);
        inviteFriendPromise.reject(err);
    })
    return inviteFriendPromise.promise;
}

// var saveDish = function(dishName) {
//     var dishPromise = Q.defer();
//     db.exec('insert into potluck_dish(name)values(:name)', {
//         params: {
//             name: dishName
//         },
//         RETURN: "@rid"
//     }).then(function(res) {
//         var recordId = getRid(res);
//         dishPromise.resolve(recordId);
//     }, function(err) {
//         dishPromise.reject(err);
//     })
//     return dishPromise.promise;
// }

module.exports = (function() {
    return {
        createEvent: function(collectionName, body, autoId) {
            var friendPromise = [],
                friendsObject = [],
                eventSavePromise = Q.defer();
            for (var i = 0; i < body.friends.length; i++) {
                var obj = {
                    "friend": body.friends[i]
                }
                friendsObject.push(obj);
            }
            var query = 'insert into potluck_events(name,event_date,event_time,location,food_type,theme,message,created_by) values ("' + body.name + '", "' + body.date + '", "' + body.time + '", "' + body.currentlocation + '", "' + body.foodtype + '", "' + body.theme + '", "' + body.message + '",[' + body.created_by + ']) RETURN @rid';
            db.exec(query).then(function(res) {
                var eventId = getRid(res);
                _.map(friendsObject, function(v, k, arr) {
                    friendPromise.push(saveInviteFriend(arr[k].friend, eventId));
                });

                Q.allSettled(friendPromise).then(function(response) {
                    eventSavePromise.resolve("event saved successfully");
                }, function(err) {
                    eventSavePromise.reject(err);
                });
            }, function(err) {
                console.log(err);
                eventSavePromise.reject(err);
            })
            return eventSavePromise.promise;
        },
        login: function(obj) {
            var defered = Q.defer();
            var query = "select * from potluck_users where email='" + obj.email + "' and password ='" + md5(obj.password) + "' and type = 'local'";
            db.exec(query).then(function(response) {
                 if (response.results[0].content.length) {
                    var userID = getRid(response);
                    var userObj = {
                            "userId": userID,
                            "email": response.results[0].content[0].value.email,
                            "name": response.results[0].content[0].value.name,
                            "register_by": "local"
                        }
                    defered.resolve(userObj);
                }
                else
                    defered.reject("Invalid login/password");
            }, function(err) {
                defered.reject(err);
            });
            return defered.promise;
        },
        getEventDetails: function() {
            var defered = Q.defer();
            db.select('event_id as eId,event_id.name as eventName,event_id.location as location,event_id.event_time as event_time,event_id.event_date as event_date,event_id.message as event_message,event_id.theme as event_theme,user_id.email_id as email_id,dish_id.name as dish_name,event_id.food_type_id.name as type_name').from('potluck_dish_allocation')
                .all().then(function(response) {
                    defered.resolve(response);
                }, function(err) {
                    defered.reject(false);
                });
            return defered.promise;
        },
        getEvents: function() {
            var defered = Q.defer();
            db.query('select @rid,name,event_date,location,food_type,theme,message,event_time,created_by,created_by.name as hostname from potluck_events')
                .then(function(response) {
                    defered.resolve(response);
                }, function(err) {
                    defered.reject(false);
                });
            return defered.promise;
        },
        create_user: function(body) {
            var defered = Q.defer(),
                query,
                checkUser;
            // local user
            switch (body.register_by) {
                case 'local':
                    checkUser = "select @rid from potluck_users where email='" + body.email + "' and type = 'local'";
                    query = 'insert into potluck_users(name,email,password,type)values("' + body.name + '","' + body.email + '","' + md5(body.password) + '","local") Return @this';
                    break;
                case 'facebook':
                    checkUser = "select * from potluck_users where email='" + body.email + "' and type = 'facebook'";
                    query = 'insert into potluck_users(uuid,name,email,type)values("' + body.id + '","' + body.name + '","' + body.email + '","facebook") Return @this';
                    break;
                case 'gplus':
                    checkUser = "select @rid from potluck_users where email='" + body.email + "' and type='gplus'";
                    query = 'insert into potluck_users(uuid,name,email,type)values("' + body.id + '","' + body.name + '","' + body.email + '","gplus") Return @this';
                    break;
            }
            // user is local 
            if (body.register_by === "local") {
                db.exec(checkUser).then(function(response) {
                    if (!response.results[0].content.length) {
                        db.exec(query).then(function(res) {
                            var userID = getRid(res);
                            obj = {
                                "userId": userID,
                                "email": res.results[0].content.value.email_id,
                                "name": res.results[0].content.name,
                                "register_by": "local"
                            }
                            defered.resolve(obj);
                        }, function(err) {
                            defered.reject(err);
                        })
                    } else {
                        defered.reject('Email already exists');
                    }
                });
            } else if (body.register_by === "facebook") {
                db.exec(checkUser).then(function(response) {
                    if (!response.results[0].content.length) {
                        db.exec(query).then(function(res) {
                            var userID = getRid(res);
                            obj = {
                                "userId": userID,
                                "email": res.results[0].content.value.email,
                                "name": res.results[0].content.name,
                                "register_by": "facebook"
                            }
                            defered.resolve(obj);
                        }, function(err) {
                            defered.reject(err);
                        })
                    } else {
                        var userID = getRid(response);
                        // login with details
                        obj = {
                            "userId": userID,
                            "email": body.email,
                            "name": body.name,
                            "register_by": "facebook"
                        }
                        defered.resolve(obj)
                    }
                })
            }
            return defered.promise;
        }
    }
})();