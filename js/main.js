/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({

    paths: {
        'domReady': '../vendor/requirejs-domready/domReady',
        'angular': '../vendor/angular/angular',
        "ui.router": "../vendor/angular-ui-router/release/angular-ui-router",
        "jquery": "../vendor/jquery/dist/jquery",
        "lodash": "../vendor/lodash/dist/lodash"
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ui.router':{
            deps: ['angular']
        }
    },
    
    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
