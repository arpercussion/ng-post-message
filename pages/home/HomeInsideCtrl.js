/**
*/

'use strict';

angular.module('myAppInside')
  .controller('HomeInsideCtrl', function($rootScope, PostMessage, appConfig) {
    var vm = this;

    vm.respondHello = respondHello;

    PostMessage.on('hello', function(event, data) {
      console.log(event, data);
      vm.message = data;
    });

    function respondHello() {
      PostMessage.send('responding-hello', {
        responding: 'hello',
        time: (new Date()).valueOf()
      }, null, appConfig.parentDomain);
    }
  });