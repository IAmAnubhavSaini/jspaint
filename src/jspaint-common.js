$(function () {

    size = window.location.toString().split('?')[1].split('=')[1];
    sizeX = size.split('x')[0];
    sizeY = size.split('x')[1];
    selectedAlternativeColor = '#FF0000';
    selectedPrimaryColor = '#000000';
    context = null;
    CanvasState = [];

    Actions = {
        Mouse: {
            getX: function (options) {
                var
                event = options.event,
                relativeTo = options.relativeTo,
                X = event.pageX - relativeTo.offset().left;

                return X;
            },
            getY: function (options) {
                var
                event = options.event,
                relativeTo = options.relativeTo,
                Y = event.pageY - relativeTo.offset().top;

                return Y;
            }
        }
    };

    CANVASAPI = {
        fillCirc: function (x, y, radius) {
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
        },
        drawCircle: function (options) {
            context.save();
            context.beginPath();
            context.arc(options.X, options.Y, options.innerRadius, 0, 2 * Math.PI, false);
            context.lineWidth = options.outerRadius - options.innerRadius;
            context.strokeStyle = options.strokeColor;
            context.stroke();
            context.restore();
        },
        fillSquare: function (x, y, side) {
            context.fillRect(x, y, side, side);
        },
        fillRoatedSquare: function (x, y, side, xyPlaneRotationAngle) {
            context.save();
            context.translate(x + side / 2, y + side / 2);
            context.rotate(xyPlaneRotationAngle);
            context.translate(-1 * (x + side / 2), -1 * (y + side / 2));
            CANVASAPI.fillSquare(x, y, side);
            context.restore();
        },
        fillRotatedRectangle: function(x, y, length, breadth, xyPlaneRotationAngle){
            context.save();
            context.translate(x + length / 2, y + breadth / 2);
            context.rotate(xyPlaneRotationAngle);
            context.translate(-1 * (x + length / 2), -1 * (y + breadth / 2));
            context.fillRect(x, y, length, breadth);
            context.restore();
        },
        fillRing: function (options) {
            CANVASAPI.fillCirc(options.X, options.Y, options.outerRadius);
            context.save();
            context.fillStyle = options.fillColor;
            CANVASAPI.fillCirc(options.X, options.Y, options.innerRadius);
            context.restore();
        }
    };

    Color = {
        generateBasicColorPalette: function (options) {
            var
            IContainBasicColors = options.appendHere || '.BasicColorPalette',
            div1 = $('<div></div>'),
            div2 = $('<div></div>'),
            row = div1,
            hex = null,
            color = null,
            colors = options.basicColors || CONSTANTS.basicColors,
            len = colors.length,
            i = 0;

            for (i = 0; i < len; i++) {
                row = i < len / 2 ? div1 : div2;
                hex = '#' + colors[i].hex;
                color = $('<div></div>')
                        .addClass('color')
                        .attr('id', 'Color-Hex-' + hex)
                        .css('background-color', hex)
                        .appendTo(row);
            }
            div1.appendTo(IContainBasicColors);
            div2.appendTo(IContainBasicColors);
        },
        hexToRgb: function (hex) {
            var result = null;
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        rgbToHex: function(r, g, b){
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
    };

    setupToolTips = function (tool, title) {
        tool.attr('title', title)
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'bottom');
    };

    activateTool = function (options) {
        if (activeTool !== null) {
            activeTool.trigger('click');
        }
        activeTool = options.tool;
        $(options.tool).toggleClass('active-tool');
        $('label#activated-tool-name').html(options.toolName);
        options.start(options);
    };

    deactivateTool = function (options) {
        activeTool = null;
        $(options.tool).toggleClass('active-tool');
        $('label#activated-tool-name').html('no active tool');
        options.stop(options);
    };

    activeTool = null;
});