(function () {
  'use strict';

  angular.module('adn').controller('UserSearchCtrl', function ($scope, User, ApiClient) {
    // autocomplete
    var get_search_select2 = function (include_users) {
      return {
        multiple: true,
        minimumInputLength: 1,
        tokenSeparators: [",", " "],
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
            options.callback({
              results: results
            });
          }).error(function () {
            console.log('error', arguments);
          }).always(function () {
            console.log('always', arguments);
          });
          // This is a fucked up way to fix a weird fucking bug in angular
          // https://github.com/angular/angular.js/issues/2442
          $scope.$apply();
        }
      };
    };
    $scope.usernameSelect = get_search_select2();
  });

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

})();