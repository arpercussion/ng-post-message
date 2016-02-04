/**
@fileOverview

@toc

*/

(function () {
  'use strict';

  angular
    .module('petarslovic.ng-post-message', [])
    .provider('PostMessage', PostMessageProvider);

  function PostMessageProvider() {
    var allowedDomains = [];

    this.setAllowedDomains = function(newAllowedDomains) {
      allowedDomains = newAllowedDomains;
    };

    this.$get = function($window, $rootScope) {
      var callbacks = {};

      var api = {
        send: sendMessage,
        on: onMessage
      };

      angular.element(window).bind('message', onPostMessage);

      return api;

      function sendMessage(messageName, data, iframeName, domain) {
        var sender;
        var serializedData = serializeData(messageName, data);

        if(domain) {
          if(allowedDomains.indexOf(domain) === -1) {
            throw new Error('Sending messages to domain ' + domain + ' must be explicitly allowed.');
          }
        } else {
          domain = '*';
        }

        var iframe = $window.document.querySelector('iframe[name="' + iframeName + '"]');

        sender = iframe ? iframe.contentWindow : $window.parent;

        sender.postMessage(serializedData, domain);
      }

      function onMessage(messageName, callback) {
        if(!callbacks[messageName]) {
          callbacks[messageName] = [];
        }

        callbacks[messageName].push(callback);
      }

      function onPostMessage(event) {
        var origin = event.origin || (event.originalEvent && event.originalEvent.origin) || null;
        var data = event.data || (event.originalEvent && event.originalEvent.data) || 'null';

        if(allowedDomains.indexOf(origin) === -1) {
          throw new Error('Receiving messages from domain ' + origin + ' must be explicitly allowed.');
        }

        var parsedData = typeof data === 'string' ? parseData(data) : data;

        _.invoke(callbacks[parsedData.messageName], _.call, null, event, parsedData);
        $rootScope.$digest();
      }

      function parseData(data) {
        if(!data || typeof data !== 'string') {
          return {};
        }

        var parts = data.split(/:(.+)/);
        return {
          messageName: parts[0],
          data: angular.fromJson(parts[1])
        };
      }

      function serializeData(messageName, data) {
        return messageName + ':' + angular.toJson(data);
      }
    };

  }
})();