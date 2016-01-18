module.exports = function (config) {
  config.set({
    basePath : '',
    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
    ],
    files: [
      'spec/*.js',
      '../source/javascripts/frob_core_helpers.js'
    ],
    singleRun: true,
    reporters: ['progress'],
    colors: true
  });
};
