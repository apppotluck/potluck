var Q = require('q'),
    _ = require('underscore'),
    Oriento = require('oriento'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter;

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
    if (_.isNull(dID) || _.isUndefined(dID)) { // Friends whom dish is not allocated they are invited but no dish allocation for them
        dId = "";
    }
    console.log(uID,"==",eID,"===",dID);
    db.exec('insert into potluck_Dish_Allocation(DishId,eventId,usersId)values(:dishId,:eventId,:friendId)', {
        params: {
            dishId: dID,
            eventId: eID,
            friendId: uID
        },
        RETURN: "@rid"
    }).then(function(res) {
        var dishAllocationID = getRid(res);
        console.log("dishAllocationID====>", dishAllocationID);
        dishAllocationPromise.resolve(dishAllocationID);
    }, function(err) {
        console.log("insertIntoDishAllocation error===>", err);
        dishAllocationPromise.reject(err);
    });
    return dishAllocationPromise.promise;
};

var saveUsers = function(userEmailId, dishName) {
    var uPromise = Q.defer();
    var userID, obj = {};
    db.exec('insert into potluck_users(emailId,status)values(:emailId, :status)', {
        params: {
            emailId: userEmailId,
            status: "active"
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
                userObject = [];
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

            db.exec('insert into potluck_events(name,date,time,location,foodTypeId,themeId,Message) values (:name, :date, :time, :location, :foodTypeId, :themeId, :message)', {
                    params: {
                        date: body.date,
                        foodTypeId: body.foodType,
                        location: body.currentlocation,
                        message: body.message,
                        name: body.name,
                        time: body.time,
                        theme: body.theme
                    },
                    RETURN: "@rid"
                }).then(function(res) {
                    var eventId = getRid(res);
                    _.map(userObject, function(v, k, arr) {
                        userPromise.push(saveUsers(arr[k].user, arr[k].dish));
                    });

                    Q.allSettled(userPromise).then(function(response) {
                        try {
                            _.map(response, function(v, key, arr) {
                                if (arr[key].state === "fulfilled") {
                                    // console.log(arr[key].value.userId, "====", arr[key].value.dishId, "=====", eventId)
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
                            console.log("error=>", e);
                        }
                        Q.allSettled(dishAllocationPromiseArray).then(function(response) {
                                console.log("response all inserted===>", response);
                            },
                            function(err) {
                                console.log(err);
                            })
                    }, function(err) {
                        console.log(err);
                    });

                }, function(err) {
                    console.log(err);
                })
                // return defered.promise;
        },
        update: function() {

        },
        delete: function() {

        },
        login: function(collectionName, obj) {
            var defered = Q.defer();
            try {
                defered.resolve(true);
            } catch (err) {
                console.log("error", err);
                defered.reject(err);
            }
            return defered.promise;
        },
        find: function(collectionName) {

        },
        findOne: function(id, collectionName, identifer) {

        },
        getFoodType: function() {
            var defered = Q.defer();
            db.query("select * from potluck_FoodType").then(function(response) {
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
        }

    }
})();