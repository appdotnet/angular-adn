'use strict';
angular.module('adn', ['ui']);'use strict';
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
angular.module('adn').provider('Auth', function () {
  var LS = function () {
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
    }();
  var MS = function () {
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
    }();
  var storages = {
      memory: MS,
      localStorage: LS
    };
  var baseUser = {
      loggedIn: false,
      accessToken: null
    };
  var createUser = function () {
    return angular.extend({}, baseUser);
  };
  var storageEngine = storages.localStorage;
  this.$get = [
    '$rootScope',
    '$location',
    function ($rootScope, $location) {
      var user;
      if (typeof storageEngine.get('user') !== 'undefined') {
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
    }
  ];
  this.$get.$inject = [
    '$rootScope',
    '$location'
  ];
  this.chooseStorageEngine = function (engine) {
    if (storages[engine]) {
      storageEngine = storages[engine];
    }
  };
});'use strict';
angular.module('adn').factory('ApiClient', [
  '$rootScope',
  '$http',
  'ADNConfig',
  'Auth',
  function ($rootScope, $http, ADNConfig, Auth) {
    var methods = [
        'get',
        'head',
        'post',
        'put',
        'delete',
        'jsonp'
      ];
    var dispatch = function (method) {
      return function (conf, extra) {
        extra = extra || {};
        conf.headers = conf.headers || {};
        var user = Auth.currentUser();
        if (user.loggedIn) {
          conf.headers.Authorization = 'Bearer ' + user.accessToken;
        }
        conf = jQuery.extend(true, {}, extra, conf);
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
        url: '/users/me/channels',
        params: {
          channel_types: 'net.app.core.broadcast',
          count: 200
        }
      }, extra);
    };
    apiClient.getChannel = function (channel_id, extra) {
      return apiClient.get({ url: '/channels/' + channel_id }, extra);
    };
    apiClient.subscribeToChannel = function (channel, extra) {
      return apiClient.post({ url: '/channels/' + channel.id + '/subscribe' }, extra);
    };
    apiClient.unsubscribeFromChannel = function (channel, extra) {
      return apiClient.delete({ url: '/channels/' + channel.id + '/subscribe' }, extra);
    };
    apiClient.createMessage = function (channel, message, extra) {
      return apiClient.postJson({
        url: '/channels/' + channel.id + '/messages',
        data: message
      }, extra);
    };
    apiClient.getMessages = function (channel, extra) {
      var conf = { url: '/channels/' + channel.id + '/messages' };
      return apiClient.get(conf, extra);
    };
    apiClient.getMultipleUsers = function (ids, extra) {
      return apiClient.get({ params: { ids: ids } }, extra);
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
          title: 'Channel ' + channel.id,
          description: ''
        };
      }
    };
    return apiClient;
  }
]);(function () {
  'use strict';
  angular.module('adn').factory('User', [
    '$http',
    '$q',
    'ApiClient',
    function ($http, $q, ApiClient) {
      var User = function (complete, data) {
        if (complete) {
          this.complete(data);
        } else {
          data['is_complete'] = false;
          angular.extend(this, data);
        }
      };
      User.prototype.complete = function (data) {
        angular.extend(this, data);
        this.is_complete = true;
        this.text = '@' + this.username + ' (' + this.name + ')';
        return this;
      };
      User._cache = {};
      User._pending = [];
      User.update = function (user) {
        if (!user) {
          return;
        }
        var cached_user = User._cache[user.id || 0];
        if (cached_user) {
          User._pending = _.without(User._pending, cached_user);
          return cached_user.complete(user);
        } else {
          User._cache[user.id] = new User(true, user);
          return User._cache[user.id];
        }
      };
      User.bulk_get = function (user_ids, fetch) {
        var result = {};
        var deferred = $q.defer();
        _.each(_.uniq(user_ids), function (user_id) {
          var user = User._cache[user_id];
          if (!user) {
            user = User._cache[user_id] = new User(false, { id: user_id });
            User._pending.push(user);
          }
          result[user_id] = user;
        });
        if (fetch) {
          User.fetch_pending().then(function () {
            deferred.resolve(result);
          });
        } else {
          deferred.resolve(result);
        }
        return deferred.promise;
      };
      User.fetch_pending = function () {
        var pending = User._pending;
        User._pending = [];
        var callback = function (response) {
          _.each(response.data.data, function (user) {
            User.update(user);
          });
        };
        var promises = [];
        while (pending.length) {
          var chunk = _.first(pending, 200);
          pending = _.rest(pending, 200);
          var joined_ids = _.pluck(chunk, 'id').join();
          var promise = ApiClient.getMultipleUsers(joined_ids);
          promise.then(callback);
          promises.push(promise);
        }
        return $q.all(promises);
      };
      return User;
    }
  ]);
}());(function () {
  'use strict';
  angular.module('adn').directive('adnText', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        scope.offset = 0;
        if (scope.textData.rawText === undefined) {
          scope.textData.rawText = '';
        }
        // until angular > 1.1.1, ng-trim isn't an option so this won't be fired on whitespace from scope.text
        scope.updateCounter = function () {
          scope.charCount = scope.maxChars - scope.offset - scope.textData.rawText.length;
        };
        scope.$watch('[maxChars, offset, textData]', scope.updateCounter, true);
        scope.updateCounter();
        scope.buttonClick = function () {
          if (scope.textData.rawText.length <= scope.maxChars) {
            // processedMessage is what we should send to the server
            // rawText is what should be in the text box that gets processed into text
            scope.textData.processedMessage = { text: scope.textData.rawText };
            scope.onButtonClick();
          }
        };
      },
      templateUrl: 'templates/adn-text.html',
      scope: {
        buttonText: '@',
        onButtonClick: '&',
        maxChars: '@',
        textData: '='
      }
    };
  });
}());(function () {
  'use strict';
  angular.module('adn').controller('UserSearchCtrl', [
    '$scope',
    'User',
    'ApiClient',
    function ($scope, User, ApiClient) {
      // autocomplete
      var get_search_select2 = function (include_users) {
        return {
          multiple: true,
          minimumInputLength: 1,
          tokenSeparators: [
            ',',
            ' '
          ],
          createSearchChoice: function (term) {
            return term;
          },
          width: 'resolve',
          query: function (options) {
            if (options.term.charAt(0) !== '@' && options.term.charAt(0) !== '#') {
              options.term = '@' + options.term;
            }
            var data = {
                q: options.term,
                include_users: include_users || 'any'
              };
            ApiClient.searchUsers(data).success(function (data) {
              var results = _.map(data.data, function (value) {
                  return User.update(value);
                });
              options.callback({ results: results });
            });
            // This is a fucked up way to fix a weird fucking bug in angular
            // https://github.com/angular/angular.js/issues/2442
            $scope.$apply();
          }
        };
      };
      $scope.usernameSelect = get_search_select2();
    }
  ]);
  angular.module('adn').directive('userSearch', function () {
    return {
      restrict: 'A',
      controller: 'UserSearchCtrl',
      templateUrl: 'templates/user-search.html',
      replace: true,
      scope: {
        label: '=',
        selectedUsers: '=',
        include_users: '='
      }
    };
  });
}());angular.module('adn').run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/adn-text.html', '<div class="well-plain well-elevated">\n' + '    <div>\n' + '        <textarea class="editable input-flex" ng-model="textData.rawText" ng-trim="false" tabindex=1></textarea>\n' + '    </div>\n' + '    <div>\n' + '      <span class="text-left char-count">{{ charCount }}</span>\n' + '      <span class="pull-right">\n' + '        <button class="btn btn-primary btn-small" tabindex=2 ng-disabled="charCount < 0" ng-click="buttonClick()">{{ buttonText }}</button>\n' + '      </span>\n' + '    </div>\n' + '</div>');
    $templateCache.put('templates/user-search.html', '<div>\n' + '  <!-- originally from ohe -->\n' + '  <label class="control-label" ng-bind=\'label\'></label>\n' + '  <input class=\'input-block-level\' type="hidden" ui-select2="usernameSelect" ng-model="selectedUsers" ng-multiple>\n' + '</div>');
  }
]);