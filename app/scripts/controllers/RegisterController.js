define(['app'], function(app) {
    app.controller('RegisterController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        '$q',
        'jwtHelper',
        '$localStorage',
        function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage) {
            $scope.constants = constants;
            $scope.isError = false;
            $scope.errorMessage = "";
            $scope.submitForm = function() {
                $scope.user.register_by = 'local';
                appConfig.serviceAPI.registerUser(API, function(response) {
                    if (response.responseData.message === "success") {
                        $localStorage.token = response.responseData.token;
                        $location.path('intro')
                    } else if(response.responseData.message === "fail") {
                        $scope.isError = true;
                        $scope.errorMessage  = response.responseData.error;
                    }
                }, function(err) {
                    console.log(err);
                }, $scope.user);
            }
        }
    ]);

    app.controller('ForgotPasswordController', [
        '$scope',
        '$location',
        function($scope, API, $location) {
            //            alert("inside forgot controller")
        }
    ])
});