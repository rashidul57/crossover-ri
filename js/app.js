/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'ui.router',
    'jquery',
    'lodash',
    './controllers/index',
    './directives/index',
    './services/index'
], function (ng) {
    'use strict';

    return ng.module('app', [
        'app.services',
        'app.controllers',
        'app.directives',
        'ui.router'
    ]);
});
