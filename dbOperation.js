var Q = require('q'),
    _ = require('underscore'),
    Oriento = require('oriento'),
    util = require("util"),
    EventEmitter = require("events").EventEmitter,
    md5 = require('md5'),
    nodemailer = require('nodemailer');

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

var updateInviteFriendStatus = function(email_id, uid) {

    var selectQuery = "select * from potluck_invite_friends where email_id='" + email_id + "'";
    db.exec(selectQuery).then(function(res) {
        var event_id=[]
        _.map(res.results[0].content,function(content,key) {
            event_id.push(content.value.event_id)
        })
        if (res.results[0].content.length) {
            var updateUid = "update potluck_invite_friends SET user_id =" + uid + " where email_id = '" + email_id + "'";
            var updateUsers = "update " + uid + " add inviteed_to = [" + event_id +"]";
            db.exec(updateUid).then(function(res) {
                db.exec(updateUsers).then(function(res) {}, function(err) {})
            }, function(err) {

            })

        }
    }, function(err) {

    })
}

var saveInviteFriend = function(friendEmail, event_id) {
    var inviteFriendPromise = Q.defer();
    var userID, obj = {};
    var checkUsers = "select * from potluck_users where email = '" + friendEmail + "'";
    db.exec(checkUsers).then(function(response) {
        if (response.results[0].content.length) {
            var userId = getRid(response);
            var query = 'insert into potluck_invite_friends(email_id,event_id,user_id) values ("' + friendEmail + '", ' + event_id + ', '+userId+') RETURN @rid';
        } else {
            var query = 'insert into potluck_invite_friends(email_id,event_id) values ("' + friendEmail + '", ' + event_id + ') RETURN @rid';
        }
        db.exec(query).then(function(res) {
            invite_id = getRid(res);
            if (response.results[0].content.length) {
                var userId = getRid(response);
                // In case of registered user update users.invitted_to field
                var updateUsers = "update " + userId + " add inviteed_to = " + event_id;
                obj = {
                    "invite_id": invite_id
                }
                db.exec(updateUsers).then(function(response) {
                    inviteFriendPromise.resolve(obj);
                }, function(err) {
                    console.log("some problem while updaing users with inviteed_to", err);
                    inviteFriendPromise.reject(err);
                });
            } else {
                obj = {
                    "invite_id": invite_id
                }
                // send mail to invitees
                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport('smtps://puneetsiet@gmail.com:P@ssword123456@smtp.gmail.com');
                var mailOptions = {
                    from: '"Fred Potluck" <potluck@gmail.com>', // sender address
                    to: friendEmail, // list of receivers
                    subject: 'Potluck mail', // Subject line
                    text: 'Please join the app to see the event.Click here to login/register', // plaintext body
                    html: '<b>Please join the app to see the event. <a href="http://localhost:8000/">Click here</a> to login/register</b>' // html body
                };
                // send mail with defined transport object
                // transporter.sendMail(mailOptions, function(error, info) {
                //     if (error) {
                //         return console.log(error);
                //     }
                //     console.log('Message sent: ' + info.response);
                // });
                inviteFriendPromise.resolve(obj);
            }
        }, function(err) {
            console.log("some problem", err);
            inviteFriendPromise.reject(err);
        })
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
var save_menu = function(body) {
    var defered = Q.defer();

    var query = "insert into potluck_event_menu(name,description,event_id,added_by,created_date) values ('" + body.name + "','" + body.desc + "'," + body.event_id + "," + body.added_by + ",'" + Date.now() + "')"
    db.exec(query).then(function(response) {
        defered.resolve(response);
    }, function(err) {
        defered.reject(err);
    });
    return defered.promise;
};

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
            var query = 'insert into potluck_events(name,event_date,event_time,location,food_type,theme,message,created_by,created_date,status) values ("' + body.name + '", "' + body.date + '", "' + body.time + '", "' + body.currentlocation + '", "' + body.foodtype + '", "' + body.theme + '", "' + body.message + '",' + body.created_by + ',"' + Date.now() + '",1) RETURN @rid';
            db.exec(query).then(function(res) {
                var eventId = getRid(res);
                _.map(friendsObject, function(v, k, arr) {
                    friendPromise.push(saveInviteFriend(arr[k].friend, eventId));
                });

                Q.allSettled(friendPromise).then(function(response) {
                    _.map(response, function(v, k, a) {
                        if (v.state === 'fulfilled') {
                            var updateEvent = "update " + eventId + " add invitees = " + v.value.invite_id;
                            db.exec(updateEvent)
                        }
                    });
                    var updateUsers = "update " + body.created_by + " add created_events = " + eventId;
                    db.exec(updateUsers).then(function(res) {
                        eventSavePromise.resolve("event saved successfully");
                    }, function(err) {
                        eventSavePromise.reject(err);
                    })

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
                } else
                    defered.reject("Invalid login/password");
            }, function(err) {
                defered.reject(err);
            });
            return defered.promise;
        },
        getEventDetails: function(eventId) {
            var defered = Q.defer();
            db.query('select @rid,name,event_date,location,food_type,theme,message,event_time,created_by,created_by.name as hostname,accepted_users,declined_users,may_be_accepted_user from potluck_events where @rid = "' + eventId + '" and status = 1')
                .then(function(response) {
                    db.query('select email_id,@rid,user_id,user_id.name as username from potluck_invite_friends where event_id=' + eventId).then(function(inviteesResponse) {
                        response[0].invitees = inviteesResponse;
                        defered.resolve(response);
                    }, function(err) {
                        defered.reject(false);
                    })
                }, function(err) {
                    defered.reject(false);
                });
            return defered.promise;
        },
        getEvents: function(uid) {
            var defered = Q.defer();
            var query = "select *,created_by.name as created_user from (select expand($c) let $a = (SELECT expand(created_events) from potluck_users where @rid = " + uid + "), $b = (SELECT expand(inviteed_to) from potluck_users where @rid = " + uid + "),$c = unionAll( $a, $b )) where status = 1";
            db.exec(query).then(function(result) {
                defered.resolve(result);
            }, function(e) {
                defered.reject(false)
            })
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
                            updateInviteFriendStatus(body.email, userID);
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
                            updateInviteFriendStatus(body.email, userID);
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
        },
        insert_menu: function(body) {
            var defered = Q.defer();
            var promiseArray = [];
            for (var i = 0; i < body.length; i++) {
                promiseArray.push(save_menu(body[i]));
            }
            Q.allSettled(promiseArray).then(function(response) {
                if (response[0].state === 'fulfilled') {
                    defered.resolve(response);
                } else {
                    defered.reject("try again.");
                }
            }, function(err) {
                defered.reject(err);
            });
            return defered.promise;
        },
        getEventMenuDetails: function(eventId) {
            var defered = Q.defer();
            var query = "select @rid,name,description,added_by, added_by.name as user,created_date from potluck_event_menu where event_id=" + eventId
            db.exec(query).then(function(response) {
                var selectQuery = "select @rid,image,menu_id from potluck_menu_images";
                db.exec(selectQuery).then(function(res) {
                    var object = {
                        "menu": response.results[0].content,
                        "menu_image": res.results[0].content
                    }
                    defered.resolve(object);
                }, function(err) {
                    defered.reject(object);
                })
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        },
        updateMenuImage: function(menu_id, fileName) {
            var defered = Q.defer();
            var query = "insert into potluck_menu_images(menu_id,image)values(" + menu_id + ",'" + fileName + "')";
            db.exec(query).then(function(response) {
                defered.resolve(response);
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        },
        deleteMenuImage: function(menu_id, image_id) {
            var defered = Q.defer();
            var query = "delete from potluck_menu_images where menu_id=" + menu_id + " and @rid=" + image_id;
            db.exec(query).then(function(response) {
                defered.resolve(response);
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        },
        updateEventMenu: function(body) {
            var defered = Q.defer();
            var query = "update potluck_event_menu SET name='" + body.name + "', description='" + body.description + "' where @rid=" + body.rid;
            db.exec(query).then(function(response) {
                defered.resolve(response);
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        },
        updateEventAcceptanceStatus: function(body) {
            var defered = Q.defer();
            /*
               body.type == 1 = accepted
               body.type == 2 = declined
               body.type == 3 = maybe
            */
            var userUpdate,
                eventUpdate;

            if (body.type === 1) {
                userUpdate = "update " + body.user_id + " add accepted_events =" + body.event_id;
                eventUpdate = "update " + body.event_id + " add accepted_users =" + body.user_id;
            } else if (body.type === 2) {
                userUpdate = "update " + body.user_id + " add declined_events =" + body.event_id;
                eventUpdate = "update " + body.event_id + " add declined_users =" + body.user_id;
            } else {
                userUpdate = "update " + body.user_id + " add may_be_accepted_event =" + body.event_id;
                eventUpdate = "update " + body.event_id + " add may_be_accepted_user =" + body.user_id;
            }

            db.exec(userUpdate).then(function(response) {
                db.exec(eventUpdate).then(function(updatedUserResponse) {
                    defered.resolve(updatedUserResponse);
                }, function(err) {
                    defered.reject(err);
                })
            }, function(err) {
                defered.reject(err);
            })
            return defered.promise;
        },
        cancelEvents: function(event_id,uid) {
            var defered = Q.defer();
            var query="update potluck_events set status=0 where created_by="+uid+" and @rid="+event_id;
            console.log(query)
            db.exec(query).then(function(updatedEvent){
                defered.resolve(true);
            },function(err){
                defered.reject(err);
            })            
            return defered.promise;
        }
    }
})()