var mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
var dbConfig = require('./dbConfig');
var Q = require('q');

var dburl = "localhost/potluck";
var collections = ['users', 'events'];
var db = require('mongojs').connect(dburl, collections);


module.exports = (function() {
    return {
        create: function(collectionName, body, autoId) {
            var defered = Q.defer();
            console.log(body);
            try {
                db[collectionName].insert(body);
                defered.resolve(true);
            } catch (e) {
                defered.reject(false);
            }
            return defered.promise;
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