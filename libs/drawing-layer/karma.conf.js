// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    customLaunchers: {
      ChromeCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/drawing-layer'),
      subdir: '.',
      reporters: ['html', 'lcovonly'],
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage/drawing-layer'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
