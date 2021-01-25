"use strict";
var COLOR = {
    rgb2hex: function (r, g, b) {
        return [r, g, b]
            .map(function (c) { return parseInt(c).toString(16); })
            .map(function (c) { return c.toUpperCase(); })
            .map(function (c) { return c.padStart(2, '0'); })
            .reduce(function (a, c) { return a + c; }, '#');
    },
    hex2rgb: function (hex) {
        return [hex || '#000']
            .map(function (h) { return h.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (_matches, r, g, b) { return '' + r + r + g + g + b + b; }); })
            .map(function (h) { return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); })
            .map(function (mrgb) { return (mrgb || [0, 0, 0, 0]).slice(1); })
            .map(function (rgb) { return rgb.map(function (c) { return parseInt(c.toString()).toString(16); }); })
            .map(function (rgb) { return ({
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            rgb: "rgb(" + rgb.join(', ') + ")",
            rgba: "rgba(" + rgb.join(', ') + ", 1)"
        }); })
            .pop();
    }
};
var CONSTANTS = {
    canvasId: "jspaint-canvas",
    canvasContainerId: "jspaint-paint-area",
    basicColors: [{
            hex: '00FFFF',
            name: "Aqua"
        }, {
            hex: '000000',
            name: "Black"
        }, {
            hex: '0000FF',
            name: "Blue"
        }, {
            hex: 'FF00FF',
            name: "Fuchsia"
        }, {
            hex: '808080',
            name: "Gray"
        }, {
            hex: '008000',
            name: "Green"
        }, {
            hex: '00FF00',
            name: "Lime"
        }, {
            hex: '800000',
            name: "Maroon"
        }, {
            hex: '000080',
            name: "Navy"
        }, {
            hex: '808000',
            name: "Olive"
        }, {
            hex: '800080',
            name: "Purple"
        }, {
            hex: 'FF0000',
            name: "Red"
        }, {
            hex: 'C0C0C0',
            name: "Silver"
        }, {
            hex: '008080',
            name: "Teal"
        }, {
            hex: 'FFFFFF',
            name: "White"
        }, {
            hex: 'FFFF00',
            name: "Yellow"
        },],
    Events: {
        mousemove: 'mousemove',
        mouseclick: 'click'
    }
};
var activeTool;
var LocalStorageAvailable = function () {
    return localStorage !== undefined && localStorage !== null;
}, getSizeFromURL = function () {
    return (window.location.toString().split('?')[1] || '=').split('=')[1];
}, size = function () {
    return (LocalStorageAvailable() ? localStorage.getItem('dimensionsWxH') : getSizeFromURL()) || 'x';
}, sizeX = size().split('x')[0] || '', sizeY = size().split('x')[1] || '', selectedAlternativeColor = '#FF0000', selectedPrimaryColor = '#000000', context = null, CanvasState = [], Actions = {
    Mouse: {
        getX: function (options) {
            var event = options.event, relativeTo = options.relativeTo, X = event.pageX - relativeTo.offset().left;
            return X;
        },
        getY: function (options) {
            var event = options.event, relativeTo = options.relativeTo, Y = event.pageY - relativeTo.offset().top;
            return Y;
        }
    }
}, CANVASAPI = {
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
    fillRotatedRectangle: function (x, y, length, breadth, xyPlaneRotationAngle) {
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
    },
    drawLineSegmentFromLastPoint: function (options) {
        var context = options.context, last = options.last, current = options.current, width = options.width;
        context.beginPath();
        context.moveTo(last.X, last.Y);
        context.lineTo(current.X, current.Y);
        context.lineWidth = width;
        context.strokeStyle = selectedPrimaryColor;
        context.stroke();
        CANVASAPI.fillCirc(current.X, current.Y, width / 2);
    }
}, saveCanvasState = function (options) {
    CanvasState.push(context.getImageData(options.startX, options.startY, options.width, options.height));
}, Color = {
    generateBasicColorPalette: function (options) {
        var IContainBasicColors = options.appendHere || '.BasicColorPalette', div1 = $('<div></div>'), div2 = $('<div></div>'), row = div1, hex = null, colors = options.basicColors || CONSTANTS.basicColors, len = colors.length, i = 0;
        for (i = 0; i < len; i++) {
            row = i < len / 2 ? div1 : div2;
            hex = '#' + colors[i].hex;
            $('<div></div>')
                .addClass('color')
                .attr('id', 'Color-Hex-' + hex)
                .css('background-color', hex)
                .appendTo(row);
        }
        div1.appendTo(IContainBasicColors);
        div2.appendTo(IContainBasicColors);
    },
    hexToRgb: COLOR.hex2rgb,
    rgbToHex: COLOR.rgb2hex
}, setupToolTips = function (tool, title) {
    tool.attr('title', title)
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'bottom');
}, activateTool = function (options) {
    if (activeTool !== null) {
        activeTool.trigger('click');
    }
    activeTool = options.tool;
    $('label#activated-tool-name').html(options.toolName);
    options.start(options);
}, deactivateTool = function (options) {
    activeTool = null;
    $('label#activated-tool-name').html('no active tool');
    options.stop(options);
};
activeTool = null;
var CanvasApi = CANVASAPI;
;
(function ($) {
    "use strict";
    $(function () {
        function initializeCanvas(options) {
            var canvas = $('<canvas/>', {
                id: options.canvasId
            })
                .prop({
                'width': options.width,
                'height': options.height
            })
                .appendTo('#' + options.canvasContainerId);
            return canvas[0];
        }
        function initializeContext(options) {
            var sizeX = options.sizeX || '600';
            var sizeY = options.sizeY || '400';
            options.width = (parseInt(sizeX) - 2).toString();
            options.height = (parseInt(sizeY) - 2).toString();
            return initializeCanvas(options).getContext('2d');
        }
        function generateHexColorStringFromThisElementsId(element) {
            var attr = (element.attr('id') || '#').split('#')[1];
            return '#' + attr;
        }
        var registerColorEvents = function () {
            function updatePrimaryColor(selectedPrimaryColor) {
                var label = document.querySelector('label#primary-color-name');
                label.style.color = selectedPrimaryColor;
                label.innerHTML = selectedPrimaryColor;
            }
            function updataAlternativeColorLabel(selectedAlternativeColor) {
                var label = document.querySelector('label#alternative-color-name');
                label.style.color = selectedAlternativeColor;
                label.innerHTML = selectedAlternativeColor;
            }
            $('.color')
                .attr('title', 'Left click for primary color, Right click for alternative color.')
                .attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .on('click', function () {
                selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
                document.querySelector('#SelectedPrimaryColor').style.backgroundColor = selectedPrimaryColor;
                updatePrimaryColor(selectedPrimaryColor);
            })
                .on('contextmenu', function (e) {
                e.preventDefault();
                selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
                $('#SelectedAlternativeColor').css('background-color', selectedAlternativeColor);
                updataAlternativeColorLabel(selectedAlternativeColor);
            });
            updatePrimaryColor(selectedPrimaryColor);
            updataAlternativeColorLabel(selectedAlternativeColor);
        }, registerAllColorsPickerEvents = function (options) {
            $('#' + options.toolId)
                .on('input', function () {
                selectedPrimaryColor = context.fillStyle = ($(this).val() || '');
            });
        }, registerSaveImageEvents = function (options) {
            $('#' + options.toolId)
                .on('click', function () {
                window.open($('#' + CONSTANTS.canvasId)[0].toDataURL("image/png"), "_blank");
            });
        }, registerResetCanvasEvents = function (options) {
            $('#' + options.toolId)
                .on('click', function () {
                var canvasId = '#' + (options.canvasId || CONSTANTS.canvasId), canvas = $(canvasId)[0], canvasHeight = canvas.height, canvasWidth = canvas.width, context = canvas.getContext('2d');
                context.clearRect(0, 0, canvasWidth, canvasHeight);
                CanvasState = [];
            });
        }, registerUndoEvents = function (options) {
            $(options.toolSelection)
                .on('click', function () {
                var state = CanvasState.pop();
                if (state !== undefined) {
                    context.putImageData(state, 0, 0);
                }
            });
            $(options.canvasId)
                .on('mousedown', function () {
                saveCanvasState({
                    startX: 0,
                    startY: 0,
                    width: $(this).width(),
                    height: $(this).height()
                });
            });
        }, registerEvents = function () {
            registerColorEvents();
            registerAllColorsPickerEvents({
                toolId: 'allColorsPicker',
                containerId: 'HTML5ColorPicker'
            });
            registerSaveImageEvents({
                toolId: 'save-as-image',
                containerId: 'SaveImageButton'
            });
            registerResetCanvasEvents({
                toolId: 'reset-canvas',
                containerId: 'ResetCanvas'
            });
            registerUndoEvents({
                toolSelection: '#undo-button',
                canvasId: '#' + CONSTANTS.canvasId
            });
        }, mustAssignDimensionsToCanvasContainer = function () {
            var _sizex = parseInt(sizeX || '');
            if (_sizex > 2500) {
                _sizex = 2500;
            }
            else if (_sizex < 320) {
                _sizex = 320;
            }
            var _sizey = parseInt(sizeY || '');
            if (_sizey > 2500) {
                _sizey = 2500;
            }
            else if (_sizey < 320) {
                _sizey = 320;
            }
            sizeX = _sizex.toString();
            sizeY = _sizex.toString();
            $('#jspaint-paint-area').css({
                width: sizeX,
                height: sizeY
            });
        }, init = function () {
            mustAssignDimensionsToCanvasContainer();
            var canvasContextOptions = {
                sizeX: sizeX || '',
                sizeY: sizeY || '',
                canvasId: CONSTANTS.canvasId,
                canvasContainerId: CONSTANTS.canvasContainerId
            };
            initializeContext(canvasContextOptions);
            Color.generateBasicColorPalette({
                appendHere: '.BasicColorPalette',
                basicColors: CONSTANTS.basicColors
            });
            registerEvents();
            $('#PencilTool').trigger('click');
            $('#SelectedPrimaryColor').css('background-color', selectedPrimaryColor);
            $('#SelectedAlternativeColor').css('background-color', selectedAlternativeColor);
        };
        init();
    });
})(jQuery);
//# sourceMappingURL=jspaint.js.map