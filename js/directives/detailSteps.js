'use strict';
app.directive('detailSteps', ['$window', '$compile', 'drawingService', function ($window, $compile, drawingService) {
  return {
      restrict: 'A',
      replace: false,
      link: function ($scope, element, attrs) {
          var width, height, canvas,
             rec = $scope.detailData,
             colorArray = drawingService.getColorArray(),
             status = rec.status,
             centerY = 47;

          $(window).on("resize", redraw);

          $scope.$watch(function () {
              return window.innerWidth;
          }, draw);

          function redraw() {
              drawingService.removeCanvas(element);
              draw();
          }

          function draw () {
              var inval, size,
                  offsetX = drawingService.offset,
                  incStep = drawingService.increment;

              try{
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
                              statusColor = colorArray[status + 'Color'],
                              usableWidth = width,
                              fraction = (width - (width * 16) / 100) / 4,
                              startX = 0,
                              middleX = 1.45 * fraction,
                              endX = 3.1 * fraction,
                              statusColor = colorArray[status + 'Color'],
                              buffer, bufferSeed;

                          startX += offsetX;
                          middleX += offsetX;
                          endX += offsetX;

                          if (rec.unitTest.completed) {
                              bufferSeed = 5.15;
                          } else {
                              bufferSeed = 7;
                          }
                          buffer = bufferSeed * width / 100;

                          drawBuildSection(ctx, startX, centerY, statusColor, colorArray, rec);
                          drawingService.drawArrow(ctx, middleX - buffer, centerY - 10);
                          //drawingService.drawArrow(ctx, width/3 - 5, centerY - 10);

                          drawTestSection(ctx, middleX, centerY, statusColor, colorArray, rec, 70, 2);

                          drawingService.drawArrow(ctx, endX - buffer, centerY - 10);
                          //drawingService.drawArrow(ctx, 2 * width/3 - 5, centerY - 10);
                          drawTestSection(ctx, endX, centerY, statusColor, colorArray, rec, 110, 3);
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

          function drawBuildSection (ctx, x, y, color, colorArray, rec) {
              var message;
              drawingService.drawText (ctx, x + 5, y - 10, "Build", color, 13);

              switch (rec.status) {
                  case "pending":
                      drawingService.drawPendingSmallIcon(ctx, x + 47, y - 14, 7, color, [2, 2], 1);
                      break;
                  case "running":
                      drawingService.drawRunningIcon(ctx, x + 47, y - 14, 7, colorArray.whiteColor, color);
                      break;
                  case "failed":
                      drawingService.drawCloseIcon(ctx, x + 47, y - 14, 7, color, colorArray.whiteColor, 2, false);
                      break;
                  case "passed":
                      drawingService.loadImage(ctx, 'images/success-tick.png', x + 42, y - 21);
                      break;
              }

              drawingService.drawTime (ctx, x + 5, y + 5, rec.build.time, colorArray.grayColor, 11);

              //debug part
              drawingService.loadImage(ctx, 'images/breafcase-tick.png', x + 90, y - 25);
              drawingService.drawText (ctx, x + 90, y + 25, "debug", colorArray.blueColor, 13);
              drawingService.underline(ctx, "debug", x + 90, y + 27, colorArray.blueColor, 13, 'left');

              //release part
              if (rec.status === 'passed') {
                  drawingService.loadImage(ctx, 'images/breafcase-tick.png', x + 151, y - 22);
              } else {
                  drawingService.drawBriefCase(ctx, x + 151, y - 17, 32, 24, 5, color, colorArray.whiteColor, false, true, rec.status);
              }

              drawingService.drawText (ctx, x + 150, y + 25, "release", colorArray.blueColor, 13);
              drawingService.underline(ctx, "release", x + 150, y + 27, colorArray.blueColor, 13, 'left');

              if (rec.status === 'failed') {
                  drawingService.loadImage(ctx, 'images/download-logs.png', x + 150, y + 30);
              }
          }

          function drawTestSection (ctx, x, y, color, colorArray, rec, textTickRight, forStep) {
              var x, percColor,
                  currentTest = forStep === 2 ? rec.unitTest : rec.functionalTest;

              switch (rec.status) {
                  case "passed":
                      drawingService.loadImage(ctx, 'images/success-tick.png', x + textTickRight, y - 22);
                      break;
                  case "pending":
                      drawingService.drawPendingSmallIcon(ctx, x + textTickRight + 13, y - 14, 7, color, [2, 2], 1);
                      break;
                  case "running":
                      drawingService.drawRunningIcon(ctx, x + textTickRight + 13, y - 14, 7, colorArray.whiteColor, color);
                      break;
                  case "failed":
                      drawingService.loadImage(ctx, 'images/test-failed.png', x + textTickRight, y - 22);
                      break;
              }

              drawingService.drawText(ctx, x + 5, y - 10, currentTest.name, colorArray.grayColor, 15);
              percColor = currentTest.completed ? colorArray.passedColor : colorArray.grayColor;
              drawingService.drawText (ctx, x + 5, y + 17, currentTest.perc + '%', color, 20);

              if (currentTest.completed) {
                  drawingService.drawPercentCircle(ctx, x + textTickRight + 75, y + 10, 30, colorArray.passedColor, colorArray, currentTest.perc);
                  drawingService.drawRect(ctx, x + textTickRight + 125, y - 18, 7, 7, color);
                  drawingService.drawText(ctx, x + textTickRight +  140, y - 10, currentTest.topInfo, colorArray.grayColor, 13);
                  drawingService.drawRect(ctx, x + textTickRight + 125, y + 2, 7, 7, colorArray.pendingColor);
                  drawingService.drawText(ctx, x + textTickRight + 140, y + 10, currentTest.bottomInfo, colorArray.grayColor, 13);
                  drawingService.drawTime (ctx, x + textTickRight + 123, y + 20, currentTest.time, colorArray.grayColor, 11);
              } else {
                  drawingService.drawText(ctx, x + 50, y + 15, "Status:", colorArray.darkgrayColor, 13);
                  drawingService.drawText(ctx, x + 95, y + 16, currentTest.message, color, 18);
              }
          }


      }
    };
}]);