'use strict';

angular.module('adn').factory('Auth', function ($rootScope, $location) {
  var baseUser = {
    loggedIn: false,
    accessToken: null,
  };
  var createUser = function () {
    return angular.extend({}, baseUser);
  };
  var user;
  if (typeof(localStorage.user) !== 'undefined') {
    user = JSON.parse(localStorage.user);
  } else {
    user = createUser();
  }

  return {
    logout: function () {
      localStorage.clear();
      user = createUser();
      $rootScope.$broadcast('logout');
    },
    login: function (accessToken) {
      user.accessToken = accessToken || jQuery.url($location.absUrl()).fparam('access_token') || user.accessToken;
      if (user.accessToken) {
        user.loggedIn = true;
      }
      localStorage.user = JSON.stringify(user);
      $location.hash('');
      $rootScope.$broadcast('login');
    },
    currentUser: function () {
      return user;
    }
  };

});