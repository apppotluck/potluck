var express = require('express'),
    open = require('open'),
    Q = require('q'),
    faker = require('faker'),
    dbOperation = require('./dbOperation'),
    // dbOp = require('./db_open_close'),
    app = express();

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));



app.get('/random/user', function(req, res) {
    var user = faker.helpers.userCard()
    user.avatar = faker.image.avatar();
    res.json(user);
})

app.get('/getFoodType',function(req,res){
    dbOperation.getFoodType().then(function(foodTypeResponse){
         res.json(foodTypeResponse);
         res.send();
    },function(err){
        res.json("error");
        res.send();
    })
});

app.get('/getThemes',function(req,res){
    dbOperation.getThemes().then(function(themesResponse){
         res.json(themesResponse);
         res.send();
    },function(err){
        res.json("error");
        res.send();
    })
});


app.get('/*', function(req, res) {
    res.sendfile(__dirname + '/app/index.html');
});

app.get('/db',function(){
})


app.post('/create-event', function(req, res) {
    var body = req.body;
    console.log(body);
    dbOperation.create('events', body);
    // .then(function(result) {
    //     var authResponse = {
    //         responseData: {
    //             message: 'success'
    //         }
    //     }
    //     res.json(authResponse);
    //     res.send();
    // }, function(err) {

    // })

})
app.post('/auth/user', function(req, res) {

    var body = req.body;
    dbOperation.login('users', body).then(function(result) {
        var authResponse = {
            responseData: {
                message: 'success'
            }
        }
        res.json(authResponse);
        res.send();
    }, function(err) {
        console.log("err ====>", err);
        var authResponse = {
            responseData: {
                message: 'fail'
            }
        }
        res.json(authResponse);
        res.send();
    });
});

app.listen(8000, function(err, res) {
    // open('http://localhost:8000/');
});

console.log('Listening on port 8000');