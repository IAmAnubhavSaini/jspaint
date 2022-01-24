let RGBToHex = function (r: number, g: number, b: number): string {
    function componentToHex(c: number) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

let HexToRGB = function (hex: string) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

let CONSTANTS = {
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

let LocalStorageAvailable = function () {
    return localStorage !== undefined && localStorage !== null;
};
let getSizeFromURL = function () {
    return window.location.toString().split('?')[1].split('=')[1];
};

let size = function () {
    return LocalStorageAvailable() ? localStorage.getItem('dimensionsWxH') : getSizeFromURL();
};

let sizeX: string = size().split('x')[0];
let sizeY: string = size().split('x')[1];

let selectedAlternativeColor: string = '#FF0000';
let selectedPrimaryColor: string = '#000000';
let context = null;
let CanvasState = [];

let Actions = {
    Mouse: {
        getX: function (options) {
            let
                event = options.event,
                relativeTo = options.relativeTo;

            return event.pageX - relativeTo.offset().left;
        },
        getY: function (options) {
            let
                event = options.event,
                relativeTo = options.relativeTo;

            return event.pageY - relativeTo.offset().top;
        }
    }
};

let CANVASAPI = {
    fillCirc: function (x: number, y: number, radius: number) {
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
        let
            context = options.context,
            last = options.last,
            current = options.current,
            width = options.width;

        context.beginPath();
        context.moveTo(last.X, last.Y);
        context.lineTo(current.X, current.Y);
        context.lineWidth = width;
        context.strokeStyle = selectedPrimaryColor;
        context.stroke();

        CANVASAPI.fillCirc(current.X, current.Y, width / 2);
    }
};

let saveCanvasState = function (options) {
    let image = context.getImageData(options.startX, options.startY, options.width, options.height);
    CanvasState.push(image);
    // #TODO: Figure out a way to persist image data. #210
};

let Color = {
    generateBasicColorPalette: function (options) {
        let
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
    hexToRgb: HexToRGB,
    rgbToHex: RGBToHex
};

let setupToolTips = function (tool, title) {
    tool.attr('title', title)
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'bottom');
};

let activeTool = null;

let activateTool = function (options) {
    if (activeTool !== null) {
        activeTool.trigger('click');
    }
    activeTool = options.tool;
    $('label#activated-tool-name').html(options.toolName);
    options.start(options);
};

let deactivateTool = function (options) {
    activeTool = null;
    $('label#activated-tool-name').html('no active tool');
    options.stop(options);
};


if (typeof Object.assign != 'function') {
    /* Object.assign Polyfill (comments are inside) */
    (function () {
        Object.assign = function (target) {
            'use strict';
            // We must check against these specific cases.
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            let output = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                let source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (let nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
    /* Object.assign Polyfill ends here */
}

let generateSliderString = function (options) {
    let min = options.min,
        max = options.max,
        title = options.title,
        id = options.id,
        step = options.step;

    return '<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" title="' + title + '" />';
};
let generateLabelString = function (options) {
    let hexColor = options.hexColor,
        fontSize = options.fontSize;

    return '<label style="color: #' + hexColor + '; font-size: ' + fontSize + ';"></label>';
};

function randomLoop(width, height, operation) {
    let x, y;
    for (let i = 0; i < Math.floor(width / 10); i++) {
        for (let j = 0; j < Math.floor(height / 10); j++) {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
            operation(x, y, i, j);
        }
    }
}

interface BaseTool {
    id: string;
    selectionId: string;
    class: string;
    title: string;
    containerId?: string;
    ACTIONS?: any;
    previewId?: string;
    previewOuterId?: string;
}


let TOOLS = {
    CONSTANTS: {
        /* constant values for tools in jspaint */
        MandelbrotFractal: {
            id: "MandelbrotFractalTool",
            selectionId: '#MandelbrotFractalTool',
            class: 'main-tool',
            title: 'Click to draw Mandelbrot Fractal. Click again to disable.',
            maxHeight: -1,
            maxWidth: -1
        },
        Pencil: {
            id: "PencilTool",
            selectionId: '#PencilTool',
            class: 'main-tool',
            title: 'Click to draw free-hand lines. Click again to disable.'
        } as BaseTool,
        PickColor: {
            id: 'pick-color',
            selectionId: '#pick-color',
            class: 'string-menu-item',
            containerId: 'PickColorTool',
            title: 'Click to pick color under mouse pointer tip; picks until some other tool is selected. Click again to disable.'
        } as BaseTool,
        PivotedLinePattern: {
            id: "PivotedLinePatternTool",
            selectionId: '#PivotedLinePatternTool',
            class: 'main-tool',
            title: 'Click to draw amazing pattern. Click again to disable.',
            ACTIONS: {
                pivots: 'pivots',
                Ydrops: 'drops',
                godRays: 'god-rays',
                Xextends: 'extends'
            }
        } as BaseTool,
        Rectangle: {
            id: 'RectangleTool',
            selectionId: '#RectangleTool',
            class: 'main-tool',
            title: 'Click to draw rectangles. Click again to disable.',
            previewId: 'previewRectangle'
        } as BaseTool,
        Ring: {
            id: 'RingTool',
            selectionId: '#RingTool',
            class: 'main-tool',
            title: 'Click to draw ring. Click again to disable.',
            previewId: 'previewRing',
            previewOuterId: 'previewOuterRing'
        } as BaseTool,
        Disc: {
            id: 'DiscTool',
            selectionId: '#DiscTool',
            class: 'main-tool',
            title: 'Click to draw disc. Click again to disable.',
            previewId: 'previewDisc'
        } as BaseTool,
        Square: {
            id: 'SquareTool',
            selectionId: '#SquareTool',
            class: 'main-tool',
            title: 'Click to draw squares. Click again to disable.',
            previewId: 'previewSquare'
        } as BaseTool,
        Circle: {
            id: 'CircleTool',
            selectionId: '#CircleTool',
            class: 'main-tool',
            title: 'Click to draw circle. Click again to disable.',
            previewId: 'previewCircle'
        } as BaseTool,
        PointWalker: {
            id: 'PointWalkerTool',
            selectionId: '#PointWalkerTool',
            class: 'main-tool',
            title: 'Click to draw random point walker. Click again to disable.'
        } as BaseTool,
        FamilyPointWalker: {
            id: 'FamilyPointWalkerTool',
            selectionId: '#FamilyPointWalkerTool',
            class: 'main-tool',
            title: 'Click to draw family random point walker. Click again to disable.'
        } as BaseTool,
        OrganismPointWalker: {
            id: 'OrganismPointWalkerTool',
            selectionId: '#OrganismPointWalkerTool',
            class: 'main-tool',
            title: 'Click to draw organism random point walker. Click again to disable.'
        } as BaseTool,
        UniCellularParasiteTool: {
            id: 'UniCellularParasiteTool',
            selectionId: '#UniCellularParasiteTool',
            class: 'main-tool',
            title: 'Click to create a parasite. Click again to disable.'
        } as BaseTool
        /* CONSTANTS ends here */
    },
    VARIABLES: {
        /* variables for tools */
        MandelbrotFractal: {
            iterations: 1000,
            xMax: 1,
            yMax: 1,
            xMin: -2,
            yMin: -1,
            height: -1,
            width: -1
        },
        Pencil: {
            width: 2,
            LastPoint: {
                X: -1,
                Y: -1
            }
        },
        PivotedLinePattern: {
            width: 2,
            LastPoint: {
                X: -1,
                Y: -1
            }
        },
        Rectangle: {
            length: 20,
            breadth: 10,
            xyPlaneRotationAngle: 360
        },
        Ring: {
            innerRadius: 10,
            outerRadius: 20
        },
        Disc: {
            radius: 10
        },
        Square: {
            side: 10,
            xyPlaneRotationAngle: 360
        },
        Circle: {
            innerRadius: 10
        },
        PointWalker: {
            steps: 100
        },
        FamilyPointWalker: {
            steps: 100,
            durationBetweenDanceStepsInMiliSeconds: 100
        },
        OrganismPointWalker: {
            steps: 100,
            durationBetweenDanceStepsInMiliSeconds: 100
        },
        UniCellularParasiteTool: {
            steps: 1,
            durationBetweenParasiticActsInMiliSeconds: 100,
            dieOutSteps: 10000
        }
        /* VARIABLES ends here */
    }
};

interface ToolType {
    CONSTANTS: any,
    VARIABLES: any,
    start: Function,
    stop: Function,
    contextMenu: any
}

let MandelbrotFractal = {
    CONSTANTS: TOOLS.CONSTANTS.MandelbrotFractal,
    VARIABLES: TOOLS.VARIABLES.MandelbrotFractal,
};
let Pencil = {
    CONSTANTS: TOOLS.CONSTANTS.Pencil,
    VARIABLES: TOOLS.VARIABLES.Pencil
};
let PickColor = {
    CONSTANTS: TOOLS.CONSTANTS.PickColor
};
let PivotedLinePattern = {
    CONSTANTS: TOOLS.CONSTANTS.PivotedLinePattern,
    VARIABLES: TOOLS.VARIABLES.PivotedLinePattern
};
let Rectangle = {
    CONSTANTS: TOOLS.CONSTANTS.Rectangle,
    VARIABLES: TOOLS.CONSTANTS.Rectangle
};
let Ring: ToolType = {
    CONSTANTS: TOOLS.CONSTANTS.Ring,
    VARIABLES: TOOLS.VARIABLES.Ring,
};
let Disc = {
    CONSTANTS: TOOLS.CONSTANTS.Disc,
    VARIABLES: TOOLS.VARIABLES.Disc
};
let Square = {
    CONSTANTS: TOOLS.CONSTANTS.Square,
    VARIABLES: TOOLS.VARIABLES.Square
};
let Circle = {
    CONSTANTS: TOOLS.CONSTANTS.Circle,
    VARIABLES: TOOLS.VARIABLES.Circle
};
let PointWalker = {
    CONSTANTS: TOOLS.CONSTANTS.PointWalker,
    VARIABLES: TOOLS.VARIABLES.PointWalker
};
let FamilyPointWalker = {
    CONSTANTS: TOOLS.CONSTANTS.FamilyPointWalker,
    VARIABLES: TOOLS.VARIABLES.FamilyPointWalker
};
let OrganismPointWalker = {
    CONSTANTS: TOOLS.CONSTANTS.OrganismPointWalker,
    VARIABLES: TOOLS.VARIABLES.OrganismPointWalker
};
let UniCellularParasiteTool = {
    CONSTANTS: TOOLS.CONSTANTS.UniCellularParasiteTool,
    VARIABLES: TOOLS.VARIABLES.UniCellularParasiteTool
};

$(function () {
    "use strict";

    function getCanvasDetails() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width();

        return {
            canvasId: canvasId,
            height: height,
            width: width,
            image: context.getImageData(0, 0, width, height),
            context: context,
            startX: 0,
            startY: 0,
            strokeStyle: context.strokeStyle
        };
    }

    let COMMON = {
        generateSlider: function (options) {
            return $(generateSliderString(options));
        },
        generateLabel: function (options): JQuery<HTMLElement> {
            return $(generateLabelString(options));
        },
        genericLabel: function (): JQuery<HTMLElement> {
            return COMMON.generateLabel({
                hexColor: 'FFFFFF',
                fontSize: '10px'
            });
        },

        registerEventForTool: function (options) {
            let toolId = options.toolId,
                tool = $(toolId),
                contextMenu = options.contextMenu,
                title = options.constantTitle;

            setupToolTips(tool, title);
            options.tool = tool;

            tool.funcToggle('click',
                function () {
                    activateTool(options);
                    contextMenu.activate(contextMenu.getOptions());
                },
                function () {
                    contextMenu.deactivate(contextMenu.getOptions());
                    deactivateTool(options);
                });
        }

    };

    function onImageButtonChange(e) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            };
            img.src = event.target.result.toString();
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    let MandelbrotFractalFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = options.canvasId;

            function drawMandelbrotFractal(options) {
                function mandelIter(cx, cy, maxIter) {
                    let x = 0.0,
                        y = 0.0,
                        xx = 0,
                        yy = 0,
                        xy = 0,
                        i = maxIter;

                    while (i-- && xx + yy <= 4) {
                        xy = x * y;
                        xx = x * x;
                        yy = y * y;
                        x = xx - yy + cx;
                        y = xy + xy + cy;
                    }
                    return maxIter - i;
                }

                function mandelbrot(options) {
                    let ctx = options.context,
                        xmin = options.XMin,
                        ymin = options.YMin,
                        xmax = options.XMax,
                        ymax = options.YMax,
                        iterations = options.iterations,
                        width = MandelbrotFractal.VARIABLES.width,
                        height = MandelbrotFractal.VARIABLES.height,
                        img = ctx.getImageData(0, 0, width, height),
                        pix = img.data,
                        innerColor = Color.hexToRgb(selectedPrimaryColor),
                        ix, iy, x, y, i, c, ppos;

                    for (ix = 0; ix < width; ++ix) {
                        for (iy = 0; iy < height; ++iy) {
                            x = xmin + (xmax - xmin) * ix / (width - 1);
                            y = ymin + (ymax - ymin) * iy / (height - 1);
                            i = mandelIter(x, y, iterations);
                            ppos = 4 * (width * iy + ix);

                            if (i > iterations) {
                                pix[ppos] = innerColor.r;
                                pix[ppos + 1] = innerColor.g;
                                pix[ppos + 2] = innerColor.b;
                            } else {
                                c = 3 * Math.log(i) / Math.log(iterations - 1.0);

                                if (c < 1) {
                                    pix[ppos] = 255 * c;
                                    pix[ppos + 1] = 0;
                                    pix[ppos + 2] = 0;
                                } else if (c < 2) {
                                    pix[ppos] = 255;
                                    pix[ppos + 1] = 255 * (c - 1);
                                    pix[ppos + 2] = 0;
                                } else {
                                    pix[ppos] = 255;
                                    pix[ppos + 1] = 255;
                                    pix[ppos + 2] = 255 * (c - 2);
                                }
                            }
                            pix[ppos + 3] = 255;
                        }
                    }
                    ctx.putImageData(img, options.startX, options.startY);
                }

                mandelbrot(options);
            }

            let getOverflowInXAxis = function (startX) {
                return startX + Math.floor(MandelbrotFractal.VARIABLES.width) - MandelbrotFractal.CONSTANTS.maxWidth;
            };

            let getStartingXCoordinate = function (mouseOptions) {
                let X = Actions.Mouse.getX(mouseOptions),
                    startX = Math.max(X - Math.floor(MandelbrotFractal.VARIABLES.width / 2), 0),
                    overflowX = getOverflowInXAxis(startX);
                if (overflowX > 0) {
                    startX -= overflowX;
                }
                return startX;
            };

            let getOverflowInYAxis = function (startY) {
                return startY + Math.floor(MandelbrotFractal.VARIABLES.height) - MandelbrotFractal.CONSTANTS.maxHeight;
            };

            let getStartingYCoordinate = function (mouseOptions) {
                let Y = Actions.Mouse.getY(mouseOptions),
                    startY = Math.max(Y - Math.floor(MandelbrotFractal.VARIABLES.height / 2), 0),
                    overflowY = getOverflowInYAxis(startY);

                if (overflowY > 0) {
                    startY -= overflowY;
                }
                return startY;
            };

            $(canvasId).on(event, function (e) {
                let mouseOptions = {
                        event: e,
                        relativeTo: $(canvasId)
                    },
                    startX = getStartingXCoordinate(mouseOptions),
                    startY = getStartingYCoordinate(mouseOptions);

                drawMandelbrotFractal({
                    context: context,
                    XMin: MandelbrotFractal.VARIABLES.xMin,
                    XMax: MandelbrotFractal.VARIABLES.xMax,
                    YMin: MandelbrotFractal.VARIABLES.yMin,
                    YMax: MandelbrotFractal.VARIABLES.yMax,
                    iterations: MandelbrotFractal.VARIABLES.iterations,
                    startX: startX,
                    startY: startY
                });
            });
        },

        stop: function (options) {
            $(options.canvasId).off(options.event);
        },

        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function addIterationController(options) {
                    function createIterationSlider(options) {
                        let slider = getInputElement('mandelbrotIterations', '10', options.maxIterationsAllowed, 'Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.')
                            .attr('value', MandelbrotFractal.VARIABLES.iterations)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                let val = parseInt($(this).val().toString().toString());
                                if (val > options.maxIterationsAllowed) {
                                    if (confirm('Beware! It might crash your browser. Go back?')) {
                                        val = options.maxIterationsAllowed;
                                    }
                                }
                                MandelbrotFractal.VARIABLES.iterations = val;
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.iterationLabel)
                        .append(createIterationSlider(options));

                    return sliderTool;
                }

                function addHeightController(options) {
                    function createHeightSlider(options) {
                        let slider = getInputElement('mandelbrotHeight', '100', MandelbrotFractal.CONSTANTS.maxHeight, 'Height for mandelbrot fractal generation.')
                            .attr('value', MandelbrotFractal.CONSTANTS.maxHeight)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val().toString().toString());
                            })
                            .on('change', function () {
                                let val = parseInt($(this).val().toString().toString());
                                if (val > MandelbrotFractal.CONSTANTS.maxHeight) {
                                    val = MandelbrotFractal.CONSTANTS.maxHeight;
                                }
                                MandelbrotFractal.VARIABLES.height = val;
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.heightLabel)
                        .append(createHeightSlider(options));

                    return sliderTool;
                }

                function addWidthController(options) {
                    function createWidthSlider(options) {
                        let slider = getInputElement('mandelbrotWidth', '100', MandelbrotFractal.CONSTANTS.maxWidth, 'Width for mandelbrot fractal generation.')
                            .attr('value', MandelbrotFractal.CONSTANTS.maxWidth)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                let val = $(this).val().toString();
                                if (val > MandelbrotFractal.CONSTANTS.maxWidth) {
                                    val = MandelbrotFractal.CONSTANTS.maxWidth;
                                }
                                MandelbrotFractal.VARIABLES.width = val;
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.widthLabel)
                        .append(createWidthSlider(options));

                    return sliderTool;
                }

                function addXMaxController(options) {
                    function createXMaxSlider(options) {
                        let slider = getInputElement('mandelbrotXMax', '0', '3', 'XMax for mandelbrot fractal generation.')
                            .attr('value', '1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.xMax = $(this).val().toString();
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.xMaxLabel)
                        .append(createXMaxSlider(options));

                    return sliderTool;
                }

                function addYMaxController(options) {
                    function createYMaxSlider(options) {
                        let slider = getInputElement('mandelbrotYMax', '0', '3', 'YMax for mandelbrot fractal generation.')
                            .attr('value', '1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.yMax = $(this).val().toString();
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.yMaxLabel)
                        .append(createYMaxSlider(options));

                    return sliderTool;
                }

                function addXMinController(options) {
                    function createXMinSlider(options) {
                        let slider = getInputElement('mandelbrotXMin', '-3', '1', 'XMin for mandelbrot fractal generation.')
                            .attr('value', '-2')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.xMin = $(this).val().toString();
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.xMinLabel)
                        .append(createXMinSlider(options));

                    return sliderTool;
                }

                function addYMinController(options) {
                    function createYMinSlider(options) {
                        let slider = getInputElement('mandelbrotYMin', '-2', '1', 'YMin for mandelbrot fractal generation.')
                            .attr('value', '-1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.yMin = $(this).val().toString();
                            });
                        return slider;
                    }

                    let sliderTool = COMMON.genericLabel()
                        .append(options.yMinLabel)
                        .append(createYMinSlider(options));

                    return sliderTool;
                }

                container.append(addIterationController(options));
                container.append(addHeightController(options));
                container.append(addWidthController(options));
                container.append(addXMaxController(options));
                container.append(addYMaxController(options));
                container.append(addXMinController(options));
                container.append(addYMinController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'MandelbrotFractalContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    maxIterationsAllowed: 2000,
                    minIterationsAllowed: 10,
                    iterationLabel: 'Iterations: ',
                    maxHeightAllowed: MandelbrotFractal.VARIABLES.maxHeight,
                    heightLabel: 'Height: ',
                    maxWidthAllowed: MandelbrotFractal.VARIABLES.maxWidth,
                    widthLabel: 'Width: ',
                    xMaxLabel: 'XMax: ',
                    yMaxLabel: 'YMax: ',
                    xMinLabel: 'XMin: ',
                    yMinLabel: 'YMin: ',
                };
            }
        },
        Events: {
            register: function (options) {
                let toolId = options.toolId,
                    tool = $(toolId),
                    contextMenu = MandelbrotFractal.ContextMenu;

                setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                    function () {
                        activateTool(options);
                        MandelbrotFractal.VARIABLES.height = MandelbrotFractal.CONSTANTS.maxHeight = $(options.canvasId)[0].height;
                        MandelbrotFractal.VARIABLES.width = MandelbrotFractal.CONSTANTS.maxWidth = $(options.canvasId)[0].width;
                        contextMenu.activate(contextMenu.getOptions());
                    },
                    function () {
                        contextMenu.deactivate(contextMenu.getOptions());
                        deactivateTool(options);
                    });
            }
        }
    };

    let PencilFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                width = null,
                last = null,
                LastPoint = {
                    get: function () {
                        return {
                            X: Pencil.VARIABLES.LastPoint.X,
                            Y: Pencil.VARIABLES.LastPoint.Y
                        };
                    },
                    set: function (x, y) {
                        Pencil.VARIABLES.LastPoint.X = x;
                        Pencil.VARIABLES.LastPoint.Y = y;
                    }
                };

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(this)
                };

                let drawLines = function () {
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    width = Pencil.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X != -1) {
                        CANVASAPI.drawLineSegmentFromLastPoint({
                            context: context,
                            last: last,
                            current: {
                                X: X,
                                Y: Y
                            },
                            width: width
                        });
                    }
                    LastPoint.set(X, Y);
                };

                if (e.buttons !== undefined) {
                    if (e.buttons === 1) {
                        drawLines();
                    } else {
                        Pencil.VARIABLES.LastPoint.X = -1;
                        Pencil.VARIABLES.LastPoint.Y = -1;
                    }
                }
            });
        },
        stop: function (options) {
            let event = options.event || CONSTANTS.Events.mousemove,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "widthPencil",
                        min: 1,
                        max: 200,
                        step: 1,
                        title: "Width for pencil tool."
                    });
                }

                function addSliderForLineWidth(options) {
                    let div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                        slider = initialSlider()
                            .attr('value', Pencil.VARIABLES.width)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Pencil.VARIABLES.width = $(this).val().toString();
                            })
                            .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForLineWidth(options);
            },
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'PencilContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let PickColorFunctionality = {
        ContextMenu: {
            activate: function () {
            },
            deactivate: function () {
            },
            getOptions: function () {
            }
        },
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                data = null,
                r = 0,
                g = 0,
                b = 0,
                a = 0;
            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(this)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                data = context.getImageData(X - 0.5, Y - 0.5, X + 0.5, Y + 0.5).data;
                r = data[0];
                g = data[1];
                b = data[2];
                a = data[3];
                selectedPrimaryColor = context.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            });
        },
        stop: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId;

            $(canvasId).off(event);
        }
    };

    let PivotedLinePatternFunctionality = {
        start: function (options) {
            let event = options.event || CONSTANTS.Events.mousemove,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                width = null,
                last = null,
                LastPoint = {
                    get: function () {
                        return {
                            X: PivotedLinePattern.VARIABLES.LastPoint.X,
                            Y: PivotedLinePattern.VARIABLES.LastPoint.Y
                        };
                    },
                    set: function (x, y) {
                        PivotedLinePattern.VARIABLES.LastPoint.X = x;
                        PivotedLinePattern.VARIABLES.LastPoint.Y = y;
                    }
                },
                action = null;

            function drawLineSegmentFromLastPoint(options) {
                let
                    context = options.context,
                    last = options.last,
                    current = options.current,
                    width = options.width;

                context.beginPath();
                context.moveTo(last.X, last.Y);
                context.lineTo(current.X, current.Y);
                context.lineWidth = width;
                context.strokeStyle = selectedPrimaryColor;
                context.stroke();
            }

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(this)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                action = $('[name=tool-options]:checked').val();

                let drawLines = function () {
                    width = PivotedLinePattern.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X != -1) {
                        CANVASAPI.drawLineSegmentFromLastPoint({
                            context: context,
                            last: last,
                            current: {
                                X: X,
                                Y: Y
                            },
                            width: width
                        });
                    }
                    if (action === PivotedLinePattern.CONSTANTS.ACTIONS.Xextends) {
                        LastPoint.set(0, Y);
                    }
                    if (action === PivotedLinePattern.CONSTANTS.ACTIONS.Ydrops) {
                        LastPoint.set(X, 0);
                    }
                    if (action === PivotedLinePattern.CONSTANTS.ACTIONS.godRays) {
                        LastPoint.set(0, 0);
                    }
                };

                if (e.buttons !== undefined) {
                    if (e.buttons === 1) {
                        drawLines();
                    } else {
                        LastPoint.set(-1, -1);
                        if (action === PivotedLinePattern.CONSTANTS.ACTIONS.pivots) {
                            LastPoint.set(X, Y);
                        }
                    }
                }

            });
        },
        stop: function (options) {
            let
                event = options.event || CONSTANTS.Events.mousemove,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                let createToolOptions = function () {
                    let createBasicOption = function (id, name, value) {
                        return COMMON.genericLabel().append(value).append(' <input id="' + id + '" name="' + name + '" type="radio" value="' + value + '" /></label>');
                    };

                    container.append(createBasicOption("option_pivot", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.pivots));
                    container.append(createBasicOption("option_extends", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.Xextends));
                    container.append(createBasicOption("option_drops", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.Ydrops));
                    container.append(createBasicOption("option_god_rays", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.godRays));

                };

                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "widthPivotedLinePattern",
                        min: 1,
                        max: 200,
                        step: 1,
                        title: "width for pivoted line pattern tool."
                    });
                }

                function addSliderForLineWidth(options) {
                    let
                        slider = initialSlider()
                            .attr('value', PivotedLinePattern.VARIABLES.width)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                PivotedLinePattern.VARIABLES.width = $(this).val().toString();
                            })
                            .appendTo(container);

                    container.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForLineWidth(options);
                createToolOptions();
            },

            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'PivotedLinePatternContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let RectangleFunctionality = {
        start: function (options) {
            let
                event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                length = null,
                breadth = null,
                previewer = null,
                canvasOffsetLeft = $(canvasId).offset().left,
                canvasOffsetTop = $(canvasId).offset().top,
                canvasHeight = $(canvasId).height(),
                canvasWidth = $(canvasId).width(),
                previewOffsetLeft = null,
                previewOffsetTop = null,
                xyPlaneRotationAngle = null;

            function generatePreview(options) {
                let
                    div = $('<div></div>')
                        .attr('id', Rectangle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            let
                                mouseOptions = {
                                    event: eClick,
                                    relativeTo: $(canvasId)
                                },
                                X = Actions.Mouse.getX(mouseOptions),
                                Y = Actions.Mouse.getY(mouseOptions),
                                length = Rectangle.VARIABLES.length,
                                breadth = Rectangle.VARIABLES.breadth;
                            xyPlaneRotationAngle = (Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;
                            CANVASAPI.fillRotatedRectangle(X - length / 2, Y - breadth / 2, length, breadth, xyPlaneRotationAngle);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                                .css('left', ev.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                                .css('background-color', selectedPrimaryColor)
                                .css('border', 'thin dashed ' + selectedAlternativeColor)
                                .css('height', Rectangle.VARIABLES.breadth)
                                .css('width', Rectangle.VARIABLES.length);

                            previewOffsetLeft = $(this).offset().left + Rectangle.VARIABLES.length / 2;
                            previewOffsetTop = $(this).offset().top + Rectangle.VARIABLES.breadth / 2;
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || canvasOffsetLeft + canvasWidth < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || canvasOffsetTop + canvasHeight < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }

            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Rectangle.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                    .css('left', e.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                    .css('background-color', selectedPrimaryColor)
                    .css('height', Rectangle.VARIABLES.breadth)
                    .css('width', Rectangle.VARIABLES.length)
                    .css('transform', 'rotate(' + parseInt((Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI)) / 180 + 'rad)')
                    .show();
            });
        },
        stop: function (options) {
            let
                event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
            $('#' + Rectangle.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function initialSlider(id, title, max, min) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360, 0)
                        .attr('value', Rectangle.VARIABLES.xyPlaneRotationAngle)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val().toString() + ' deg');
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.xyPlaneRotationAngle = $(this).val().toString();
                        });
                }

                function addSliderForLength(options) {
                    let lengthSlider = initialSlider(options.lengthId, options.lengthTitle, 400, 10)
                        .attr('value', Rectangle.VARIABLES.length)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.length = $(this).val().toString();
                        })
                        .appendTo(container);

                    let breadthSlider = initialSlider(options.breadthId, options.breadthTitle, 400, 10)
                        .attr('value', Rectangle.VARIABLES.breadth)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.breadth = $(this).val().toString();
                        })
                        .appendTo(container);
                }

                addSliderForLength(options);
                container.append(getSliderForXYPlaneRotationAngle(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.lengthId).remove();
                    $('#' + options.breadthId).remove();
                    $('#xyPlaneRotationAngle').remove();
                }

                removeSliderForSide(options);
                $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
                $('#' + Rectangle.CONSTANTS.previewId).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'RectangleContextMenu',
                    lengthId: 'lengthRectangle',
                    breadthId: 'breadthRectangle',
                    lengthTitle: 'length for rectangle',
                    breadthTitle: 'breadth for rectangle',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    Ring = {
        ...Ring,
        start: function (options) {
            let event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                radius = null,
                innerRadius = null,
                outerRadius = null,
                previewer = null,
                canvasOffsetLeft = null,
                canvasOffsetTop = null,
                canvasHeight = $(canvasId).height(),
                canvasWidth = $(canvasId).width(),
                previewOffsetLeft = null,
                previewOffsetTop = null,
                outer = null;

            function generatePreview(options) {
                let outerDiv = $('<div></div>').attr('id', Ring.CONSTANTS.previewOuterId)
                    .css({
                        'position': 'fixed',
                        'z-index': '2',
                        'border-radius': '50%',
                        'height': Ring.VARIABLES.outerRadius * 2,
                        'width': Ring.VARIABLES.outerRadius * 2,
                        'backgruond-color': selectedPrimaryColor,
                    })
                    .appendTo('.utilities');
                let
                    div = $('<div></div>')
                        .attr('id', Ring.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%'
                        })
                        .appendTo(outerDiv)
                        .on('click', function (eClick) {
                            mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId)
                            };
                            X = Actions.Mouse.getX(mouseOptions);
                            Y = Actions.Mouse.getY(mouseOptions);
                            innerRadius = Ring.VARIABLES.innerRadius;
                            outerRadius = Ring.VARIABLES.outerRadius;
                            CANVASAPI.fillRing({
                                X: X,
                                Y: Y,
                                innerRadius: innerRadius,
                                outerRadius: outerRadius,
                                strokeColor: selectedPrimaryColor,
                                fillColor: selectedAlternativeColor
                            });
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - parseInt(Ring.VARIABLES.innerRadius.toString()) - parseInt(window.scrollY.toString()))
                                .css('left', ev.pageX - parseInt(Ring.VARIABLES.innerRadius.toString()) - parseInt(window.scrollX.toString()))
                                .css('background-color', selectedAlternativeColor)
                                .css('border', 'thin dashed ' + selectedPrimaryColor)
                                .css('height', Ring.VARIABLES.innerRadius * 2)
                                .css('width', Ring.VARIABLES.innerRadius * 2);

                            outer.css({
                                'position': 'fixed',
                                'top': ev.pageY - parseInt(Ring.VARIABLES.outerRadius.toString()) - parseInt(window.scrollY.toString()),
                                'left': ev.pageX - parseInt(Ring.VARIABLES.outerRadius.toString()) - parseInt(window.scrollX.toString()),
                                'z-index': '2',
                                'border-radius': '50%',
                                'height': Ring.VARIABLES.outerRadius * 2,
                                'width': Ring.VARIABLES.outerRadius * 2,
                                'background-color': selectedPrimaryColor,
                            });

                            previewOffsetLeft = $(this).offset().left + parseInt(Ring.VARIABLES.innerRadius.toString());
                            previewOffsetTop = $(this).offset().top + parseInt(Ring.VARIABLES.innerRadius.toString());
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth.toString()) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight.toString()) < previewOffsetTop) {
                                $(this).hide();
                                outer.hide();
                            }
                        });

            }

            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Ring.CONSTANTS.previewId);
                previewer.css('top', e.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollY))
                    .css('left', e.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollX))
                    .css('background-color', selectedAlternativeColor)
                    .css('height', Ring.VARIABLES.innerRadius * 2)
                    .css('width', Ring.VARIABLES.innerRadius * 2)
                    .show();
                outer = outer || $('#' + Ring.CONSTANTS.previewOuterId);
                outer.css({
                    'position': 'fixed',
                    'top': e.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollY),
                    'left': e.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollX),
                    'z-index': '2',
                    'border-radius': '50%',
                    'height': Ring.VARIABLES.outerRadius * 2,
                    'width': Ring.VARIABLES.outerRadius * 2,
                    'background-color': selectedPrimaryColor,
                }).show();
            });
        },
        stop: function (options) {
            let
                event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Ring.CONSTANTS.previewId).off('mousemove');
            $('#' + Ring.CONSTANTS.previewId).remove();
            $('#' + Ring.CONSTANTS.previewOuterId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: 1,
                        max: 200,
                        step: 1,
                        title: title
                    });
                }

                function addSliderForRadius(options) {
                    let div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                        innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                            .attr('value', Ring.VARIABLES.innerRadius)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Ring.VARIABLES.innerRadius = $(this).val().toString();
                            })
                            .appendTo(div),

                        outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                            .attr('value', Ring.VARIABLES.outerRadius)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Ring.VARIABLES.outerRadius = $(this).val().toString();
                            })
                            .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'RingContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let DiscFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                radius = null,
                previewer = null,
                canvasOffsetLeft = $(canvasId).offset().left,
                canvasOffsetTop = $(canvasId).offset().top,
                canvasHeight = $(canvasId).height(),
                canvasWidth = $(canvasId).width(),
                previewOffsetLeft = null,
                previewOffsetTop = null;

            function generatePreview(options) {
                let
                    div = $('<div></div>')
                        .attr('id', Disc.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%'
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId)
                            };
                            X = Actions.Mouse.getX(mouseOptions);
                            Y = Actions.Mouse.getY(mouseOptions);
                            radius = Disc.VARIABLES.radius;
                            CANVASAPI.fillCirc(X, Y, radius);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Disc.VARIABLES.radius - window.scrollY)
                                .css('left', ev.pageX - Disc.VARIABLES.radius - window.scrollX)
                                .css('background-color', selectedPrimaryColor)
                                .css('border', 'thin dashed ' + selectedAlternativeColor)
                                .css('height', Disc.VARIABLES.radius * 2)
                                .css('width', Disc.VARIABLES.radius * 2);

                            previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Disc.VARIABLES.radius);
                            previewOffsetTop = parseInt($(this).offset().top) + parseInt(Disc.VARIABLES.radius);
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }

            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Disc.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Disc.VARIABLES.radius - window.scrollY)
                    .css('left', e.pageX - Disc.VARIABLES.radius - window.scrollX)
                    .css('background-color', selectedPrimaryColor)
                    .css('height', Disc.VARIABLES.radius * 2)
                    .css('width', Disc.VARIABLES.radius * 2)
                    .show();
            });
        },
        stop: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId;

            $(canvasId).off(event);
            $('#' + Disc.CONSTANTS.previewId).off('mousemove');
            $('#' + Disc.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "radiusDisc",
                        min: 1,
                        max: 200,
                        step: 1,
                        title: "radius for disc tool."
                    });
                }

                function addSliderForRadius(options) {
                    let div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                        slider = initialSlider()
                            .attr('value', Disc.VARIABLES.radius)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Disc.VARIABLES.radius = $(this).val().toString();
                            })
                            .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'DiscContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let SquareFunctionality = {
        start: function (options) {
            let event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                side = null,
                xyPlaneRotationAngle = null,
                previewer = null,
                canvasOffsetLeft = $(canvasId).offset().left,
                canvasOffsetTop = $(canvasId).offset().top,
                canvasHeight = $(canvasId).height(),
                canvasWidth = $(canvasId).width(),
                previewOffsetLeft = null,
                previewOffsetTop = null;

            function generatePreview(options) {
                let div = $('<div></div>')
                    .attr('id', Square.CONSTANTS.previewId)
                    .css({
                        'position': 'fixed',
                        'z-index': '2',
                    })
                    .appendTo('.utilities')
                    .on('click', function (eClick) {
                        let mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId)
                            },
                            X = Actions.Mouse.getX(mouseOptions),
                            Y = Actions.Mouse.getY(mouseOptions),
                            side = Square.VARIABLES.side,
                            xyPlaneRotationAngle = (Square.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;

                        CANVASAPI.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
                    })
                    .on('mousemove', function (ev) {
                        $(this).css('top', parseInt(ev.pageY) - parseInt(Square.VARIABLES.side / 2) - parseInt(window.scrollY))
                            .css('left', parseInt(ev.pageX) - parseInt(parseInt(Square.VARIABLES.side / 2)) - parseInt(window.scrollX))
                            .css('background-color', selectedPrimaryColor)
                            .css('border', 'thin dashed ' + selectedAlternativeColor)
                            .css('height', Square.VARIABLES.side)
                            .css('width', Square.VARIABLES.side);

                        previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Square.VARIABLES.side / 2);
                        previewOffsetTop = parseInt($(this).offset().top) + parseInt(Square.VARIABLES.side / 2);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft + canvasWidth) < previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop + canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Square.CONSTANTS.previewId);
                previewer.css('top', e.pageY - parseInt(Square.VARIABLES.side / 2) - window.scrollY)
                    .css('left', e.pageX - parseInt(Square.VARIABLES.side / 2) - window.scrollX)
                    .css('background-color', selectedPrimaryColor)
                    .css('height', Square.VARIABLES.side)
                    .css('width', Square.VARIABLES.side)
                    .css('transform', 'rotate(' + parseInt((Square.VARIABLES.xyPlaneRotationAngle * Math.PI)) / 180 + 'rad)')
                    .show();
            });
        },
        stop: function (options) {
            let
                event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title, max, min) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function getContextMenuContainer(options) {
                    let container = $('#' + options.id);
                    if (container.length === 0)
                        return $('<div></div>').attr('id', options.id).addClass('menu-item');
                    else
                        return container;
                }

                function getSliderForSide(options) {
                    return initialSlider('sideSquare', 'side length for square tool', 200, 10)
                        .attr('value', Square.VARIABLES.side)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Square.VARIABLES.side = $(this).val().toString();
                        });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360, 0)
                        .attr('value', Square.VARIABLES.xyPlaneRotationAngle)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val().toString() + ' deg');
                        })
                        .on('input', function () {
                            Square.VARIABLES.xyPlaneRotationAngle = $(this).val().toString();
                        });
                }

                let contextMenuContainer = getContextMenuContainer(options);
                getSliderForSide(options).appendTo(contextMenuContainer);
                getSliderForXYPlaneRotationAngle(options).appendTo(contextMenuContainer);
                contextMenuContainer.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForSide(options);
                $('#' + Square.CONSTANTS.previewId).off('mousemove');
                $('#' + Square.CONSTANTS.previewId).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'SquareToolContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let CircleFunctionality = {
        start: function (options) {
            let event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                innerRadius = null,
                outerRadius = null,
                previewer = null,
                canvasOffsetLeft = null,
                canvasOffsetTop = null,
                canvasHeight = $(canvasId).height(),
                canvasWidth = $(canvasId).width(),
                previewOffsetLeft = null,
                previewOffsetTop = null;

            function generatePreview(options) {
                let div = $('<div></div>')
                    .attr('id', Circle.CONSTANTS.previewId)
                    .css({
                        'position': 'fixed',
                        'z-index': '2',
                        'border-radius': '50%'
                    })
                    .appendTo('.utilities')
                    .on('click', function (eClick) {
                        mouseOptions = {
                            event: eClick,
                            relativeTo: $(canvasId)
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        innerRadius = Circle.VARIABLES.innerRadius;
                        outerRadius = parseInt(Circle.VARIABLES.innerRadius) + 1;
                        CANVASAPI.drawCircle({
                            X: X,
                            Y: Y,
                            innerRadius: innerRadius,
                            outerRadius: outerRadius,
                            strokeColor: selectedPrimaryColor
                        });
                    })
                    .on('mousemove', function (ev) {
                        $(this).css('top', ev.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                            .css('left', ev.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                            .css('border', 'thin solid ' + selectedPrimaryColor)
                            .css('height', Circle.VARIABLES.innerRadius * 2)
                            .css('width', Circle.VARIABLES.innerRadius * 2);

                        previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Circle.VARIABLES.innerRadius);
                        previewOffsetTop = parseInt($(this).offset().top) + parseInt(Circle.VARIABLES.innerRadius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Circle.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                    .css('left', e.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                    .css('border', 'thin solid ' + selectedPrimaryColor)
                    .css('height', Circle.VARIABLES.innerRadius * 2)
                    .css('width', Circle.VARIABLES.innerRadius * 2)
                    .show();
            });
        },
        stop: function (options) {
            let event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Circle.CONSTANTS.previewId).off('mousemove');
            $('#' + Circle.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: 1,
                        max: 200,
                        step: 1,
                        title: title
                    });
                }

                function addSliderForRadius(options) {
                    let div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                        radiusSlider = initialSlider("radiusCircle", "innerRadius for circle tool.")
                            .attr('value', Circle.VARIABLES.innerRadius)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Circle.VARIABLES.innerRadius = $(this).val().toString();
                            });
                    radiusSlider.appendTo(div);
                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $('#' + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'CircleContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        }
    };

    let PointWalkerFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                i = 0;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                for (i = 0; i < PointWalker.VARIABLES.steps; i++) {
                    CANVASAPI.fillCirc(X, Y, 1);
                    X += Math.random() < 0.5 ? -1 : 1;
                    Y -= Math.random() < 0.5 ? -1 : 1;
                }
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        let slider = getInputElement('pointWalkerSptes', '500', options.maxStepsAllowed, 'Steps for random point walk generation.')
                            .attr('value', PointWalker.VARIABLES.steps)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                PointWalker.VARIABLES.steps = $(this).val().toString();
                            });
                        return slider;
                    }

                    return COMMON.genericLabel().append(options.stepLabel).append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                $('#' + options.id).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'PointWalkerContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    maxStepsAllowed: 100000,
                    stepLabel: 'Steps: ',
                };
            }
        }
    };

    let FamilyPointWalkerFunctionality = {
        start: function (options) {
            let
                event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                i = 0,
                oldXY = [],
                origin = {},
                steps,
                fillColor;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X: X,
                    Y: Y,
                    steps: FamilyPointWalker.VARIABLES.steps,
                    fillColor: selectedPrimaryColor
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X: X,
                            Y: Y
                        };

                        context.fillStyle = fillColor;
                        CANVASAPI.fillCirc(X, Y, 1);
                        X += Math.random() < 0.5 ? -1 : 1;
                        Y -= Math.random() < 0.5 ? -1 : 1;
                    }
                    setTimeout(function () {
                        dance(origin);
                    }, 1000);
                }

                setTimeout(function () {
                    dance(origin);
                }, 1000);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        let
                            slider = getInputElement('familyPointWalkerSptes', FamilyPointWalker.VARIABLES.steps, options.maxStepsAllowed, 'Steps for family random point walk generation.')
                                .attr('value', FamilyPointWalker.VARIABLES.steps)
                                .on('mouseover', function () {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function () {
                                    FamilyPointWalker.VARIABLES.steps = $(this).val().toString();
                                });
                        return slider;
                    }

                    return COMMON.genericLabel().append(options.stepLabel).append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                $('#' + options.id).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'FamilyPointWalkerContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    maxStepsAllowed: 100000,
                    stepLabel: 'Steps: ',
                };
            }
        }
    };

    let OrganismPointWalkerFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                i = 0,
                oldXY = [],
                origin = {},
                steps,
                fillColor;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X: X,
                    Y: Y,
                    steps: OrganismPointWalker.VARIABLES.steps,
                    fillColor: selectedPrimaryColor
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X: X,
                            Y: Y
                        };

                        context.fillStyle = fillColor;
                        CANVASAPI.fillCirc(X, Y, 1);
                        X += Math.random() < 0.5 ? -1 : 1;
                        Y -= Math.random() < 0.5 ? -1 : 1;
                    }
                    origin.X = X;
                    origin.Y = Y;
                    setTimeout(function () {
                        dance(origin);
                    }, 1000);
                }

                setTimeout(function () {
                    dance(origin);
                }, 1000);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                let container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        let slider = getInputElement('organismPointWalkerSptes', OrganismPointWalker.VARIABLES.steps, options.maxStepsAllowed, 'Steps for organism random point walk generation.')
                            .attr('value', OrganismPointWalker.VARIABLES.steps)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                OrganismPointWalker.VARIABLES.steps = $(this).val().toString();
                            });
                        return slider;
                    }

                    return COMMON.genericLabel().append(options.stepLabel).append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                $('#' + options.id).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'OrganismPointWalkerContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    maxStepsAllowed: 10000,
                    stepLabel: 'Steps: ',
                };
            }
        }
    };

    let UniCellularParasiteToolFunctionality = {
        start: function (options) {
            let event = options.event,
                canvasId = '#' + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                i = 0,
                origin = {},
                steps,
                fillColor;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId)
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X: X,
                    Y: Y,
                    steps: UniCellularParasiteTool.VARIABLES.steps,
                    fillColor: selectedPrimaryColor,
                    i: 0
                };

                function act(origin) {
                    X = Math.floor(origin.X);
                    Y = Math.floor(origin.Y);
                    steps = origin.steps;
                    fillColor = context.fillStyle;

                    context.fillStyle = origin.fillColor;
                    CANVASAPI.fillCirc(X, Y, 1);
                    context.fillStyle = fillColor;
                    X += Math.random() < 0.5 ? -1 : 1;
                    Y += Math.random() < 0.5 ? -1 : 1;

                    origin.X = X;
                    origin.Y = Y;
                    setTimeout(function () {
                        act(origin);
                    }, UniCellularParasiteTool.VARIABLES.durationBetweenParasiticActsInMiliSeconds);
                }

                act(origin);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
            },
            deactivate: function (options) {
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'UniCellularParasiteToolContextMenu'
                };
            }
        }
    };

    /* Assigning functionality to tools */
    Object.assign(MandelbrotFractal, MandelbrotFractalFunctionality);
    Object.assign(Pencil, PencilFunctionality);
    Object.assign(PickColor, PickColorFunctionality);
    Object.assign(PivotedLinePattern, PivotedLinePatternFunctionality);
    Object.assign(Rectangle, RectangleFunctionality);
    // Object.assign(Ring, {...RingFunctionality});
    Object.assign(Disc, DiscFunctionality);
    Object.assign(Square, SquareFunctionality);
    Object.assign(Circle, CircleFunctionality);
    Object.assign(PointWalker, PointWalkerFunctionality);
    Object.assign(FamilyPointWalker, FamilyPointWalkerFunctionality);
    Object.assign(OrganismPointWalker, OrganismPointWalkerFunctionality);
    Object.assign(UniCellularParasiteTool, UniCellularParasiteToolFunctionality);
    /* Assignment of functionality to tools ends here */

    /* Actions */
    function onSaturateRedColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    }

    function onSaturateGreenColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 1; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    }

    function onSaturateBlueColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 2; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    }

    function onInvertColorsToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255 - image.data[i];
            image.data[i + 1] = 255 - image.data[i + 1];
            image.data[i + 2] = 255 - image.data[i + 2];
        }
        context.putImageData(image, 0, 0);
    }

    function onDesaturateRedColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    }

    function onDesaturateGreenColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 1; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    }

    function onDesaturateBlueColorToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 2; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    }

    function onAddGrayToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] += 112;
            image.data[i + 1] += 112;
            image.data[i + 2] += 112;
        }
        context.putImageData(image, 0, 0);
    }

    function onRemoveGrayToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] -= 112;
            image.data[i + 1] -= 112;
            image.data[i + 2] -= 112;
        }
        context.putImageData(image, 0, 0);
    }

    function onAddNoiseToolClick() {
        let canvasId = '#' + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] += Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;
            image.data[i + 1] += Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;
            image.data[i + 2] += Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;
        }
        context.putImageData(image, 0, 0);
    }

    function onRandomColorToolClick() {
        let canvas = getCanvasDetails(),
            image = canvas.image,
            sampleX = Math.floor(Math.random() * canvas.width),
            sampleY = Math.floor(Math.random() * canvas.height),
            sampleRed = image.data[sampleX * canvas.width + sampleY],
            sampleGreen = image.data[sampleX * canvas.width + sampleY + 1],
            sampleBlue = image.data[sampleX * canvas.width + sampleY + 2],
            red = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255,
            green = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255,
            blue = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;

        saveCanvasState(canvas);
        for (let i = 0; i < image.data.length; i += 4) {
            if (image.data[i] === sampleRed && image.data[i + 1] === sampleGreen && image.data[i + 2] === sampleBlue) {
                image.data[i] += red;
                image.data[i + 1] += green;
                image.data[i + 2] += blue;
            }
        }
        context.putImageData(image, 0, 0);
    }

    function onFuzzyColorToolClick() {
        let canvas = getCanvasDetails();

        saveCanvasState(canvas);
        for (let i = 0; i < 255; i++) {
            $('#RandomColorTool').click();
        }
    }

    function onBlackAndWhiteColorToolClick() {
        let canvas = getCanvasDetails(),
            image = canvas.image,
            average = 0,
            newValue = 0;

        saveCanvasState(canvas);

        for (let i = 0; i < image.data.length; i += 4) {
            average = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
            if (average < 112) {
                newValue = 0;
            } else {
                newValue = 255;
            }
            image.data[i] = newValue;
            image.data[i + 1] = newValue;
            image.data[i + 2] = newValue;
        }
        context.putImageData(image, 0, 0);
    }

    function onGrayColorToolClick() {
        let canvas = getCanvasDetails(),
            image = canvas.image,
            average = 0,
            newValue = 0;

        saveCanvasState(canvas);
        for (let i = 0; i < image.data.length; i += 4) {
            average = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
            newValue = Math.floor(average / 16) * 16;
            image.data[i + 2] = image.data[i + 1] = image.data[i] = newValue;
        }
        context.putImageData(image, 0, 0);
    }

    function onRandomDisksColorToolClick() {
        let canvas = getCanvasDetails(),
            savedStrokeStyle = canvas.strokeStyle;
        saveCanvasState(canvas);

        function discDrawOperation(x, y, indexI, indexJ) {
            let radius = Math.floor(Math.random() * 10);
            context.fillStyle = "#" + CONSTANTS.basicColors[Math.floor(Math.random() * 16)].hex;
            CANVASAPI.fillCirc(x, y, radius);
        }

        randomLoop(canvas.width, canvas.height, discDrawOperation);
        context.strokeStyle = savedStrokeStyle;
    }

    function onRandomCirclesColorToolClick() {
        let canvas = getCanvasDetails(),
            savedStrokeStyle = canvas.strokeStyle;

        saveCanvasState(canvas);

        function circleDrawOperation(x, y, indexI, indexJ) {
            let innerRadius = Math.floor(Math.random() * 10),
                strokeStyle = "#" + CONSTANTS.basicColors[Math.floor(Math.random() * 16)].hex;

            CANVASAPI.drawCircle({
                X: x,
                Y: y,
                innerRadius: innerRadius,
                outerRadius: innerRadius + 1,
                strokeColor: strokeStyle
            });
        }

        randomLoop(canvas.width, canvas.height, circleDrawOperation);
        context.strokeStyle = savedStrokeStyle;
    }

    /* Actions ends here */

    /* Setting things up */
    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: '#' + CONSTANTS.canvasId,
        start: MandelbrotFractal.start,
        stop: MandelbrotFractal.stop,
        toolName: 'Mandelbrot fractal'
    });
    COMMON.registerEventForTool({
        toolId: Pencil.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: Pencil.start,
        stop: Pencil.stop,
        toolName: 'Pencil',
        contextMenu: Pencil.ContextMenu,
        constantTitle: Pencil.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: PickColor.CONSTANTS.selectionId,
        containerId: PickColor.CONSTANTS.containerId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: PickColor.start,
        stop: PickColor.stop,
        toolName: 'Color picker',
        contextMenu: PickColor.ContextMenu,
        constantTitle: PickColor.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: PivotedLinePattern.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: PivotedLinePattern.start,
        stop: PivotedLinePattern.stop,
        toolName: 'Pivoted Line Pattern',
        contextMenu: PivotedLinePattern.ContextMenu,
        constantTitle: PivotedLinePattern.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: Rectangle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Rectangle.start,
        stop: Rectangle.stop,
        toolName: 'Rectangle',
        contextMenu: Rectangle.ContextMenu,
        constantTitle: Rectangle.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: Ring.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Ring.start,
        stop: Ring.stop,
        toolName: 'Ring',
        contextMenu: Ring.ContextMenu,
        constantTitle: Ring.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: Disc.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Disc.start,
        stop: Disc.stop,
        toolName: 'Disc',
        contextMenu: Disc.ContextMenu,
        constantTitle: Disc.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: Square.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Square.start,
        stop: Square.stop,
        toolName: 'Square',
        contextMenu: Square.ContextMenu,
        constantTitle: Square.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: Circle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Circle.start,
        stop: Circle.stop,
        toolName: 'Circle',
        contextMenu: Circle.ContextMenu,
        constantTitle: Circle.CONSTANTS.title

    });
    COMMON.registerEventForTool({
        toolId: PointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: PointWalker.start,
        stop: PointWalker.stop,
        toolName: 'Point Walker',
        contextMenu: PointWalker.ContextMenu,
        constantTitle: PointWalker.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: OrganismPointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: OrganismPointWalker.start,
        stop: OrganismPointWalker.stop,
        toolName: 'Organism Point Walker',
        contextMenu: OrganismPointWalker.ContextMenu,
        constantTitle: OrganismPointWalker.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: FamilyPointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: FamilyPointWalker.start,
        stop: FamilyPointWalker.stop,
        toolName: 'Family Point Walker',
        contextMenu: FamilyPointWalker.ContextMenu,
        constantTitle: FamilyPointWalker.CONSTANTS.title
    });
    COMMON.registerEventForTool({
        toolId: UniCellularParasiteTool.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: UniCellularParasiteTool.start,
        stop: UniCellularParasiteTool.stop,
        toolName: 'UniCellular Parasite Tool',
        contextMenu: UniCellularParasiteTool.ContextMenu,
        constantTitle: UniCellularParasiteTool.CONSTANTS.title
    });

    $('#image-button').on('change', onImageButtonChange);
    $('#SaturateRedColorTool').on('click', onSaturateRedColorToolClick);
    $('#SaturateGreenColorTool').on('click', onSaturateGreenColorToolClick);
    $('#SaturateBlueColorTool').on('click', onSaturateBlueColorToolClick);
    $('#InvertColorsTool').on('click', onInvertColorsToolClick);
    $('#DesaturateRedColorTool').on('click', onDesaturateRedColorToolClick);
    $('#DesaturateGreenColorTool').on('click', onDesaturateGreenColorToolClick);
    $('#DesaturateBlueColorTool').on('click', onDesaturateBlueColorToolClick);
    $('#AddGrayTool').on('click', onAddGrayToolClick);
    $('#RemoveGrayTool').on('click', onRemoveGrayToolClick);
    $('#AddNoiseTool').on('click', onAddNoiseToolClick);
    $('#RandomColorTool').on('click', onRandomColorToolClick);
    $('#FuzzyColorTool').on('click', onFuzzyColorToolClick);
    $('#BlackAndWhiteColorTool').on('click', onBlackAndWhiteColorToolClick);
    $('#GrayColorTool').on('click', onGrayColorToolClick);
    $('#RandomDisksColorTool').on('click', onRandomDisksColorToolClick);
    $('#RandomCirclesColorTool').on('click', onRandomCirclesColorToolClick);

});


(function ($) {
    "use strict";
    $(function () {
        let
            initializeCanvas = function (options) {
                let
                    canvas = $('<canvas/>', {
                        id: options.canvasId
                    })
                        .prop({
                            'width': options.width,
                            'height': options.height
                        })
                        .appendTo('#' + options.canvasContainerId);

                return canvas[0];
            },

            initializeContext = function (options) {
                let
                    sizeX = options.sizeX || 600,
                    sizeY = options.sizeY || 400;

                options.width = sizeX - 2;
                options.height = sizeY - 2;
                let canvas: HTMLCanvasElement = initializeCanvas(options) as HTMLCanvasElement;
                return canvas.getContext('2d');
            },

            generateHexColorStringFromThisElementsId = function (element) {
                return '#' + element.attr('id').split('#')[1];
            },


            registerColorEvents = function () {
                function updatePrimaryColor(selectedPrimaryColor) {
                    $('label#primary-color-name').css('color', selectedPrimaryColor).html(selectedPrimaryColor);
                }

                function updataAlternativeColorLabel(selectedAlternativeColor) {
                    $('label#alternative-color-name').css('color', selectedAlternativeColor).html(selectedAlternativeColor);
                }

                $('.color')
                    .attr('title', 'Left click for primary color, Right click for alternative color.')
                    .attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .on('click', function () {
                        selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
                        $('#SelectedPrimaryColor').css('background-color', selectedPrimaryColor);
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
            },

            registerAllColorsPickerEvents = function (options) {
                $('#' + options.toolId)
                    .on('input', function () {
                        selectedPrimaryColor = context.fillStyle = $(this).val().toString();
                    });
            },

            registerSaveImageEvents = function (options) {
                $('#' + options.toolId)
                    .on('click', function () {
                        window.open(($('#' + CONSTANTS.canvasId)[0] as HTMLCanvasElement).toDataURL("image/png"), "_blank");
                    });
            },

            registerResetCanvasEvents = function (options) {
                $('#' + options.toolId)
                    .on('click', function () {
                        let
                            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                            canvas = $(canvasId)[0] as HTMLCanvasElement,
                            canvasHeight = canvas.height,
                            canvasWidth = canvas.width,
                            context = canvas.getContext('2d');

                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        CanvasState = [];
                    });
            },

            registerUndoEvents = function (options) {
                $(options.toolSelection)
                    .on('click', function () {
                        let state = CanvasState.pop();
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
            },

            registerEvents = function () {
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
            },

            mustAssignDimensionsToCanvasContainer = function () {
                if (sizeX > 2500) {
                    sizeX = 2500;
                } else if (sizeX < 320) {
                    sizeX = 320;
                }
                if (sizeY > 2500) {
                    sizeY = 2500;
                } else if (sizeY < 320) {
                    sizeY = 320;
                }
                $('#jspaint-paint-area').css({
                    width: sizeX,
                    height: sizeY
                });
            },

            init = function () {
                mustAssignDimensionsToCanvasContainer();
                context = initializeContext({
                    sizeX: sizeX,
                    sizeY: sizeY,
                    canvasId: CONSTANTS.canvasId,
                    canvasContainerId: CONSTANTS.canvasContainerId
                });
                Color.generateBasicColorPalette({
                    appendHere: '.BasicColorPalette',
                    basicColors: CONSTANTS.basicColors
                });
                registerEvents();
                $('#PencilTool').trigger('click');
                $('[data-toggle="tooltip"]').tooltip();
                $('#SelectedPrimaryColor').css('background-color', selectedPrimaryColor);
                $('#SelectedAlternativeColor').css('background-color', selectedAlternativeColor);
            };
        init();
    });
})(jQuery);
