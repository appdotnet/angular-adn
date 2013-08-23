// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/angular-unstable/angular.js',
  'app/components/jquery/jquery.js',
  'app/components/underscore/underscore-min.js',
  'app/components/purl/purl.js',
  'app/components/angular-ui/build/angular-ui.js',
  'app/components/select2/select2.min.js',
  'app/components/angular-mocks/angular-mocks.js',
  'src/services/init.js',
  'src/services/config.js',
  'src/services/auth.js',
  'src/services/user.js',
  'src/services/api_client.js',
  'src/directives/adn_text.js',
  'src/directives/user_search.js',
  'src/templates/templates.js',
  'test/spec/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress'];

// web server port
port = 8080;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
