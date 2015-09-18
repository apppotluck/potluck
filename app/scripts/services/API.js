/**
 * Created by puneet on 9/10/15.
 */
'use strict';
//debugger;

define([
        'app'
    ],

    function(app) {

        return app.factory('API', function ($http) {
                return {
                    getAPI: function (serviceConfig, callbackFunction, errorCallback) {
                        var shouldExclude = false;
//                        console.log("***********"+serviceConfig.url+"********************** Before service call ******** "+new Date().getTime())

                        if ((serviceConfig.method == 'POST')) {
//                            for (var i = 0; i < excludeSecurityCheckArr.length; i++) {
//                                if (!(serviceConfig.url.indexOf(excludeSecurityCheckArr[i]) < 0)) {
//                                    shouldExclude = true;
//                                }
//                            }
//                            if (!shouldExclude) {
//                                serviceConfig = angular.copy(commonMethods.addHeaderForEncryption(serviceConfig));
//                            }
                        }
                        $http.defaults.useXDomain = true;
                        $http(serviceConfig).success(function (response, status, headers, config) {
//                            console.log("***********"+serviceConfig.url+"**********************  Got response       ******** "+new Date().getTime())
                            if (callbackFunction) {
                                if (response) {
                                    callbackFunction(response);
                                }
                            }
                        }).error(function (response, status, headers, config) {
                            if (errorCallback) {

                                if(status == 401 || status == "401"){
                                    if(response.indexOf('Unauthorized-Session_Timeout') != -1){
                                        sessionStorage.clear();
                                        window.location.reload();
                                    }

                                }
                                errorCallback(null);
                            }
                        });
                    }
                }
            }
        );
    });