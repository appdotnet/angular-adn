'use strict';

angular.module('adn').factory('ApiClient', function ($rootScope, $http, ADNConfig) {

  var methods = ['get', 'head', 'post', 'put', 'delete', 'jsonp'];
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

});