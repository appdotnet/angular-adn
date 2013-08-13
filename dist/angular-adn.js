'use strict';
angular.module('adn', []).factory('ApiClient', [
  '$rootScope',
  '$http',
  'ADNConfig',
  function ($rootScope, $http, ADNConfig) {
    var methods = [
        'get',
        'head',
        'post',
        'put',
        'delete',
        'jsonp'
      ];
    var dispatch = function (method) {
      return function (conf) {
        conf.headers = conf.headers || {};
        conf.headers.Authorization = 'Bearer ' + $rootScope.local.accessToken;
        conf.url = ADNConfig.get('api_client_root', window.location.origin + '/api/') + conf.url;
        conf.method = method;
        if (method === 'post' && conf.data) {
          conf.data = jQuery.param(conf.data);
          conf.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return $http(conf);
      };
    };
    var apiClient = {};
    _.each(methods, function (m) {
      apiClient[m] = dispatch(m);
    });
    return apiClient;
  }
]);'use strict';
angular.module('adn', []).factory('Auth', [
  '$rootScope',
  '$location',
  function ($rootScope, $location) {
    $rootScope.local = JSON.parse(typeof localStorage.data !== 'undefined' ? localStorage.data : '{}');
    $rootScope.$watch('local', function () {
      localStorage.data = JSON.stringify($rootScope.local);
    }, true);
    return {
      isLoggedIn: function (local) {
        if (local === undefined) {
          local = $rootScope.local;
        }
        return local && typeof local.accessToken !== 'undefined';
      },
      logout: function () {
        $rootScope.local = {};
        localStorage.clear();
      },
      login: function () {
        $location.hash('');
        $rootScope.local.accessToken = $rootScope.local.accessToken || jQuery.url(window.location).fparam('access_token');
      }
    };
  }
]);'use strict';
angular.module('adn', []).provider('ADNConfig', function () {
  this.configuation = {};
  this.$get = function () {
    return {
      config: this.configuation,
      get: function (key, defaultValue) {
        if (this.config.hasOwnProperty(key)) {
          return this.config[key];
        }
        return defaultValue;
      }
    };
  };
  this.setConfig = function (conf) {
    this.configuation = angular.extend({}, this.configuation, conf);
  };
});