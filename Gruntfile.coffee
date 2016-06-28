module.exports = (grunt) ->
  url = require('url')
  puppetdb = url.parse(grunt.option('puppetdb') or 'http://puppetdb.puppetexplorer.io:80/')
  properties = grunt.file.readJSON('package.json')

  # Define the configuration for all the tasks
  grunt.initConfig
    connect:
      rules: [ # We use the example config for local development
          from: '^/config.js$'
          to: '/config.js.example'
      ]
      options:
        hostname: 'localhost'
        base: 'dist'
        middleware: (connect, options) ->
          proxy = require('grunt-connect-proxy/lib/utils').proxyRequest
          rewriteRules = require('grunt-connect-rewrite/lib/utils').rewriteRequest
          serveStatic = require('serve-static')
          serveIndex = require('serve-index')
          [
            # Include the proxy first
            proxy

            # Then rewrite rules
            rewriteRules

            # Serve static files.
            serveStatic(options.base[0])

            # Make empty directories browsable.
            serveIndex(options.base[0])
          ]
      server:
        options:
          port: 8000
      testserver:
        options:
          port: 8001
      proxies:
        context: '/api'
        host: puppetdb.hostname
        port: puppetdb.port or (if puppetdb.protocol is 'https:' then 443 else 80)
        https: puppetdb.protocol is 'https:'
        rewrite:
          '^/api': ''

    watch:
      coffee:
        files: 'app/**/*.coffee'
        tasks: ['browserify:dev']
      static:
        files: [
          'app/**/*.html'
          'app/**/*.css'
          'app/config.js.example'
          'app/favicon.ico'
          'fonts/**'
        ]
        tasks: ['copy:src']

    browserify:
      # Build for distribution
      dist:
        files:
          'dist/app.js': [ 'app/**/*.coffee' ]
        options:
          debug: true
          transform: [
            'coffeeify'
            ['uglifyify', { global: true, mangle: false }]
          ]
      # Dev target without ulgifyify
      dev:
        options:
          debug: true
          transform: [ 'coffeeify' ]
        files:
          'dist/app.js': [ 'app/**/*.coffee' ]

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
          'moment/moment.js'
        ]
        dest: 'dist/lib/'
      theme:
        expand: true
        flatten: true
        dest: 'dist/css/'
        src: [
          'node_modules/bootswatch/sandstone/bootstrap.min.css'
        ]

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

    rpm:
      options:
        summary: 'web frontend for PuppetDB'
      release:
        options:
          release: true
        files: [
          expand: true
          cwd: 'dist'
          src: [ '**' ]
          dest: "/usr/share/#{properties.name}/"
        ]
      snapshot:
        options:
          release: false
        files: [
          expand: true
          cwd: 'dist'
          src: [ '**' ]
          dest: "/usr/share/#{properties.name}/"
        ]

    clean: ['dist', 'tmp']

    mocha_casperjs:
      files:
        src: ['test/**/*.coffee']

    casperjs:
      options:
        async:
          parallel: false
      files: ['tests/casperjs/**/*.js']

  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-connect-rewrite'
  grunt.loadNpmTasks 'grunt-connect-proxy'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-debian-package'
  grunt.loadNpmTasks 'grunt-rpm'
  grunt.loadNpmTasks 'grunt-casperjs'

  grunt.registerTask 'serve', [
    'configureRewriteRules'
    'configureProxies'
    'connect:server:keepalive'
  ]

  grunt.registerTask 'dev', [
    'clean'
    'browserify:dev'
    'copy'
    'configureRewriteRules'
    'configureProxies'
    'connect:server'
    'watch'
  ]

  grunt.registerTask 'build', ['clean', 'browserify:dist', 'copy']
  grunt.registerTask 'build_debian', ['build', 'debian_package']
  grunt.registerTask 'default', ['build']
  grunt.registerTask 'test', [
    'configureRewriteRules'
    'configureProxies'
    'connect:testserver'
    'casperjs'
  ]
