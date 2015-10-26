var express = require('express'),
    open = require('open'),
    Q = require('q'),
    faker = require('faker'),
    dbOperation = require('./dbOperation'),
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

app.get('/*', function(req, res) {
    res.sendfile(__dirname + '/app/index.html');
});

app.post('/create-event', function(req, res) {
    var body = req.body;
    console.log(body);
    dbOperation.create('events', body).then(function(result) {
        var authResponse = {
            responseData: {
                message: 'success'
            }
        }
        res.json(authResponse);
        res.send();
    }, function(err) {

    })

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
    open('http://localhost:8000/');
});

console.log('Listening on port 8000');