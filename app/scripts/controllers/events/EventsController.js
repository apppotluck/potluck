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

            var userToken = $localStorage.token;
            var userDetails = jwtHelper.decodeToken(userToken);
            var eventsList = function() {
                $scope.upcomingEvents = [];
                $scope.pastEvents = [];
                var userToken = $localStorage.token,
                    userDetails = jwtHelper.decodeToken(userToken),
                    currentUser = userDetails.userId;
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                    var eventDate, eventDateWithHourAndMinute, unixTimeStamp;
                    for (var eventIndex in eventResponse.results[0].content) {
                        // console.log(eventResponse.results[0].content[eventIndex].value);
                        var event = eventResponse.results[0].content[eventIndex].value
                        var eventId = '#' + eventResponse.results[0].content[eventIndex].cluster + ":" + eventResponse.results[0].content[eventIndex].position;
                        eventDate = event.event_date.replace(/-/g, '\/');
                        eventDateWithHourAndMinute = new Date(eventDate).setHours(event.event_time.split(":")[0]);
                        eventDateWithHourAndMinute = new Date(eventDateWithHourAndMinute).setMinutes(event.event_time.split(":")[1]);
                        event.event_id = eventId;
                        if (typeof event.accepted_users !== "undefined") {
                            if (event.accepted_users.length > 0) {
                                for (var i = 0; i < event.accepted_users.length; i++) {
                                    if (event.accepted_users[i] === currentUser) {
                                        event.accepted_event = true;
                                    } else {
                                        event.accepted_event = false;
                                    }
                                }
                            }
                        }
                        if (typeof event.declined_users !== "undefined") {
                            if (event.declined_users.length > 0) {
                                for (var i = 0; i < event.declined_users.length; i++) {
                                    if (event.declined_users[i] === currentUser) {
                                        event.declined_event = true;
                                    } else {
                                        event.declined_event = false;
                                    }
                                }
                            }
                        }
                        if (typeof event.may_be_accepted_user !== "undefined") {
                            if (event.may_be_accepted_user.length > 0) {
                                for (var i = 0; i < event.may_be_accepted_user.length; i++) {
                                    if (event.may_be_accepted_user[i] === currentUser) {
                                        event.may_be_accepted_event = true;
                                    } else {
                                        event.may_be_accepted_event = false;
                                    }
                                }
                            }
                        }

                        if (eventDateWithHourAndMinute > Date.now()) {
                            $scope.upcomingEvents.push(event);
                        } else {
                            $scope.pastEvents.push(event);
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
                }, userDetails.userId);
            }
            eventsList();
            $scope.$on('getEventList', function() {
                eventsList();
            });
            $scope.createEvent = function() {
                $location.path('/create-event');
            }

            $scope.onEventClick = function() {
                $location.path('/event-details/' + this.value.event_id);
            }
            $scope.eventAcceptence = function(type) {
                var userToken = $localStorage.token;
                var userDetails = jwtHelper.decodeToken(userToken);
                var object = {
                    "user_id": userDetails.userId,
                    "event_id": this.value.event_id,
                    "type": type
                }
                appConfig.serviceAPI.updateEventAcceptence(API, function(eventDetails) {
                    $scope.$broadcast('getEventList');
                }, function(err) {
                    console.log(err);
                }, object);
            }

            $scope.$watch('upcomingEvents', function(value) {
                console.log(value);
            })
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
                appConfig.serviceAPI.insertEventMenu(API, function(menuResponse) {
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
            $scope.isVisible = false;
            $scope.updateMenu = function() {
                appConfig.serviceAPI.updateEventMenu(API, function(menuResponse) {
                    if (menuResponse.responseData.message === "success") {
                        $scope.$broadcast('updateMenuList');
                        $scope.selectedIndex = 1;

                    } else {
                        $scope.update_menu_error = true;
                    }
                }, function(err) {
                    console.log(err);
                }, this.menu);

            }
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

            $scope.deleteImage = function(ev, menuId) {
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
                    }, function(err) {
                        console.log("try again!");
                    }, imageId, menuId)

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
            $scope.uploadFiles = function(file) {
                $scope.f = file;
                $scope.files = {}
                console.log(file)
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
        }
    ])
    app.controller('CancelEventsController', ['$scope',
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
            var userToken = $localStorage.token,
                userDetails = jwtHelper.decodeToken(userToken),
                currentUser = userDetails.userId;
            var eventsList = function() {
                $scope.events = [];
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                    for (var eventIndex in eventResponse.results[0].content) {
                        if (eventResponse.results[0].content[eventIndex].value.created_by === userDetails.userId) {
                            var events = {
                                "event_id": '#' + eventResponse.results[0].content[eventIndex].cluster + ":" + eventResponse.results[0].content[eventIndex].position,
                                "event_name": eventResponse.results[0].content[eventIndex].value.name
                            }
                            $scope.events.push(events);
                        }
                    }
                }, function(err) {
                    console.log(err);
                }, userDetails.userId)
            }
            eventsList();
            $scope.$on('cancelEventList', function() {
                eventsList();
            });
            $scope.cancelEvent = function(ev) {
                var event_id = this.value.event_id;
                var confirm = $mdDialog.confirm()
                    .title('Cancel Event')
                    .textContent('Would you like to cancel this event?')
                    .ariaLabel('Cance Event')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    appConfig.serviceAPI.cancelEvents(API, function(eventResponse) {
                        $scope.$broadcast('cancelEventList');
                    }, function(err) {
                        console.log(err);
                    }, event_id, userDetails.userId)
                }, function() {});
            }
        }
    ]);
    app.controller('InviteFriendsController', ['$scope',
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
            var userToken = $localStorage.token,
                userDetails = jwtHelper.decodeToken(userToken),
                currentUser = userDetails.userId;
                $scope.showOnInviteeMoreFriendClick = false;
            var eventsList = function() {
                $scope.events = [];
                appConfig.serviceAPI.getEvents(API, function(eventResponse) {
                    console.log(eventResponse)
                    for (var eventIndex in eventResponse.results[0].content) {
                        var events = {
                            "event_id": '#' + eventResponse.results[0].content[eventIndex].cluster + ":" + eventResponse.results[0].content[eventIndex].position,
                            "event_name": eventResponse.results[0].content[eventIndex].value.name
                        }

                        $scope.events.push(events);
                    }
                    // console.log($scope.events);
                }, function(err) {
                    console.log(err);
                }, userDetails.userId)
            }

            eventsList();
            // $scope.$on('cancelEventList', function() {
            //     eventsList();
            // });
            $scope.event_details = function() {
                $location.path("event-details/" + this.value.event_id)
            }

            $scope.inviteFriend = function(ev) {
                $scope.showOnInviteeMoreFriendClick = true;
                var event_id = this.value.event_id;
                $scope.contacts = [];
                $scope.inviteesEmail = [];
                appConfig.serviceAPI.getInvitees(API, function(inviteesResponse) {
                    for (var eventIndex in inviteesResponse.results[0].content) {
                        var invitees = {
                                "invitees_id": '#' + inviteesResponse.results[0].content[eventIndex].cluster + ":" + inviteesResponse.results[0].content[eventIndex].position,
                                "email": inviteesResponse.results[0].content[eventIndex].value.email_id,
                                "name": inviteesResponse.results[0].content[eventIndex].value.username
                            }
                            // $scope.inviteesEmail.push(invitees.email);
                        $scope.contacts.push(invitees);
                    }
                }, function(err) {
                    console.log(err);
                }, this.value.event_id)


            }
            $scope.addInvitess = function() {
                $scope.contacts.push({
                    email: this.inviteesEmail[this.inviteesEmail.length - 1]
                });
            }
            $scope.removeInvitees = function() {
                console.log(this.inviteesEmail)
                // $scope.contacts.push({
                //     email: this.inviteesEmail[this.inviteesEmail.length - 1]
                // });
            }
        }
    ]);

    app.filter('contains', function() {
        return function(array, needle) {
            if (array)
                return array.indexOf(needle) >= 0;
        };
    });

})