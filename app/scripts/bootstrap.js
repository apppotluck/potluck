require.config({
    baseUrl: '/scripts',
    paths: {
		'angular'           : '/bower_components/angular/angular',
		'angular-route'     : '/bower_components/angular-route/angular-route',
		'bootstrap'         : '../lib/bootstrap/js/bootstrap.min',
		'jquery'            : '/bower_components/jquery/dist/jquery',
        'constants'         : '/scripts/config/constants',
        'appConfig'         : '/scripts/config/appConfig',
        'bootstrap-ui'      : '/bower_components/angular-bootstrap/ui-bootstrap-tpls'
    },
	shim: {
        'angular': {
            exports: 'angular'
        },
        'app': {
			deps: ['angular', 'angular-route','bootstrap','constants','appConfig','bootstrap-ui']
		},
		'angular-route': {
			deps: ['angular']
		},
        'bootstrap-ui': {
            deps: ['angular']
        },
		'bootstrap': {
			deps: ['jquery']
		}
	},
    priority: ['angular']
});

require
(
    [
        'app',
        'services/API',
        'bootstrap-ui'
    ],
    function(app)
    {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app']);
        })
    }
);