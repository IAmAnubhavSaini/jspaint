$(function () {

    size = window.location.toString().split('?')[1].split('=')[1];
    sizeX = size.split('x')[0];
    sizeY = size.split('x')[1];
    jspaint = null;
    selectedAlternativeColor = 'red';
    selectedPrimaryColor = 'black';
    resetCanvasColor = 'white';
    context = null;

    Actions = {
        Mouse: {
            getX: function (options) {
                var event = options.event,
                    relativeTo = options.relativeTo,
                    X = event.pageX - relativeTo.offset().left;

                return X;
            },
            getY: function (options) {
                var event = options.event,
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
            var IContainBasicColors = options.appendHere || '.BasicColorPalette',
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
                            .css('background-color', hex);
                color.appendTo(row);
            }
            div1.appendTo(IContainBasicColors);
            div2.appendTo(IContainBasicColors);
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
        $(options.tool).toggleClass('active-tool');
        options.start(options);
    };

    deactivateTool = function (options) {
        $(options.tool).toggleClass('active-tool');
        options.stop(options);
    };

    activeTool = null;
});