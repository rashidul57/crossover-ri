'use strict';
app.controller('gridCtrl', [
    '$scope',
    '$rootScope',
    'drawingService',
    '$http',
    '$state',
    function ($scope, $rootScope, drawingService, $http, $state) {
        $scope.rows = [];

        var report = $state.current.name;

        if (report) {
            drawingService.getReportData(report)
              .then(function(response) {
                  $scope.rows = response;
              })
              .catch(function() {
                $scope.error = 'Error to read data';
            });
        }

        /**
         * 
 * @param {Object} rec: Record object regarding to the acting row
         */
        $scope.expandRow = function (rec) {
            $scope.clearDetailInfo();
            if (rec.id && (!$scope.expandedRow || $scope.expandedRow && $scope.expandedRow.id != rec.id)) {
                delete $scope.expandedRow;
                drawingService.getReportDetailData(report, rec.id, function (response) {
                    var index = _.indexOf($scope.rows, rec);
                    $scope.detailData = response.data;
                    $scope.rows[index].master = true;
                    $scope.expandedRow = $scope.rows[index];
                    $scope.rows.splice(index + 1, 0, response.data);
                });
            } else {
                delete $scope.expandedRow;
            }
        }

        $scope.clearDetailInfo = function () {
            //remove previously expanded detail row
             _.remove($scope.rows, function(_rec) {
                return _rec.detail;
            });
            //Remove attribute that represents the previously expanded row 
            _.map($scope.rows, function(_rec) {
                delete _rec.master;
                return _rec;
            });
        }

    }]);