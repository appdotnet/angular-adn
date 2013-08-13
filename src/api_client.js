'use strict';

angular.module('adn', []).factory('ApiClient', function ($rootScope, $http, ADNConfig) {

  var methods = ['get', 'head', 'post', 'put', 'delete', 'jsonp'];

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

});