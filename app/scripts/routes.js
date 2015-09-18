define([], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: '/views/home.html',
                dependencies: [
                    'controllers/HomeViewController'
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
                    'directives/compareTo'
                ]
            },
            '/forgot-password': {
                templateUrl: '/views/forgot-password.html',
                dependencies: [
                    'controllers/ForgotPasswordController'
                ]
            }
        }
    };
});