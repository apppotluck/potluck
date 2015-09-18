define(['app'], function(app)
{
    app.controller('IntroController',
        [
            '$scope',
            '$location',
            function($scope,API,$location) {
                $scope.constants = constants;
                $scope.myInterval = 5000;
                $scope.noWrapSlides = false;
                $scope.slides= [];
                $scope.slides = [{
                    "titleText":"Create Event & Invite Friends in ease1.",
                    "subTitle":"Register for FREE and Create an event and Invite in less then few seconds.",
                    "image":"./assets/images/yellow.png",
                    "cssName":""
                },{
                    "titleText":"Create Event & Invite Friends in ease2.",
                    "subTitle":"Register for FREE and Create an event and Invite in less then few seconds.",
                    "image":"./assets/images/yellow.png",
                    "cssName":"violet"
                },{
                    "titleText":"Create Event & Invite Friends in ease3.",
                    "subTitle":"Register for FREE and Create an event and Invite in less then few seconds.",
                    "image":"./assets/images/yellow.png",
                    "cssName":"green"
                },{
                    "titleText":"Create Event & Invite Friends in ease4.",
                    "subTitle":"Register for FREE and Create an event and Invite in less then few seconds.",
                    "image":"./assets/images/yellow.png",
                    "cssName":"blue"
                }]
            }
        ]);
});