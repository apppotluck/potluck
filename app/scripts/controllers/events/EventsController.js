define(['app'], function(app) {
    app
        .controller('EventsController', [
            '$scope',
            'API',
            '$location',
            '$rootScope',
            '$q',
            'jwtHelper',
            '$localStorage',
            function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage) {
                $scope.events = {};
                $scope.nonHostUser = false;
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                    $scope.events = eventResponse;
                    var userToken = $localStorage.token;
                    var userDetails = jwtHelper.decodeToken(userToken);
                    console.log($scope.events);
                    console.log(userDetails);
                    $scope.currentUser = userDetails;
                }, function(err) {
                    console.log(err);
                });
                $scope.createEvent = function() {
                    $location.path('/potluck/create-event');
                }
            }
        ])
});