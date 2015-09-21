define(['app'], function(app)
{
	app.controller('HomeViewController',
    [
        '$scope',
        'API',
        '$location',
        '$facebook',
        'twitterService',
        function($scope,API,$location,$facebook,twitterService) {
            $scope.constants = constants;
            // When the user clicks to fb connect
            $scope.fbLogin = function() {
                $facebook.login().then(function() {
                    $scope.refreshTimeline();
                });
            };
            function refresh() {
                $facebook.api("/me").then(
                    function(response) {
                        $scope.welcomeMsg = "Welcome " + response.name;
                        $scope.isLoggedIn = true;
                        $scope.refreshTimeline();
                    },
                    function(err) {
                        $scope.welcomeMsg = "Please log in";
                    });
            };

//            refresh();

            //using the OAuth authorization result get the latest 20 tweets from twitter for the user
            $scope.refreshTimeline = function() {
                $location.path('intro');
            }

            twitterService.initialize();
            //when the user clicks the connect twitter button, the popup authorization window opens
            $scope.twiiterConnect = function() {
                twitterService.connectTwitter().then(function() {
                    if (twitterService.isReady()) {
                        //if the authorization is successful, hide the connect button and display the tweets
                        $scope.twitterLoginButton = true;

                    }
                });
            };
            //if the user is a returning user, hide the sign in button and display the tweets
            if (twitterService.isReady()) {
                $scope.refreshTimeline();
            }

            $scope.login = function () {
                loginModelObject.userId = $scope.login.username;
                loginModelObject.password = $scope.login.password;
                appConfig.serviceAPI.authAPI(API, function(result){
                    if(result.responseData.message === "success") {
                        $location.path('intro');
                    }
                },function(err){
                    console.log(err);
                }, loginModelObject);
            }
        }
    ]);
});