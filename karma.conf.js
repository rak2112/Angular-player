module.exports = function(config) {
    config.set({
 
        // base path, that will be used to resolve files and exclude
        basePath: '',
 
        // frameworks to use
        frameworks: ['jasmine'],
 
        // list of files / patterns to load in the browser
        files: [
            'js/vendor/angular-1.2.0/angular.js',
            'js/vendor/angular-1.2.0/angular-mocks.js',
            'js/vendor/angular-1.2.0/angular-resource.js',
            'js/vendor/angular-1.2.0/angular-animate.js',
            'js/vendor/angular-1.2.0/angular-route.js',
            'js/main.js',
            'tests/home.test.js'


        ],
 
        // list of files to exclude
        exclude: [
        ],
 
        // test results reporter to use
        reporters: ['progress'],
 
        // web server port
        port: 9876,
 
        // enable / disable colors in the output (reporters and logs)
        colors: true,
 
        // level of logging
        logLevel: config.LOG_DEBUG,
 
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
 
        // Start these browsers
        browsers: ['Chrome'],
 
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
 
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};