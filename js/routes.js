/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function(app) {
    'use strict';
    return app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('report1',{
            url: '/report1',
            templateUrl: 'templates/grid.html',
            controller:'gridController'
        })
        .state('report2',{
            url: '/report2',
            templateUrl: 'templates/grid.html',
            controller:'gridController'
        });

        $urlRouterProvider.otherwise('/report1');
    })
});