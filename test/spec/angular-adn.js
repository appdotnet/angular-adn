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


  it('should be disabled', inject(function($compile, $rootScope) {
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
