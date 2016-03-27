define([], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: '/views/home.html',
                dependencies: [
                    'controllers/HomeViewController',
                    'directives/google-plus-signin'
                ]
            },
            '/intro': {
                templateUrl: '/views/intro.html',
                dependencies: [
                    'controllers/IntroViewController'
                ]
            },
            '/register': {
                templateUrl: '/views/register.html',
                dependencies: [
                    'controllers/RegisterController',
                    'directives/compareTo',
                    'directives/header'
                ]
            },
            '/forgot-password': {
                templateUrl: '/views/forgot-password.html',
                dependencies: [
                    'controllers/ForgotPasswordController',
                    'directives/header'
                ]
            },
            '/create-event': {
                templateUrl: '/views/events/create-event.html',
                dependencies: [
                    'controllers/events/CreateEventController',
                    'directives/header'
                ]
            },
            '/events': {
                templateUrl: '/views/events/events.html',
                dependencies: [
                    'controllers/events/EventsController',
                    'directives/header'
                ]
            },
            '/event-details/:eid': {
                templateUrl: '/views/events/event-details.html',
                dependencies: [
                    'controllers/events/EventsController',
                    'directives/header'
                ]
            },
            '/cancel-events': {
                templateUrl: '/views/events/cancel-events.html',
                dependencies: [
                    'controllers/events/EventsController',
                    'directives/header'
                ]
            },
            '/invite-friends': {
                templateUrl: '/views/events/invite-friends-for-events.html',
                dependencies: [
                    'controllers/events/EventsController',
                    'directives/header'
                ]
            }
        }
    };
});