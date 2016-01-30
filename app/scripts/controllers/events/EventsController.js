define(['app'], function(app) {
    app
        .controller('EventsController', [
            '$scope',
            'API',
            '$location',
            '$rootScope',
            '$q',
            function($scope, API, $location, $rootScope, $q) {
            	$scope.events = {};
                // get Events 
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                	console.log(eventResponse);
                    // for(var i in themeResponse) {
                    //     $scope.themes[themeResponse[i]['@rid']] = themeResponse[i].name
                    // }
                    // console.log($scope.themes);
                }, function(err) {
                    console.log(err);
                });
            }
        ])
});