var Q           = require('q'),
_               = require('underscore'),
Oriento         = require('oriento'),
util            = require("util"),
EventEmitter    = require("events").EventEmitter;

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


var saveUsers = function(userEmailId) {
    var uPromise = Q.defer();
    db.query('insert into potluck_users(emailId,status)values(:emailId, :status)',{
        params: {
            emailId: userEmailId,
            status: "active"
        },
        RETURN:"@rid"
    }).then(function(res){
        uPromise.resolve(res);
    },function(err){
        uPromise.reject(err);
    })
    return uPromise.promise;
}

module.exports = (function() {
    return {
        create: function(collectionName, body, autoId) {
            var userPromise = [],
                dishAllocationPromise = [];
            console.log(body);
            // for(var i=0;i<body.users.length;i++) {
            //     userPromise.push(saveUsers(body.users[i]));
            // }
            for(var index in body.dishAllocation) {
                for(var dish in body.dishAllocation[index]) {
                    console.log(dish,"===",body.dishAllocation[index][dish])
                }
                // dishAllocationPromise
            }
            // Q.allSettled(userPromise).then(function(response){
            //     if(response.length > 0) {
            //         for(var j=0;j<response.length;j++) {
            //             if(response[j].state === "fulfilled") {
            //                 recordObject = JSON.parse(JSON.stringify(response[j].value));
            //                 userId = recordObject[0]['@rid'];

            //             }
            //         }
            //     }
            // },function(err){
            //     console.log(err);
            // })
            // db.query('insert into events (name,date,time,location,foodTypeId,themeId,Message) values (:name, :date, :time, :location, :foodTypeId, :themeId, :message)', {
            //     params: {
            //         name: 'demo',
            //         date: '11/01/2015',
            //         time: '9:30 AM',
            //         location: 'Cassini Dr, Columbus, OH 43240, USA',
            //         foodTypeId: '2',
            //         themeId: 1,
            //         message: "Personal message"
            //     }
            // }).then(function(response) {
            //     console.log(response); //an Array of records inserted
            // });
            // var defered = Q.defer();
            // console.log(body);
            // try {
            //     db[collectionName].insert(body);
            //     defered.resolve(true);
            // } catch (e) {
            //     defered.reject(false);
            // }
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
        getFoodType: function(){
            var defered = Q.defer();
            db.query("select * from potluck_FoodType").then(function(response) {
                defered.resolve(response);
            },function(err){
                defered.reject(false);
            });
            return defered.promise;
        },
        getThemes: function(){
          var defered = Q.defer();
            db.query("select * from potluck_themes").then(function(response) {
                defered.resolve(response);
            },function(err){
                defered.reject(false);
            });
            return defered.promise;  
        }

    }
})();