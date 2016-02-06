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
            function($scope, API, $location, $rootScope, $q,jwtHelper,$localStorage) {
            	console.log($localStorage)
                $scope.events = {};
                // get Events 
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                	console.log(eventResponse);
                    $scope.events = eventResponse;
                    // for(var i in eventResponse) {
                    //     for(var jj in eventResponse[i]) {
                    //         console.log("jj---->",jj)
                    //     }
                    // }
                }, function(err) {
                    console.log(err);
                });
            }
        ])
});