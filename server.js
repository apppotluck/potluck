var express = require('express'),
    open = require('open'),
    Q = require('q'),
    faker = require('faker'),
    dbOperation = require('./dbOperation'),
    jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
    app = express(),
    config = require('./config');

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('superSecret', config.secret); // secret variable



app.get('/random/user', function(req, res) {
    var user = faker.helpers.userCard()
    user.avatar = faker.image.avatar();
    res.json(user);
})

app.get('/getFoodType', function(req, res) {
    dbOperation.getFoodType().then(function(foodTypeResponse) {
        res.json(foodTypeResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

app.get('/getThemes', function(req, res) {
    dbOperation.getThemes().then(function(themesResponse) {
        res.json(themesResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

app.get('/getEvents', function(req, res) {
    dbOperation.getEvents().then(function(eventsResponse) {
        res.json(eventsResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

app.get('/*', function(req, res) {
    res.sendfile(__dirname + '/app/index.html');
});

app.get('/db', function() {})


app.post('/create-event', function(req, res) {
    var body = req.body;
    dbOperation.create('events', body)
        .then(function(result) {
            var authResponse = {
                responseData: {
                    status: "success",
                    message: result
                }
            }
            res.json(authResponse);
            res.send();
        }, function(err) {
            var authResponse = {
                responseData: {
                    status: "failed",
                    message: "something went wrong. Please try again later"
                }
            }
            res.json(authResponse);
            res.send();
        })
})
app.post('/auth/user', function(req, res) {
    var body = req.body;
    dbOperation.login(body).then(function(response) {
        var user = response.results[0].content[0].value;
        var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn: 1440 // expires in 24 hours
        });
              
        var authResponse = {
            responseData: {
                message:'success',
                token: token
            }
        }
        res.json(authResponse);
        res.send();
    }, function(err) {
        console.log(err);
        var authResponse = {
            responseData: {
                message: 'fail'
            }
        }
        res.json(authResponse);
        res.send();
    });
});

app.post('/create-user', function(req, res) {
    // var body =req.body;
    // dbOperation.create_user(body).then(function(result) {
    //     var authResponse = {
    //         responseData: {
    //             message: 'success'
    //         }
    //     }
    //     res.json(authResponse);
    //     res.send();
    // },function(err) {
    //     var authResponse = {
    //         responseData: {
    //             message: 'fail'
    //         }
    //     }
    //     res.json(authResponse);
    //     res.send();
    // })
    var userObject = new User({
        name: 'puneet',
        password: 'password',
        email: 'puneetsiet@gmail.com',
        status: 1,
        registered_by: 'app'
    });
    dbOperation.create_user(userObject).then(function(result) {

    }, function(err) {

    })
})

app.listen(8000, function(err, res) {
    // open('http://localhost:8000/');
});

console.log('Listening on port 8000');