'use strict';

/*
 * angular-google-plus-directive v0.0.1
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 */
define(['app'], function(app)
{
    app.directive('header', ['$window', function ($window) {
    	return {
                restrict: 'E',
                transclude: true,
                template: '<span></span>',
                replace: true,
                link: function (scope, element, attrs, ctrl, linker) {
					var headerHtml = '<section class="pop-btn yellow"> <section class="col-xs-1 back-arrow"><span class=""><a href="/"><img src="./assets/images/arrow.png" width="10" height="17" alt="Back Arrow"></a></span></section><section class="col-xs-9 title-text">'+attrs.title+'</section><section class="col-xs-1 sprite pot-moreover"></section></section>';
						element.html(headerHtml);					
				}
			}
    }])
});