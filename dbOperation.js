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
    return "#" + res.results[0].content.cluster + ":" + res.results[0].content.position;
}

var insertIntoDishAllocation = function(uID, eID, dID) {
    var dishAllocationPromise = Q.defer();
    var queryToInsertInDishAllocationTable;
    if (_.isNull(dID) || _.isUndefined(dID) || _.isEmpty(dID)) { // Friends whom dish is not allocated they are invited but no dish allocation for them
        queryToInsertInDishAllocationTable = 'insert into potluck_dish_allocation(event_id,user_id)values([' + eID + '],[' + uID + ']) RETURN @rid';
    } else {
        queryToInsertInDishAllocationTable = 'insert into potluck_dish_allocation(dish_id,event_id,user_id)values([' + dID + '],[' + eID + '],[' + uID + ']) RETURN @rid';
    }
    db.exec(queryToInsertInDishAllocationTable).then(function(res) {
        var dishAllocationID = getRid(res);
        dishAllocationPromise.resolve(dishAllocationID);
    }, function(err) {
        dishAllocationPromise.reject(err);
    });
    return dishAllocationPromise.promise;
};

var saveUsers = function(userEmailId, dishName) {
    var uPromise = Q.defer();
    var userID, obj = {};
    db.exec('insert into potluck_users(email_id,status)values(:emailId, :status)', {
        params: {
            emailId: userEmailId,
            status: 1
        },
        RETURN: "@rid"
    }).then(function(res) {
        userID = getRid(res);
        if (!_.isNull(dishName) && !_.isUndefined(dishName)) {
            saveDish(dishName).then(function(dishId) {
                obj = {
                    "userId": userID,
                    "dishId": dishId
                }
                uPromise.resolve(obj);
            })
        } else {
            obj = {
                "userId": userID
            }
            uPromise.resolve(obj);
        }
    }, function(err) {
        console.log("some problem", err);
        uPromise.reject(err);
    })
    return uPromise.promise;
}

var saveDish = function(dishName) {
    var dishPromise = Q.defer();
    db.exec('insert into potluck_dish(name)values(:name)', {
        params: {
            name: dishName
        },
        RETURN: "@rid"
    }).then(function(res) {
        var recordId = getRid(res);
        dishPromise.resolve(recordId);
    }, function(err) {
        dishPromise.reject(err);
    })
    return dishPromise.promise;
}

module.exports = (function() {
    return {
        create: function(collectionName, body, autoId) {
            var userPromise = [],
                dishAllocationPromiseArray = [],
                userObject = [],
                eventSavePromise = Q.defer();
            for (var index in body.dishAllocation) {
                for (var user in body.dishAllocation[index]) {
                    var obj = {
                        "user": user,
                        "dish": body.dishAllocation[index][user]
                    }
                    userObject.push(obj);
                }
            }
            for (var i = 0; i < body.users.length; i++) {
                var obj = {
                    "user": body.users[i]
                }
                userObject.push(obj);
            }

            db.exec('insert into potluck_events(name,event_date,event_time,location,food_type_id,theme,message) values ("' + body.name + '", "' + body.date + '", "' + body.time + '", "' + body.currentlocation + '", [' + body.foodtype + '], "' + body.theme + '", "' + body.message + '") RETURN @rid').then(function(res) {
                var eventId = getRid(res);
                _.map(userObject, function(v, k, arr) {
                    userPromise.push(saveUsers(arr[k].user, arr[k].dish));
                });

                Q.allSettled(userPromise).then(function(response) {
                    try {
                        _.map(response, function(v, key, arr) {
                            if (arr[key].state === "fulfilled") {
                                var dId;
                                if (_.isUndefined(arr[key].value.dishId)) {
                                    dId = "";
                                } else {
                                    dId = arr[key].value.dishId;
                                }
                                dishAllocationPromiseArray.push(insertIntoDishAllocation(arr[key].value.userId, eventId, dId));
                            }
                        })
                    } catch (e) {
                        eventSavePromise.reject(e);
                    }
                    Q.allSettled(dishAllocationPromiseArray).then(function(response) {
                            eventSavePromise.resolve("event saved successfully");
                        },
                        function(err) {
                            console.log(err);
                            eventSavePromise.reject(err);
                        })
                }, function(err) {
                    console.log(err);
                    eventSavePromise.reject(err);
                });

            }, function(err) {
                console.log(err);
                eventSavePromise.reject(err);
            })
            return eventSavePromise.promise;
        },
        update: function() {

        },
        delete: function() {

        },
        login: function(obj) {
            var defered = Q.defer();
            var query = "select @rid,email_id,username from potluck_users where username='"+obj.username+"' and password ='"+obj.password+"'";
            db.exec("select @rid,email_id,username from potluck_users where username='"+obj.username+"' and password ='"+obj.password+"'").then(function(response){
                    defered.resolve(response);
                },function(err){
                    defered.reject(err);
                });
            return defered.promise;
        },
        find: function(collectionName) {

        },
        findOne: function(id, collectionName, identifer) {

        },
        getFoodType: function() {
            var defered = Q.defer();
            db.query("select * from potluck_food_type").then(function(response) {
                defered.resolve(response);
            }, function(err) {
                defered.reject(false);
            });
            return defered.promise;
        },
        getThemes: function() {
            var defered = Q.defer();
            db.query("select * from potluck_themes").then(function(response) {
                defered.resolve(response);
            }, function(err) {
                defered.reject(false);
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
            db.select('*').from('potluck_events')
                .all().then(function(response) {
                    defered.resolve(response);
                }, function(err) {
                    defered.reject(false);
                });
            return defered.promise;
        },
        create_user: function(body) {
            var defered = Q.defer();
            var query = 'insert into potluck_users(username,email_id,password,status,registerd_by)values("' + body.username + '","' + body.email_id + '","' + md5(body.password) + '",1,"' + body.registerd_by + '") Return @rid';
            db.exec(query).then(function(res) {
                var userID = getRid(res);
                obj = {
                    "userId": userID
                }
                defered.resolve(obj);
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        }
    }
})();