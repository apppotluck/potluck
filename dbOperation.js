// var mongo = require("mongodb");
// var MongoClient = require('mongodb').MongoClient;
// var dbConfig = require('./dbConfig');
// var Q = require('q');

// var dburl = "localhost/potluck";
// var collections = ['users', 'events'];
// var db = require('mongojs').connect(dburl, collections);

var Oriento = require('oriento');

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

module.exports = (function() {
    return {
        create: function(collectionName, body, autoId) {
            db.query('insert into events (name,date,time,location,foodTypeId,themeId,Message) values (:name, :date, :time, :location, :foodTypeId, :themeId, :message)', {
                params: {
                    name: 'demo',
                    date: '11/01/2015',
                    time: '9:30 AM',
                    location: 'Cassini Dr, Columbus, OH 43240, USA',
                    foodTypeId: '2',
                    themeId: 1,
                    message: "Personal message"
                }
            }).then(function(response) {
                console.log(response); //an Array of records inserted
            });
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

        }
    }
})();