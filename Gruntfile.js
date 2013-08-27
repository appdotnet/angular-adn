// Generated on 2013-08-13 using generator-angular-component 0.2.1
'use strict';

module.exports = function(grunt) {

  // Configurable paths
  var yoConfig = {
    livereload: 35729,
    src: 'src',
    dist: 'dist'
  };

  // Livereload setup
  var lrSnippet = require('connect-livereload')({port: yoConfig.livereload});
  var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yo: yoConfig,
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.dist %>/*',
            '<%= yo.src %>/templates/templates.js',
            '!<%= yo.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      less: {
        files: ['<%= yo.src %>/{,*/}*.less'],
        tasks: ['less:dist']
      },
      app: {
        files: [
          '<%= yo.src %>/{,*/}*.html',
          '{.tmp,<%= yo.src %>}/{,*/}*.css',
          '{.tmp,<%= yo.src %>}/{,*/}*.js',
          'test/preview/*.html',
          'test/preview/*.js'
        ],
        options: {
          livereload: yoConfig.livereload
        }
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0' // Change this to '0.0.0.0' to access the server from outside.
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yoConfig.src)
            ];
          }
        }
      },
      preview: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'test/preview/'),
              mountFolder(connect, 'src/'),
              mountFolder(connect, 'app/'),
              mountFolder(connect, yoConfig.dist)

            ];
          }
        }
      }
    },
    less: {
      options: {
        // dumpLineNumbers: 'all',
        paths: ['<%= yo.src %>']
      },
      dist: {
        files: {
          '<%= yo.src %>/<%= yo.name %>.css': '<%= yo.src %>/<%= yo.name %>.less'
        }
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['<%= yo.src %>/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true,
        singleRun: false,
        browsers: ['Chrome']
      }
    },
    ngmin: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          '<%= yo.src %>/services/init.js',
          '<%= yo.src %>/services/config.js',
          '<%= yo.src %>/services/auth.js',
          '<%= yo.src %>/services/api_client.js',
          '<%= yo.src %>/services/user.js',
          '<%= yo.src %>/directives/adn_text.js',
          '<%= yo.src %>/directives/user_search.js',
          '<%= yo.src %>/templates/templates.js'
        ],
        dest: '<%= yo.dist %>/<%= pkg.name %>.js'
      }
      // dist: {
      //   files: {
      //     '/.js': '/.js'
      //   }
      // }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          '<%= yo.src %>/services/init.js',
          '<%= yo.src %>/services/config.js',
          '<%= yo.src %>/services/auth.js',
          '<%= yo.src %>/services/api_client.js',
          '<%= yo.src %>/services/user.js',
          '<%= yo.src %>/directives/adn_text.js',
          '<%= yo.src %>/directives/user_search.js'
        ],
        dest: '<%= yo.dist %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= yo.dist %>/<%= pkg.name %>.min.js'
      }
    },
    ngtemplates: {
      dist: {
        options: {
          base: '<%= yo.src %>',
          module: 'adn',
          prepend: ''
        },
        src: '<%= yo.src %>/templates/*.html',
        dest: '<%= yo.src %>/templates/templates.js'
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        pushTo: 'origin'
      }
    }
  });

  grunt.registerTask('test', [
    'ngtemplates',
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngtemplates',
    //'less:dist',
    'ngmin:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('release', [
    'test',
    'bump-only',
    'build',
    'bump-commit'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('preview', ['connect:preview', 'watch']);

};
