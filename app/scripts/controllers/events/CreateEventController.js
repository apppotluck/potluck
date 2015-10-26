define(['app', 'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false'], function(app) {
    app
        .controller('CreateEventController', [
            '$scope',
            'API',
            '$location',
            '$rootScope',
            function($scope, API, $location,$rootScope) {
                $scope.today = function() {
                    $scope.dt = new Date();
                };
                $scope.today();
                $scope.time1 = new Date();

                $scope.time2 = new Date();
                $scope.time2.setHours(7, 30);
                $scope.showMeridian = true;

                $scope.disabled = false;
                $scope.result1 = '';
                $scope.options1 = null;
                $scope.details1 = '';
                $rootScope.displayCreateEventFormDisplay = true;
                $rootScope.totalNumberOfFriendsInvited = 0;

                $scope.themes = ["Italian", "Indian", "Chinees", "USA"];
                $scope.friends = ["Puneet", "Archana", "Sajjin", "Pooja", "Kaarthik", "Malai", "Sarvanan"];

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                }

                function showPosition(position) {
                    $scope.currentlocation = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
                    $scope.locationObject = {};
                    $scope.locationObject.lat = position.coords.latitude;
                    $scope.locationObject.lang = position.coords.longitude;
                    appConfig.serviceAPI.getCurrentLocation(API, function(response) {
                        // console.log(response.results[0].formatted_address);
                        $scope.currentlocation = response.results[0].formatted_address
                    }, function(err) {
                        console.log(err);
                    }, $scope.locationObject)
                }

                $scope.inviteFriends = function() {
                    $rootScope.displayCreateEventFormDisplay = false;
                    $rootScope.inviteFriendsFormDisplay = true;
                }

                $scope.createEvent = function() {
                  $scope.demo = {};
                  $scope.demo.name = "eventName";
                  $scope.demo.test = "eventtest";
                  appConfig.serviceAPI.createEvent(API,function(response){
                      console.log(response);
                  },function(err){
                    console.log(err);
                  },$scope.demo);
                }
            }

        ])
    app.controller('InviteFriendsController', [
        '$scope',
        'API',
        '$location',
        '$rootScope',
        function($scope, API, $location,$rootScope) {
            $scope.inviteFriendsForm = '/views/events/invite-friends.html';
            $scope.items = [{"friendNameName":""}];
            $scope.add = function() {
                $scope.items.push({
                    friendNameName: ""
                });
            };
            $scope.addFriends = function() {
              console.log($scope.items.length);
              $rootScope.inviteFriendsFormDisplay = false;
              $rootScope.displayCreateEventFormDisplay = true;
              $rootScope.totalNumberOfFriendsInvited = $scope.items.length;
            }
        }
    ])
});