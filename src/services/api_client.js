'use strict';

angular.module('adn').factory('ApiClient', function ($rootScope, $http, ADNConfig) {

  var methods = ['get', 'head', 'post', 'put', 'delete', 'jsonp'];
  var dispatch = function (method) {
    return function (conf, extra) {
      extra = extra || {};
      conf.headers = conf.headers || {};
      if ($rootScope.local && $rootScope.local.accessToken) {
        conf.headers.Authorization = 'Bearer ' + $rootScope.local.accessToken;
      }

      conf = jQuery.extend({}, extra, conf);
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

  var jsonMethod = function (method, conf, extra) {
    conf.headers = conf.headers || {};
    conf.headers['Content-Type'] = 'application/json';
    if (!angular.isString(conf.data) && angular.isObject(conf.data) || angular.isArray(conf.data)) {
      conf.data = angular.toJson(conf.data);
    }
    return apiClient[method](conf, extra);
  };

  apiClient.postJson = function (conf, extra) {
    return jsonMethod('post', conf, extra);
  };

  apiClient.putJson = function (conf, extra) {
    return jsonMethod('put', conf, extra);
  };


 // look into $resource for this stuff
  apiClient.createChannel = function (channel, extra) {
    return apiClient.postJson({
      url: '/channels',
      data: channel
    }, extra);
  };

  apiClient.updateChannel = function (channel, updates, extra) {
    return apiClient.putJson({
      url: '/channels/' + channel.id,
      data: updates
    }, extra);
  };

  apiClient.getBroadcastChannels = function (extra) {
    return apiClient.get({
      url: '/channels',
      params: {
        channel_types: 'net.app.core.broadcast',
        count: 200
      }
    }, extra);
  };

  apiClient.getChannel = function (channel_id, extra) {
    return apiClient.get({
      url: '/channels/' + channel_id,
    }, extra);
  };

  apiClient.subscribeToChannel = function (channel, extra) {
    return apiClient.post({
      url: '/channels/' + channel.id + '/subscribe',
    }, extra);
  };

  apiClient.unsubscribeFromChannel = function (channel, extra) {
    return apiClient.delete({
      url: '/channels/' + channel.id + '/subscribe',
    }, extra);
  };

  apiClient.createMessage = function (channel, message, extra) {
    return apiClient.postJson({
      url: '/channels/' + channel.id + '/messages',
      data: message
    }, extra);
  };

  apiClient.getMessages = function (channel, extra) {
    var conf = {
      url: '/channels/' + channel.id + '/messages',
    };

    return apiClient.get(conf, extra);
  };

  apiClient.getMultipleUsers = function (ids, extra) {
    return apiClient.get({
      params: {
        ids: ids
      }
    }, extra);
  };

  apiClient.searchUsers = function (query, extra) {
    return apiClient.get({
      params: query,
      url: '/users/search'
    }, extra);
  };

  // misc stuff
  apiClient.getChannelMetadata = function (channel) {
    var annotation = _.find(channel.annotations, function (annotation) {
      return annotation.type === 'net.app.core.broadcast.metadata' && annotation.value.title && annotation.value.description;
    });
    if (annotation) {
      return annotation.value;
    } else {
      return {
        title: "Channel " + channel.id,
        description: ''
      };
    }
  };

  // ugly hack?
  $rootScope.channels = [];

  apiClient.getBroadcastChannels().success(function (data) {
    $rootScope.channels = _.filter(data.data, function (channel) {
      return channel.you_subscribed;
    });
  });


  return apiClient;

});