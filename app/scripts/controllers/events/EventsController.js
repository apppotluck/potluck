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
            $scope.menu = {}
            $scope.menuList = [];
            $scope.update_menu_error = false;
            var eventId = $routeParams.eid
            $scope.selectedIndex = 0;

            appConfig.serviceAPI.getEventDetails(API, function(eventDetails) {
                $scope.event = eventDetails;
                $scope.eventInvitees = eventDetails[0].invitees;
            }, function(err) {
                console.log(err);
            }, $routeParams.eid);

            $scope.addToList = function() {
                var userToken = $localStorage.token;
                var userDetails = jwtHelper.decodeToken(userToken);
                $scope.menuList.push({
                    "name": $scope.menu.name,
                    "desc": $scope.menu.desc,
                    "event_id": $routeParams.eid,
                    "added_by": userDetails.userId
                })
                $scope.menu.name = "";
                $scope.menu.desc = "";
            }
            $scope.removeMenu = function() {
                delete $scope.menuList[this.key];
            };
            $scope.addMenuToEvent = function() {
                appConfig.serviceAPI.updateEventMenu(API, function(menuResponse) {
                    if (menuResponse.responseData.message === "success") {
                        $scope.$broadcast('updateMenuList');
                        $scope.selectedIndex = 1;

                    } else {
                        $scope.update_menu_error = true;
                    }
                }, function(err) {
                    console.log(err);
                }, $scope.menuList);
            };
        }
    ])
    app.controller('EventMenuController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        '$q',
        'jwtHelper',
        '$localStorage',
        '$routeParams',
        function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage, $routeParams) {
            $scope.eventMenu = {}

            var getEventMenuList = function() {
                var menuArray = [];
                appConfig.serviceAPI.getEventMenuDetails(API, function(eventMenuDetails) {
                    $scope.eventMenuArray = Object.keys(eventMenuDetails)
                        .map(function(key) {
                            return eventMenuDetails[key].value;
                        });

                    console.log($scope.eventMenuArray)
                }, function(err) {
                    console.log(err);
                }, $routeParams.eid);
            };
            getEventMenuList();
            $scope.$on('updateMenuList', function() {
                getEventMenuList();
            });
            var userToken = $localStorage.token;
            var userDetails = jwtHelper.decodeToken(userToken);
            $scope.currentUser = userDetails;

        }
    ])
});