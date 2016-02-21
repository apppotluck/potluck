/**
 * Created by puneet on 9/10/15.
 */
'use strict';
//debugger;

define([
        'app'
    ],

    function(app) {

        return app.factory('API', function($http, $localStorage,$location) {
            return {
                getAPI: function(serviceConfig, callbackFunction, errorCallback) {
                    var shouldExclude = false;
                    $http.defaults.useXDomain = true;
                    $http(serviceConfig).success(function(response, status, headers, config) {
                        //                            console.log("***********"+serviceConfig.url+"**********************  Got response       ******** "+new Date().getTime())
                        if (callbackFunction) {
                            if (response) {
                                callbackFunction(response);
                            }
                        }
                    }).error(function(response, status, headers, config) {
                        if (errorCallback) {

                            if (status == 401 || status == "401") {
                                if (response.indexOf('Unauthorized-Session_Timeout') != -1) {
                                    sessionStorage.clear();
                                    window.location.reload();
                                }

                            }
                            errorCallback(null);
                        }
                    });
                },
                authAndRegister: function(userObject) {
                    if (userObject.register_by === "facebook") { // register by facebook
                        appConfig.serviceAPI.registerUser(this, function(response) {
                            if (response.responseData.message === "success") {
                                $localStorage.token = response.responseData.token;
                                $location.path('intro')
                            }
                        }, function(err) {
                            console.log(err);
                        }, userObject);
                    }
                }
            }
        });
    });