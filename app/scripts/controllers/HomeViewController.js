define(['app'], function(app)
{
	app.controller('HomeViewController',
    [
        '$scope',
        'API',
        '$location',
        '$facebook',
        function($scope,API,$location,$facebook) {
            $scope.constants = constants;
            $scope.fbLogin = function() {
                $facebook.login().then(function() {
                    refresh();
                });
            }
            function refresh() {
                $facebook.api("/me").then(
                    function(response) {
                        $scope.welcomeMsg = "Welcome " + response.name;
                        $scope.isLoggedIn = true;
                    },
                    function(err) {
                        $scope.welcomeMsg = "Please log in";
                    });
            }

            refresh();

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