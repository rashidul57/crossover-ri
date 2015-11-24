module.exports = function(grunt) {
    var debugFile = "dist/app.debug.js",
        minFile = debugFile.replace('debug', 'min'),
        jsList = [
            'bower_components/angular/angular.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/lodash/lodash.js'
        ],
        appSrc = 'js/**/*.js',
        testFiles = '!js/**/*_test.js',
        templates = 'dist/templates.js',
        uglifyFiles = {};

    jsList.push(appSrc);
    jsList.push(templates);
    jsList.push(testFiles);
    uglifyFiles[minFile] = debugFile;

    grunt.initConfig ({
        pkg: grunt.file.readJSON('package.json'),
        clean:  {
            app: ['dist']
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: jsList,
                dest: debugFile
            }
        },
        html2js: {
            options: {
                base: './',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            dist: {
                src: ['templates/**/*.html'],
                dest: templates
            }
        },
        uglify: {
            dist: {
                files: uglifyFiles,
                options: {
                    mangle: false
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask ('default', ['clean:app', 'html2js', 'concat']);
    grunt.registerTask ('release', ['default', 'uglify']);

};
