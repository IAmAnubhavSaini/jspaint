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
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Anubhav Saini (c) 2015 */\n'
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
      updateReferenceBootstrap: {
        src: 'src/bootstrap.css',
        dest: 'src/bootstrap.css',
        replacements: [{
            from: '../fonts/',
            to: ''
          }
        ]
      },
      jsCssToMinJsCSSMoveToBuild: {
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
          src: ['*.css', '!*.min.css', '!*.scss'],
          dest: 'build/',
          ext: '.min.css',
          extDot: 'last'
        }]
      }
    },
    copy: {
      fromNodeModules:{
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
            src: ['node_modules/bootstrap/dist/fonts/*'],
            dest: 'src/'
          }
        ]
      },
      copyFontsToBuild : {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['src/*.eot', 'src/*.svg', 'src/*.ttf', 'src/*.woff', 'src/*.woff2'],
            dest: 'build/'
          }
        ]
      }
    },
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'build/'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 5 versions', 'ie 8', 'ie 9']
      },
      single_file: {
        src: 'src/jspaint.css',
        dest: 'src/jspaint.css'
      }
    },
    /* I want sass to take care of SCSS and SASS files. */
    sass: {
      self: {
        options: { 
          style: 'compressed',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.scss'],
          dest: 'build/',
          ext: '.min.css'
        }]
      }
    },
    haml: {
      dist: {
        files: {
          'src/index.html': 'src/index.haml'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-haml');

  grunt.registerTask('styles', ['sass', 'cssmin']);
  grunt.registerTask('setup-dev', ['copy:fromNodeModules', 'replace:updateReferenceBootstrap']);
  grunt.registerTask('default', ['haml', 'copy:fromNodeModules','bootlint', 'autoprefixer', 'jshint', 'uglify', 'replace:updateReferenceBootstrap', 'replace:jsCssToMinJsCSSMoveToBuild', 'sass:self','cssmin', 'copy:copyFontsToBuild', 'imagemin']);
  grunt.registerTask('release-the-hounds', ['bootlint', 'jshint'])
};
