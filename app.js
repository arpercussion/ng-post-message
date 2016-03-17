/**
@toc
1. setup - whitelist, appPath, html5Mode
*/

'use strict';

angular.module('myApp', [
'petarslovic.ng-post-message'
]).
config(function(PostMessageProvider, appConfig) {

  // var staticPath ='/';
  var staticPath;
  // staticPath ='/angular-services/ng-post-message/';    //local
  staticPath ='/';    //nodejs (local)
  staticPath ='/ng-post-message/';   //gh-pages
  var appPathRoute ='/';
  var pagesPath =staticPath+'pages/';

  PostMessageProvider.setAllowedDomains(appConfig.allowedDomains);
  PostMessageProvider.debug(true);
})
.constant('appConfig', {
  allowedDomains: ['http://petarslovic.github.io'],
  iframeDomain: 'http://petarslovic.github.io'
});