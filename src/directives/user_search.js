(function () {
  'use strict';

  angular.module('adn').directive('userSearch', function (User, ApiClient) {
    return {
      restrict: 'A',
      controller: 'UserSearchCtrl',
      templateUrl: 'templates/user-search.html',
      replace: true,
      scope: {
        label: '@',
        selectedUsers: '=',
        include_users: '='
      },
      link: function (scope, element) {
        scope.handleUserQuery = scope.handleUserQuery || function (options) {
          if (options.term.charAt(0) !== '@' && options.term.charAt(0) !== '#') {
            options.term = '@' + options.term;
          }

          var data = {
            q: options.term,
            include_users: scope.include_users || 'any'
          };

          ApiClient.searchUsers(data).success(function (data) {
            var results = _.map(data.data, User.update);

            options.callback({
              results: results
            });
          });
        };
      }
    };
  });

})();