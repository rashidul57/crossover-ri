'use strict';

app.directive('statusSummary', ['drawingService', '$window', '$compile', function (drawingService, $window, $compile) {
    return {
        restrict: 'A',
        replace: false,
        link: function ($scope, element, attrs) {
            var width, height, canvas,
                rec = $scope.detailData,
                status = rec.status,
                colorArray = drawingService.getColorArray();

            $($window).on("resize", redraw);

            $scope.$watch(function () {
                return $window.innerWidth;
            }, draw);

            function redraw() {
                drawingService.removeCanvas(element);
                draw();
            }

            function draw () {
                var inval, size,
                    offsetX = drawingService.offset,
                    incStep = drawingService.increment;

                try {
                    inval = setInterval(function () {
                        if (drawingService.debug) {
                            offsetX = 0;
                            clearInterval(inval);
                        }

                        if (offsetX < incStep) {
                            drawingService.removeCanvas(element);
                            size = drawingService.injectCanvas($scope, $compile, element);
                            height = size.height;
                            width = size.width;

                            var ctx = element.find('canvas')[0].getContext('2d'),
                                radius = 18,
                                innerLineWidth = 4,
                                innerRad = radius - 5,
                                usableWidth = width,
                                fraction = width / 3,
                                startX = radius + 10,
                                middleX = fraction + fraction / 4 - radius,
                                endX = 2 * fraction + fraction / 4 - radius,
                                statusColor = colorArray[status + 'Color'];

                            startX += offsetX;
                            middleX += offsetX;
                            endX += offsetX;

                            drawSummary (ctx, startX, statusColor, colorArray, rec);

                            offsetX += incStep;
                        } else {
                            clearInterval(inval);
                        }
                    }, drawingService.speed);
                } catch (err) {
                    clearInterval(inval);
                    console.log('Something happen unexpected: ' + err.message);
                }
            }

            function drawSummary (ctx, startX, color, colorArray, rec) {
                var step, centerX,
                    centerY = 82;

                switch (rec.level) {
                    case 1:
                        step = rec.build.name;
                        break;
                    case 2:
                        step = rec.unitTest.name;
                        break;
                    case 3:
                        step = rec.functionalTest.name;
                        break;
                    //for passed
                    default:
                        step = "All Steps";
                }

                centerX = startX + 65 - (step.length - 4) * 3.5;

                switch (rec.status) {
                    case "passed":
                        drawingService.drawCircle(ctx, centerX - 12, centerY - 7, 8, color, true, 3);
                        drawingService.drawTickMark(ctx, centerX - 12, centerY - 7, 4, 3, color, false);
                        break;
                    case "pending":
                        drawingService.drawPendingSmallIcon(ctx, centerX - 12, centerY - 7, 8, color, [2.5, 2.5], 3);
                        break;
                    case "running":
                        drawingService.drawRunningIcon(ctx, centerX - 12, centerY - 7, 8, colorArray.whiteColor, color);
                        break;
                    case "failed":
                        drawingService.drawCircle(ctx, centerX - 12, centerY - 7, 8, color, true, 3);
                        drawingService.drawCrossSign(ctx, centerX - 12, centerY - 7, 7, color, 2);
                        //drawingService.drawCloseIcon(ctx, centerX - 12, centerY - 7, 8, color, colorArray.whiteColor, 2, false);
                        break;
                }

                drawingService.drawText(ctx, centerX, centerY, step, color, 18);
                drawingService.drawText(ctx, centerX - 20, centerY + 22, rec.statusMsg, color, 19);
            }

        }
    };
}]);
