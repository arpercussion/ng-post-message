/**
@toc
1. setup - whitelist, appPath, html5Mode
*/

'use strict';

angular.module('myAppInside', [
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
  parentDomain: 'http://petarslovic.github.io'
});