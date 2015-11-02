/**
 * Created by puneet on 9/10/15.
 */

var SERVICES_DOMAIN_NAME = '';

if (window.location.hostname == 'localhost') {
    // starts LOCAL Configurations
    var APP_SERVICE_FOLDER_NAME = '/';
    var SERVICES_CONTEXT_NAME = '/';
    var PHOTO_URL_CONTEXT = SERVICES_DOMAIN_NAME + '/';
}

var SERVICE_NAME_AUTH_USER = 'auth/user'; //POST
var SERVICE_NAME_CREATE_EVENT = 'create-event'; //POST
var SERVICE_NAME_GET_FOOD_TYPE= 'getFoodType';
var SERVICE_NAME_GET_GET_THEMES = 'getThemes';
var METHOD_TYPE_GET = 'GET';
var METHOD_TYPE_POST = 'POST';
var METHOD_TYPE_PUT = 'PUT';
var METHOD_TYPE_DELETE = 'DELETE';

var requestHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};


var AUTHENTICATE_USER = {
    method: METHOD_TYPE_POST,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_AUTH_USER,
    headers: requestHeaders
};
var CURRENT_LOCATION = {
    method: METHOD_TYPE_GET,
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.1381687,-82.9843817',
    headers: requestHeaders
};
var CREATE_EVENT = {
    method: METHOD_TYPE_POST,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_CREATE_EVENT,
    headers: requestHeaders
};

var GET_FOOD_TYPE = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_FOOD_TYPE,
    headers: requestHeaders
};

var GET_THEMES = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_GET_THEMES,
    headers: requestHeaders
}



var appConfig = {
    'component': {
        API: {
            name: 'ServiceAPI'
        },
        'authUser': {
            'serviceConfig': {
                method: METHOD_TYPE_POST,
                url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_AUTH_USER,
                headers: requestHeaders
            }
        },
        'getCurrentLocation': {
            'serviceConfig': {
                method: METHOD_TYPE_GET,
                url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_AUTH_USER,
                headers: requestHeaders
            }
        }
    },
    'serviceAPI': {
        // AUTHORIZATION SERVICE
        'authAPI': function(API, _successCallback, _errorCallback, requestBody) {
            var serviceConfig = angular.copy(AUTHENTICATE_USER);
            serviceConfig.data = requestBody;
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getCurrentLocation': function(API, _successCallback, _errorCallback, requestBody) {
            var serviceConfig = {};
            serviceConfig.method = METHOD_TYPE_GET,
                serviceConfig.url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + requestBody.lat + ',' + requestBody.lang,
                serviceConfig.headers = requestHeaders;
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'createEvent': function(API, _successCallback, _errorCallback, requestBody) {
            var serviceConfig = angular.copy(CREATE_EVENT);
            serviceConfig.data = requestBody;
            console.log("====",requestBody);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getFoodType': function(API, _successCallback, _errorCallback) {
            var serviceConfig = angular.copy(GET_FOOD_TYPE);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getThemes': function(API, _successCallback, _errorCallback) {
            var serviceConfig = angular.copy(GET_THEMES);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        }
    }
};