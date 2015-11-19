define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('gridController', ['$scope', 'drawingService', '$http', '$state', function ($scope, drawingService, $http, $state) {
        $scope.rows = [];

        var report = $state.current.name;
        $http.get('/getReportData/' + report).then(function(response) {
            $scope.rows = response.data;
        });

        /**
         * 
 * @param {Object} rec: Record object regarding to the acting row
         */
        $scope.expandRow = function (rec) {
            if (rec.id && (!$scope.expandedRow || $scope.expandedRow && $scope.expandedRow.id != rec.id)) {
                $http.get('/getDetailData/' + report + '/' + rec.id).then(function(response) {
                    //remove previously expanded detail row
                     _.remove($scope.rows, function(_rec) {
                        return _rec.detail;
                    });
                    //Remove attribute that represents the previously expanded row 
                    _.map($scope.rows, function(_rec) {
                        delete _rec.master;
                        return _rec;
                    });

                    var index = _.indexOf($scope.rows, rec);
                    $scope.detailData = response.data;
                    $scope.rows[index].master = true;
                    $scope.expandedRow = $scope.rows[index];
                    $scope.rows.splice(index + 1, 0, response.data);
                });
            }
        }

        $scope.addSong = function(song) {
            $scope.songs.push(song);
        };
    }]);
});
