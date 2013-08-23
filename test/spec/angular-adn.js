'use strict';

describe('Module: adn.ADNConfig', function () {
  // load the controller's module
  beforeEach(module('adn', function(ADNConfigProvider) {
    ADNConfigProvider.setConfig({
      'not_blank': 'test'
    });
  }));


  it('should return defaultValue if key is missing from config', inject(function (ADNConfig) {
    expect(ADNConfig.get('blank', 'awesome')).toBe('awesome');
    expect(ADNConfig.get('not_blank', 'awesome')).toBe('test');
  }));

});

describe('Module: adn.Auth', function () {
  var scope, $sandbox, $compile, $timeout;

  // load the controller's module
  beforeEach(module('adn', function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('');
  }));

  it('should not be logged in by default', inject(function (Auth) {
    expect(Auth.isLoggedIn()).toBe(false);
  }));

  it('should fail to login if there is no hash', inject(function (Auth) {
    Auth.login();
    expect(Auth.isLoggedIn()).toBe(false);
  }));

  it('should succeded to login if there is a hash', inject(function (Auth, $location) {
    $location.hash('access_token=1234');
    Auth.login();
    expect(Auth.isLoggedIn()).toBe(true);
  }));

  it('should log a user out when calling logout', inject(function (Auth, $location) {
    $location.hash('access_token=1234');
    Auth.login();
    expect(Auth.isLoggedIn()).toBe(true);
    Auth.logout();
    expect(Auth.isLoggedIn()).toBe(false);
  }));

  describe('localStorage test', function () {
    beforeEach(function () {
      localStorage.data = '{"accessToken":"1234"}';
    });

    afterEach(function () {
      localStorage.clear();
    });

    it('should automatically log a user in if localStorage already has an access token', inject(function (Auth) {
      expect(Auth.isLoggedIn()).toBe(true);
    }));
  });
});

describe('Module: adn.adnText', function() {
  var elm, scope;

  // load the tabs code
  beforeEach(module('adn'));

  // load the templates
  // beforeEach(module('tpl/tabs.html', 'tpl/pane.html'));

  function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var random = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      random += charSet.substring(randomPoz,randomPoz+1);
    }
    return random;
  }

  beforeEach(inject(function($rootScope, $compile) {
    // we might move this tpl into an html file as well...
    elm = angular.element('<div adn-text button-text="Publish" on-button-click="sendText()" text-data="message" max-chars=256></div>');
    scope = $rootScope;
    scope.$apply(function () {
      scope.message = {};
      scope.sendText = function () {
        return;
      };
    });
    spyOn(scope, 'sendText');
    $compile(elm)(scope);
    scope.$digest();
  }));


  it('should work', inject(function($compile, $rootScope) {
    var submit = elm.find('button');
    expect(submit.attr('disabled')).toBe(undefined);
    scope.$apply(function () {
      scope.message.rawText = randomString(257);
    });
    expect(submit.attr('disabled')).toBe('disabled');
    var test_string = randomString(256);
    scope.$apply(function () {
      scope.message.rawText = test_string;
    });
    expect(submit.attr('disabled')).toBe(undefined);
    $('button', elm).click();
    expect(scope.sendText).toHaveBeenCalled();
    expect(scope.sendText.calls.length).toEqual(1);
    expect(scope.message.processedMessage.text).toBe(test_string);
  }));

});

describe('Module: adn.User', function() {

  beforeEach(module('adn'));

  beforeEach(inject(function (User) {
    User._pending = [];
    User._cache = [];
  }));

  it('should partially update', inject(function(User) {
    var new_user = new User(false, {id: 1});
    expect(new_user.id).toBe(1);
    expect(new_user.is_complete).toBe(false);
    new_user.complete({
      username: 'voidfiles',
      name: 'Alex Kessinger'
    });
    expect(new_user.is_complete).toBe(true);
    expect(new_user.username).toBe('voidfiles');
    expect(new_user.text).toBe('@voidfiles (Alex Kessinger)');
  }));

  it('should do ad hoc updates', inject(function(User) {
    expect(User.update()).toBe(undefined);
    var new_user = new User(false, {id: 1});
    User._cache[1] = new_user;
    User._pending = [new_user];
    expect(User._pending.length).toBe(1);
    User.update(new_user);
    expect(User._pending.length).toBe(0);
    User._cache = {};
    User.update(new_user);
    expect(User._cache[1].id).toBe(1);
  }));

  it('Should only fetch as many users as it needs', inject(function(User) {
    var new_user_1 = new User(false, {id: 1});
    var new_user_2 = new User(false, {id: 2});
    User._cache = {1: new_user_1};
    User.bulk_get([1,2], false);
    expect(User._pending.length).toBe(1);
    expect(User._pending[0].id).toBe(2);
  }));



});
