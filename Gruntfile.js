const url = require('url');
const proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
const rewriteRules = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const taskLoader = require('load-grunt-tasks');

module.exports = (grunt) => {
  taskLoader(grunt);
  const puppetdb = url.parse(grunt.option('puppetdb') || 'http://puppetdb.puppetexplorer.io:80/');
  const properties = grunt.file.readJSON('package.json');

  // Define the configuration for all the tasks
  grunt.initConfig({
    connect: {
      rules: [{ // We use the example config for local development
        from: '^/config.js$',
        to: '/config.js.example',
      },
      ],
      options: {
        hostname: 'localhost',
        base: 'dist',
        middleware(connect, options) {
          return [
            // Include the proxy first
            proxy,

            // Then rewrite rules
            rewriteRules,

            // Serve static files.
            serveStatic(options.base[0]),

            // Make empty directories browsable.
            serveIndex(options.base[0]),
          ];
        },
      },
      server: {
        options: {
          port: 8000,
        },
      },
      testserver: {
        options: {
          port: 8001,
        },
      },
      proxies: {
        context: '/api',
        host: puppetdb.hostname,
        port: puppetdb.port || (puppetdb.protocol === 'https:' ? 443 : 80),
        https: puppetdb.protocol === 'https:',
        rewrite: {
          '^/api': '',
        },
      },
    },

    watch: {
      coffee: {
        files: 'app/**/*.coffee',
        tasks: ['browserify:dev'],
      },
      static: {
        files: [
          'app/**/*.html',
          'app/**/*.css',
          'app/config.js.example',
          'app/favicon.ico',
          'fonts/**',
        ],
        tasks: ['copy:src'],
      },
    },

    browserify: {
      // Build for distribution
      dist: {
        files: {
          'dist/app.js': ['app/**/*.js', 'app/**/*.coffee'],
        },
        options: {
          debug: true,
          transform: [
            'coffeeify',
            ['babelify', {
              global: true,
              presets: ['es2015'],
              // FIXME: This "list" of ES6 modules is pretty ugly
              only: [/app\//, /node_modules\/node-puppetdbquery/],
            }],
            ['uglifyify', { global: true, mangle: false }],
          ],
        },
      },
      // Dev target without ulgifyify
      dev: {
        options: {
          debug: true,
          transform: [
            'coffeeify',
            ['babelify', {
              global: true,
              presets: ['es2015'],
              only: [/app\//, /node_modules\/node-puppetdbquery/],
            }],
          ],
        },
        files: {
          'dist/app.js': ['app/**/*.js', 'app/**/*.coffee'],
        },
      },
    },

    copy: {
      src: {
        expand: true,
        cwd: 'app/',
        src: ['**/*.html', '**/*.css', 'config.js.example', 'favicon.ico', 'fonts/**'],
        dest: 'dist/',
      },
      dependencies: {
        expand: true,
        cwd: 'node_modules/',
        src: [
          'moment/moment.js',
        ],
        dest: 'dist/lib/',
      },
      theme: {
        expand: true,
        flatten: true,
        dest: 'dist/css/',
        src: [
          'node_modules/bootswatch/sandstone/bootstrap.min.css',
        ],
      },
    },

    coffeelint: {
      options: {
        configFile: 'coffeelint.json',
      },
      all: ['app/**/*.coffee', 'Gruntfile.coffee'],
    },

    eslint: {
      files: ['app/**/*.js', 'tests/**/*.js', '!tests/casperjs/**/*.js', 'Gruntfile.js'],
    },

    debian_package: {
      options: {
        maintainer: properties.author,
      },
      files: {
        expand: true,
        cwd: 'dist',
        src: ['**'],
        dest: `/usr/share/${properties.name}/`,
      },
    },

    rpm: {
      options: {
        summary: 'web frontend for PuppetDB',
      },
      release: {
        options: {
          release: true,
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**'],
          dest: `/usr/share/${properties.name}/`,
        },
        ],
      },
      snapshot: {
        options: {
          release: false,
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['**'],
          dest: `/usr/share/${properties.name}/`,
        },
        ],
      },
    },

    clean: ['dist', 'tmp'],

    casperjs: {
      files: ['tests/casperjs/**/*.js'],
    },
  });

  grunt.registerTask('serve', [
    'configureRewriteRules',
    'configureProxies',
    'connect:server:keepalive',
  ]);

  grunt.registerTask('dev', [
    'clean',
    'browserify:dev',
    'copy',
    'configureRewriteRules',
    'configureProxies',
    'connect:server',
    'watch',
  ]);

  grunt.registerTask('build', ['clean', 'browserify:dist', 'copy']);
  grunt.registerTask('build_debian', ['build', 'debian_package']);
  grunt.registerTask('default', ['build']);
  return grunt.registerTask('test', [
    'configureRewriteRules',
    'configureProxies',
    'connect:testserver',
    'casperjs',
    'eslint',
  ]);
};
