require.config({
    baseUrl: '/scripts',
    catchError: true,
    paths: {
        'angular'           : '/bower_components/angular/angular',
        'angular-route'     : '/bower_components/angular-route/angular-route',
        'angular-animate'   : '/bower_components/angular-animate/angular-animate',
        'ngAria'            : '/bower_components/angular-aria/angular-aria.min',
        'ngMaterial'        : '/bower_components/angular-material/angular-material.min',
        'bootstrap-ui'      : '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-dateParser': '/bower_components/angular-dateParser/dataparser',
        'bootstrap'         : '../lib/bootstrap/js/bootstrap.min',
        'jquery'            : '/bower_components/jquery/dist/jquery',
        'constants'         : '/scripts/config/constants',
        'appConfig'         : '/scripts/config/appConfig',
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
        'ngAria': {
            deps:['angular']
        },
        'ngMaterial': {
            deps:['ngAria']
        }
        
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
        'autocomplete',
        'ngMaterial'
    ],
    function(app)
    {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app']);
        })
    }
);