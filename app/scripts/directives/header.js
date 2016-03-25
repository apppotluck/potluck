'use strict';

/*
 * angular-google-plus-directive v0.0.1
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 */
define(['app'], function(app) {
    app.directive('header', ['$window','$localStorage','$location','jwtHelper', function($window,$localStorage,$location,jwtHelper) {
        return {
            restrict: 'E',
            transclude: true,
            scope: false,
            template: '<section class="pop-btn yellow"> <section class="col-xs-1 back-arrow"><span class=""><a href="{{link}}"><img src="/assets/images/arrow.png" width="10" height="17" alt="Back Arrow"></a></span></section><section class="col-xs-9 title-text">{{title}}</section><section class="col-xs-1 sprite pot-moreover" ng-click="displayLinks()" ng-transclude></section><section ng-show="settingLinks"><ul class="dropdown"><li><a href="#">Invite More Friends</a></li><li><a href="#">Broadcast Message</a></li><li><a href="#">Share Event</a></li><li><a href="#">Settings</a></li><li><a href="#" ng-click="signout()">Sign Out</a></li><li style="border-top: 1px solid #ccc;"><a href="#" ng-click="cancelEvents()">Cancel Event</a></li></ul></section></section>',
            replace: true,
            link: function(scope, element, attrs, linker) {
               // if ($localStorage.token === undefined) {
               //      $location.path('/');
               //  } 
                if($location.$$path === '/register') {
                    scope.link = '/';
                } else {
                    scope.link ='/events';
                }
                scope.title = attrs.title;
                scope.displayLinks = function() {
                    scope.settingLinks = !scope.settingLinks;
                };
                scope.signout = function() {
                     delete $localStorage.token
                     $location.path('/');
                };
                scope.cancelEvents = function() {
                    alert("sfsdf")
                }
            }
        }
    }])
});