module.exports = config:
  files:
    javascripts: joinTo:
      'libraries.js': /^app\/vendor/
      'app.js': /^app\/js/
    stylesheets: joinTo: 'app.css'

  modules:
    wrapper: false
    definition: false

  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins: autoReload: enabled: false

  plugins:
    uglify:
      mangle: false
      compress:
        global_defs:
          DEBUG: true
    cleancss:
      keepSpecialComments: 0
      removeEmpty: true