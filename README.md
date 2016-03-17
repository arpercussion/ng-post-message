# AngularJS Post Message API Wrapper

AngularJS Post Message API Wrapper.
Developed for communication between two Angular apps, but can be used with non-angular apps as well.

## Demo
http://petarslovic.github.io/ng-post-message/

## Dependencies
- required:
	lodash

See `bower.json` and `index.html` in the `gh-pages` branch for a full list / more details

## Install
### Get the files
	Bower
		add `"ng-post-message": "latest"` to your `bower.json` file then run `bower install` OR run `bower install ng-post-message`

### Include the files in your app
  `post-message.min.js`

### Include the module in angular
  i.e. in `app.js` - `petarslovic.ng-post-message`

See the `gh-pages` branch, files `bower.json` and `index.html` for a full example.


## Documentation

### Configuration

To configure ng-post-message, inject it in the config phase like so:
```
  angular
    .module('your-module')
    .config(function(PostMessageProvider) {
      PostMessageProvider.setAllowedDomains(['http://petarslovic.github.io']);
    });
```

- **PostMessageProvider.setAllowedDomains(array)**
Set the list of domains that your app can communicate with.
This list will be checked when your app receives a message.

- **PostMessageProvider.debug(boolean)**
Turn debug messages on or off.

### API

- **PostMessage.on(*messageName*, *callback*)**
Registers message listeners.
Message name is like an event name, and callback will be executed when the message arrives.
When your callback is invoked, it will be provided the original event and message data as parameters in that order.
Message data is an object containing `messageName` and `data`.

```
  var offSomeEvent = PostMessage.on('some-event', function(event, data) {
    console.log(event, data);
    vm.message = data;
  });
```

The `PostMessage.on` method returns a deregister function that you can call to deregister that listener.
For example, you would deregister a listener when a scope is destroyed (i.e. state changed).

```
  $scope.$on('$destroy', offSomeEvent);
```

- **PostMessage.send(*messageName*, *data*, *iframeName*, *domain*)**
Sends a message with name `messageName` and data `data` to iframe with `[name="iframeName"]` that is located on the domain `domain`.
If you provide null as an `iframeName` the message will be sent to `window.parent` (for sending messages from an iframe to parent window).
If you don't provide `domain` as a parameter, `'*'` will be used.

```
  PostMessage.send('some-event', {
    some: 'data'
  }, 'myIframeName', 'http://petarslovic.github.io');
```

## Development

1. `git checkout gh-pages`
	1. run `npm install && bower install`
	2. write your code then run `grunt`
	3. git commit your changes
2. copy over core files (.js and .css/.less for directives) to master branch
	1. `git checkout master`
	2. `git checkout gh-pages post-message.js post-message.min.js`
3. update README, CHANGELOG, bower.json, and do any other final polishing to prepare for publishing
	1. git commit changes
	2. git tag with the version number, i.e. `git tag v1.0.0`
4. create github repo and push
	1. [if remote does not already exist or is incorrect] `git remote add origin [github url]`
	2. `git push origin master --tags` (want to push master branch first so it is the default on github)
	3. `git checkout gh-pages`
	4. `git push origin gh-pages`
5. (optional) register bower component
	1. `bower register ng-post-message [git repo url]`
