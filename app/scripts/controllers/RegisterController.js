define(['app'], function(app) {
    app.controller('RegisterController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        '$q',
        'jwtHelper',
        function($scope, API, $location, $rootScope, $q,jwtHelper) {
            $scope.constants = constants;
            // console.log("$scope.userForm.$valid---->",$scope.userForm); 
            var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJAdHlwZSI6ImQiLCJAY2xhc3MiOiJwb3RsdWNrX3VzZXJzIiwiZW1haWxfaWQiOiJwdW5lZXRzaWV0QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwicmVnaXN0ZXJkX2J5IjoiYXBwIiwic3RhdHVzIjoxLCJ1c2VybmFtZSI6InB1bmVldCIsImlhdCI6MTQ1NDc1NDM1NiwiZXhwIjoxNDU0ODQwNzU2fQ.nGXr4L5yPYqiGX9hdgKOfA1o7zUG6GYtBaQc7Lef02Q';
            // console.log(jwtHelper)
            var bool = jwtHelper.decodeToken(token);
            console.log("bool====>",bool);
            $scope.submitForm = function() {
                $scope.user.registerd_by = "app";
                    // appConfig.serviceAPI.registerUser(API, function(response) {
                    //     console.log(response);
                    //     if(response.status === "success") {
                    //         $location.path('events');
                    //     }
                    // }, function(err) {
                    //     console.log(err);
                    // }, $scope.user);
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