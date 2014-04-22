'use strict';

angular.module('adn').provider('Auth', function() {

  var LS = (function () {
    return {
      clear: function () {
        localStorage.clear();
      },
      get: function (key) {
        return localStorage[key];
      },
      set: function (key, value) {
        localStorage[key] = value;
        return;
      }
    };
  })();

  var MS = (function () {
    var inMemory = {};

    return {
      clear: function () {
        inMemory = {};
      },
      get: function (key) {
        return inMemory[key];
      },
      set: function (key, value) {
        inMemory[key] = value;
        return;
      }
    };
  })();

  var storages = {
    memory: MS,
    localStorage: LS,
  };

  var baseUser = {
    loggedIn: false,
    accessToken: null,
  };

  var createUser = function () {
    return angular.extend({}, baseUser);
  };

  var storageEngine = storages.localStorage;

  this.$get = function($rootScope, $location) {
    var user;

    if (typeof(storageEngine.get('user')) !== 'undefined') {
      user = JSON.parse(storageEngine.get('user'));
    } else {
      user = createUser();
    }

    return {
      logout: function () {
        storageEngine.clear();
        user = createUser();
        $rootScope.$broadcast('logout');
      },
      login: function (accessToken) {
        user.accessToken = accessToken || jQuery.url($location.absUrl()).fparam('access_token') || user.accessToken;
        if (user.accessToken) {
          user.loggedIn = true;
        }
        storageEngine.set('user', JSON.stringify(user));
        $location.hash('');
        $rootScope.$broadcast('login');
      },
      currentUser: function () {
        return user;
      }
    };
  };

  this.chooseStorageEngine = function(engine) {
    if (storages[engine]) {
      storageEngine = storages[engine];
    }
  };

});
