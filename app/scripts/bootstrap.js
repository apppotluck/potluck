require.config({
    baseUrl: '/scripts',
    paths: {
        'angular'           : '/bower_components/angular/angular',
        'angular-route'     : '/bower_components/angular-route/angular-route',
        'bootstrap'         : '../lib/bootstrap/js/bootstrap.min',
        'jquery'            : '/bower_components/jquery/dist/jquery',
        'constants'         : '/scripts/config/constants',
        'appConfig'         : '/scripts/config/appConfig',
        'angular-animate'   : '/bower_components/angular-animate/angular-animate',
        'bootstrap-ui'      : '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-dateParser': '/bower_components/angular-dateParser/dataparser',
        'ngFacebook'        : '../lib/ngFacebook',
        'timepickerPop'     : '../lib/timepickerPop',
        'ngAutocomplete'    : '../lib/ngAutocomplete',
        'autocomplete'      : '../lib/autocomplete'

    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'app': {
            deps: ['angular', 'angular-route','bootstrap','constants','appConfig','angular-animate','bootstrap-ui']
        },
        'angular-route': {
            deps: ['angular']
        },
        'bootstrap-ui': {
            deps: ['angular']
        },
        'ngFacebook': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'timepickerPop': {
            deps:['angular','bootstrap-ui']
        },
        'ngAutocomplete':{
            deps:['angular']
        },
        'autocomplete': {
            deps:['angular']
        },
        
    },
    priority: ['angular']
});

require
(
    [
        'app',
        'services/twitterService',
        'ngFacebook',
        'services/API',
        'timepickerPop',
        'ngAutocomplete',
        'autocomplete'
    ],
    function(app)
    {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app']);
        })
    }
);