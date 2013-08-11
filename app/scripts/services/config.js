'use strict';

angular.module('adn', []).provider('ADNConfig', function() {
  this.configuation = {};

  this.$get = function() {
    return {
      config: this.configuation,
      getOrDefault: function (key, default_value) {
        if (this.config.hasOwnProperty(key)) {
          return this.config[key];
        }

        return default_value;
      }
    }
  };

  this.setConfig = function(conf) {
    this.configuation = angular.extend({}, this.configuation, conf);
  };
});