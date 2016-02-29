var express = require('express'),
    bodyParser = require('body-parser'),
    open = require('open'),
    Q = require('q'),
    dbOperation = require('./dbOperation'),
    jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
    favicon = require('serve-favicon'),
    multer = require('multer'),
    fs = require('fs'),
    app = express(),
    config = require('./config');

var storage = multer.diskStorage({
    limits: {
        fileSize: 500000
    },
    destination: function(req, file, callback) {
        callback(null, './app/assets/uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('file');


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.set('superSecret', config.secret); // secret variable
app.use(favicon(__dirname + '/favicon.ico'));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
app.get('/create-event', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
app.get('/events', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});
app.get('/event-details/:id', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

apiRoutes.get('/getFoodType', function(req, res) {
    dbOperation.getFoodType().then(function(foodTypeResponse) {
        res.json(foodTypeResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

apiRoutes.get('/getThemes', function(req, res) {
    dbOperation.getThemes().then(function(themesResponse) {
        res.json(themesResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

apiRoutes.get('/getEvents', function(req, res) {
    dbOperation.getEvents().then(function(eventsResponse) {
        res.json(eventsResponse);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});

apiRoutes.get('/getEventDetails/:eId', function(req, res) {
    dbOperation.getEventDetails(req.params.eId).then(function(eventDetails) {
        res.json(eventDetails);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});


apiRoutes.post('/create-event', function(req, res) {
    var body = req.body;
    dbOperation.createEvent('events', body)
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
            console.log(err)
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

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8000/potluck/auth/user

apiRoutes.post('/auth/user', function(req, res) {
    var body = req.body;
    dbOperation.login(body).then(function(response) {
        var user = response;
        var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn: '2 days' // expires in 24 hours
        });

        var authResponse = {
            responseData: {
                message: 'success',
                token: token
            }
        }
        res.json(authResponse);
        res.send();
    }, function(err) {
        var authResponse = {
            responseData: {
                message: 'fail'
            }
        }
        res.json(authResponse);
        res.send();
    });
});

apiRoutes.post('/create-user', function(req, res) {
    var body = req.body;
    dbOperation.create_user(body).then(function(response) {
        var token = jwt.sign(response, app.get('superSecret'), {
            expiresIn: "2 days" // expires in 24 hours
        });
        var authResponse = {
            responseData: {
                message: 'success',
                token: token
            }
        }
        res.json(authResponse);
        res.send();
    }, function(err) {
        var authResponse = {
            responseData: {
                message: 'fail',
                error: err
            }
        }
        res.json(authResponse);
        res.send();
    })
})

apiRoutes.post('/insert-menu', function(req, res) {
    var body = req.body;
    dbOperation.insert_menu(body).then(function(response) {
        var menuUpdateResponse = {
            responseData: {
                message: 'success'
            }
        }
        res.json(menuUpdateResponse);
        res.send();
    }, function(err) {
        var menuUpdateResponse = {
            responseData: {
                message: 'fail',
                error: err
            }
        }
        res.json(menuUpdateResponse);
        res.send();
    })
})

apiRoutes.get('/get-menu-details/:eId', function(req, res) {
    dbOperation.getEventMenuDetails(req.params.eId).then(function(eventMenuDetails) {
        res.json(eventMenuDetails);
        res.send();
    }, function(err) {
        res.json("error");
        res.send();
    })
});
apiRoutes.post('/dish/image/:menu_id', function(req, res) {
    upload(req, res, function(err, result) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            var fileObject = {
                "filename": req.file.filename,
                "destination": req.file.path
            }
            dbOperation.updateMenuImage(req.params.menu_id,req.file.filename).then(function(response){
                res.json(fileObject)
                res.send();
            },function(err){
                res.json("error");
                res.send();
            })
        }
    });
})
apiRoutes.get('/delete-menu-image/:image_id/:menu_id',function(req,res){
    dbOperation.deleteMenuImage(req.params.menu_id,req.params.image_id).then(function(eventMenuDetails) {
        var menuImageDeleteResponse = {
            responseData: {
                message: 'success'
            }
        }
        res.json(menuImageDeleteResponse);
        res.send();
    }, function(err) {
        var menuImageDeleteResponse = {
            responseData: {
                message: 'fail',
                error: err
            }
        }
        res.json(menuImageDeleteResponse);
        res.send();
    })
})

apiRoutes.post('/update-menu', function(req, res) {
    var body = req.body;
    dbOperation.updateEventMenu(body).then(function(response) {
        var menuUpdateResponse = {
            responseData: {
                message: 'success'
            }
        }
        res.json(menuUpdateResponse);
        res.send();
    }, function(err) {
        var menuUpdateResponse = {
            responseData: {
                message: 'fail',
                error: err
            }
        }
        res.json(menuUpdateResponse);
        res.send();
    })
})

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
app.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers["x-access-token"];
    if (req.headers.skipauthorization) { // In case of login of autherization is not required
        next();
    } else {
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
});

app.use('/potluck', apiRoutes);

app.listen(8000, function(err, res) {
    // open('http://localhost:8000/');
});

console.log('Listening on port 8000');