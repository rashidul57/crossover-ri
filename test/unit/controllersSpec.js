describe('grid controller', function() {
    var $scope, $q, deferred, drawingService, promise,
        testData = [{ id: 1 }, { id: 2 }];

    beforeEach(module('csTest'));

    beforeEach(inject(function($controller, _$rootScope_, _$q_, drawingService) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        drawingService = drawingService;

            // We use the $q service to create a mock instance of defer
        deferred = _$q_.defer();

        // Use a Jasmine Spy to return the deferred promise
        promise = spyOn(drawingService, 'getReportData').and.returnValue(deferred.promise);

        // Init the controller, passing our spy service instance
        $controller('gridCtrl', { 
            $scope: $scope, 
            drawingService: drawingService
        });

        promise().then(function(response) {
              $scope.rows = response;
          })
          .catch(function() {
            $scope.error = 'Error to read data';
        });

    }));



    it('should resolve promise', function () {
        deferred.resolve(testData);
        $scope.$apply();
        // Since we called apply, not we can perform our assertions
        expect($scope.rows).not.toBe(undefined);
        expect($scope.rows.length).toEqual(testData.length);
        expect($scope.error).toBe(undefined);
    });

    it('should reject promise', function () {
        // This will call the .catch function in the controller
        deferred.reject();

        // We have to call apply for this to work
        $scope.$apply();
        // Since we called apply, not we can perform our assertions
        expect($scope.rows.length).toBe(0);
        expect($scope.error).toBe('Error to read data');
      });

  
});
