'use strict';

angular.module('adn').provider('ADNConfig', function() {
  this.configuation = {};

  this.$get = function() {
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

  this.setConfig = function(conf) {
    this.configuation = angular.extend({}, this.configuation, conf);
  };
});