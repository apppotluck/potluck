/**
 * Created by puneet on 9/10/15.
 */

var SERVICES_DOMAIN_NAME = '';

if (window.location.hostname == 'localhost') {
    // starts LOCAL Configurations
    var APP_SERVICE_FOLDER_NAME = '/potluck/';
    var SERVICES_CONTEXT_NAME = '/potluck/';
}

var SERVICE_NAME_AUTH_USER = 'auth/user'; //POST
var SERVICE_NAME_CREATE_EVENT = 'create-event'; //POST
var SERVICE_NAME_GET_FOOD_TYPE= 'getFoodType'; // GET
var SERVICE_NAME_GET_THEMES = 'getThemes'; // GET
var SERVICE_NAME_GET_EVENTS = 'getEvents'; // GET
var SERVICE_NAME_GET_EVENT_DETAILS = 'getEventDetails'; // GET
var SERVICE_NAME_REGISTER_USER = 'create-user';
var SERVICE_NAME_INSERT_MENU = 'insert-menu'; // POST
var SERVICE_NAME_UPDATE_MENU = 'update-menu'; // POST
var SERVICE_NAME_GET_MENU_DETAILS = 'get-menu-details';
var SERVICE_NAME_GET_MENU_IMAGE_DELETE = 'delete-menu-image'
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
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_THEMES,
    headers: requestHeaders
};

var GET_EVENTS = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_EVENTS,
    headers: requestHeaders
};

var CREATE_USER = {
    method: METHOD_TYPE_POST,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_REGISTER_USER,
    headers: requestHeaders
};

var GET_EVENT_DETAILS = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_EVENT_DETAILS,
    headers: requestHeaders
};

var INSERT_EVENT_MENU = {
    method: METHOD_TYPE_POST,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_INSERT_MENU,
    headers: requestHeaders
};

var UPDATE_EVENT_MENU = {
    method: METHOD_TYPE_POST,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_UPDATE_MENU,
    headers: requestHeaders
};

var GET_EVENT_MENU_DETAILS = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_MENU_DETAILS,
    headers: requestHeaders

};

var GET_EVENT_MENU_IMAGE_DELETE = {
    method: METHOD_TYPE_GET,
    url: SERVICES_DOMAIN_NAME + SERVICES_CONTEXT_NAME + SERVICE_NAME_GET_MENU_IMAGE_DELETE,
    headers: requestHeaders

};


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
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getFoodType': function(API, _successCallback, _errorCallback) {
            var serviceConfig = angular.copy(GET_FOOD_TYPE);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getThemes': function(API, _successCallback, _errorCallback) {
            var serviceConfig = angular.copy(GET_THEMES);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getEvents': function(API, _successCallback, _errorCallback) {
            var serviceConfig = angular.copy(GET_EVENTS);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'registerUser': function(API, _successCallback, _errorCallback, requestBody) {
            var serviceConfig = angular.copy(CREATE_USER);
            serviceConfig.data = requestBody;
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getEventDetails': function(API, _successCallback, _errorCallback,eventId) {
            var serviceConfig = angular.copy(GET_EVENT_DETAILS);
            serviceConfig.url = GET_EVENT_DETAILS.url + '/'+encodeURIComponent(eventId);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'insertEventMenu': function(API, _successCallback, _errorCallback,requestBody) {
            var serviceConfig = angular.copy(INSERT_EVENT_MENU);
            serviceConfig.data = requestBody;
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'getEventMenuDetails': function(API, _successCallback, _errorCallback,eventId) {
            var serviceConfig = angular.copy(GET_EVENT_MENU_DETAILS);
            serviceConfig.url = GET_EVENT_MENU_DETAILS.url + '/'+encodeURIComponent(eventId);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'deleteMenuMenuImage': function(API, _successCallback, _errorCallback,imageId,menuId) {
            var serviceConfig = angular.copy(GET_EVENT_MENU_IMAGE_DELETE);
            serviceConfig.url = GET_EVENT_MENU_IMAGE_DELETE.url + '/'+encodeURIComponent(imageId)+'/'+encodeURIComponent(menuId);
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
        'updateEventMenu': function(API, _successCallback, _errorCallback,requestBody) {
            var serviceConfig = angular.copy(UPDATE_EVENT_MENU);
            serviceConfig.data = requestBody;
            API.getAPI(serviceConfig, _successCallback, _errorCallback);
        },
    }
};