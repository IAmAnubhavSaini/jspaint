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
      updateReferenceBootstrap: {
        src: 'src/bootstrap.css',
        dest: 'src/bootstrap.css',
        replacements: [{
            from: '../fonts/',
            to: ''
          }
        ]
      },
      updateReferenceFontAwesome: {
        src: 'src/font-awesome.css',
        dest: 'src/font-awesome.css',
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
      fromNodeModules:{
        files:[
          {
            expand: true,
            flatten: true,
            src: [
              'node_modules/bootstrap/dist/css/bootstrap.css',
              'node_modules/font-awesome/css/font-awesome.css',
              'node_modules/bootstrap/dist/js/bootstrap.js',
              'node_modules/jquery/dist/jquery.js',
              'node_modules/jquery-awesome-cursor/dist/jquery.awesome-cursor.js'
            ],
            dest: 'src/'
          },
          {
            expand: true,
            flatten: true,
            src: ['node_modules/bootstrap/dist/fonts/*', 'node_modules/font-awesome/fonts/*'],
            dest: 'src/'
          }
        ]
      },
      copyFontsToBuild : {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['src/*.eot', 'src/*.svg', 'src/*.ttf', 'src/*.woff', 'src/*.woff2', 'src/*.otf'],
            dest: 'build/'
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

  grunt.registerTask('setup-dev', ['copy:fromNodeModules', 'replace:updateReferenceBootstrap', 'replace:updateReferenceFontAwesome']);
  grunt.registerTask('default', ['copy:fromNodeModules','bootlint', 'jshint', 'uglify', 'cssmin', 'replace', 'copy:copyFontsToBuild']);
  grunt.registerTask('release-the-hounds', ['bootlint', 'jshint'])
};
