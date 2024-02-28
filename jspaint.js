window.JSPAINT = window.JSPAINT || {
    __DEBUGGING__: false,
    selectedAlternativeColor: "#FF0000",
    selectedPrimaryColor: "#000000",
};


function whenReady($) {
    $(() => {
        const DimensionOptionsButtons = $(".dimension-options button");
        const OrientationOptionsButtons = $(".orientation-options button");
        const dimensionEvents = function dimensionEvents() {
            DimensionOptionsButtons.on("click", function onClick() {
                DimensionOptionsButtons.removeClass("btn-success");
                $(this).addClass("btn-success");
            });
        };
        const orientationEvents = function orientationEvents() {
            OrientationOptionsButtons.on("click", function onClick() {
                OrientationOptionsButtons.removeClass("btn-success");
                $(this).addClass("btn-success");
            });
        };
        const setupEvents = function setupEvents() {
            dimensionEvents();
            orientationEvents();
        };
        const getWidth = function getWidth(dimensions) {
            return dimensions.localeCompare("Max") === 0 ? document.documentElement.clientWidth * 0.75 : dimensions.split("x")[0];
        };
        const getHeight = function getHeight(dimensions) {
            return dimensions.localeCompare("Max") === 0 ? document.documentElement.clientHeight - 4 : dimensions.split("x")[1];
        };
        const getQueryValue = function getQueryValue(orientation, width, height) {
            return orientation.localeCompare("landscape") === 0 ? `${width}x${height}` : `${height}x${width}`;
        };
        const conditionalURI = function conditionalURI(originalUri, queryPrefix, queryValue) {
            localStorage.setItem("dimensionsWxH", queryValue);
            return originalUri + queryPrefix + queryValue;
        };
        const newUri = function newUri(receiver) {
            const originalUri = receiver.attr("href");
            const queryPrefix = "?dimension=";
            const SelectedDimensionsButton = $(".dimension-options button.btn-success");
            const SelectedOrientationsButton = $(".orientation-options button.btn-success");
            const dimensions = SelectedDimensionsButton.attr("id");
            const width = getWidth(dimensions);
            const height = getHeight(dimensions);
            const orientation = SelectedOrientationsButton.attr("id");
            const queryValue = getQueryValue(orientation, width, height);

            return conditionalURI(originalUri, queryPrefix, queryValue);
        };
        const goToPaint = function goToPaint(uri) {
            window.location = uri;
        };
        const deferAction = function deferAction(e) {
            e.preventDefault();
        };
        const setup = function setup() {
            setupEvents();
            $("#jspaint-action").on("click", function onClick(e) {
                deferAction(e);
                goToPaint(newUri($(this)));
            });
        };
        const initOrientationAndDimension = function initOrientationAndDimension() {
            const defaultOrientationButton = $("#landscape");
            const defaultDimensionButton = $("#Max");

            defaultDimensionButton.trigger("click");
            defaultOrientationButton.trigger("click");
        };
        const init = function init() {
            initOrientationAndDimension();
        };
        const mustRunInSequence = function mustRunInSequence() {
            setup();
            init();
        };

        mustRunInSequence();
    });


    const CONSTANTS = {
        canvasId: "jspaint-canvas",
        canvasContainerId: "jspaint-paint-area",
        basicColors: [
            {
                hex: "00FFFF", name: "Aqua",
            },
            {
                hex: "000000", name: "Black",
            },
            {
                hex: "0000FF", name: "Blue",
            },
            {
                hex: "FF00FF", name: "Fuchsia",
            },
            {
                hex: "808080", name: "Gray",
            },
            {
                hex: "008000", name: "Green",
            },
            {
                hex: "00FF00", name: "Lime",
            },
            {
                hex: "800000", name: "Maroon",
            },
            {
                hex: "000080", name: "Navy",
            },
            {
                hex: "808000", name: "Olive",
            },
            {
                hex: "800080", name: "Purple",
            },
            {
                hex: "FF0000", name: "Red",
            },
            {
                hex: "C0C0C0", name: "Silver",
            },
            {
                hex: "008080", name: "Teal",
            },
            {
                hex: "FFFFFF", name: "White",
            },
            {
                hex: "FFFF00", name: "Yellow",
            },
        ],
        Events: {
            mousemove: "mousemove", mouseclick: "click",
        },
    };

    let sizeX = localStorage.getItem("dimensionsWxH").split("x")[0];
    let sizeY = localStorage.getItem("dimensionsWxH").split("x")[1];

    let context = null;
    let CanvasState = [];

    const Actions = {
        Mouse: {
            getX({ event, relativeTo }) {
                /**
                 * const {offset} = relativeTo; doesn't work because of `this`?
                 * const offset = relativeTo.offset.bind(relativeTo); works.
                 */
                const { pageX } = event;
                return pageX - relativeTo.offset().left;
            },
            getY({ event, relativeTo }) {
                const { pageY } = event;
                return pageY - relativeTo.offset().top;
            },
        },
    };

    const CANVAS_API = {
        fillCirc(x, y, radius, color) {
            if (color) {
                context.fillStyle = color;
            }
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
        },
        drawCircle(options) {
            context.save();
            context.beginPath();
            context.arc(options.X, options.Y, options.innerRadius, 0, 2 * Math.PI, false);
            context.lineWidth = options.outerRadius - options.innerRadius;
            context.strokeStyle = options.strokeColor;
            context.stroke();
            context.restore();
        },
        fillSquare(x, y, side) {
            context.fillRect(x, y, side, side);
        },
        fillRoatedSquare(x, y, side, xyPlaneRotationAngle) {
            context.save();
            context.translate(x + side / 2, y + side / 2);
            context.rotate(xyPlaneRotationAngle);
            context.translate(-1 * (x + side / 2), -1 * (y + side / 2));
            CANVAS_API.fillSquare(x, y, side);
            context.restore();
        },
        fillRotatedRectangle(x, y, length, breadth, xyPlaneRotationAngle) {
            context.save();
            context.translate(x + length / 2, y + breadth / 2);
            context.rotate(xyPlaneRotationAngle);
            context.translate(-1 * (x + length / 2), -1 * (y + breadth / 2));
            context.fillRect(x, y, length, breadth);
            context.restore();
        },
        fillRing(options) {
            CANVAS_API.fillCirc(options.X, options.Y, options.outerRadius);
            context.save();
            context.fillStyle = options.fillColor;
            CANVAS_API.fillCirc(options.X, options.Y, options.innerRadius);
            context.restore();
        },
        drawLineSegmentFromLastPoint({ context, last, current, width }) {
            context.beginPath();
            context.moveTo(last.X, last.Y);
            context.lineTo(current.X, current.Y);
            context.lineWidth = width;
            context.strokeStyle = window.JSPAINT.selectedPrimaryColor;
            context.stroke();

            CANVAS_API.fillCirc(current.X, current.Y, width / 2);
        },
    };

    function saveCanvasState(options) {
        const data = context.getImageData(options.startX, options.startY, options.width, options.height);
        CanvasState.push(data);
        /** Have to comment this out.
         * Uncaught DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'canvasState' exceeded the quota.
         * // localStorage.setItem("canvasState", JSON.stringify(data));
         */
    }

    window.JSPAINT.saveCanvasState = saveCanvasState;

    const Color = {
        generateBasicColorPalette(options) {
            const IContainBasicColors = options.appendHere || ".BasicColorPalette";
            const div1 = $("<div></div>");
            const div2 = $("<div></div>");
            let row = div1;
            let hex = null;
            let color = null;
            const colors = options.basicColors || CONSTANTS.basicColors;
            const len = colors.length;
            let i = 0;

            for (i = 0; i < len; i++) {
                row = i < len / 2 ? div1 : div2;
                hex = `#${colors[i].hex}`;
                color = $("<div></div>")
                    .addClass("color")
                    .attr("id", `Color-Hex-${hex}`)
                    .css("background-color", hex)
                    .appendTo(row);
            }
            div1.appendTo(IContainBasicColors);
            div2.appendTo(IContainBasicColors);
        },
        hexToRgb(hex) {
            let result = null;
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return result ? {
                r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16),
            } : null;
        },
        rgbToHex(r, g, b) {
            function componentToHex(c) {
                const hex = c.toString(16);
                return hex.length == 1 ? `0${hex}` : hex;
            }

            return (`#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`);
        },
    };

    window.JSPAINT.Color = Color;

    function setupToolTips(tool, title) {
        tool.attr("title", title)
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "bottom");
    }

    window.JSPAINT.setupToolTips = setupToolTips;

    function activateTool(options) {
        if (activeTool !== null) {
            activeTool.trigger("click");
        }
        activeTool = options.tool;
        $("label#activated-tool-name").html(options.toolName);
        options.start(options);
    }

    window.JSPAINT.activateTool = activateTool;

    function deactivateTool(options) {
        activeTool = null;
        $("label#activated-tool-name").html("no active tool");
        options.stop(options);
    }

    window.JSPAINT.deactivateTool = deactivateTool;

    activeTool = null;

    const { rgbToHex, hexToRgb: hex2RGB } = window.JSPAINT.Color;

    const COMMON = {
        generateSlider(options) {
            const { min } = options;
            const { max } = options;
            const { title } = options;
            const { id } = options;
            const { step } = options;

            return $(`<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" title="${title}" />`);
        },
        generateLabel(options) {
            const { hexColor } = options;
            const { fontSize } = options;

            return $(`<label style="color: #${hexColor}; font-size: ${fontSize};"></label>`);
        },
        genericLabel() {
            return COMMON.generateLabel({
                hexColor: "FFFFFF", fontSize: "10px",
            });
        },
        registerEventForTool(options) {
            const { toolId } = options;
            const tool = $(toolId);
            const { contextMenu } = options;
            const title = options.constantTitle;

            setupToolTips(tool, title);
            options.tool = tool;

            tool.funcToggle("click", () => {
                activateTool(options);
                contextMenu.activate(contextMenu.getOptions());
            }, () => {
                contextMenu.deactivate(contextMenu.getOptions());
                deactivateTool(options);
            });
        },
    };
    window.JSPAINT.COMMON = COMMON;

    $("#image-button").on("change", (e) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    const MandelbrotFractal = {
        CONSTANTS: {
            id: "MandelbrotFractalTool",
            selectionId: "#MandelbrotFractalTool",
            class: "main-tool",
            title: "Click to draw Mandelbrot Fractal. Click again to disable.",
            maxHeight: 3200,
            maxWidth: 3200,
        },
        VARIABLES: {
            iterations: 10000, xMax: 1, yMax: 1, xMin: -2, yMin: -1, height: -1, width: -1,
        },
        start({ event, canvasId }) {
            function drawMandelbrotFractal(options) {
                function mandelIter(cx, cy, maxIter) {
                    let x = 0.0;
                    let y = 0.0;
                    let xx = 0;
                    let yy = 0;
                    let xy = 0;
                    let i = maxIter;

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
                    const ctx = options.context;
                    const xmin = options.XMin;
                    const ymin = options.YMin;
                    const xmax = options.XMax;
                    const ymax = options.YMax;
                    const { iterations } = options;
                    const { width } = MandelbrotFractal.VARIABLES;
                    const { height } = MandelbrotFractal.VARIABLES;
                    const innerColor = hex2RGB(window.JSPAINT.selectedPrimaryColor);
                    const altColor = hex2RGB(window.JSPAINT.selectedAlternativeColor);
                    let ix;
                    let iy;
                    let x;
                    let y;
                    let i;
                    let c;
                    let ppos;

                    const img = ctx.getImageData(0, 0, width, height);
                    const pix = img.data;
                    for (ix = 0; ix < width; ++ix) {
                        for (iy = 0; iy < height; ++iy) {
                            x = xmin + ((xmax - xmin) * ix) / (width - 1);
                            y = ymin + ((ymax - ymin) * iy) / (height - 1);
                            i = mandelIter(x, y, iterations);
                            ppos = 4 * (width * iy + ix);

                            if (i > iterations) {
                                pix[ppos] = innerColor.r;
                                pix[ppos + 1] = innerColor.g;
                                pix[ppos + 2] = innerColor.b;
                            } else {
                                c = (3 * Math.log(i)) / Math.log(iterations - 1.0);

                                if (c < 1) {
                                    pix[ppos] = altColor.r * c;
                                    pix[ppos + 1] = altColor.g;
                                    pix[ppos + 2] = altColor.b;
                                } else if (c < 2) {
                                    pix[ppos] = altColor.r;
                                    pix[ppos + 1] = altColor.g * (c - 1);
                                    pix[ppos + 2] = altColor.b;
                                } else {
                                    pix[ppos] = altColor.r;
                                    pix[ppos + 1] = altColor.g;
                                    pix[ppos + 2] = altColor.b * (c - 2);
                                }
                            }
                            /* alpha channel */
                            pix[ppos + 3] = 255;
                        }
                    }
                    ctx.putImageData(img, options.startX, options.startY);
                }

                mandelbrot(options);
            }

            function getOverflowInXAxis(startX) {
                return (startX + Math.floor(MandelbrotFractal.VARIABLES.width) - MandelbrotFractal.CONSTANTS.maxWidth);
            }

            function getStartingXCoordinate(mouseOptions) {
                const X = Actions.Mouse.getX(mouseOptions);
                let startX = Math.max(X - Math.floor(MandelbrotFractal.VARIABLES.width / 2), 0);
                const overflowX = getOverflowInXAxis(startX);
                if (overflowX > 0) {
                    startX -= overflowX;
                }
                return startX;
            }

            function getOverflowInYAxis(startY) {
                return (startY + Math.floor(MandelbrotFractal.VARIABLES.height) - MandelbrotFractal.CONSTANTS.maxHeight);
            }

            function getStartingYCoordinate(mouseOptions) {
                const Y = Actions.Mouse.getY(mouseOptions);
                let startY = Math.max(Y - Math.floor(MandelbrotFractal.VARIABLES.height / 2), 0);
                const overflowY = getOverflowInYAxis(startY);

                if (overflowY > 0) {
                    startY -= overflowY;
                }
                return startY;
            }

            $(canvasId).on(event, (e) => {
                const mouseOptions = {
                    event: e, relativeTo: $(canvasId),
                };
                if (window.JSPAINT.__DEBUGGING__) {
                    console.log({
                        mouseOptions,
                    });
                }
                const startX = getStartingXCoordinate(mouseOptions);
                const startY = getStartingYCoordinate(mouseOptions);

                drawMandelbrotFractal({
                    context,
                    XMin: MandelbrotFractal.VARIABLES.xMin,
                    XMax: MandelbrotFractal.VARIABLES.xMax,
                    YMin: MandelbrotFractal.VARIABLES.yMin,
                    YMax: MandelbrotFractal.VARIABLES.yMax,
                    iterations: MandelbrotFractal.VARIABLES.iterations,
                    startX,
                    startY,
                });
            });
        },

        stop(options) {
            $(options.canvasId).off(options.event);
        },

        ContextMenu: {
            activate(options) {
                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function addIterationController(options) {
                    function createIterationSlider(options) {
                        const slider = getInputElement("mandelbrotIterations", "10", options.maxIterationsAllowed, "Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.")
                            .attr("value", MandelbrotFractal.VARIABLES.iterations)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                let val = $(this).val();
                                if (val > options.maxIterationsAllowed) {
                                    val = options.maxIterationsAllowed;
                                }
                                MandelbrotFractal.VARIABLES.iterations = val;
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.iterationLabel)
                        .append(createIterationSlider(options));

                    return sliderTool;
                }

                function addHeightController(options) {
                    function createHeightSlider(options) {
                        const slider = getInputElement("mandelbrotHeight", "100", MandelbrotFractal.CONSTANTS.maxHeight, "Height for mandelbrot fractal generation.")
                            .attr("value", MandelbrotFractal.CONSTANTS.maxHeight)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                let val = $(this).val();
                                if (val > MandelbrotFractal.CONSTANTS.maxHeight) {
                                    val = MandelbrotFractal.CONSTANTS.maxHeight;
                                }
                                MandelbrotFractal.VARIABLES.height = val;
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.heightLabel)
                        .append(createHeightSlider(options));

                    return sliderTool;
                }

                function addWidthController(options) {
                    function createWidthSlider(options) {
                        const slider = getInputElement("mandelbrotWidth", "100", MandelbrotFractal.CONSTANTS.maxWidth, "Width for mandelbrot fractal generation.")
                            .attr("value", MandelbrotFractal.CONSTANTS.maxWidth)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                let val = $(this).val();
                                if (val > MandelbrotFractal.CONSTANTS.maxWidth) {
                                    val = MandelbrotFractal.CONSTANTS.maxWidth;
                                }
                                MandelbrotFractal.VARIABLES.width = val;
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.widthLabel)
                        .append(createWidthSlider(options));

                    return sliderTool;
                }

                function addXMaxController(options) {
                    function createXMaxSlider(options) {
                        const slider = getInputElement("mandelbrotXMax", "0", "3", "XMax for mandelbrot fractal generation.")
                            .attr("value", "1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.xMax = $(this).val();
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.xMaxLabel)
                        .append(createXMaxSlider(options));

                    return sliderTool;
                }

                function addYMaxController(options) {
                    function createYMaxSlider(options) {
                        const slider = getInputElement("mandelbrotYMax", "0", "3", "YMax for mandelbrot fractal generation.")
                            .attr("value", "1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.yMax = $(this).val();
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.yMaxLabel)
                        .append(createYMaxSlider(options));

                    return sliderTool;
                }

                function addXMinController(options) {
                    function createXMinSlider(options) {
                        const slider = getInputElement("mandelbrotXMin", "-3", "1", "XMin for mandelbrot fractal generation.")
                            .attr("value", "-2")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.xMin = $(this).val();
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.xMinLabel)
                        .append(createXMinSlider(options));

                    return sliderTool;
                }

                function addYMinController(options) {
                    function createYMinSlider(options) {
                        const slider = getInputElement("mandelbrotYMin", "-2", "1", "YMin for mandelbrot fractal generation.")
                            .attr("value", "-1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.yMin = $(this).val();
                            });
                        return slider;
                    }

                    const sliderTool = COMMON.genericLabel()
                        .append(options.yMinLabel)
                        .append(createYMinSlider(options));

                    return sliderTool;
                }

                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");
                container.append(addIterationController(options));
                container.append(addHeightController(options));
                container.append(addWidthController(options));
                container.append(addXMaxController(options));
                container.append(addYMaxController(options));
                container.append(addXMinController(options));
                container.append(addYMinController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                function removeSliderForLineWidth(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions() {
                return {
                    tool: this,
                    id: "MandelbrotFractalContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
                    maxIterationsAllowed: 10000,
                    minIterationsAllowed: 10,
                    iterationLabel: "Iterations: ",
                    maxHeightAllowed: MandelbrotFractal.VARIABLES.maxHeight,
                    heightLabel: "Height: ",
                    maxWidthAllowed: MandelbrotFractal.VARIABLES.maxWidth,
                    widthLabel: "Width: ",
                    xMaxLabel: "XMax: ",
                    yMaxLabel: "YMax: ",
                    xMinLabel: "XMin: ",
                    yMinLabel: "YMin: ",
                };
            },
        },
        Events: {
            register(options) {
                const { toolId } = options;
                const tool = $(toolId);
                const contextMenu = MandelbrotFractal.ContextMenu;

                setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle("click", () => {
                    activateTool(options);
                    MandelbrotFractal.VARIABLES.height = MandelbrotFractal.CONSTANTS.maxHeight = $(options.canvasId)[0].height;
                    MandelbrotFractal.VARIABLES.width = MandelbrotFractal.CONSTANTS.maxWidth = $(options.canvasId)[0].width;
                    contextMenu.activate(contextMenu.getOptions());
                }, () => {
                    contextMenu.deactivate(contextMenu.getOptions());
                    deactivateTool(options);
                });
            },
        },
    };

    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: `#${CONSTANTS.canvasId}`,
        start: MandelbrotFractal.start,
        stop: MandelbrotFractal.stop,
        toolName: "Mandelbrot fractal",
    });

    const Pencil = {
        CONSTANTS: {
            id: "PencilTool",
            selectionId: "#PencilTool",
            class: "main-tool",
            title: "Click to draw free-hand lines. Click again to disable.",
        },
        VARIABLES: {
            width: 2,
            LastPoint: {
                X: -1, Y: -1,
            },
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let width = null;
            let last = null;
            const LastPoint = {
                get() {
                    return {
                        X: Pencil.VARIABLES.LastPoint.X, Y: Pencil.VARIABLES.LastPoint.Y,
                    };
                },
                set(x, y) {
                    Pencil.VARIABLES.LastPoint.X = x;
                    Pencil.VARIABLES.LastPoint.Y = y;
                },
            };

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e, relativeTo: $(this),
                };

                function drawLines() {
                    if (window.JSPAINT.__DEBUGGING__) {
                        console.log({
                            mouseOptions,
                        });
                    }
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    width = Pencil.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X !== -1) {
                        CANVAS_API.drawLineSegmentFromLastPoint({
                            context,
                            last,
                            current: {
                                X, Y,
                            },
                            width,
                        });
                    }
                    LastPoint.set(X, Y);
                }

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
        stop({ event, canvasId }) {
            if (window.JSPAINT.__DEBUGGING__) {
                console.log({
                    event, canvasId,
                });
            }
            event = event || CONSTANTS.Events.mousemove;
            canvasId = `#${canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate(options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "widthPencil", min: 1, max: 200, step: 1, title: "Width for pencil tool.",
                    });
                }

                function addSliderForLineWidth(options) {
                    const div = $("<div></div>")
                        .attr("id", options.id)
                        .addClass("menu-item");
                    const slider = initialSlider()
                        .attr("value", Pencil.VARIABLES.width)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Pencil.VARIABLES.width = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForLineWidth(options);
            },
            deactivate(options) {
                function removeSliderForLineWidth(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions() {
                return {
                    tool: this, id: "PencilContextMenu", containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: Pencil.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: Pencil.start,
        stop: Pencil.stop,
        toolName: "Pencil",
        contextMenu: Pencil.ContextMenu,
        constantTitle: Pencil.CONSTANTS.title,
    });

    const PivotedLinePattern = {
        CONSTANTS: {
            id: "PivotedLinePatternTool",
            selectionId: "#PivotedLinePatternTool",
            class: "main-tool",
            title: "Click to draw amazing pattern. Click again to disable.",
            ACTIONS: {
                pivots: "pivots", Ydrops: "drops", godRays: "god-rays", Xextends: "extends",
            },
        },
        VARIABLES: {
            width: 2,
            LastPoint: {
                X: -1, Y: -1,
            },
        },
        start(options) {
            const event = options.event || CONSTANTS.Events.mousemove;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let width = null;
            let last = null;
            const LastPoint = {
                get() {
                    return {
                        X: PivotedLinePattern.VARIABLES.LastPoint.X, Y: PivotedLinePattern.VARIABLES.LastPoint.Y,
                    };
                },
                set(x, y) {
                    PivotedLinePattern.VARIABLES.LastPoint.X = x;
                    PivotedLinePattern.VARIABLES.LastPoint.Y = y;
                },
            };
            let action = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e, relativeTo: $(this),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                action = $("[name=tool-options]:checked").val();

                function drawLines() {
                    width = PivotedLinePattern.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X !== -1) {
                        CANVAS_API.drawLineSegmentFromLastPoint({
                            context,
                            last,
                            current: {
                                X, Y,
                            },
                            width,
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
                }

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
        stop(options) {
            const event = options.event || CONSTANTS.Events.mousemove;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate(options) {
                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function createToolOptions() {
                    function createBasicOption(id, name, value) {
                        return COMMON.genericLabel()
                            .append(value)
                            .append(`<input id="${id}" name="${name}" type="radio" value="${value}" />`);
                    }

                    container.append(createBasicOption("option_pivot", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.pivots));
                    container.append(createBasicOption("option_extends", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.Xextends));
                    container.append(createBasicOption("option_drops", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.Ydrops));
                    container.append(createBasicOption("option_god_rays", "tool-options", PivotedLinePattern.CONSTANTS.ACTIONS.godRays));
                }

                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "widthPivotedLinePattern",
                        min: 1,
                        max: 200,
                        step: 1,
                        title: "width for pivoted line pattern tool.",
                    });
                }

                function addSliderForLineWidth(options) {
                    const slider = initialSlider()
                        .attr("value", PivotedLinePattern.VARIABLES.width)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            PivotedLinePattern.VARIABLES.width = $(this).val();
                        })
                        .appendTo(container);

                    container.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForLineWidth(options);
                createToolOptions();
            },

            deactivate(options) {
                function removeSliderForLineWidth(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions() {
                return {
                    tool: this,
                    id: "PivotedLinePatternContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: PivotedLinePattern.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: PivotedLinePattern.start,
        stop: PivotedLinePattern.stop,
        toolName: "Pivoted Line Pattern",
        contextMenu: PivotedLinePattern.ContextMenu,
        constantTitle: PivotedLinePattern.CONSTANTS.title,
    });

    var Rectangle = {
        CONSTANTS: {
            id: "RectangleTool",
            selectionId: "#RectangleTool",
            class: "main-tool",
            title: "Click to draw rectangles. Click again to disable.",
            previewId: "previewRectangle",
        },
        VARIABLES: {
            length: 20, breadth: 10, xyPlaneRotationAngle: 360,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            const mouseOptions = null;
            const X = null;
            const Y = null;
            const length = null;
            const breadth = null;
            let previewer = null;
            let canvasOffsetLeft = $(canvasId).offset().left;
            let canvasOffsetTop = $(canvasId).offset().top;
            const canvasHeight = $(canvasId).height();
            const canvasWidth = $(canvasId).width();
            let previewOffsetLeft = null;
            let previewOffsetTop = null;
            let xyPlaneRotationAngle = null;

            function generatePreview(options) {
                const div = $("<div></div>")
                    .attr("id", Rectangle.CONSTANTS.previewId)
                    .css({
                        position: "fixed", "z-index": "2",
                    })
                    .appendTo(".utilities")
                    .on("click", (eClick) => {
                        const mouseOptions = {
                            event: eClick, relativeTo: $(canvasId),
                        };
                        const X = Actions.Mouse.getX(mouseOptions);
                        const Y = Actions.Mouse.getY(mouseOptions);
                        const { length } = Rectangle.VARIABLES;
                        const { breadth } = Rectangle.VARIABLES;
                        xyPlaneRotationAngle = (Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;
                        CANVAS_API.fillRotatedRectangle(X - length / 2, Y - breadth / 2, length, breadth, xyPlaneRotationAngle);
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css("top", ev.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                            .css("left", ev.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                            .css("background-color", window.JSPAINT.selectedPrimaryColor)
                            .css("border", `thin dashed ${window.JSPAINT.selectedAlternativeColor}`)
                            .css("height", Rectangle.VARIABLES.breadth)
                            .css("width", Rectangle.VARIABLES.length);

                        previewOffsetLeft = $(this).offset().left + Rectangle.VARIABLES.length / 2;
                        previewOffsetTop = $(this).offset().top + Rectangle.VARIABLES.breadth / 2;
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || canvasOffsetLeft + canvasWidth < previewOffsetLeft || canvasOffsetTop > previewOffsetTop || canvasOffsetTop + canvasHeight < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", (e) => {
                previewer = previewer || $(`#${Rectangle.CONSTANTS.previewId}`);
                previewer
                    .css("top", e.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                    .css("left", e.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                    .css("background-color", window.JSPAINT.selectedPrimaryColor)
                    .css("height", Rectangle.VARIABLES.breadth)
                    .css("width", Rectangle.VARIABLES.length)
                    .css("transform", `rotate(${parseInt(Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180}rad)`)
                    .show();
            });
        },
        stop(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
            $(`#${Rectangle.CONSTANTS.previewId}`)
                .off("mousemove")
                .remove();
        },
        ContextMenu: {
            activate(options) {
                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function initialSlider(id, title, max, min) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider("xyPlaneRotationAngle", "rotation angle for XY plane rotation.", 360, 0)
                        .attr("value", Rectangle.VARIABLES.xyPlaneRotationAngle)
                        .on("mouseover", function () {
                            $(this).attr("title", `${$(this).val()} deg`);
                        })
                        .on("input", function () {
                            Rectangle.VARIABLES.xyPlaneRotationAngle = $(this).val();
                        });
                }

                function addSliderForLength(options) {
                    const lengthSlider = initialSlider(options.lengthId, options.lengthTitle, 400, 10)
                        .attr("value", Rectangle.VARIABLES.length)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Rectangle.VARIABLES.length = $(this).val();
                        })
                        .appendTo(container);

                    const breadthSlider = initialSlider(options.breadthId, options.breadthTitle, 400, 10)
                        .attr("value", Rectangle.VARIABLES.breadth)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Rectangle.VARIABLES.breadth = $(this).val();
                        })
                        .appendTo(container);
                }

                addSliderForLength(options);
                container.append(getSliderForXYPlaneRotationAngle(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                function removeSliderForSide(options) {
                    $(`#${options.lengthId}`).remove();
                    $(`#${options.breadthId}`).remove();
                    $("#xyPlaneRotationAngle").remove();
                }

                removeSliderForSide(options);
                $(`#${Rectangle.CONSTANTS.previewId}`)
                    .off("mousemove")
                    .remove();
            },
            getOptions() {
                return {
                    tool: this,
                    id: "RectangleContextMenu",
                    lengthId: "lengthRectangle",
                    breadthId: "breadthRectangle",
                    lengthTitle: "length for rectangle",
                    breadthTitle: "breadth for rectangle",
                    containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: Rectangle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Rectangle.start,
        stop: Rectangle.stop,
        toolName: "Rectangle",
        contextMenu: Rectangle.ContextMenu,
        constantTitle: Rectangle.CONSTANTS.title,
    });

    var Ring = {
        CONSTANTS: {
            id: "RingTool",
            selectionId: "#RingTool",
            class: "main-tool",
            title: "Click to draw ring. Click again to disable.",
            previewId: "previewRing",
            previewOuterId: "previewOuterRing",
        },
        VARIABLES: {
            innerRadius: 10, outerRadius: 20,
        },
        start(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            const radius = null;
            let innerRadius = null;
            let outerRadius = null;
            let previewer = null;
            let canvasOffsetLeft = null;
            let canvasOffsetTop = null;
            const canvasHeight = $(canvasId).height();
            const canvasWidth = $(canvasId).width();
            let previewOffsetLeft = null;
            let previewOffsetTop = null;
            let outer = null;

            function generatePreview(options) {
                const outerDiv = $("<div></div>")
                    .attr("id", Ring.CONSTANTS.previewOuterId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                        "border-radius": "50%",
                        height: Ring.VARIABLES.outerRadius * 2,
                        width: Ring.VARIABLES.outerRadius * 2,
                        "backgruond-color": window.JSPAINT.selectedPrimaryColor,
                    })
                    .appendTo(".utilities");
                const div = $("<div></div>")
                    .attr("id", Ring.CONSTANTS.previewId)
                    .css({
                        position: "fixed", "z-index": "2", "border-radius": "50%",
                    })
                    .appendTo(outerDiv)
                    .on("click", (eClick) => {
                        mouseOptions = {
                            event: eClick, relativeTo: $(canvasId),
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        innerRadius = Ring.VARIABLES.innerRadius;
                        outerRadius = Ring.VARIABLES.outerRadius;
                        CANVAS_API.fillRing({
                            X,
                            Y,
                            innerRadius,
                            outerRadius,
                            strokeColor: window.JSPAINT.selectedPrimaryColor,
                            fillColor: window.JSPAINT.selectedAlternativeColor,
                        });
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css("top", ev.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollY))
                            .css("left", ev.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollX))
                            .css("background-color", window.JSPAINT.selectedAlternativeColor)
                            .css("border", `thin dashed ${window.JSPAINT.selectedPrimaryColor}`)
                            .css("height", Ring.VARIABLES.innerRadius * 2)
                            .css("width", Ring.VARIABLES.innerRadius * 2);

                        outer.css({
                            position: "fixed",
                            top: ev.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollY),
                            left: ev.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollX),
                            "z-index": "2",
                            "border-radius": "50%",
                            height: Ring.VARIABLES.outerRadius * 2,
                            width: Ring.VARIABLES.outerRadius * 2,
                            "background-color": window.JSPAINT.selectedPrimaryColor,
                        });

                        previewOffsetLeft = $(this).offset().left + parseInt(Ring.VARIABLES.innerRadius);
                        previewOffsetTop = $(this).offset().top + parseInt(Ring.VARIABLES.innerRadius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft || canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                            outer.hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", (e) => {
                previewer = previewer || $(`#${Ring.CONSTANTS.previewId}`);
                previewer
                    .css("top", e.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollY))
                    .css("left", e.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollX))
                    .css("background-color", window.JSPAINT.selectedAlternativeColor)
                    .css("height", Ring.VARIABLES.innerRadius * 2)
                    .css("width", Ring.VARIABLES.innerRadius * 2)
                    .show();
                outer = outer || $(`#${Ring.CONSTANTS.previewOuterId}`);
                outer
                    .css({
                        position: "fixed",
                        top: e.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollY),
                        left: e.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollX),
                        "z-index": "2",
                        "border-radius": "50%",
                        height: Ring.VARIABLES.outerRadius * 2,
                        width: Ring.VARIABLES.outerRadius * 2,
                        "background-color": window.JSPAINT.selectedPrimaryColor,
                    })
                    .show();
            });
        },
        stop(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
            $(`#${Ring.CONSTANTS.previewId}`).off("mousemove");
            $(`#${Ring.CONSTANTS.previewId}`).remove();
            $(`#${Ring.CONSTANTS.previewOuterId}`).remove();
        },
        ContextMenu: {
            activate(options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id, min: 1, max: 200, step: 1, title,
                    });
                }

                function addSliderForRadius(options) {
                    const div = $("<div></div>")
                        .attr("id", options.id)
                        .addClass("menu-item");
                    const innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                        .attr("value", Ring.VARIABLES.innerRadius)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Ring.VARIABLES.innerRadius = $(this).val();
                        })
                        .appendTo(div);
                    const outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                        .attr("value", Ring.VARIABLES.outerRadius)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Ring.VARIABLES.outerRadius = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate(options) {
                function removeSliderForRadius(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions() {
                return {
                    tool: this, id: "RingContextMenu", containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };
    COMMON.registerEventForTool({
        toolId: Ring.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Ring.start,
        stop: Ring.stop,
        toolName: "Ring",
        contextMenu: Ring.ContextMenu,
        constantTitle: Ring.CONSTANTS.title,
    });

    var Disc = {
        CONSTANTS: {
            id: "DiscTool",
            selectionId: "#DiscTool",
            class: "main-tool",
            title: "Click to draw disc. Click again to disable.",
            previewId: "previewDisc",
        },
        VARIABLES: {
            radius: 10,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let radius = null;
            let previewer = null;
            let canvasOffsetLeft = $(canvasId).offset().left;
            let canvasOffsetTop = $(canvasId).offset().top;
            const canvasHeight = $(canvasId).height();
            const canvasWidth = $(canvasId).width();
            let previewOffsetLeft = null;
            let previewOffsetTop = null;

            function generatePreview(options) {
                const div = $("<div></div>")
                    .attr("id", Disc.CONSTANTS.previewId)
                    .css({
                        position: "fixed", "z-index": "2", "border-radius": "50%",
                    })
                    .appendTo(".utilities")
                    .on("click", (eClick) => {
                        mouseOptions = {
                            event: eClick, relativeTo: $(canvasId),
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        radius = Disc.VARIABLES.radius;
                        CANVAS_API.fillCirc(X, Y, radius);
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css("top", ev.pageY - Disc.VARIABLES.radius - window.scrollY)
                            .css("left", ev.pageX - Disc.VARIABLES.radius - window.scrollX)
                            .css("background-color", window.JSPAINT.selectedPrimaryColor)
                            .css("border", `thin dashed ${window.JSPAINT.selectedAlternativeColor}`)
                            .css("height", Disc.VARIABLES.radius * 2)
                            .css("width", Disc.VARIABLES.radius * 2);

                        previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Disc.VARIABLES.radius);
                        previewOffsetTop = parseInt($(this).offset().top) + parseInt(Disc.VARIABLES.radius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft || canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", (e) => {
                previewer = previewer || $(`#${Disc.CONSTANTS.previewId}`);
                previewer
                    .css("top", e.pageY - Disc.VARIABLES.radius - window.scrollY)
                    .css("left", e.pageX - Disc.VARIABLES.radius - window.scrollX)
                    .css("background-color", window.JSPAINT.selectedPrimaryColor)
                    .css("height", Disc.VARIABLES.radius * 2)
                    .css("width", Disc.VARIABLES.radius * 2)
                    .show();
            });
        },
        stop(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;

            $(canvasId).off(event);
            $(`#${Disc.CONSTANTS.previewId}`)
                .off("mousemove")
                .remove();
        },
        ContextMenu: {
            activate(options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "radiusDisc", min: 1, max: 200, step: 1, title: "radius for disc tool.",
                    });
                }

                function addSliderForRadius(options) {
                    const div = $("<div></div>")
                        .attr("id", options.id)
                        .addClass("menu-item");
                    const slider = initialSlider()
                        .attr("value", Disc.VARIABLES.radius)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Disc.VARIABLES.radius = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate(options) {
                function removeSliderForRadius(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions() {
                return {
                    tool: this, id: "DiscContextMenu", containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: Disc.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Disc.start,
        stop: Disc.stop,
        toolName: "Disc",
        contextMenu: Disc.ContextMenu,
        constantTitle: Disc.CONSTANTS.title,
    });

    var Square = {
        CONSTANTS: {
            id: "SquareTool",
            selectionId: "#SquareTool",
            class: "main-tool",
            title: "Click to draw squares. Click again to disable.",
            previewId: "previewSquare",
        },
        VARIABLES: {
            side: 10, xyPlaneRotationAngle: 360,
        },
        start(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;
            const mouseOptions = null;
            const X = null;
            const Y = null;
            const side = null;
            const xyPlaneRotationAngle = null;
            let previewer = null;
            let canvasOffsetLeft = $(canvasId).offset().left;
            let canvasOffsetTop = $(canvasId).offset().top;
            const canvasHeight = $(canvasId).height();
            const canvasWidth = $(canvasId).width();
            let previewOffsetLeft = null;
            let previewOffsetTop = null;

            function generatePreview(options) {
                const div = $("<div></div>")
                    .attr("id", Square.CONSTANTS.previewId)
                    .css({
                        position: "fixed", "z-index": "2",
                    })
                    .appendTo(".utilities")
                    .on("click", (eClick) => {
                        const mouseOptions = {
                            event: eClick, relativeTo: $(canvasId),
                        };
                        const X = Actions.Mouse.getX(mouseOptions);
                        const Y = Actions.Mouse.getY(mouseOptions);
                        const { side } = Square.VARIABLES;
                        const xyPlaneRotationAngle = (Square.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;

                        CANVAS_API.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css("top", parseInt(ev.pageY) - parseInt(Square.VARIABLES.side / 2) - parseInt(window.scrollY))
                            .css("left", parseInt(ev.pageX) - parseInt(parseInt(Square.VARIABLES.side / 2)) - parseInt(window.scrollX))
                            .css("background-color", window.JSPAINT.selectedPrimaryColor)
                            .css("border", `thin dashed ${window.JSPAINT.selectedAlternativeColor}`)
                            .css("height", Square.VARIABLES.side)
                            .css("width", Square.VARIABLES.side);

                        previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Square.VARIABLES.side / 2);
                        previewOffsetTop = parseInt($(this).offset().top) + parseInt(Square.VARIABLES.side / 2);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft + canvasWidth) < previewOffsetLeft || canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop + canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", (e) => {
                previewer = previewer || $(`#${Square.CONSTANTS.previewId}`);
                previewer
                    .css("top", e.pageY - parseInt(Square.VARIABLES.side / 2) - window.scrollY)
                    .css("left", e.pageX - parseInt(Square.VARIABLES.side / 2) - window.scrollX)
                    .css("background-color", window.JSPAINT.selectedPrimaryColor)
                    .css("height", Square.VARIABLES.side)
                    .css("width", Square.VARIABLES.side)
                    .css("transform", `rotate(${parseInt(Square.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180}rad)`)
                    .show();
            });
        },
        stop(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate(options) {
                function initialSlider(id, title, max, min) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function getContextMenuContainer(options) {
                    const container = $(`#${options.id}`);
                    if (container.length === 0) {
                        return $("<div></div>")
                            .attr("id", options.id)
                            .addClass("menu-item");
                    }
                    return container;
                }

                function getSliderForSide(options) {
                    return initialSlider("sideSquare", "side length for square tool", 200, 10)
                        .attr("value", Square.VARIABLES.side)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Square.VARIABLES.side = $(this).val();
                        });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider("xyPlaneRotationAngle", "rotation angle for XY plane rotation.", 360, 0)
                        .attr("value", Square.VARIABLES.xyPlaneRotationAngle)
                        .on("mouseover", function () {
                            $(this).attr("title", `${$(this).val()} deg`);
                        })
                        .on("input", function () {
                            Square.VARIABLES.xyPlaneRotationAngle = $(this).val();
                        });
                }

                const contextMenuContainer = getContextMenuContainer(options);
                getSliderForSide(options).appendTo(contextMenuContainer);
                getSliderForXYPlaneRotationAngle(options).appendTo(contextMenuContainer);
                contextMenuContainer.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                function removeSliderForSide(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForSide(options);
                $(`#${Square.CONSTANTS.previewId}`)
                    .off("mousemove")
                    .remove();
            },
            getOptions() {
                return {
                    tool: this, id: "SquareToolContextMenu", containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: Square.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Square.start,
        stop: Square.stop,
        toolName: "Square",
        contextMenu: Square.ContextMenu,
        constantTitle: Square.CONSTANTS.title,
    });

    var Circle = {
        CONSTANTS: {
            id: "CircleTool",
            selectionId: "#CircleTool",
            class: "main-tool",
            title: "Click to draw circle. Click again to disable.",
            previewId: "previewCircle",
        },
        VARIABLES: {
            innerRadius: 10,
        },
        start(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let innerRadius = null;
            let outerRadius = null;
            let previewer = null;
            let canvasOffsetLeft = null;
            let canvasOffsetTop = null;
            const canvasHeight = $(canvasId).height();
            const canvasWidth = $(canvasId).width();
            let previewOffsetLeft = null;
            let previewOffsetTop = null;

            function generatePreview(options) {
                const div = $("<div></div>")
                    .attr("id", Circle.CONSTANTS.previewId)
                    .css({
                        position: "fixed", "z-index": "2", "border-radius": "50%",
                    })
                    .appendTo(".utilities")
                    .on("click", (eClick) => {
                        mouseOptions = {
                            event: eClick, relativeTo: $(canvasId),
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        innerRadius = Circle.VARIABLES.innerRadius;
                        outerRadius = parseInt(Circle.VARIABLES.innerRadius) + 1;
                        CANVAS_API.drawCircle({
                            X, Y, innerRadius, outerRadius, strokeColor: window.JSPAINT.selectedPrimaryColor,
                        });
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css("top", ev.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                            .css("left", ev.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                            .css("border", `thin solid ${window.JSPAINT.selectedPrimaryColor}`)
                            .css("height", Circle.VARIABLES.innerRadius * 2)
                            .css("width", Circle.VARIABLES.innerRadius * 2);

                        previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Circle.VARIABLES.innerRadius);
                        previewOffsetTop = parseInt($(this).offset().top) + parseInt(Circle.VARIABLES.innerRadius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft || canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", (e) => {
                previewer = previewer || $(`#${Circle.CONSTANTS.previewId}`);
                previewer
                    .css("top", e.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                    .css("left", e.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                    .css("border", `thin solid ${window.JSPAINT.selectedPrimaryColor}`)
                    .css("height", Circle.VARIABLES.innerRadius * 2)
                    .css("width", Circle.VARIABLES.innerRadius * 2)
                    .show();
            });
        },
        stop(options) {
            const event = options.event || CONSTANTS.Events.mouseclick;
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;

            $(canvasId).off(event);
            $(`#${Circle.CONSTANTS.previewId}`).off("mousemove");
            $(`#${Circle.CONSTANTS.previewId}`).remove();
        },
        ContextMenu: {
            activate(options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id, min: 1, max: 200, step: 1, title,
                    });
                }

                function addSliderForRadius(options) {
                    const div = $("<div></div>")
                        .attr("id", options.id)
                        .addClass("menu-item");
                    const radiusSlider = initialSlider("radiusCircle", "innerRadius for circle tool.")
                        .attr("value", Circle.VARIABLES.innerRadius)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Circle.VARIABLES.innerRadius = $(this).val();
                        });
                    radiusSlider.appendTo(div);
                    div.appendTo($(options.containerSelectionCriterion));
                }

                addSliderForRadius(options);
            },
            deactivate(options) {
                function removeSliderForRadius(options) {
                    $(`#${options.id}`).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions() {
                return {
                    tool: this, id: "CircleContextMenu", containerSelectionCriterion: ".contextual-tool-bar",
                };
            },
        },
    };
    COMMON.registerEventForTool({
        toolId: Circle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Circle.start,
        stop: Circle.stop,
        toolName: "Circle",
        contextMenu: Circle.ContextMenu,
        constantTitle: Circle.CONSTANTS.title,
    });

    var PointWalker = {
        CONSTANTS: {
            id: "PointWalkerTool",
            selectionId: "#PointWalkerTool",
            class: "main-tool",
            title: "Click to draw random point walker. Click again to disable.",
        },
        VARIABLES: {
            steps: 100,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            const i = 0;

            $(canvasId).on(event, (e) => {
                mouseOptions = {
                    event: e, relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                const color = window.JSPAINT.selectedPrimaryColor;

                function addCircle(X, Y, api, i, max, color) {
                    api.fillCirc(X, Y, 1, color);
                    X += Math.random() < 0.5 ? -1 : 1;
                    Y -= Math.random() < 0.5 ? -1 : 1;
                    if (i < max) {
                        setTimeout(() => addCircle(X, Y, CANVAS_API, i + 1, max, color), 1);
                    }
                }

                addCircle(X, Y, CANVAS_API, 0, PointWalker.VARIABLES.steps, color);
            });
        },
        stop(options) {
            $(`#${options.canvasId}`).off(options.event);
        },
        ContextMenu: {
            activate(options) {
                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement("pointWalkerSptes", "500", options.maxStepsAllowed, "Steps for random point walk generation.")
                            .attr("value", PointWalker.VARIABLES.steps)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                PointWalker.VARIABLES.steps = $(this).val();
                            });
                        return slider;
                    }

                    return COMMON.genericLabel()
                        .append(options.stepLabel)
                        .append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                $(`#${options.id}`).remove();
            },
            getOptions() {
                return {
                    tool: this,
                    id: "PointWalkerContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
                    maxStepsAllowed: 100000,
                    stepLabel: "Steps: ",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: PointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: PointWalker.start,
        stop: PointWalker.stop,
        toolName: "Point Walker",
        contextMenu: PointWalker.ContextMenu,
        constantTitle: PointWalker.CONSTANTS.title,
    });

    var FamilyPointWalker = {
        CONSTANTS: {
            id: "FamilyPointWalkerTool",
            selectionId: "#FamilyPointWalkerTool",
            class: "main-tool",
            title: "Click to draw family random point walker. Click again to disable.",
        },
        VARIABLES: {
            steps: 100, durationBetweenDanceStepsInMiliSeconds: 100,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let i = 0;
            const oldXY = [];
            let origin = {
            };
            let steps;
            let fillColor;

            $(canvasId).on(event, (e) => {
                mouseOptions = {
                    event: e, relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X, Y, steps: FamilyPointWalker.VARIABLES.steps, fillColor: window.JSPAINT.selectedPrimaryColor,
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X, Y,
                        };

                        context.fillStyle = fillColor;
                        CANVAS_API.fillCirc(X, Y, 1);
                        X += Math.random() < 0.5 ? -1 : 1;
                        Y += Math.random() < 0.5 ? -1 : 1;
                    }
                    setTimeout(() => {
                        dance(origin);
                        const { r, g, b } = hex2RGB(origin.fillColor);
                        const hex = rgbToHex((r + 5 + Math.floor(10 * Math.random())) % 256, (g + 5 + Math.floor(10 * Math.random())) % 256, (b + 5 + Math.floor(10 * Math.random())) % 256);
                        origin.fillColor = hex;
                    }, 1000);
                }

                setTimeout(() => {
                    dance(origin);
                }, 1000);
            });
        },
        stop(options) {
            $(`#${options.canvasId}`).off(options.event);
        },
        ContextMenu: {
            activate(options) {
                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement("familyPointWalkerSptes", FamilyPointWalker.VARIABLES.steps, options.maxStepsAllowed, "Steps for family random point walk generation.")
                            .attr("value", FamilyPointWalker.VARIABLES.steps)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                FamilyPointWalker.VARIABLES.steps = $(this).val();
                            });
                        return slider;
                    }

                    return COMMON.genericLabel()
                        .append(options.stepLabel)
                        .append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                $(`#${options.id}`).remove();
            },
            getOptions() {
                return {
                    tool: this,
                    id: "FamilyPointWalkerContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
                    maxStepsAllowed: 100000,
                    stepLabel: "Steps: ",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: FamilyPointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: FamilyPointWalker.start,
        stop: FamilyPointWalker.stop,
        toolName: "Family Point Walker",
        contextMenu: FamilyPointWalker.ContextMenu,
        constantTitle: FamilyPointWalker.CONSTANTS.title,
    });

    var OrganismPointWalker = {
        CONSTANTS: {
            id: "OrganismPointWalkerTool",
            selectionId: "#OrganismPointWalkerTool",
            class: "main-tool",
            title: "Click to draw organism random point walker. Click again to disable.",
        },
        VARIABLES: {
            steps: 100, durationBetweenDanceStepsInMiliSeconds: 100,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let i = 0;
            const oldXY = [];
            let origin = {
            };
            let steps;
            let fillColor;

            $(canvasId).on(event, (e) => {
                mouseOptions = {
                    event: e, relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X, Y, steps: OrganismPointWalker.VARIABLES.steps, fillColor: window.JSPAINT.selectedPrimaryColor,
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X, Y,
                        };

                        context.fillStyle = fillColor;
                        CANVAS_API.fillCirc(X, Y, 1);
                        X += Math.random() < 0.5 ? -1 : 1;
                        Y += Math.random() < 0.5 ? -1 : 1;
                    }
                    origin.X = X;
                    origin.Y = Y;
                    setTimeout(() => {
                        dance(origin);
                    }, 1000);
                }

                setTimeout(() => {
                    dance(origin);
                }, 1000);
            });
        },
        stop(options) {
            $(`#${options.canvasId}`).off(options.event);
        },
        ContextMenu: {
            activate(options) {
                const container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id, min, max, step: 1, title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement("organismPointWalkerSptes", OrganismPointWalker.VARIABLES.steps, options.maxStepsAllowed, "Steps for organism random point walk generation.")
                            .attr("value", OrganismPointWalker.VARIABLES.steps)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                OrganismPointWalker.VARIABLES.steps = $(this).val();
                            });
                        return slider;
                    }

                    return COMMON.genericLabel()
                        .append(options.stepLabel)
                        .append(createStepSlider(options));
                }

                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate(options) {
                $(`#${options.id}`).remove();
            },
            getOptions() {
                return {
                    tool: this,
                    id: "OrganismPointWalkerContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
                    maxStepsAllowed: 10000,
                    stepLabel: "Steps: ",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: OrganismPointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: OrganismPointWalker.start,
        stop: OrganismPointWalker.stop,
        toolName: "Organism Point Walker",
        contextMenu: OrganismPointWalker.ContextMenu,
        constantTitle: OrganismPointWalker.CONSTANTS.title,
    });

    var UniCellularParasiteTool = {
        CONSTANTS: {
            id: "UniCellularParasiteTool",
            selectionId: "#UniCellularParasiteTool",
            class: "main-tool",
            title: "Click to create a parasite. Click again to disable.",
        },
        VARIABLES: {
            steps: 1, durationBetweenParasiticActsInMiliSeconds: 100, dieOutSteps: 10000,
        },
        start(options) {
            const { event } = options;
            const canvasId = `#${options.canvasId}`;
            let mouseOptions = null;
            let X = null;
            let Y = null;
            let tempFillColor;

            /**
             * Context for subsequent invocations
             * @type {{X: number, Y: number, steps: number, fillColor: string | CanvasGradient | CanvasPattern, i: number}}
             */
            let origin = {
            };
            $(canvasId).on(event, (e) => {
                mouseOptions = {
                    event: e, relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                const fillColor = window.JSPAINT.selectedPrimaryColor;
                const { steps } = UniCellularParasiteTool.VARIABLES;

                origin = {
                    X, Y, steps, fillColor, i: 0,
                };

                /**
                 *
                 * @param origin {{X: number, Y: number, steps: number, fillColor: string | CanvasGradient | CanvasPattern, i: number}}
                 */
                function act(origin) {
                    /**
                     * This stores the current fillStyle value in a temporary variable "tempFillColor"
                     * because otherwise this function works as a singleton and
                     * each parasite would respond to primary/draw color change.
                     * @type {string | CanvasGradient | CanvasPattern}
                     */
                    tempFillColor = context.fillStyle;
                    context.fillStyle = origin.fillColor;
                    X = Math.floor(origin.X);
                    Y = Math.floor(origin.Y);
                    CANVAS_API.fillCirc(X, Y, 1);
                    context.fillStyle = tempFillColor;

                    X += Math.random() < 0.5 ? -1 : 1;
                    Y += Math.random() < 0.5 ? -1 : 1;

                    /* update the context */
                    origin = {
                        ...origin, X, Y,
                    };
                    if (window.JSPAINT.__DEBUGGING__) {
                        console.log({
                            fn: "act", origin,
                        });
                    }

                    setTimeout(() => {
                        /* recursion */
                        act(origin);
                    }, UniCellularParasiteTool.VARIABLES.durationBetweenParasiticActsInMiliSeconds);
                }

                act(origin);
            });
        },
        stop(options) {
            $(`#${options.canvasId}`).off(options.event);
        },
        ContextMenu: {
            activate(options) {
            },
            deactivate(options) {
            },
            getOptions() {
                return {
                    tool: this, id: "UniCellularParasiteToolContextMenu",
                };
            },
        },
    };

    COMMON.registerEventForTool({
        toolId: UniCellularParasiteTool.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: UniCellularParasiteTool.start,
        stop: UniCellularParasiteTool.stop,
        toolName: "UniCellular Parasite Tool",
        contextMenu: UniCellularParasiteTool.ContextMenu,
        constantTitle: UniCellularParasiteTool.CONSTANTS.title,
    });

    $("#SaturateRedColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#SaturateGreenColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 1; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#SaturateBlueColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 2; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#InvertColorsTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255 - image.data[i];
            image.data[i + 1] = 255 - image.data[i + 1];
            image.data[i + 2] = 255 - image.data[i + 2];
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateRedColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateGreenColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 1; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateBlueColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 2; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#AddGrayTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] += 112;
            image.data[i + 1] += 112;
            image.data[i + 2] += 112;
        }
        context.putImageData(image, 0, 0);
    });

    $("#RemoveGrayTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            image.data[i] -= 112;
            image.data[i + 1] -= 112;
            image.data[i + 2] -= 112;
        }
        context.putImageData(image, 0, 0);
    });

    $("#AddNoiseTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            const random = Math.random();
            image.data[i] += random < 0.5 ? random * 255 * -1 : random * 255;
            image.data[i + 1] += random < 0.5 ? random * 255 * -1 : random * 255;
            image.data[i + 2] += random < 0.5 ? random * 255 * -1 : random * 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#RandomColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);
        const sampleX = Math.floor(Math.random() * width);
        const sampleY = Math.floor(Math.random() * height);
        const sampleRed = image.data[sampleX * width + sampleY];
        const sampleGreen = image.data[sampleX * width + sampleY + 1];
        const sampleBlue = image.data[sampleX * width + sampleY + 2];
        const red = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;
        const green = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;
        const blue = Math.random() < 0.5 ? Math.random() * 255 * -1 : Math.random() * 255;

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            if (image.data[i] === sampleRed && image.data[i + 1] === sampleGreen && image.data[i + 2] === sampleBlue) {
                image.data[i] += red;
                image.data[i + 1] += green;
                image.data[i + 2] += blue;
            }
        }
        context.putImageData(image, 0, 0);
    });

    $("#FuzzyColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < 255; i++) {
            $("#RandomColorTool").click();
        }
    });

    $("#BlackAndWhiteColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);
        let averageValue = 0;
        let newValue = 0;

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            averageValue = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
            if (averageValue < 112) {
                newValue = 0;
            } else {
                newValue = 255;
            }
            image.data[i] = newValue;
            image.data[i + 1] = newValue;
            image.data[i + 2] = newValue;
        }
        context.putImageData(image, 0, 0);
    });

    $("#GrayColorTool").on("click", () => {
        const canvasId = `#${CONSTANTS.canvasId}`;
        const height = $(canvasId).height();
        const width = $(canvasId).width();
        const image = context.getImageData(0, 0, width, height);
        let averageValue = 0;
        let newValue = 0;

        saveCanvasState({
            startX: 0, startY: 0, width, height,
        });

        for (let i = 0; i < image.data.length; i += 4) {
            averageValue = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
            newValue = Math.floor(averageValue / 16) * 16;
            image.data[i] = newValue;
            image.data[i + 1] = newValue;
            image.data[i + 2] = newValue;
        }
        context.putImageData(image, 0, 0);
    });

    const initializeCanvas = function (options) {
        const canvas = $("<canvas/>", {
            id: options.canvasId,
        })
            .prop({
                width: options.width, height: options.height,
            })
            .appendTo(`#${options.canvasContainerId}`);

        return canvas[0];
    };
    const initializeContext = function (options) {
        const sizeX = options.sizeX || 600;
        const sizeY = options.sizeY || 400;
        const width = sizeX - 2;
        const height = sizeY - 2;
        let canvas = null;

        options.width = width;
        options.height = height;
        canvas = initializeCanvas(options);
        return canvas.getContext("2d");
    };
    const generateHexColorStringFromThisElementsId = function (element) {
        return `#${element.attr("id").split("#")[1]}`;
    };
    const registerColorEvents = function () {
        function updatePrimaryColor(selectedPrimaryColor) {
            $("label#primary-color-name").html(selectedPrimaryColor);
        }

        function updataAlternativeColorLabel(selectedAlternativeColor) {
            $("label#alternative-color-name").html(window.JSPAINT.selectedAlternativeColor);
        }

        $(".color")
            .attr("title", "Left click for primary color, Right click for alternative color.")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "bottom")
            .on("click", function () {
                window.JSPAINT.selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
                $("#SelectedPrimaryColor").css("background-color", window.JSPAINT.selectedPrimaryColor);
                updatePrimaryColor(window.JSPAINT.selectedPrimaryColor);
            })
            .on("contextmenu", function (e) {
                e.preventDefault();
                window.JSPAINT.selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
                $("#SelectedAlternativeColor").css("background-color", window.JSPAINT.selectedAlternativeColor);
                updataAlternativeColorLabel(window.JSPAINT.selectedAlternativeColor);
            });
        updatePrimaryColor(window.JSPAINT.selectedPrimaryColor);
        updataAlternativeColorLabel(window.JSPAINT.selectedAlternativeColor);
    };
    const registerAllColorsPickerEvents = function (options) {
        $(`#${options.toolId}`).on("input", function () {
            window.JSPAINT.selectedPrimaryColor = context.fillStyle = $(this).val();
        });
    };
    const registerSaveImageEvents = function (options) {
        $(`#${options.toolId}`).on("click", () => {
            const canvasElement = $(`#${CONSTANTS.canvasId}`)[0];
            const base64ImageUrl = canvasElement.toDataURL();
            const newWindow = window.open("_blank");
            newWindow.document.write(`Right click and open in a new tab.<br/><iframe src='${base64ImageUrl}' style='border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;' allowfullscreen></iframe>`);
        });
    };
    const registerResetCanvasEvents = function (options) {
        $(`#${options.toolId}`).on("click", () => {
            const canvasId = `#${options.canvasId || CONSTANTS.canvasId}`;
            const canvas = $(canvasId)[0];
            const canvasHeight = canvas.height;
            const canvasWidth = canvas.width;
            const context = canvas.getContext("2d");

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            CanvasState = [];
        });
    };
    const registerUndoEvents = function (options) {
        $(options.toolSelection).on("click", () => {
            const state = CanvasState.pop();
            if (state !== undefined) {
                context.putImageData(state, 0, 0);
            }
        });
        $(options.canvasId).on("mousedown", function () {
            saveCanvasState({
                startX: 0, startY: 0, width: $(this).width(), height: $(this).height(),
            });
        });
    };
    const registerEvents = function () {
        registerColorEvents();
        registerAllColorsPickerEvents({
            toolId: "allColorsPicker", containerId: "HTML5ColorPicker",
        });
        registerSaveImageEvents({
            toolId: "save-as-image", containerId: "SaveImageButton",
        });
        registerResetCanvasEvents({
            toolId: "reset-canvas", containerId: "ResetCanvas",
        });
        registerUndoEvents({
            toolSelection: "#undo-button", canvasId: `#${CONSTANTS.canvasId}`,
        });
    };
    const mustAssignDimensionsToCanvasContainer = function () {
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
        $("#jspaint-paint-area").css({
            width: sizeX, height: sizeY,
        });
    };
    const init = function init() {
        mustAssignDimensionsToCanvasContainer();
        context = initializeContext({
            sizeX, sizeY, canvasId: CONSTANTS.canvasId, canvasContainerId: CONSTANTS.canvasContainerId,
        });
        window.JSPAINT.Color.generateBasicColorPalette({
            appendHere: ".BasicColorPalette", basicColors: CONSTANTS.basicColors,
        });
        registerEvents();
        $("#PencilTool").trigger("click");
        // $('[data-toggle="tooltip"]').tooltip();
        $("#SelectedPrimaryColor").css("background-color", window.JSPAINT.selectedPrimaryColor);
        $("#SelectedAlternativeColor").css("background-color", window.JSPAINT.selectedAlternativeColor);
    };
    init();
}

whenReady(jQuery);

