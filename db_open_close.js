var Oriento = require('oriento');

var server = Oriento({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'demo'
});

// List databases
server.list().then(function(dbs) {
    console.log('There are ' + dbs.length + ' databases on the server.');
}, function(err) {
    console.log(err);
});

var db = server.use({
    name: 'potluck',
    username: 'root',
    password: 'demo'
});

module.exports = (function() {
    return {
        create: function(body) {
            console.log("inside create");
            var defered = Q.defer();
            console.log(body);
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
            db.query("select * from FoodType").then(function(response) {
                defered.resolve(response);
            },function(err){
                defered.reject(false);
            });
            return defered.promise;
        }
    }
});
// db.query('select * from potluck_users').then(function(results) {
//     console.log(results);
// });