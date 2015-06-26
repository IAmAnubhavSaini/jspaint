module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        extDot: 'first'
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
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('default', ['uglify', 'replace']);
};
