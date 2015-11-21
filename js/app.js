var app = angular.module('csTest', [
    'ui.router',
    'templates-dist'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    //use angular-ui-router to manage routing
    $stateProvider.state('report1',{
        url: '/report1',
        templateUrl: 'templates/grid.html',
        controller:'gridCtrl'
    })
    .state('report2',{
        url: '/report2',
        templateUrl: 'templates/grid.html',
        controller:'gridCtrl'
    });

    $urlRouterProvider.otherwise('/report1');

});


