define(['./module'], function (services) {
    'use strict';
    services.value('drawingService', {

        getReportData: function ($http) {
            //debugger
            var reportId = 'report1';
            return $http.get('/data/getReportData/' + reportId);
        },

        debug: false,

        /**
         * Animation speed in milliseconds
         */
        speed: 20,

        /**
         * Starting X coording of canvas for animation
         */
        offset: -700,

        /**
         * increment offset by this pixels
         */
        increment: 50,

        /**
         * List of colors used through the client side drawing 
         */
        getColorArray: function () {
            return {
                bgColor: '#e4e4e7',
                borderColor: '#e3e3e6',
                failedColor: '#ed5565',
                pendingColor: '#f8ac59',
                runningColor: '#1c84c6',
                passedColor: '#1ab394',
                whiteColor: '#fff',
                grayColor: '#999999',
                darkgrayColor: '#454545',
                blueColor: '#1c84c6',
                circleBorder: '#dff3ed'
            };
        },
        /**
         * Check if the browser is IE or not.
         */
        isIE: function () {
            var userAgent, ieReg, ie;
            userAgent = window.navigator.userAgent;
            ieReg = /msie|Trident.*rv[ :]*11\./gi;
            return ieReg.test(userAgent);
        },

        /**
         * Canvas element to remove
 * @param {Object} element
         */
        removeCanvas: function(element) {
            var removeFn,
                oldCanvas = element.find('canvas')[0];

            if (oldCanvas) {
                if (oldCanvas.remove) {
                    oldCanvas.remove();
                } else {
                    oldCanvas.removeNode();
                }
            }
        },

        /**
         * Inject canvas element to dom
 * @param {Object} $scope
 * @param {Object} $compile
 * @param {Object} element
         */
        injectCanvas: function($scope, $compile, element) {
            var canvas,
                height = element[0].clientHeight || 109, //for detail it doesn't get the value
                width = element[0].clientWidth;

            if (!width && this.isIE()) {
                width = $(element).width();
            }
            canvas = angular.element('<canvas height="' + height + '" width="' +  width + '"></canvas>');
            $compile(canvas)($scope);
            element.append(canvas);
            return {height: height, width: width};
        },

        loadImage: function (ctx, url, x, y) {
            var img = new Image();
            img.src = url;
            img.onload = function() {
                ctx.drawImage(img, x, y);
            };
        },

        drawTime: function (ctx, x, y, text, color, fontSize) {
            var url = 'images/clock.png';
            this.loadImage(ctx, url, x, y);
            this.drawText (ctx, x + 15, y + 10, text, color, fontSize);
        },

        drawArrow: function (ctx, x, y) {
            var url = 'images/arrow.png';
            this.loadImage(ctx, url, x, y);
        },

        drawText: function (ctx, x, y, text, color, fontSize) {
            ctx.font = fontSize + "px Arial";
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        },

        drawRect: function (ctx, x, y, w, h, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.rect(x, y, w, h);
            ctx.fill();
            ctx.closePath();
        },


        drawLine: function (ctx, x1, x2, y, color, lineWidth, dashConfig) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            if (dashConfig) {
                ctx.setLineDash(dashConfig);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        },

        drawPercentCircle: function (ctx, cx, cy, radius, color, colorArray, perc) {
            this.drawCircle(ctx, cx, cy, radius, color, false);

            var radius = 30,
                pendingPerc = (100 - perc) * 360 / 100,
                initAngle = 45,
                startAngle = (Math.PI * -initAngle) / 180,
                endAngle = (Math.PI * -(initAngle + pendingPerc)) / 180;

            ctx.fillStyle = colorArray.pendingColor;
            ctx.strokeStyle = colorArray.circleBorder;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle, true);
            ctx.lineTo(cx, cy);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        },

        drawCircle: function (ctx, x, y, radius, color, stroke, lineWidth, fill) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2*Math.PI);
            if (stroke && fill) {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth || 1;
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.fill();
            } else if (stroke) {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth || 1;
                ctx.stroke();
            } else {
                ctx.fillStyle = color;
                ctx.fill();
            }
            ctx.closePath();
        },

        underline: function  (context, text, x, y, color, textSize, align) {
            var textWidth = context.measureText(text).width,
                startY = y + (parseInt(textSize) / 15),
                endY = startY,
                underlineHeight = parseInt(textSize)/15,
                startX, endX;

            //Because of the above calculation we might get the value less 
            //than 1 and then the underline will not be rendered. this is to make sure 
            //there is some value for line width.
            if (underlineHeight < 1) {
                underlineHeight = 1;
            }

            context.beginPath();
            if (align == "center") {
                startX = x - (textWidth/2);
                endX = x + (textWidth/2);
            } else if (align == "right") {
                startX = x-textWidth;
                endX = x;
            } else {
                startX = x;
                endX = x + textWidth;
            }

            context.strokeStyle = color;
            context.lineWidth = underlineHeight;
            context.moveTo(startX, startY);
            context.lineTo(endX,endY);
            context.stroke();
        },

        drawTickMark: function (ctx, x, y, rad, lineWidth, color, grayShade) {
            var bottom;
            ctx.beginPath();
            ctx.lineWidth = lineWidth;

            if (grayShade) {
                ctx.moveTo(x - rad, y - 1);
                ctx.lineTo(x - rad/2 + 1, y + rad/2 + 1);
                ctx.lineTo(x + rad, y - rad + 1);
                ctx.strokeStyle = '#ccc';
                ctx.stroke();
                ctx.closePath();
            }
            ctx.beginPath();
            bottom = y + rad/2;
            if (rad <= 4) {
                ++bottom;
                --y;
            }
            ctx.moveTo(x - rad, y - rad + 4);
            ctx.lineTo(x - rad/2 + 1, bottom);
            ctx.lineTo(x + rad, y - rad + 2);
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.closePath();
        },

        drawExclamSign: function (ctx, x, y, color) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.moveTo(x, y - 12);
            ctx.lineTo(x, y - 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x, y + 1);
            ctx.stroke();
            ctx.closePath();
        },

        drawRunningIcon: function (ctx, x, y, r, color, statusColor) {
            var rad, lineWidth;
            rad = r/2.36;
            lineWidth = rad > 3 ? 2 : 1;

            this.drawCircle(ctx, x, y, r, statusColor);
            this.drawCircle(ctx, x, y, rad, color, true, 2);
            this.drawLine (ctx, x - rad - 1, x + rad + 1, y, statusColor, lineWidth)

            ctx.beginPath();
            ctx.strokeWidth = lineWidth;
            ctx.fillStyle = color;
            ctx.moveTo(x + 1, y - 1);
            ctx.lineTo(x + rad + 1.5, y - 1);
            ctx.lineTo(x + rad + 1.5, y - rad - 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(x - rad - 0.5, y + 1);
            ctx.lineTo(x - 1, y + 1);
            ctx.lineTo(x - rad - 0.5, y + rad + 1.5);
            ctx.fill();
            ctx.closePath();
        },

        drawPendingIcon: function (ctx, x, y, rad, strokeColor, fillColor) {
            this.drawCircle(ctx, x, y, rad, fillColor);
            this.drawCircle(ctx, x, y, rad - 6, strokeColor, true, 2);
            this.drawLine(ctx, x - 5, x + 5, y, strokeColor, 1.5, [2, 2]);
            ctx.setLineDash([]);
        },

        drawPendingSmallIcon: function (ctx, x, y, rad, strokeColor, dashConfig, lineWidth) {
            this.drawCircle(ctx, x, y, rad, strokeColor, true, lineWidth);
            this.drawLine(ctx, x - rad + 1, x + rad - 1, y, strokeColor, lineWidth, dashConfig);
            ctx.setLineDash([]);
        },

        roundRect: function (ctx, x, y, width, height, radius, color, fill, stroke, roundMatrix) {
            if (!roundMatrix) {
                roundMatrix = {tl: true, tr: true, br: true, bl: true};
            }
            ctx.beginPath();

            //Top-right
            if (!roundMatrix.bl) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + width, y);
            } else {
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            }

            //Bottom-right
            if (!roundMatrix.bl) {
                ctx.lineTo(x + width, y + height);
            } else {
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            }

            //Bottom-left
            if (!roundMatrix.bl) {
                ctx.lineTo(x, y + height);
            } else {
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            }

            //Top-left
            if (!roundMatrix.tl) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
            }
            ctx.closePath();

            if (fill) {
                ctx.fillStyle = color;
                ctx.fill();
            }

            if (stroke) {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        },

        drawBriefCase: function (ctx, x, y, width, height, radius, color, innerStrokeColor, fill, stroke) {
            var h, w, r,
                roundMatrix = {tl: false, tr: true, br: true, bl: true};
            this.roundRect(ctx, x, y, width, height, radius, color, fill, stroke, roundMatrix);
            h = height / 4;
            w = width / 2 - 2;
            roundMatrix = {tl: true, tr: true, br: false, bl: false};
            this.roundRect(ctx, x, y - h, w, h, 2, color, fill, stroke);

            r = height/3;
            this.drawCloseIcon(ctx, x + width/2, y + height/2, r, color, color, 3, true);
            this.drawCrossSign(ctx, x + width/2, y + height/2, r - 2, innerStrokeColor, 1);
        },

        drawCrossSign: function (ctx, x, y, r, color, strokeWidth) {
            var buffer = 0.5;
            ctx.beginPath();
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = color;

            ctx.moveTo(x - r/2 + buffer, y - r/2 + buffer);
            ctx.lineTo(x + r/2 - buffer, y + r/2 - buffer);
            ctx.stroke();
            ctx.moveTo(x + r/2 - buffer, y - r/2 + buffer);
            ctx.lineTo(x - r/2 + buffer, y + r/2 - buffer);
            ctx.stroke();
        },

        drawCloseIcon: function (ctx, x, y, radius, color, closeColor, closeStrokeWidth, stroke) {
            this.drawCircle(ctx, x, y, radius, color, stroke);
            this.drawCrossSign(ctx, x, y, radius, closeColor, closeStrokeWidth);
        }
    });
});
