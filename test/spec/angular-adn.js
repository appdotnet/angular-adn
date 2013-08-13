'use strict';

describe('Module: adn.ADNConfig', function () {
  var scope, $sandbox, $compile, $timeout;

  // load the controller's module
  beforeEach(module('adn', function(ADNConfigProvider) {
    ADNConfigProvider.setConfig({
      'not_blank': 'test'
    });
  }));


  it('should return defaultValue if key is missing from config', inject(function (ADNConfig) {
    expect(ADNConfig.get('blank', 'awesome')).toBe('awesome');
    expect(ADNConfig.get('not_blank', 'awesome')).toBe('test');
  }));

});
