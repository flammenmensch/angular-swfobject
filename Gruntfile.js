/**
 * Created with IntelliJ IDEA.
 * User: Flammenmensch
 * Date: 20.12.13
 * Time: 16:53
 * To change this template use File | Settings | File Templates.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        clean: [ 'dist/' ],
        uglify: {
            'dist/swf-directive.min.js': [ 'scripts/swf-directive.js' ]
        },
        jshint: {
            all: [ 'scripts/swf-directive.js' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', [ 'jshint', 'clean', 'uglify' ]);
};