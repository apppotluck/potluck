define(['app'], function(app) {
    app.controller('HomeViewController', [
        '$scope',
        'API',
        '$location',
        '$facebook',
        'twitterService',
        'jwtHelper',
        '$localStorage',
        '$rootScope',
        function($scope, API, $location, $facebook, twitterService, jwtHelper, $localStorage,$rootScope) {
            $scope.constants = constants;
            $scope.invalidUser = false;
            // if(typeof $localStorage.token !== "undefined") {
            //     $location.path('events');
            // }
            // When the user clicks to fb connect
            $scope.fbLogin = function() {
                $facebook.login().then(function() {
                    refresh();
                });
            };

            function refresh() {
                $facebook.api("/me?fields=id,name,email").then(
                    function(response) {
                        response.register_by='facebook';
                        API.authAndRegister(response);
                    },
                    function(err) {
                        $scope.welcomeMsg = "Please log in";
                    });
            };

            //            refresh();

            //using the OAuth authorization result get the latest 20 tweets from twitter for the user
            $scope.refreshTimeline = function() {
                // $location.path('intro');
            }

            // twitterService.initialize();
            // //when the user clicks the connect twitter button, the popup authorization window opens
            // $scope.twiiterConnect = function() {
            //     twitterService.connectTwitter().then(function() {
            //         if (twitterService.isReady()) {
            //             //if the authorization is successful, hide the connect button and display the tweets
            //             $scope.twitterLoginButton = true;

            //         }
            //     });
            // };
            // //if the user is a returning user, hide the sign in button and display the tweets
            // if (twitterService.isReady()) {
            //     $scope.refreshTimeline();
            // }
            $scope.$on('event:google-plus-signin-success', function(event, authResult) {
                // User successfully authorized the G+ App!
                gapi.client.request({
                    'path': '/plus/v1/people/me',
                    'method': 'GET',
                    'callback': $scope.userInfoCallback
                });
            });
            $scope.$on('event:google-plus-signin-failure', function(event, authResult) {
                // User has not authorized the G+ App!
                console.log('Not signed into Google Plus.');
            });

            // Process user info.
            // userInfo is a JSON object.
            // When callback is received, process user info.
            // $scope.userInfoCallback = function(userInfo) {
            //     console.log(userInfo);
            //     console.log(userInfo.displayName);
            //     console.log(userInfo.emails[0].value);
            // };

            $scope.login = function() {
                loginModelObject.email = $scope.login.email;
                loginModelObject.password = $scope.login.password;
                appConfig.serviceAPI.authAPI(API, function(result) {
                    if (result.responseData.message === "success") {
                        $localStorage.token = result.responseData.token;
                        $location.path('events');
                    } else {
                        $scope.invalidUser = true;
                    }
                }, function(err) {
                    console.log(err);
                }, loginModelObject);
            }
        }
    ]);
});