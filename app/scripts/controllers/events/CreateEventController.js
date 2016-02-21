define(['app', "http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"], function(app, glocation) {
    app
        .controller('CreateEventController', [
            '$scope',
            'API',
            '$location',
            '$rootScope',
            '$q',
            'jwtHelper',
            '$localStorage',
            function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage,glocation) {
                if ($localStorage.token === "undefined") {
                    $location.path('/');
                } 
                $scope.event = {};
                $scope.today = function() {
                    $scope.event.date = new Date();
                };
                $scope.today();
                $scope.time1 = new Date();
                $scope.showMeridian = true;

                $scope.disabled = false;
                $rootScope.displayCreateEventFormDisplay = true;
                $rootScope.totalNumberOfFriendsInvited = 0;


                // get food type 
                $scope.foodTypeArray = {};
                $scope.foodTypeArray["veg"] = "Veg";
                $scope.foodTypeArray["nonveg"] = "No Veg";
                $scope.foodTypeArray["both"] = "Both";


                $scope.themes = ["Italian", "Indian", "Chinees", "USA"];

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                }

                function showPosition(position) {
                    $scope.event.currentlocation = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
                    $scope.locationObject = {};
                    $scope.locationObject.lat = position.coords.latitude;
                    $scope.locationObject.lang = position.coords.longitude;
                    var deferred = $q.defer();
                    require(glocation, function(result) {
                        deferred.resolve(true);
                    }, function(err) {
                        deferred.reject(false);
                    });
                    deferred.promise.then(function(res) {
                        appConfig.serviceAPI.getCurrentLocation(API, function(response) {
                            // console.log(response.results[0].formatted_address);
                            $scope.event.currentlocation = response.results[0].formatted_address
                        }, function(err) {
                            console.log(err);
                        }, $scope.locationObject)
                    })
                }

                $scope.inviteFriends = function() {
                    $rootScope.displayCreateEventFormDisplay = false;
                    $rootScope.inviteFriendsFormDisplay = true;
                }

                $scope.assignDishes = function() {
                    $rootScope.displayCreateEventFormDisplay = false;
                    $rootScope.assignDishesFormDisplay = true;
                }

                $scope.createEvent = function() {

                    $scope.event.time = $scope.time1.getHours() + ":" + $scope.time1.getMinutes()
                    $scope.event.friends = $rootScope.inviteUsers;
                    $scope.event.dishAllocation = $rootScope.dishesAndUsers;
                    var userToken = $localStorage.token;
                    var userDetails = jwtHelper.decodeToken(userToken);
                    $scope.event.created_by = userDetails.userId;
                    
                    appConfig.serviceAPI.createEvent(API, function(response) {
                        if (response.responseData.status === "success") {
                            $location.path('events');
                        }
                    }, function(err) {
                        console.log(err);
                    }, $scope.event);
                }
            }

        ])
    app.controller('InviteFriendsController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        function($scope, API, $location, $rootScope) {
            $scope.inviteFriendsForm = '/views/events/invite-friends.html';
            $scope.items = [{
                "friendNameName": ""
            }];
            $scope.add = function() {
                $scope.items.push({
                    friendNameName: ""
                });
            };
            $scope.addFriends = function() {
                var userArray = [];
                for (var i in $scope.items) {
                    userArray.push($scope.items[i].friendNameName);
                }
                $rootScope.inviteFriendsFormDisplay = false;
                $rootScope.displayCreateEventFormDisplay = true;
                $rootScope.totalNumberOfFriendsInvited = $scope.items.length;
                $rootScope.inviteUsers = userArray;

            }
        }
    ])
    app.controller('AssignDishesController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        function($scope, API, $location, $rootScope) {
            $rootScope.assignDisheesForm = '/views/events/assign-dishes.html';
            $scope.dishesItems = [{
                "friendName": "",
                "dishes": ""
            }];
            $scope.add = function() {
                $scope.dishesItems.push({
                    friendName: "",
                    dishes: ""
                });
            };
            $scope.assignDishes = function() {
                $rootScope.assignDishesFormDisplay = false;
                $rootScope.displayCreateEventFormDisplay = true;
                $rootScope.totalNumberOfFriendsInvited = $scope.dishesItems.length;
                var dishes = [];
                for (var i in $scope.dishesItems) {
                    var obj = {};
                    obj[$scope.dishesItems[i].friendName] = $scope.dishesItems[i].dishes;
                    dishes.push(obj);
                }
                $rootScope.dishesAndUsers = dishes;
            }
        }
    ])
});