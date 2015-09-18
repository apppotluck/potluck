define(['app'], function(app)
{
	app.controller('HomeViewController',
    [
        '$scope',
        'API',
        '$location',
        function($scope,API,$location) {
            $scope.constants = constants;
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