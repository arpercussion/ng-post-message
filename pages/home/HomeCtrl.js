/**
*/

'use strict';

angular.module('myApp')
  .controller('HomeCtrl', function($scope, PostMessage, appConfig) {
    var vm = this;

    vm.sayHello = sayHello;

    PostMessage.on('responding-hello', function(event, data) {
      console.log(event, data);
      vm.message = data;
    });

    function sayHello() {
      PostMessage.send('hello', {
        some: 'data',
        time: (new Date()).valueOf()
      }, 'inside', appConfig.iframeDomain);
    }
  });