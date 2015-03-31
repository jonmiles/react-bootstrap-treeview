module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use

    react: {
      conbined_file_output: {
        files: {
          'dist/react-bootstrap-treeview.js': [
            'src/js/react-bootstrap-treeview.jsx',
            'src/js/react-bootstrap-treenode.jsx'
          ],
          'public/js/example.js': [
            'public/js/data.jsx',
            'public/js/example.jsx'
          ]
        }
      }
    },

    watch: {
      files: [/*'tests/*.js', 'tests/*.html', */'src/**'],
      tasks: ['default']
    },

    copy: {
      main: {
        files: [
          // copy src to example
          { expand: true, cwd: 'src/css', src: '*.css', dest: 'dist/' },
          // { expand: true, cwd: 'src/js', src: '*', dest: 'public/js/' }
        ]
      }
    }
  });

  // load up your plugins
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['react', 'copy', 'watch']);
};
