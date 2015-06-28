module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bootlint:{
      options: {
        stoponerror: false,
        relaxerror: []
      },
      files: 'src/*.html'
    },
    jshint:{
      options:{
        globals:{
          jquery: true
        }
      },
      files: ['src/*.js', '!src/jquery.js', '!src/bootstrap.js', '!src/jquery-ui.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        expand: true,
        cwd: 'src/',
        src: '*.js',
        dest: 'build/',
        ext: '.min.js',
        extDot: 'last'
      }
    },
    replace: {
      jsCssToMinJsCSS: {
        src: 'src/*.html',
        dest: 'build/',
        replacements: [{
            from: '.js',
            to: '.min.js'
          },
          {
            from: '.css',
            to: '.min.css'
          }
        ]
      },
      updateReference: {
        src: 'src/bootstrap.css',
        dest: 'src/bootstrap.css',
        replacements: [{
            from: '../fonts/',
            to: ''
          }
        ]
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.css', '!*.min.css'],
          dest: 'build/',
          ext: '.min.css',
          extDot: 'last'
        }]
      }
    },
    copy: {
      main:{
        files:[
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/bootstrap/dist/css/bootstrap.css',
              'node_modules/bootstrap/dist/js/bootstrap.js',
              'node_modules/jquery/dist/jquery.js'
            ],
            dest: 'src/'
          },
          {
            expand: true,
            flatten: true,
            src: 'node_modules/bootstrap/dist/fonts/*',
            dest: 'src/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy','bootlint', 'jshint', 'uglify', 'cssmin', 'replace']);
  grunt.registerTask('setup-dev', ['copy', 'replace:updateReference']);
  grunt.registerTask('release-the-hounds', ['bootlint', 'jshint'])
};
