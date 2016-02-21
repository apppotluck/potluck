define(['routes', 'services/dependencyResolverFor'], function(config, dependencyResolverFor) {
    var app = angular.module('app', ['angular-jwt', 'ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngFacebook', 'timepickerPop', 'ngAutocomplete', 'autocomplete', 'ngMaterial', 'ngStorage']);
    app
        .config(
            [
                '$routeProvider',
                '$locationProvider',
                '$controllerProvider',
                '$compileProvider',
                '$filterProvider',
                '$provide',
                '$facebookProvider',
                '$httpProvider',
                function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $facebookProvider, $httpProvider) {
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;

                    $facebookProvider.setAppId(constants.fbAppId);
                    // $facebookProvider.setAppSecret(constants.secret);

                    $locationProvider.html5Mode({
                        enabled: true,
                        requireBase: false
                    });

                    if (config.routes !== undefined) {
                        angular.forEach(config.routes, function(route, path) {
                            $routeProvider.when(path, {
                                templateUrl: route.templateUrl,
                                resolve: dependencyResolverFor(route.dependencies)
                            });
                        });
                    }

                    if (config.defaultRoutePaths !== undefined) {
                        $routeProvider.otherwise({
                            redirectTo: config.defaultRoutePaths
                        });
                    }

                    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
                        return {
                            'request': function(config) {
                                config.headers.demo = true;
                                config.headers = config.headers || {};
                                if (config.url === "/potluck/auth/user" || config.url === "/potluck/create-user" || config.url.split(".").pop() == '.html') {
                                    config.headers.skipAuthorization = true;
                                } else {
                                    if (!config.url.indexOf("https://maps.googleapis.com/maps/api/geocode/json?")) {
                                        console.log("no authentication required for google map");
                                    } else {
                                        if ($localStorage.token) {
                                            config.headers["x-access-token"] = $localStorage.token;
                                        }
                                    }
                                }
                                return config;
                            },
                            'responseError': function(response) {
                                config.headers.demo = false;
                                if (response.status === 401 || response.status === 403) {
                                    $location.path('/');
                                }
                                return $q.reject(response);
                            }
                        };
                    }]);
                }
            ])
        .run(['$window', '$rootScope', function($window, $rootScope) {

            $window.signinCallback = function(authResult) {
                if (authResult && authResult.access_token) {
                    $rootScope.$broadcast('event:google-plus-signin-success', authResult);
                } else {
                    $rootScope.$broadcast('event:google-plus-signin-failure', authResult);
                }
            };
            // Load the facebook SDK asynchronously
            (function() {
                // If we've already installed the SDK, we're done
                if (document.getElementById('facebook-jssdk')) {
                    return;
                }

                // Get the first script element, which we'll use to find the parent node
                var firstScriptElement = document.getElementsByTagName('script')[0];

                // Create a new script element and set its id
                var facebookJS = document.createElement('script');
                facebookJS.id = 'facebook-jssdk';

                // Set the new script's source to the source of the Facebook JS SDK
                facebookJS.src = '//connect.facebook.net/en_US/all.js';

                // Insert the Facebook JS SDK into the DOM
                firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
            }());
        }]);

    return app;
});