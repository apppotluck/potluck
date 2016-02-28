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
        'Upload',
        '$timeout',
        '$mdDialog',
        '$mdMedia',
        function($scope, API, $location, $rootScope, $q, jwtHelper, $localStorage, $routeParams, Upload, $timeout, $mdDialog, $mdMedia) {
            $scope.eventMenu = {}
            $scope.showModal = false;
            var getEventMenuList = function() {
                var menuArray = [];
                appConfig.serviceAPI.getEventMenuDetails(API, function(eventMenuDetails) {
                        $scope.eventMenuArray = Object.keys(eventMenuDetails.menu)
                            .map(function(key) {
                                return eventMenuDetails.menu[key].value;
                            });
                        for (var ii = 0; ii < $scope.eventMenuArray.length; ii++) {
                            $scope.eventMenuArray[ii].menuImageDetails = [];
                            for (var jj = 0; jj < eventMenuDetails.menu_image.length; jj++) {
                                if (eventMenuDetails.menu_image[jj].value.menu_id[0] === $scope.eventMenuArray[ii].rid) {
                                    $scope.eventMenuArray[ii].menuImageDetails.push({
                                        "image": eventMenuDetails.menu_image[jj].value.image,
                                        "menuImageRid": eventMenuDetails.menu_image[jj].value.rid
                                    })
                                }
                            }
                        }
                    },
                    function(err) {
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
            $scope.onFileUpload = function(element) {
                $scope.$apply(function(scope) {
                    var file = element.files[0];
                    FileInputService.readFileAsync(file).then(function(fileInputContent) {
                        $scope.fileInputContent = fileInputContent;
                    });
                })
            }
            $scope.showImagePreview = showDialog;
            function showDialog($event) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: $event,
                    template: '<md-dialog aria-label="List dialog">' +
                        '  <md-dialog-content><img src="/assets/uploads/' + this.value.image + '">' +
                        '  </md-dialog-content>' +
                        '</md-dialog>',
                    locals: {
                        items: $scope.items
                    },
                    controller: DialogController
                });

                function DialogController($scope, $mdDialog, items) {
                    $scope.items = items;
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                }
            }

            $scope.deleteImage = function(ev,menuId) {
                var imageId = this.value.menuImageRid;
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this image?')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    appConfig.serviceAPI.deleteMenuMenuImage(API, function(eventMenuDetails) {
                        $scope.$broadcast('updateMenuList');
                    },function(err){
                        console.log("try again!");
                    },imageId,menuId)
                   
                }, function() {
                    $scope.status = 'You decided to keep your debt.';
                });
            };



        function DialogController($scope, $mdDialog, items) {
            $scope.items = items;
            $scope.closeDialog = function() {
                $mdDialog.hide();
            }
        }
        $scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.files = {}
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                var fileUploadUrl = '/potluck/dish/image/' + encodeURIComponent(this.menu.rid);
                file.upload = Upload.upload({
                    url: fileUploadUrl,
                    data: { file: file }
                });

                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                        $scope.files = response.data.filename;
                        $scope.$broadcast('updateMenuList');
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }
    }])

});