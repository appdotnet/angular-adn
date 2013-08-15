'use strict';
angular.module('adn', []);'use strict';
angular.module('adn').provider('ADNConfig', function () {
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
});'use strict';
angular.module('adn').factory('Auth', [
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
        $rootScope.local.accessToken = $rootScope.local.accessToken || jQuery.url($location.absUrl()).fparam('access_token');
        $location.hash('');
      }
    };
  }
]);'use strict';
angular.module('adn').factory('ApiClient', [
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
        if ($rootScope.local && $rootScope.local.accessToken) {
          conf.headers.Authorization = 'Bearer ' + $rootScope.local.accessToken;
        }
        conf.url = ADNConfig.get('api_client_root', 'https://alpha-api.app.net/stream/0/') + conf.url;
        conf.method = method;
        if (method === 'post' && conf.data && !conf.headers['Content-Type']) {
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
    apiClient.postJson = function (conf) {
      conf.headers = conf.headers || {};
      conf.headers['Content-Type'] = 'application/json';
      if (!angular.isString(conf.data) && angular.isObject(conf.data) || angular.isArray(conf.data)) {
        conf.data = angular.toJson(conf.data);
      }
      return apiClient.post(conf);
    };
    return apiClient;
  }
]);