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
    var debug = {
      on: false
    };

    this.setAllowedDomains = function(newAllowedDomains) {
      allowedDomains = newAllowedDomains;
    };

    this.debug = function(shouldDebug) {
      debug.on = shouldDebug;
    };

    this.$get = function($window, $rootScope, $log) {
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

        if(debug.on) {
          $log.info('ng-post-message: sendMessage', messageName, data, iframeName, domain);
        }

        sender.postMessage(serializedData, domain);
      }

      function onMessage(messageName, callback) {
        if(!callbacks[messageName]) {
          callbacks[messageName] = [];
        }

        callbacks[messageName].push(callback);

        if(debug.on) {
          $log.info('ng-post-message: registered callback for ', messageName);
        }

        return offMessage(messageName, callback);
      }

      function offMessage(messageName, callback) {
        return function() {
          callbacks[messageName] = _.filter(callbacks[messageName], function(cb) {
            return cb !== callback;
          });

          if(debug.on) {
            $log.info('ng-post-message: removed callback for', messageName);
          }
        };
      }

      function onPostMessage(event) {
        var origin = event.origin || (event.originalEvent && event.originalEvent.origin) || null;
        var data = event.data || (event.originalEvent && event.originalEvent.data) || 'null';

        if(allowedDomains.indexOf(origin) === -1) {
          throw new Error('Receiving messages from domain ' + origin + ' must be explicitly allowed.');
        }

        var parsedData = typeof data === 'string' ? parseData(data) : data;
        var messageName = parsedData.messageName || parsedData.message;

        // Don't allow Batarang messages to slow the app down :)
        if(parsedData['__fromBatarang']) {
          return;
        }

        if(debug.on) {
          $log.info('ng-post-message: onMessage', messageName, parsedData, origin);
        }

        _.invoke(callbacks[messageName], _.call, null, event, parsedData);
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