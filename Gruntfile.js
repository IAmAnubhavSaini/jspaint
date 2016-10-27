function registerTasks(grunt) {
  grunt.registerTask('styles', ['sass', 'cssmin']);
  grunt.registerTask('default', ['bootlint', 'autoprefixer', 'jshint', 'jasmine', 'uglify', 'replace:convertRefToMinRef', 'sass:self','cssmin', 'copy:copyFontsToBuild', 'imagemin']);
  grunt.registerTask('release-the-hounds', ['bootlint', 'jshint', 'jasmine']);
}

function loadTasks(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bootlint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
}

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
      files: ['src/scripts/*.js', '!src/scripts/jquery.js', '!src/scripts/bootstrap.js', '!src/scripts/jquery-ui.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Anubhav Saini (c) 2015-2016 */\n'
      },
      build: {
        expand: true,
        cwd: 'src/scripts',
        src: '*.js',
        dest: 'build/scripts',
        ext: '.min.js',
        extDot: 'last'
      }
    },
    replace: {
      convertRefToMinRef: {
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
          cwd: 'src/styles/',
          src: ['*.css', '!*.min.css', '!*.scss'],
          dest: 'build/styles/',
          ext: '.min.css',
          extDot: 'last'
        }]
      }
    },
    copy: {
      copyFontsToBuild : {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['src/fonts/*.eot', 'src/fonts/*.svg', 'src/fonts/*.ttf', 'src/fonts/*.woff', 'src/fonts/*.woff2'],
            dest: 'build/fonts/'
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
        browsers: ['last 5 versions']
      },
      single_file: {
        src: 'src/styles/jspaint.css',
        dest: 'src/styles/jspaint.css'
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
          cwd: 'src/styles/',
          src: ['*.scss'],
          dest: 'build/styles/',
          ext: '.min.css'
        }]
      }
    },
    jasmine: {
      test: {
        src: ['src/scripts/iframe-buster.js', 'src/scripts/jspaint-pre.js', 'src/scripts/jspaint-Tools.js'],
        options: {
          specs: 'tests/*.spec.js',
          helpers: 'tests/*helper.js'
        }
      }
    }
  });

  loadTasks(grunt);
  registerTasks(grunt);
};
