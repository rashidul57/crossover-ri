
app.directive('buildToTest', ['drawingService', '$window', '$compile', '$animate', function (drawingService, $window, $compile, $animate) {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, element, attrs) {
            var width, height, canvas, size,
                centerY = 32,
                exclamCenterY = centerY + 5,
                colorArray = drawingService.getColorArray(),
                status = attrs['buildToTest'],
                level = parseInt(attrs['level'], 10);

            $($window).on("resize", draw);

            $scope.$watch(function () {
                return $window.innerWidth;
            }, draw);

            function draw () {
                try{
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

                    //Draw bigger circles along each line
                    drawingService.drawCircle(ctx, startX, centerY, radius, colorArray.bgColor);
                    drawingService.drawCircle(ctx, middleX, centerY, radius, colorArray.bgColor);
                    drawingService.drawCircle(ctx, endX, centerY, radius, colorArray.bgColor);
                    drawingService.drawLine(ctx, startX, endX, centerY, colorArray.bgColor, 10);

                    switch (status) {
                        case "passed":
                            drawingService.drawLine(ctx, startX + innerRad, endX - innerRad, centerY, statusColor, innerLineWidth);
                            drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                            drawingService.drawTickMark(ctx, startX, centerY, 6, 3, colorArray.whiteColor, true);
                            drawingService.drawCircle(ctx, middleX, centerY, innerRad, statusColor);
                            drawingService.drawTickMark(ctx, middleX, centerY, 6, 3, colorArray.whiteColor, true);
                            drawingService.drawCircle(ctx, endX, centerY, innerRad, statusColor);
                            drawingService.drawTickMark(ctx, endX, centerY, 6, 3, colorArray.whiteColor, true);
                            break;

                        case "failed":
                            switch (level) {
                                case 3:
                                    level3Common(ctx, startX, middleX, endX, centerY, innerRad, statusColor, colorArray, innerLineWidth);

                                    drawingService.drawCircle(ctx, endX, centerY, innerRad, statusColor);
                                    drawingService.drawExclamSign(ctx, endX, exclamCenterY, colorArray.whiteColor);
                                    break;
                                case 2:
                                    drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                                    drawingService.drawTickMark(ctx, startX, centerY, 6, 3, colorArray.whiteColor, true);
                                    drawingService.drawLine(ctx, startX + innerRad, middleX - innerRad, centerY, statusColor, innerLineWidth);
                                    drawingService.drawCircle(ctx, middleX, centerY, innerRad, statusColor);
                                    drawingService.drawExclamSign(ctx, middleX, exclamCenterY, colorArray.whiteColor);
                                    break;
                                case 1:
                                default:
                                    drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                                    drawingService.drawExclamSign(ctx, startX, exclamCenterY, colorArray.whiteColor);
                            }
                            break;

                        case "pending":
                            switch (level) {
                                case 3:
                                    level3Common(ctx, startX, middleX, endX, centerY, innerRad, statusColor, colorArray, innerLineWidth);
                                    drawingService.drawPendingIcon(ctx, endX, centerY, innerRad, colorArray.whiteColor, statusColor);
                                    break;
                                case 2:
                                    drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                                    drawingService.drawTickMark(ctx, startX, centerY, 6, 3, colorArray.whiteColor, true);
                                    drawingService.drawLine(ctx, startX + innerRad, middleX - innerRad, centerY, statusColor, innerLineWidth);

                                    drawingService.drawPendingIcon(ctx, middleX, centerY, innerRad, colorArray.whiteColor, statusColor);
                                    break;
                                case 1:
                                default:
                                    drawingService.drawPendingIcon(ctx, startX, centerY, innerRad, colorArray.whiteColor, statusColor);
                            }
                            break;

                        case "running":
                            switch (level) {
                                case 3:
                                    level3Common(ctx, startX, middleX, endX, centerY, innerRad, statusColor, colorArray, innerLineWidth);
                                    drawingService.drawRunningIcon(ctx, endX, centerY, innerRad, colorArray.whiteColor, statusColor);
                                    break;
                                case 2:
                                    drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                                    drawingService.drawTickMark(ctx, startX, centerY, 6, 3, colorArray.whiteColor, true);
                                    drawingService.drawLine(ctx, startX + innerRad, middleX - innerRad, centerY, statusColor, innerLineWidth);

                                    drawingService.drawRunningIcon(ctx, middleX, centerY, innerRad, colorArray.whiteColor, statusColor);
                                    drawingService.drawLine(ctx, middleX + innerRad, endX - 2 * radius, centerY, statusColor, innerLineWidth);
                                    break;

                                case 1:
                                default:
                                    drawingService.drawRunningIcon(ctx, startX, centerY, innerRad, colorArray.whiteColor, statusColor);
                                    drawingService.drawLine(ctx, startX + innerRad, middleX - 2 * radius, centerY, statusColor, innerLineWidth);
                            }
                            break;
                    }
                } catch (err) {
                    console.log('Something happen unexpected: ' + err.message);
                }
            }

            function level3Common (ctx, startX, middleX, endX, centerY, innerRad, statusColor, colorArray, innerLineWidth) {
                drawingService.drawCircle(ctx, startX, centerY, innerRad, statusColor);
                drawingService.drawTickMark(ctx, startX, centerY, 6, 3, colorArray.whiteColor, true);
                drawingService.drawLine(ctx, startX + innerRad, endX - innerRad, centerY, statusColor, innerLineWidth);
                drawingService.drawCircle(ctx, middleX, centerY, innerRad, statusColor);
                drawingService.drawTickMark(ctx, middleX, centerY, 6, 3, colorArray.whiteColor, true);
            }

        }
    };
}]);