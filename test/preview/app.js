'use strict';
var preview = angular.module('preview', ['adn', 'ui']);

preview.run(function ($rootScope, $location, Auth) {
  // Developers should change this client_id to their own app.
  $rootScope.client_id = '6kmFxf2JrEqmFRQ4WncLfN8WWx7FnUS8';
  Auth.login();
});


preview.controller('DemoCtrl', function($rootScope, $scope) {
  console.log('yo');
});