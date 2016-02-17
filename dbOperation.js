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

var saveUsers = function(userEmailId) {
    var uPromise = Q.defer();
    var userID, obj = {};
    db.exec('insert into potluck_users(email_id,password,status,registerd_by,username)values(:emailId,:password,:status,:rby,:username)', {
        params: {
            emailId: userEmailId,
            password: md5('123456'),
            status: 1,
            rby: "app",
            username: userEmailId.match(/([^@]+).+/)[1]
        },
        RETURN: "@rid"
    }).then(function(res) {
        userID = getRid(res);
        obj = {
            "userId": userID
        }
        uPromise.resolve(obj);
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
            for (var i = 0; i < body.users.length; i++) {
                var obj = {
                    "user": body.users[i]
                }
                userObject.push(obj);
            }

            db.exec('insert into potluck_events(name,event_date,event_time,location,food_type_id,theme,message,created_by) values ("' + body.name + '", "' + body.date + '", "' + body.time + '", "' + body.currentlocation + '", [' + body.foodtype + '], "' + body.theme + '", "' + body.message + '",' + body.created_by + ') RETURN @rid').then(function(res) {
                var eventId = getRid(res);
                _.map(userObject, function(v, k, arr) {
                    userPromise.push(saveUsers(arr[k].user));
                });

                Q.allSettled(userPromise).then(function(response) {
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
        update: function() {

        },
        delete: function() {

        },
        login: function(obj) {
            var defered = Q.defer();
            var query = "select @rid,email,name from potluck_users where email='" + obj.email + "' and password ='" + md5(obj.password) + "'";
            db.exec(query).then(function(response) {
                if (response.results[0].content.length)
                    defered.resolve(response);
                else
                    defered.reject("Invalid login/password");
            }, function(err) {
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
            var defered = Q.defer(),
                query,
                checkUser;
            // local user
            switch (body.register_by) {
                case 'local':
                    checkUser = "select @rid from potluck_users where email='" + body.email + "'";
                    query = 'insert into potluck_users(name,email,password)values("' + body.name + '","' + body.email + '","' + md5(body.password) + '") Return @this';
                    break;
                case 'facebook':
                    checkUser = "select @rid from potluck_facebook_users where email='" + body.email + "'";
                    query = 'insert into potluck_users_facebook(id,name,email)values("' + body.id + '","' + body.name + '","' + body.email + '") Return @this';
                    break;
                case 'gplus':
                    checkUser = "select @rid from potluck_facebook_google_plus where email='" + body.email + "'";
                    query = 'insert into potluck_users_google_plus(id,name,email)values("' + body.id + '","' + body.name + '","' + body.email + '") Return @this';
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
                                "name": res.results[0].content.name
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

                })
            }

            return defered.promise;
        }
    }
})();