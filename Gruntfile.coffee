module.exports = (grunt) ->
  url = require('url')
  puppetdb = url.parse(grunt.option('puppetdb') or 'http://127.0.0.1:8080/')
  properties = grunt.file.readJSON('package.json')

  # Define the configuration for all the tasks
  grunt.initConfig
    connect:
      rules: [ # We use the example config for local development
          from: '^/config.js$'
          to: '/config.js.example'
      ]
      server:
        options:
          port: 8000
          hostname: 'localhost'
          base: 'dist'
          keepalive: true
          middleware: (connect, options) ->
            proxy = require('grunt-connect-proxy/lib/utils').proxyRequest
            rewriteRules = require('grunt-connect-rewrite/lib/utils').rewriteRequest
            [
              # Include the proxy first
              proxy

              # Then rewrite rules
              rewriteRules

              # Serve static files.
              connect.static(options.base[0])

              # Make empty directories browsable.
              connect.directory(options.base[0])
            ]
        proxies: [
          context: '/api'
          host: puppetdb.hostname
          port: puppetdb.port or (if puppetdb.protocol is 'https:' then 443 else 80)
          https: puppetdb.protocol is 'https:'
          rewrite:
            '^/api': ''
        ]

    watch:
      coffee:
        files: 'app/**/*.coffee'
        tasks: ['coffeeify']
      static:
        files: ['app/**/*.html', 'app/**/*.css', 'app/config.js.example', 'app/favicon.ico', 'fonts/**']
        tasks: ['copy:src']

    coffeeify:
      options:
        debug: true
      files:
        src: [
          'app/**/*.coffee'
          ]
        dest: 'dist/app.js'

    copy:
      src:
        expand: true
        cwd: 'app/'
        src: ['**/*.html', '**/*.css', 'config.js.example', 'favicon.ico', 'fonts/**']
        dest: 'dist/'
      dependencies:
        expand: true
        cwd: 'node_modules/'
        src: [
          'bootstrap/dist/**'
          'moment/moment.js'
        ]
        dest: 'dist/lib/'

    coffee:
      compile:
        options:
          sourceMap: true
        expand: true,
        cwd: 'app/',
        src: ['*.coffee', 'controllers/**/*.coffee', 'services/**/*.coffee'],
        dest: 'app/'
        ext: '.js'

    jshint:
      options:
        eqeqeq: true
        indent: 2
        noarg: true
        camelcase: true
        forin: true
        immed: true
        latedef: true
        newcap: true
        noempty: true
        nonbsp: true
        nonew: true
        strict: true
        trailing: true
        reporter: require('jshint-stylish')

      all: [
        'app/**/*.js'
      ]

    coffeelint:
      options:
        configFile: 'coffeelint.json'
      all: ['app/**/*.coffee', 'Gruntfile.coffee']

    debian_package:
      options:
        maintainer: properties.author
      files:
        expand: true
        cwd: 'dist'
        src: [ '**' ]
        dest: "/usr/share/#{properties.name}/"

    clean: ['dist', 'tmp']

    mocha_casperjs:
      files:
        src: ['test/**/*.coffee']

  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-connect-rewrite'
  grunt.loadNpmTasks 'grunt-connect-proxy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-debian-package'
  grunt.loadNpmTasks 'grunt-mocha-casperjs'

  grunt.registerTask 'serve', [
    'configureRewriteRules'
    'configureProxies:server'
    'connect:server'
  ]
  grunt.registerTask 'build', ['clean', 'coffeeify', 'copy']
  grunt.registerTask 'build_debian', ['build', 'debian_package']
  grunt.registerTask 'default', ['build']
  grunt.registerTask 'test', ['mocha_casperjs']
