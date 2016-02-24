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
                var eventDate, eventDateWithHourAndMinute, unixTimeStamp;
                for (var event in eventResponse) {
                    eventDate = eventResponse[event].event_date.replace(/-/g, '\/');
                    eventDateWithHourAndMinute = new Date(eventDate).setHours(eventResponse[event].event_time.split(":")[0]);
                    eventDateWithHourAndMinute = new Date(eventDateWithHourAndMinute).setMinutes(eventResponse[event].event_time.split(":")[1]);
                    if (eventDateWithHourAndMinute > Date.now()) {
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
        function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage, $routeParams) {
            var eventId = $routeParams.eid
            appConfig.serviceAPI.getEventDetails(API, function(eventDetails) {  
                console.log(eventDetails)
                $scope.event = eventDetails;
                $scope.eventInvitees = eventDetails[0].invitees;  
            }, function(err) {
                console.log(err);
            },$routeParams.eid);
        }
    ])
});