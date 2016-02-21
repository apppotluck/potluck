define(['app'], function(app) {
    app.controller('EventsController', [
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
            $scope.upcomingEvents = [];
            $scope.pastEvents = [];

            appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                for (var event in eventResponse) {
                    if (Date.parse(eventResponse[event].event_date) > Date.now()) {
                        $scope.upcomingEvents.push(eventResponse[event]);
                    } else {
                        $scope.pastEvents.push(eventResponse[event]);
                    }
                }
                var userToken = $localStorage.token;
                var userDetails = jwtHelper.decodeToken(userToken);
                if (typeof userDetails.userId === "undefined") {
                    $location.path('/');
                } else {
                    $scope.currentUser = userDetails;
                }

            }, function(err) {
                console.log(err);
            });
            $scope.createEvent = function() {
                $location.path('/create-event');
            }

            $scope.onEventClick = function() {
                $location.path('/event-details/' + this.value.rid);
            }
        }
    ]);
    app.controller('EventDetailsController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        '$q',
        'jwtHelper',
        '$localStorage',
        '$routeParams',
        function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage,$routeParams) {
            var eventId = $routeParams.eid
            console.log("eId====>",eventId);
        }
    ])
});