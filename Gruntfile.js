module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), // the package file to use

        react: {
            single_file_output: {
                files: {
                    'dist/js/react-bootstrap-treeview.js': 'src/react-bootstrap-treeview.jsx'
                }
            }
        },

        watch: {
            files: ['<%= react.single_file_output.files[\'dist/js/react-bootstrap-treeview.js\'] %>', '<%= browserify.main.src %>'],
            tasks: ['default', 'browserify']
        },

        copy: {
            main: {
                files: [
                    // copy src to example
                    {expand: true, cwd: 'src/', src: '*.css', dest: 'dist/css/'},
                    {expand: true, cwd: 'src/', src: '*.css', dest: 'example/public/css/'}
                    // { expand: true, cwd: 'src/js', src: '*', dest: 'public/js/' }
                ]
            }
        },

        'browserify': {
            main: {
                options: {
                    debug: true,
                    transform: ['reactify'],
                    extensions: ['.jsx']
                },
                src: 'example/js/example.js',
                dest: 'example/public/js/example.js'

            }

        }
    });

    // load up your plugins
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('default', ['react', 'copy', 'browserify', 'watch']);
};
