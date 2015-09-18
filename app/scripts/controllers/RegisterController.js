define(['app'], function(app)
{
    app.controller('RegisterController',
        [
            '$scope',
            '$location',
            function($scope,API,$location) {
                $scope.constants = constants;

                $scope.submitForm = function() {
                    console.log($scope.user);
                }

            }
        ]);

    app.controller('ForgotPasswordController',
    [
       '$scope',
       '$location',
        function($scope,API,$location) {
//            alert("inside forgot controller")
        }
    ])
});