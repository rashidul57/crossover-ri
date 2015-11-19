module.exports = function(grunt) {
    //update application version
    var requirejsOptions = {},
        tmpDir = "./tmp",
        basePath = "./js",
        debugPath = './dist/all.debug.js',
        sassDir = 'styles/sass',
        cssDir = 'styles',
        uglifyConfig, minPath, watchConfig, compass;

    requirejsOptions['build'] = {
        "options": {
            //"appDir": "./",
            "baseUrl": basePath,
            "dir": "dist",
            "modules": [
                {
                    "name": "main"
                }
            ],
            //"fileExclusionRegExp": /^(r|build)\.js$/,
            "optimizeCss": "standard",
            "removeCombined": false,
            "optimize": "uglify2",
            "skipDirOptimize": true,
            "keepBuildDir": false,
            "findNestedDependencies": true,
            "paths": {
                'domReady': '../vendor/requirejs-domready/domReady',
				'angular': '../vendor/angular/angular',
				"ui.router": "../vendor/angular-ui-router/release/angular-ui-router",
				"jquery": "../vendor/jquery/dist/jquery",
				"lodash": "../vendor/lodash/dist/lodash",
				"bootstrap": "../js/bootstrap"
            },
            "shim": {
                'angular': {
					exports: 'angular'
				},
				'ui.router':{
					deps: ['angular']
				}
            },
            onModuleBundleComplete: function (data) {
                var srcPath = requirejsOptions.build.options.dir + '/' + data.path;
                grunt.file.copy(srcPath, debugPath);
            }
        }
    };

    uglifyConfig = {
        options: {
            mangle: false
        },
        minify: {
            files: {}
        }
    };

    minPath = debugPath.replace('debug', 'min');
    uglifyConfig.minify.files[minPath] = debugPath;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: requirejsOptions,
        uglify: uglifyConfig
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('alldone', function() {
        grunt.log.writeln('\nBuild completed, version: ' + json.version);
    });

    grunt.registerTask("default", ["requirejs", "uglify", "alldone"]);
};
