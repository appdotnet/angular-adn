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
