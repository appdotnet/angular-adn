'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var adnConfig = {
    app: 'app',
    dist: 'dist'
  };
  console.log('yo');
  try {
    adnConfig.app = require('./bower.json').appPath || adnConfig.app;
  } catch (e) {}

  grunt.initConfig({
    adn: adnConfig,
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= adn.dist %>/*',
            '!<%= adn.dist %>/.git*'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= adn.app %>/scripts/{,*/}*.js'
      ]
    },
    concat: {
      dist: {
        files: {
          '<%= adn.dist %>/adn-angular.js': [
            '<%= adn.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= adn.dist %>/adn-angular.js': [
            '<%= adn.dist %>/adn-angular.js'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= adn.app %>',
          dest: '<%= adn.dist %>',
          src: [
            'scripts/**/*'
          ]
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'concat',
    //'copy',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};