$(function () {
    const saveCanvasState = window.JSPAINT.saveCanvasState;
    const hex2RGB = window.JSPAINT.Color.hexToRgb;
    const { setupToolTips, activateTool, deactivateTool } = window.JSPAINT;

    const COMMON = {
        generateSlider: function (options) {
            var min = options.min,
                max = options.max,
                title = options.title,
                id = options.id,
                step = options.step;

            return $(
                '<input id="' +
                    id +
                    '" type="range" min="' +
                    min +
                    '" max="' +
                    max +
                    '" step="' +
                    step +
                    '" title="' +
                    title +
                    '" />',
            );
        },
        generateLabel: function (options) {
            var hexColor = options.hexColor,
                fontSize = options.fontSize;

            return $(
                '<label style="color: #' +
                    hexColor +
                    "; font-size: " +
                    fontSize +
                    ';"></label>',
            );
        },
        genericLabel: function () {
            return COMMON.generateLabel({
                hexColor: "FFFFFF",
                fontSize: "10px",
            });
        },
        registerEventForTool: function (options) {
            var toolId = options.toolId,
                tool = $(toolId),
                contextMenu = options.contextMenu,
                title = options.constantTitle;

            setupToolTips(tool, title);
            options.tool = tool;

            tool.funcToggle(
                "click",
                function () {
                    activateTool(options);
                    contextMenu.activate(contextMenu.getOptions());
                },
                function () {
                    contextMenu.deactivate(contextMenu.getOptions());
                    deactivateTool(options);
                },
            );
        },
    };
    window.JSPAINT.COMMON = COMMON;

    $("#image-button").on("change", function (e) {
        const reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
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
            iterations: 10000,
            xMax: 1,
            yMax: 1,
            xMin: -2,
            yMin: -1,
            height: -1,
            width: -1,
        },
        start: function ({ event, canvasId }) {
            function drawMandelbrotFractal(options) {
                function mandelIter(cx, cy, maxIter) {
                    var x = 0.0,
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
                        innerColor = hex2RGB(
                            window.JSPAINT.selectedPrimaryColor,
                        ),
                        ix,
                        iy,
                        x,
                        y,
                        i,
                        c,
                        ppos;

                    let img = ctx.getImageData(0, 0, width, height);
                    let pix = img.data;
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
                                c =
                                    (3 * Math.log(i)) /
                                    Math.log(iterations - 1.0);

                                if (c < 1) {
                                    pix[ppos] =
                                        hex2RGB(
                                            window.JSPAINT
                                                .selectedAlternativeColor,
                                        ).r * c;
                                    pix[ppos + 1] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).g;
                                    pix[ppos + 2] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).b;
                                } else if (c < 2) {
                                    pix[ppos] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).r;
                                    pix[ppos + 1] =
                                        hex2RGB(
                                            window.JSPAINT
                                                .selectedAlternativeColor,
                                        ).g *
                                        (c - 1);
                                    pix[ppos + 2] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).b;
                                } else {
                                    pix[ppos] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).r;
                                    pix[ppos + 1] = hex2RGB(
                                        window.JSPAINT.selectedAlternativeColor,
                                    ).g;
                                    pix[ppos + 2] =
                                        hex2RGB(
                                            window.JSPAINT
                                                .selectedAlternativeColor,
                                        ).b *
                                        (c - 2);
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
                return (
                    startX +
                    Math.floor(MandelbrotFractal.VARIABLES.width) -
                    MandelbrotFractal.CONSTANTS.maxWidth
                );
            }

            function getStartingXCoordinate(mouseOptions) {
                const X = Actions.Mouse.getX(mouseOptions);
                let startX = Math.max(
                    X - Math.floor(MandelbrotFractal.VARIABLES.width / 2),
                    0,
                );
                const overflowX = getOverflowInXAxis(startX);
                if (overflowX > 0) {
                    startX -= overflowX;
                }
                return startX;
            }

            function getOverflowInYAxis(startY) {
                return (
                    startY +
                    Math.floor(MandelbrotFractal.VARIABLES.height) -
                    MandelbrotFractal.CONSTANTS.maxHeight
                );
            }

            function getStartingYCoordinate(mouseOptions) {
                var Y = Actions.Mouse.getY(mouseOptions),
                    startY = Math.max(
                        Y - Math.floor(MandelbrotFractal.VARIABLES.height / 2),
                        0,
                    ),
                    overflowY = getOverflowInYAxis(startY);

                if (overflowY > 0) {
                    startY -= overflowY;
                }
                return startY;
            }

            $(canvasId).on(event, function (e) {
                const mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId),
                };
                if (window.JSPAINT.__DEBUGGING__) {
                    console.log({ mouseOptions });
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

        stop: function (options) {
            $(options.canvasId).off(options.event);
        },

        ContextMenu: {
            activate: function (options) {
                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title,
                    });
                }

                function addIterationController(options) {
                    function createIterationSlider(options) {
                        const slider = getInputElement(
                            "mandelbrotIterations",
                            "10",
                            options.maxIterationsAllowed,
                            "Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.",
                        )
                            .attr(
                                "value",
                                MandelbrotFractal.VARIABLES.iterations,
                            )
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
                        const slider = getInputElement(
                            "mandelbrotHeight",
                            "100",
                            MandelbrotFractal.CONSTANTS.maxHeight,
                            "Height for mandelbrot fractal generation.",
                        )
                            .attr(
                                "value",
                                MandelbrotFractal.CONSTANTS.maxHeight,
                            )
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                let val = $(this).val();
                                if (
                                    val > MandelbrotFractal.CONSTANTS.maxHeight
                                ) {
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
                        const slider = getInputElement(
                            "mandelbrotWidth",
                            "100",
                            MandelbrotFractal.CONSTANTS.maxWidth,
                            "Width for mandelbrot fractal generation.",
                        )
                            .attr("value", MandelbrotFractal.CONSTANTS.maxWidth)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                var val = $(this).val();
                                if (
                                    val > MandelbrotFractal.CONSTANTS.maxWidth
                                ) {
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
                        const slider = getInputElement(
                            "mandelbrotXMax",
                            "0",
                            "3",
                            "XMax for mandelbrot fractal generation.",
                        )
                            .attr("value", "1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.xMax =
                                    $(this).val();
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
                        const slider = getInputElement(
                            "mandelbrotYMax",
                            "0",
                            "3",
                            "YMax for mandelbrot fractal generation.",
                        )
                            .attr("value", "1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.yMax =
                                    $(this).val();
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
                        const slider = getInputElement(
                            "mandelbrotXMin",
                            "-3",
                            "1",
                            "XMin for mandelbrot fractal generation.",
                        )
                            .attr("value", "-2")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.xMin =
                                    $(this).val();
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
                        const slider = getInputElement(
                            "mandelbrotYMin",
                            "-2",
                            "1",
                            "YMin for mandelbrot fractal generation.",
                        )
                            .attr("value", "-1")
                            .attr("disabled", "disabled")
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                MandelbrotFractal.VARIABLES.yMin =
                                    $(this).val();
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
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
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
            register: function (options) {
                var toolId = options.toolId,
                    tool = $(toolId),
                    contextMenu = MandelbrotFractal.ContextMenu;

                setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle(
                    "click",
                    function () {
                        activateTool(options);
                        MandelbrotFractal.VARIABLES.height =
                            MandelbrotFractal.CONSTANTS.maxHeight = $(
                                options.canvasId,
                            )[0].height;
                        MandelbrotFractal.VARIABLES.width =
                            MandelbrotFractal.CONSTANTS.maxWidth = $(
                                options.canvasId,
                            )[0].width;
                        contextMenu.activate(contextMenu.getOptions());
                    },
                    function () {
                        contextMenu.deactivate(contextMenu.getOptions());
                        deactivateTool(options);
                    },
                );
            },
        },
    };

    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: "#" + CONSTANTS.canvasId,
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
                X: -1,
                Y: -1,
            },
        },
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                width = null,
                last = null,
                LastPoint = {
                    get: function () {
                        return {
                            X: Pencil.VARIABLES.LastPoint.X,
                            Y: Pencil.VARIABLES.LastPoint.Y,
                        };
                    },
                    set: function (x, y) {
                        Pencil.VARIABLES.LastPoint.X = x;
                        Pencil.VARIABLES.LastPoint.Y = y;
                    },
                };

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(this),
                };

                function drawLines() {
                    if (window.JSPAINT.__DEBUGGING__) {
                        console.log({ mouseOptions });
                    }
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    width = Pencil.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X !== -1) {
                        CANVASAPI.drawLineSegmentFromLastPoint({
                            context: context,
                            last: last,
                            current: {
                                X: X,
                                Y: Y,
                            },
                            width: width,
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
        stop: function ({ event, canvasId }) {
            if (window.JSPAINT.__DEBUGGING__) {
                console.log({ event, canvasId });
            }
            event = event || CONSTANTS.Events.mousemove;
            canvasId = "#" + (canvasId || CONSTANTS.canvasId);

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
                        title: "Width for pencil tool.",
                    });
                }

                function addSliderForLineWidth(options) {
                    var div = $("<div></div>")
                            .attr("id", options.id)
                            .addClass("menu-item"),
                        slider = initialSlider()
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
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: "PencilContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
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
                pivots: "pivots",
                Ydrops: "drops",
                godRays: "god-rays",
                Xextends: "extends",
            },
        },
        VARIABLES: {
            width: 2,
            LastPoint: {
                X: -1,
                Y: -1,
            },
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                width = null,
                last = null,
                LastPoint = {
                    get: function () {
                        return {
                            X: PivotedLinePattern.VARIABLES.LastPoint.X,
                            Y: PivotedLinePattern.VARIABLES.LastPoint.Y,
                        };
                    },
                    set: function (x, y) {
                        PivotedLinePattern.VARIABLES.LastPoint.X = x;
                        PivotedLinePattern.VARIABLES.LastPoint.Y = y;
                    },
                },
                action = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(this),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                action = $("[name=tool-options]:checked").val();

                function drawLines() {
                    width = PivotedLinePattern.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X !== -1) {
                        CANVASAPI.drawLineSegmentFromLastPoint({
                            context: context,
                            last: last,
                            current: {
                                X: X,
                                Y: Y,
                            },
                            width: width,
                        });
                    }
                    if (
                        action === PivotedLinePattern.CONSTANTS.ACTIONS.Xextends
                    ) {
                        LastPoint.set(0, Y);
                    }
                    if (
                        action === PivotedLinePattern.CONSTANTS.ACTIONS.Ydrops
                    ) {
                        LastPoint.set(X, 0);
                    }
                    if (
                        action === PivotedLinePattern.CONSTANTS.ACTIONS.godRays
                    ) {
                        LastPoint.set(0, 0);
                    }
                }

                if (e.buttons !== undefined) {
                    if (e.buttons === 1) {
                        drawLines();
                    } else {
                        LastPoint.set(-1, -1);
                        if (
                            action ===
                            PivotedLinePattern.CONSTANTS.ACTIONS.pivots
                        ) {
                            LastPoint.set(X, Y);
                        }
                    }
                }
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                var container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function createToolOptions() {
                    function createBasicOption(id, name, value) {
                        return COMMON.genericLabel()
                            .append(value)
                            .append(
                                `<input id="${id}" name="${name}" type="radio" value="${value}" />`,
                            );
                    }

                    container.append(
                        createBasicOption(
                            "option_pivot",
                            "tool-options",
                            PivotedLinePattern.CONSTANTS.ACTIONS.pivots,
                        ),
                    );
                    container.append(
                        createBasicOption(
                            "option_extends",
                            "tool-options",
                            PivotedLinePattern.CONSTANTS.ACTIONS.Xextends,
                        ),
                    );
                    container.append(
                        createBasicOption(
                            "option_drops",
                            "tool-options",
                            PivotedLinePattern.CONSTANTS.ACTIONS.Ydrops,
                        ),
                    );
                    container.append(
                        createBasicOption(
                            "option_god_rays",
                            "tool-options",
                            PivotedLinePattern.CONSTANTS.ACTIONS.godRays,
                        ),
                    );
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

            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForLineWidth(options);
            },
            getOptions: function () {
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
            length: 20,
            breadth: 10,
            xyPlaneRotationAngle: 360,
        },
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
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
                var div = $("<div></div>")
                    .attr("id", Rectangle.CONSTANTS.previewId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                    })
                    .appendTo(".utilities")
                    .on("click", function (eClick) {
                        var mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId),
                            },
                            X = Actions.Mouse.getX(mouseOptions),
                            Y = Actions.Mouse.getY(mouseOptions),
                            length = Rectangle.VARIABLES.length,
                            breadth = Rectangle.VARIABLES.breadth;
                        xyPlaneRotationAngle =
                            (Rectangle.VARIABLES.xyPlaneRotationAngle *
                                Math.PI) /
                            180;
                        CANVASAPI.fillRotatedRectangle(
                            X - length / 2,
                            Y - breadth / 2,
                            length,
                            breadth,
                            xyPlaneRotationAngle,
                        );
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css(
                                "top",
                                ev.pageY -
                                    Rectangle.VARIABLES.breadth / 2 -
                                    window.scrollY,
                            )
                            .css(
                                "left",
                                ev.pageX -
                                    Rectangle.VARIABLES.length / 2 -
                                    window.scrollX,
                            )
                            .css(
                                "background-color",
                                window.JSPAINT.selectedPrimaryColor,
                            )
                            .css(
                                "border",
                                "thin dashed " +
                                    window.JSPAINT.selectedAlternativeColor,
                            )
                            .css("height", Rectangle.VARIABLES.breadth)
                            .css("width", Rectangle.VARIABLES.length);

                        previewOffsetLeft =
                            $(this).offset().left +
                            Rectangle.VARIABLES.length / 2;
                        previewOffsetTop =
                            $(this).offset().top +
                            Rectangle.VARIABLES.breadth / 2;
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (
                            canvasOffsetLeft > previewOffsetLeft ||
                            canvasOffsetLeft + canvasWidth <
                                previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop ||
                            canvasOffsetTop + canvasHeight < previewOffsetTop
                        ) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", function (e) {
                previewer = previewer || $("#" + Rectangle.CONSTANTS.previewId);
                previewer
                    .css(
                        "top",
                        e.pageY -
                            Rectangle.VARIABLES.breadth / 2 -
                            window.scrollY,
                    )
                    .css(
                        "left",
                        e.pageX -
                            Rectangle.VARIABLES.length / 2 -
                            window.scrollX,
                    )
                    .css(
                        "background-color",
                        window.JSPAINT.selectedPrimaryColor,
                    )
                    .css("height", Rectangle.VARIABLES.breadth)
                    .css("width", Rectangle.VARIABLES.length)
                    .css(
                        "transform",
                        "rotate(" +
                            parseInt(
                                Rectangle.VARIABLES.xyPlaneRotationAngle *
                                    Math.PI,
                            ) /
                                180 +
                            "rad)",
                    )
                    .show();
            });
        },
        stop: function (options) {
            const event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $("#" + Rectangle.CONSTANTS.previewId)
                .off("mousemove")
                .remove();
        },
        ContextMenu: {
            activate: function (options) {
                var container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function initialSlider(id, title, max, min) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title,
                    });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider(
                        "xyPlaneRotationAngle",
                        "rotation angle for XY plane rotation.",
                        360,
                        0,
                    )
                        .attr("value", Rectangle.VARIABLES.xyPlaneRotationAngle)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val() + " deg");
                        })
                        .on("input", function () {
                            Rectangle.VARIABLES.xyPlaneRotationAngle =
                                $(this).val();
                        });
                }

                function addSliderForLength(options) {
                    var lengthSlider = initialSlider(
                        options.lengthId,
                        options.lengthTitle,
                        400,
                        10,
                    )
                        .attr("value", Rectangle.VARIABLES.length)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Rectangle.VARIABLES.length = $(this).val();
                        })
                        .appendTo(container);

                    var breadthSlider = initialSlider(
                        options.breadthId,
                        options.breadthTitle,
                        400,
                        10,
                    )
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
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $("#" + options.lengthId).remove();
                    $("#" + options.breadthId).remove();
                    $("#xyPlaneRotationAngle").remove();
                }

                removeSliderForSide(options);
                $("#" + Rectangle.CONSTANTS.previewId)
                    .off("mousemove")
                    .remove();
            },
            getOptions: function () {
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
            innerRadius: 10,
            outerRadius: 20,
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId),
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
                var outerDiv = $("<div></div>")
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
                var div = $("<div></div>")
                    .attr("id", Ring.CONSTANTS.previewId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                        "border-radius": "50%",
                    })
                    .appendTo(outerDiv)
                    .on("click", function (eClick) {
                        mouseOptions = {
                            event: eClick,
                            relativeTo: $(canvasId),
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
                            strokeColor: window.JSPAINT.selectedPrimaryColor,
                            fillColor: window.JSPAINT.selectedAlternativeColor,
                        });
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css(
                                "top",
                                ev.pageY -
                                    parseInt(Ring.VARIABLES.innerRadius) -
                                    parseInt(window.scrollY),
                            )
                            .css(
                                "left",
                                ev.pageX -
                                    parseInt(Ring.VARIABLES.innerRadius) -
                                    parseInt(window.scrollX),
                            )
                            .css(
                                "background-color",
                                window.JSPAINT.selectedAlternativeColor,
                            )
                            .css(
                                "border",
                                "thin dashed " +
                                    window.JSPAINT.selectedPrimaryColor,
                            )
                            .css("height", Ring.VARIABLES.innerRadius * 2)
                            .css("width", Ring.VARIABLES.innerRadius * 2);

                        outer.css({
                            position: "fixed",
                            top:
                                ev.pageY -
                                parseInt(Ring.VARIABLES.outerRadius) -
                                parseInt(window.scrollY),
                            left:
                                ev.pageX -
                                parseInt(Ring.VARIABLES.outerRadius) -
                                parseInt(window.scrollX),
                            "z-index": "2",
                            "border-radius": "50%",
                            height: Ring.VARIABLES.outerRadius * 2,
                            width: Ring.VARIABLES.outerRadius * 2,
                            "background-color":
                                window.JSPAINT.selectedPrimaryColor,
                        });

                        previewOffsetLeft =
                            $(this).offset().left +
                            parseInt(Ring.VARIABLES.innerRadius);
                        previewOffsetTop =
                            $(this).offset().top +
                            parseInt(Ring.VARIABLES.innerRadius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (
                            canvasOffsetLeft > previewOffsetLeft ||
                            parseInt(canvasOffsetLeft) + parseInt(canvasWidth) <
                                previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop ||
                            parseInt(canvasOffsetTop) + parseInt(canvasHeight) <
                                previewOffsetTop
                        ) {
                            $(this).hide();
                            outer.hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", function (e) {
                previewer = previewer || $("#" + Ring.CONSTANTS.previewId);
                previewer
                    .css(
                        "top",
                        e.pageY -
                            parseInt(Ring.VARIABLES.innerRadius) -
                            parseInt(window.scrollY),
                    )
                    .css(
                        "left",
                        e.pageX -
                            parseInt(Ring.VARIABLES.innerRadius) -
                            parseInt(window.scrollX),
                    )
                    .css(
                        "background-color",
                        window.JSPAINT.selectedAlternativeColor,
                    )
                    .css("height", Ring.VARIABLES.innerRadius * 2)
                    .css("width", Ring.VARIABLES.innerRadius * 2)
                    .show();
                outer = outer || $("#" + Ring.CONSTANTS.previewOuterId);
                outer
                    .css({
                        position: "fixed",
                        top:
                            e.pageY -
                            parseInt(Ring.VARIABLES.outerRadius) -
                            parseInt(window.scrollY),
                        left:
                            e.pageX -
                            parseInt(Ring.VARIABLES.outerRadius) -
                            parseInt(window.scrollX),
                        "z-index": "2",
                        "border-radius": "50%",
                        height: Ring.VARIABLES.outerRadius * 2,
                        width: Ring.VARIABLES.outerRadius * 2,
                        "background-color": window.JSPAINT.selectedPrimaryColor,
                    })
                    .show();
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $("#" + Ring.CONSTANTS.previewId).off("mousemove");
            $("#" + Ring.CONSTANTS.previewId).remove();
            $("#" + Ring.CONSTANTS.previewOuterId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: 1,
                        max: 200,
                        step: 1,
                        title: title,
                    });
                }

                function addSliderForRadius(options) {
                    var div = $("<div></div>")
                            .attr("id", options.id)
                            .addClass("menu-item"),
                        innerSlider = initialSlider(
                            "innerRadiusRing",
                            "inner radius for ring tool.",
                        )
                            .attr("value", Ring.VARIABLES.innerRadius)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("input", function () {
                                Ring.VARIABLES.innerRadius = $(this).val();
                            })
                            .appendTo(div),
                        outerSlider = initialSlider(
                            "outerRadiusRing",
                            "outer radius for ring tool.",
                        )
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
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: "RingContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
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
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
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
                var div = $("<div></div>")
                    .attr("id", Disc.CONSTANTS.previewId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                        "border-radius": "50%",
                    })
                    .appendTo(".utilities")
                    .on("click", function (eClick) {
                        mouseOptions = {
                            event: eClick,
                            relativeTo: $(canvasId),
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        radius = Disc.VARIABLES.radius;
                        CANVASAPI.fillCirc(X, Y, radius);
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css(
                                "top",
                                ev.pageY -
                                    Disc.VARIABLES.radius -
                                    window.scrollY,
                            )
                            .css(
                                "left",
                                ev.pageX -
                                    Disc.VARIABLES.radius -
                                    window.scrollX,
                            )
                            .css(
                                "background-color",
                                window.JSPAINT.selectedPrimaryColor,
                            )
                            .css(
                                "border",
                                "thin dashed " +
                                    window.JSPAINT.selectedAlternativeColor,
                            )
                            .css("height", Disc.VARIABLES.radius * 2)
                            .css("width", Disc.VARIABLES.radius * 2);

                        previewOffsetLeft =
                            parseInt($(this).offset().left) +
                            parseInt(Disc.VARIABLES.radius);
                        previewOffsetTop =
                            parseInt($(this).offset().top) +
                            parseInt(Disc.VARIABLES.radius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (
                            canvasOffsetLeft > previewOffsetLeft ||
                            parseInt(canvasOffsetLeft) + parseInt(canvasWidth) <
                                previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop ||
                            parseInt(canvasOffsetTop) + parseInt(canvasHeight) <
                                previewOffsetTop
                        ) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", function (e) {
                previewer = previewer || $("#" + Disc.CONSTANTS.previewId);
                previewer
                    .css(
                        "top",
                        e.pageY - Disc.VARIABLES.radius - window.scrollY,
                    )
                    .css(
                        "left",
                        e.pageX - Disc.VARIABLES.radius - window.scrollX,
                    )
                    .css(
                        "background-color",
                        window.JSPAINT.selectedPrimaryColor,
                    )
                    .css("height", Disc.VARIABLES.radius * 2)
                    .css("width", Disc.VARIABLES.radius * 2)
                    .show();
            });
        },
        stop: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId;

            $(canvasId).off(event);
            $("#" + Disc.CONSTANTS.previewId)
                .off("mousemove")
                .remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: "radiusDisc",
                        min: 1,
                        max: 200,
                        step: 1,
                        title: "radius for disc tool.",
                    });
                }

                function addSliderForRadius(options) {
                    var div = $("<div></div>")
                            .attr("id", options.id)
                            .addClass("menu-item"),
                        slider = initialSlider()
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
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: "DiscContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
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
            side: 10,
            xyPlaneRotationAngle: 360,
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId),
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
                var div = $("<div></div>")
                    .attr("id", Square.CONSTANTS.previewId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                    })
                    .appendTo(".utilities")
                    .on("click", function (eClick) {
                        var mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId),
                            },
                            X = Actions.Mouse.getX(mouseOptions),
                            Y = Actions.Mouse.getY(mouseOptions),
                            side = Square.VARIABLES.side,
                            xyPlaneRotationAngle =
                                (Square.VARIABLES.xyPlaneRotationAngle *
                                    Math.PI) /
                                180;

                        CANVASAPI.fillRoatedSquare(
                            X - side / 2,
                            Y - side / 2,
                            side,
                            xyPlaneRotationAngle,
                        );
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css(
                                "top",
                                parseInt(ev.pageY) -
                                    parseInt(Square.VARIABLES.side / 2) -
                                    parseInt(window.scrollY),
                            )
                            .css(
                                "left",
                                parseInt(ev.pageX) -
                                    parseInt(
                                        parseInt(Square.VARIABLES.side / 2),
                                    ) -
                                    parseInt(window.scrollX),
                            )
                            .css(
                                "background-color",
                                window.JSPAINT.selectedPrimaryColor,
                            )
                            .css(
                                "border",
                                "thin dashed " +
                                    window.JSPAINT.selectedAlternativeColor,
                            )
                            .css("height", Square.VARIABLES.side)
                            .css("width", Square.VARIABLES.side);

                        previewOffsetLeft =
                            parseInt($(this).offset().left) +
                            parseInt(Square.VARIABLES.side / 2);
                        previewOffsetTop =
                            parseInt($(this).offset().top) +
                            parseInt(Square.VARIABLES.side / 2);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (
                            canvasOffsetLeft > previewOffsetLeft ||
                            parseInt(canvasOffsetLeft + canvasWidth) <
                                previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop ||
                            parseInt(canvasOffsetTop + canvasHeight) <
                                previewOffsetTop
                        ) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", function (e) {
                previewer = previewer || $("#" + Square.CONSTANTS.previewId);
                previewer
                    .css(
                        "top",
                        e.pageY -
                            parseInt(Square.VARIABLES.side / 2) -
                            window.scrollY,
                    )
                    .css(
                        "left",
                        e.pageX -
                            parseInt(Square.VARIABLES.side / 2) -
                            window.scrollX,
                    )
                    .css(
                        "background-color",
                        window.JSPAINT.selectedPrimaryColor,
                    )
                    .css("height", Square.VARIABLES.side)
                    .css("width", Square.VARIABLES.side)
                    .css(
                        "transform",
                        "rotate(" +
                            parseInt(
                                Square.VARIABLES.xyPlaneRotationAngle * Math.PI,
                            ) /
                                180 +
                            "rad)",
                    )
                    .show();
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId);

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
                        title: title,
                    });
                }

                function getContextMenuContainer(options) {
                    var container = $("#" + options.id);
                    if (container.length === 0)
                        return $("<div></div>")
                            .attr("id", options.id)
                            .addClass("menu-item");
                    else return container;
                }

                function getSliderForSide(options) {
                    return initialSlider(
                        "sideSquare",
                        "side length for square tool",
                        200,
                        10,
                    )
                        .attr("value", Square.VARIABLES.side)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val());
                        })
                        .on("input", function () {
                            Square.VARIABLES.side = $(this).val();
                        });
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider(
                        "xyPlaneRotationAngle",
                        "rotation angle for XY plane rotation.",
                        360,
                        0,
                    )
                        .attr("value", Square.VARIABLES.xyPlaneRotationAngle)
                        .on("mouseover", function () {
                            $(this).attr("title", $(this).val() + " deg");
                        })
                        .on("input", function () {
                            Square.VARIABLES.xyPlaneRotationAngle =
                                $(this).val();
                        });
                }

                var contextMenuContainer = getContextMenuContainer(options);
                getSliderForSide(options).appendTo(contextMenuContainer);
                getSliderForXYPlaneRotationAngle(options).appendTo(
                    contextMenuContainer,
                );
                contextMenuContainer.appendTo(
                    $(options.containerSelectionCriterion),
                );
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForSide(options);
                $("#" + Square.CONSTANTS.previewId)
                    .off("mousemove")
                    .remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: "SquareToolContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
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
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId),
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
                var div = $("<div></div>")
                    .attr("id", Circle.CONSTANTS.previewId)
                    .css({
                        position: "fixed",
                        "z-index": "2",
                        "border-radius": "50%",
                    })
                    .appendTo(".utilities")
                    .on("click", function (eClick) {
                        mouseOptions = {
                            event: eClick,
                            relativeTo: $(canvasId),
                        };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        innerRadius = Circle.VARIABLES.innerRadius;
                        outerRadius =
                            parseInt(Circle.VARIABLES.innerRadius) + 1;
                        CANVASAPI.drawCircle({
                            X: X,
                            Y: Y,
                            innerRadius: innerRadius,
                            outerRadius: outerRadius,
                            strokeColor: window.JSPAINT.selectedPrimaryColor,
                        });
                    })
                    .on("mousemove", function (ev) {
                        $(this)
                            .css(
                                "top",
                                ev.pageY -
                                    Circle.VARIABLES.innerRadius -
                                    window.scrollY,
                            )
                            .css(
                                "left",
                                ev.pageX -
                                    Circle.VARIABLES.innerRadius -
                                    window.scrollX,
                            )
                            .css(
                                "border",
                                "thin solid " +
                                    window.JSPAINT.selectedPrimaryColor,
                            )
                            .css("height", Circle.VARIABLES.innerRadius * 2)
                            .css("width", Circle.VARIABLES.innerRadius * 2);

                        previewOffsetLeft =
                            parseInt($(this).offset().left) +
                            parseInt(Circle.VARIABLES.innerRadius);
                        previewOffsetTop =
                            parseInt($(this).offset().top) +
                            parseInt(Circle.VARIABLES.innerRadius);
                        canvasOffsetLeft = $(canvasId).offset().left;
                        canvasOffsetTop = $(canvasId).offset().top;

                        if (
                            canvasOffsetLeft > previewOffsetLeft ||
                            parseInt(canvasOffsetLeft) + parseInt(canvasWidth) <
                                previewOffsetLeft ||
                            canvasOffsetTop > previewOffsetTop ||
                            parseInt(canvasOffsetTop) + parseInt(canvasHeight) <
                                previewOffsetTop
                        ) {
                            $(this).hide();
                        }
                    });
            }

            generatePreview();

            $(canvasId).on("mousemove", function (e) {
                previewer = previewer || $("#" + Circle.CONSTANTS.previewId);
                previewer
                    .css(
                        "top",
                        e.pageY - Circle.VARIABLES.innerRadius - window.scrollY,
                    )
                    .css(
                        "left",
                        e.pageX - Circle.VARIABLES.innerRadius - window.scrollX,
                    )
                    .css(
                        "border",
                        "thin solid " + window.JSPAINT.selectedPrimaryColor,
                    )
                    .css("height", Circle.VARIABLES.innerRadius * 2)
                    .css("width", Circle.VARIABLES.innerRadius * 2)
                    .show();
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = "#" + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $("#" + Circle.CONSTANTS.previewId).off("mousemove");
            $("#" + Circle.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: 1,
                        max: 200,
                        step: 1,
                        title: title,
                    });
                }

                function addSliderForRadius(options) {
                    var div = $("<div></div>")
                        .attr("id", options.id)
                        .addClass("menu-item");
                    var radiusSlider = initialSlider(
                        "radiusCircle",
                        "innerRadius for circle tool.",
                    )
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
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $("#" + options.id).remove();
                }

                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: "CircleContextMenu",
                    containerSelectionCriterion: ".contextual-tool-bar",
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
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                i = 0;

            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId),
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
            $("#" + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement(
                            "pointWalkerSptes",
                            "500",
                            options.maxStepsAllowed,
                            "Steps for random point walk generation.",
                        )
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
            deactivate: function (options) {
                $("#" + options.id).remove();
            },
            getOptions: function () {
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
            steps: 100,
            durationBetweenDanceStepsInMiliSeconds: 100,
        },
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
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
                    relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X: X,
                    Y: Y,
                    steps: FamilyPointWalker.VARIABLES.steps,
                    fillColor: window.JSPAINT.selectedPrimaryColor,
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X: X,
                            Y: Y,
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
            $("#" + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement(
                            "familyPointWalkerSptes",
                            FamilyPointWalker.VARIABLES.steps,
                            options.maxStepsAllowed,
                            "Steps for family random point walk generation.",
                        )
                            .attr("value", FamilyPointWalker.VARIABLES.steps)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                FamilyPointWalker.VARIABLES.steps =
                                    $(this).val();
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
            deactivate: function (options) {
                $("#" + options.id).remove();
            },
            getOptions: function () {
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
            steps: 100,
            durationBetweenDanceStepsInMiliSeconds: 100,
        },
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
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
                    relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                origin = {
                    X: X,
                    Y: Y,
                    steps: OrganismPointWalker.VARIABLES.steps,
                    fillColor: window.JSPAINT.selectedPrimaryColor,
                };

                function dance(origin) {
                    X = origin.X;
                    Y = origin.Y;
                    steps = origin.steps;
                    fillColor = origin.fillColor;

                    for (i = 0; i < steps; i++) {
                        oldXY[i] = {
                            X: X,
                            Y: Y,
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
            $("#" + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var container = $("<div></div>")
                    .attr("id", options.id)
                    .addClass("menu-item");

                function getInputElement(id, min, max, title) {
                    return COMMON.generateSlider({
                        id: id,
                        min: min,
                        max: max,
                        step: 1,
                        title: title,
                    });
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        const slider = getInputElement(
                            "organismPointWalkerSptes",
                            OrganismPointWalker.VARIABLES.steps,
                            options.maxStepsAllowed,
                            "Steps for organism random point walk generation.",
                        )
                            .attr("value", OrganismPointWalker.VARIABLES.steps)
                            .on("mouseover", function () {
                                $(this).attr("title", $(this).val());
                            })
                            .on("change", function () {
                                OrganismPointWalker.VARIABLES.steps =
                                    $(this).val();
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
            deactivate: function (options) {
                $("#" + options.id).remove();
            },
            getOptions: function () {
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
            steps: 1,
            durationBetweenParasiticActsInMiliSeconds: 100,
            dieOutSteps: 10000,
        },
        start: function (options) {
            var event = options.event,
                canvasId = "#" + options.canvasId,
                mouseOptions = null,
                X = null,
                Y = null,
                tempFillColor;

            /**
             * Context for subsequent invocations
             * @type {{X: number, Y: number, steps: number, fillColor: string | CanvasGradient | CanvasPattern, i: number}}
             */
            let origin = {};
            $(canvasId).on(event, function (e) {
                mouseOptions = {
                    event: e,
                    relativeTo: $(canvasId),
                };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                const fillColor = window.JSPAINT.selectedPrimaryColor;
                const steps = UniCellularParasiteTool.VARIABLES.steps;

                origin = {
                    X,
                    Y,
                    steps,
                    fillColor,
                    i: 0,
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
                    CANVASAPI.fillCirc(X, Y, 1);
                    context.fillStyle = tempFillColor;

                    X += Math.random() < 0.5 ? -1 : 1;
                    Y += Math.random() < 0.5 ? -1 : 1;

                    /* update the context */
                    origin = { ...origin, X, Y };
                    if (window.JSPAINT.__DEBUGGING__) {
                        console.log({ fn: "act", origin });
                    }

                    setTimeout(function () {
                        /* recursion */
                        act(origin);
                    }, UniCellularParasiteTool
                        .VARIABLES.durationBetweenParasiticActsInMiliSeconds);
                }

                act(origin);
            });
        },
        stop: function (options) {
            $("#" + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {},
            deactivate: function (options) {},
            getOptions: function () {
                return {
                    tool: this,
                    id: "UniCellularParasiteToolContextMenu",
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

    $("#SaturateRedColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#SaturateGreenColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 1; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#SaturateBlueColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 2; i < image.data.length; i += 4) {
            image.data[i] = 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#InvertColorsTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            image.data[i] = 255 - image.data[i];
            image.data[i + 1] = 255 - image.data[i + 1];
            image.data[i + 2] = 255 - image.data[i + 2];
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateRedColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateGreenColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 1; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#DesaturateBlueColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 2; i < image.data.length; i += 4) {
            image.data[i] = 0;
        }
        context.putImageData(image, 0, 0);
    });

    $("#AddGrayTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            image.data[i] += 112;
            image.data[i + 1] += 112;
            image.data[i + 2] += 112;
        }
        context.putImageData(image, 0, 0);
    });

    $("#RemoveGrayTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            image.data[i] -= 112;
            image.data[i + 1] -= 112;
            image.data[i + 2] -= 112;
        }
        context.putImageData(image, 0, 0);
    });

    $("#AddNoiseTool").on("click", function () {
        let canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height);

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (let i = 0; i < image.data.length; i += 4) {
            const random = Math.random();
            image.data[i] += random < 0.5 ? random * 255 * -1 : random * 255;
            image.data[i + 1] +=
                random < 0.5 ? random * 255 * -1 : random * 255;
            image.data[i + 2] +=
                random < 0.5 ? random * 255 * -1 : random * 255;
        }
        context.putImageData(image, 0, 0);
    });

    $("#RandomColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height),
            sampleX = Math.floor(Math.random() * width),
            sampleY = Math.floor(Math.random() * height),
            sampleRed = image.data[sampleX * width + sampleY],
            sampleGreen = image.data[sampleX * width + sampleY + 1],
            sampleBlue = image.data[sampleX * width + sampleY + 2],
            red =
                Math.random() < 0.5
                    ? Math.random() * 255 * -1
                    : Math.random() * 255,
            green =
                Math.random() < 0.5
                    ? Math.random() * 255 * -1
                    : Math.random() * 255,
            blue =
                Math.random() < 0.5
                    ? Math.random() * 255 * -1
                    : Math.random() * 255;

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            if (
                image.data[i] === sampleRed &&
                image.data[i + 1] === sampleGreen &&
                image.data[i + 2] === sampleBlue
            ) {
                image.data[i] += red;
                image.data[i + 1] += green;
                image.data[i + 2] += blue;
            }
        }
        context.putImageData(image, 0, 0);
    });

    $("#FuzzyColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width();

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (let i = 0; i < 255; i++) {
            $("#RandomColorTool").click();
        }
    });

    $("#BlackAndWhiteColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height),
            averageValue = 0,
            newValue = 0;

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });
        for (var i = 0; i < image.data.length; i += 4) {
            averageValue =
                (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
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

    $("#GrayColorTool").on("click", function () {
        var canvasId = "#" + CONSTANTS.canvasId,
            height = $(canvasId).height(),
            width = $(canvasId).width(),
            image = context.getImageData(0, 0, width, height),
            averageValue = 0,
            newValue = 0;

        saveCanvasState({
            startX: 0,
            startY: 0,
            width: width,
            height: height,
        });

        for (let i = 0; i < image.data.length; i += 4) {
            averageValue =
                (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
            newValue = Math.floor(averageValue / 16) * 16;
            image.data[i] = newValue;
            image.data[i + 1] = newValue;
            image.data[i + 2] = newValue;
        }
        context.putImageData(image, 0, 0);
    });
});
