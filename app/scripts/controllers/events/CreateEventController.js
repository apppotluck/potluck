define(['app', 'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false'], function(app) {
    app
        .controller('CreateEventController', [
            '$scope',
            'API',
            '$location',
            function($scope, API, $location) {
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

                $scope.themes = ["Italian", "Indian", "Chinees", "USA"];
                $scope.friends= ["Puneet","Archana","Sajjin","Pooja","Kaarthik","Malai","Sarvanan"];

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
            }

        ])
});