(function () {
  'use strict';

  angular.module('adn').factory('User', function ($http, $q, ApiClient) {
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
          user = User._cache[user_id] = new User(false, {
            id: user_id
          });
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
  });

})();