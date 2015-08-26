$(function() {
    "use strict";

    var COMMON = {
        generateSlider: function(options) {
            var min = options.min,
                max = options.max,
                title = options.title,
                id = options.id,
                step = options.step;

            return $('<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" title="' + title + '" />');
        },
        generateLabel: function(options) {
            var hexColor = options.hexColor,
                fontSize = options.fontSize;

            return $('<label style="color: #' + hexColor + '; font-size: ' + fontSize + ';"></label>');
        },
        genericLabel: function() {
            return COMMON.generateLabel({
                hexColor: 'FFFFFF',
                fontSize: '10px'
            });
        },

        registerEventForTool: function(options) {
            var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = options.contextMenu,
                title = options.constantTitle;

            setupToolTips(tool, title);
            options.tool = tool;

            tool.funcToggle('click',
                function() {
                    activateTool(options);
                    contextMenu.activate(contextMenu.getOptions());
                },
                function() {
                    contextMenu.deactivate(contextMenu.getOptions());
                    deactivateTool(options);
                });
        }

    };

    $(function() {
        var MandelbrotFractal = {
            CONSTANTS: {
                id: "MandelbrotFractalTool",
                selectionId: '#MandelbrotFractalTool',
                class: 'main-tool',
                title: 'Click to draw Mandelbrot Fractal. Click again to disable.',
                maxHeight: -1,
                maxWidth: -1
            },
            VARIABLES: {
                iterations: 1000,
                xMax: 1,
                yMax: 1,
                xMin: -2,
                yMin: -1,
                height: -1,
                width: -1
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = options.canvasId;

                function drawMandelbrotFractal(options) {
                    function mandelIter(cx, cy, maxIter) {
                        var
                            x = 0.0,
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
                        var
                            ctx = options.context,
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

                var getOverflowInXAxis = function(startX) {
                    return startX + Math.floor(MandelbrotFractal.VARIABLES.width) - MandelbrotFractal.CONSTANTS.maxWidth;
                };

                var getStartingXCoordinate = function(mouseOptions) {
                    var X = Actions.Mouse.getX(mouseOptions);
                    var startX = Math.max(X - Math.floor(MandelbrotFractal.VARIABLES.width / 2), 0);
                    var overflowX = getOverflowInXAxis(startX);
                    if (overflowX > 0) {
                        startX -= overflowX;
                    }
                    return startX;
                };

                var getOverflowInYAxis = function(startY) {
                    return startY + Math.floor(MandelbrotFractal.VARIABLES.height) - MandelbrotFractal.CONSTANTS.maxHeight;
                };

                var getStartingYCoordinate = function(mouseOptions) {
                    var Y = Actions.Mouse.getY(mouseOptions),
                        startY = Math.max(Y - Math.floor(MandelbrotFractal.VARIABLES.height / 2), 0),
                        overflowY = getOverflowInYAxis(startY);

                    if (overflowY > 0) {
                        startY -= overflowY;
                    }
                    return startY;
                };

                $(canvasId).on(event, function(e) {
                    var
                        mouseOptions = {
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

            stop: function(options) {
                $(options.canvasId).off(options.event);
            },

            ContextMenu: {
                activate: function(options) {
                    var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

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
                            var
                                slider = getInputElement('mandelbrotIterations', '10', options.maxIterationsAllowed, 'Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.')
                                .attr('value', MandelbrotFractal.VARIABLES.iterations)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    var val = $(this).val();
                                    if (val > options.maxIterationsAllowed) {
                                        if (confirm('Beware! It might crash your browser. Go back?', 'back', 'No, I want these many iterations. I know what I am doing!')) {
                                            val = options.maxIterationsAllowed;
                                        }
                                    }
                                    MandelbrotFractal.VARIABLES.iterations = val;
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.iterationLabel)
                            .append(createIterationSlider(options));

                        return sliderTool;
                    }

                    function addHeightController(options) {
                        function createHeightSlider(options) {
                            var
                                slider = getInputElement('mandelbrotHeight', '100', MandelbrotFractal.CONSTANTS.maxHeight, 'Height for mandelbrot fractal generation.')
                                .attr('value', MandelbrotFractal.CONSTANTS.maxHeight)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    var val = $(this).val();
                                    if (val > MandelbrotFractal.CONSTANTS.maxHeight) {
                                        val = MandelbrotFractal.CONSTANTS.maxHeight;
                                    }
                                    MandelbrotFractal.VARIABLES.height = val;
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.heightLabel)
                            .append(createHeightSlider(options));

                        return sliderTool;
                    }

                    function addWidthController(options) {
                        function createWidthSlider(options) {
                            var
                                slider = getInputElement('mandelbrotWidth', '100', MandelbrotFractal.CONSTANTS.maxWidth, 'Width for mandelbrot fractal generation.')
                                .attr('value', MandelbrotFractal.CONSTANTS.maxWidth)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    var val = $(this).val();
                                    if (val > MandelbrotFractal.CONSTANTS.maxWidth) {
                                        val = MandelbrotFractal.CONSTANTS.maxWidth;
                                    }
                                    MandelbrotFractal.VARIABLES.width = val;
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.widthLabel)
                            .append(createWidthSlider(options));

                        return sliderTool;
                    }

                    function addXMaxController(options) {
                        function createXMaxSlider(options) {
                            var
                                slider = getInputElement('mandelbrotXMax', '0', '3', 'XMax for mandelbrot fractal generation.')
                                .attr('value', '1')
                                .attr('disabled', 'disabled')
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    MandelbrotFractal.VARIABLES.xMax = $(this).val();
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.xMaxLabel)
                            .append(createXMaxSlider(options));

                        return sliderTool;
                    }

                    function addYMaxController(options) {
                        function createYMaxSlider(options) {
                            var
                                slider = getInputElement('mandelbrotYMax', '0', '3', 'YMax for mandelbrot fractal generation.')
                                .attr('value', '1')
                                .attr('disabled', 'disabled')
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    MandelbrotFractal.VARIABLES.yMax = $(this).val();
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.yMaxLabel)
                            .append(createYMaxSlider(options));

                        return sliderTool;
                    }

                    function addXMinController(options) {
                        function createXMinSlider(options) {
                            var
                                slider = getInputElement('mandelbrotXMin', '-3', '1', 'XMin for mandelbrot fractal generation.')
                                .attr('value', '-2')
                                .attr('disabled', 'disabled')
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    MandelbrotFractal.VARIABLES.xMin = $(this).val();
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
                            .append(options.xMinLabel)
                            .append(createXMinSlider(options));

                        return sliderTool;
                    }

                    function addYMinController(options) {
                        function createYMinSlider(options) {
                            var
                                slider = getInputElement('mandelbrotYMin', '-2', '1', 'YMin for mandelbrot fractal generation.')
                                .attr('value', '-1')
                                .attr('disabled', 'disabled')
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    MandelbrotFractal.VARIABLES.yMin = $(this).val();
                                });
                            return slider;
                        }
                        var sliderTool = COMMON.genericLabel()
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
                deactivate: function(options) {
                    function removeSliderForLineWidth(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForLineWidth(options);
                },
                getOptions: function() {
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
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = MandelbrotFractal.ContextMenu;

                    setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            MandelbrotFractal.VARIABLES.height = MandelbrotFractal.CONSTANTS.maxHeight = $(options.canvasId)[0].height;
                            MandelbrotFractal.VARIABLES.width = MandelbrotFractal.CONSTANTS.maxWidth = $(options.canvasId)[0].width;
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        });
                }
            }
        };

        MandelbrotFractal.Events.register({
            toolId: MandelbrotFractal.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: '#' + CONSTANTS.canvasId,
            start: MandelbrotFractal.start,
            stop: MandelbrotFractal.stop,
            toolName: 'Mandelbrot fractal'
        });
    });

    $(function() {


        var Pencil = {
            CONSTANTS: {
                id: "PencilTool",
                selectionId: '#PencilTool',
                class: 'main-tool',
                title: 'Click to draw free-hand lines. Click again to disable.'
            },
            VARIABLES: {
                width: 2,
                LastPoint: {
                    X: -1,
                    Y: -1
                }
            },
            start: function(options) {
                var event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    width = null,
                    last = null,
                    LastPoint = {
                        get: function() {
                            return {
                                X: Pencil.VARIABLES.LastPoint.X,
                                Y: Pencil.VARIABLES.LastPoint.Y
                            };
                        },
                        set: function(x, y) {
                            Pencil.VARIABLES.LastPoint.X = x;
                            Pencil.VARIABLES.LastPoint.Y = y;
                        }
                    };

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };

                    var drawLines = function() {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mousemove,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider() {
                        return $('<input id="widthPencil" type="range" min="1" max="200" step="1" title="width for pencil tool." />');
                    }

                    function addSliderForLineWidth(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                            slider = initialSlider()
                            .attr('value', Pencil.VARIABLES.width)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Pencil.VARIABLES.width = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForLineWidth(options);
                },
                deactivate: function(options) {
                    function removeSliderForLineWidth(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForLineWidth(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'PencilContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

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
    });

    $(function() {

        var PickColor = {
            CONSTANTS: {
                id: 'pick-color',
                selectionId: '#pick-color',
                class: 'string-menu-item',
                containerId: 'PickColorTool',
                title: 'Click to pick color under mouse pointer tip; picks until some other tool is selected. Click again to disable.'
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    data = null,
                    r = 0,
                    g = 0,
                    b = 0,
                    a = 0;
                $(canvasId).on(event, function(e) {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId);

                    setupToolTips(tool, PickColor.CONSTANTS.title);
                    options.tool = tool;
                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                        },
                        function() {
                            deactivateTool(options);
                        });
                }
            }
        };

        PickColor.Events.register({
            toolId: PickColor.CONSTANTS.selectionId,
            containerId: PickColor.CONSTANTS.containerId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: CONSTANTS.canvasId,
            start: PickColor.start,
            stop: PickColor.stop,
            toolName: 'Color picker'
        });
    });

    $(function() {


        var PivotedLinePattern = {
            CONSTANTS: {
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
            },
            VARIABLES: {
                width: 2,
                LastPoint: {
                    X: -1,
                    Y: -1
                }
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mousemove,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    width = null,
                    last = null,
                    LastPoint = {
                        get: function() {
                            return {
                                X: PivotedLinePattern.VARIABLES.LastPoint.X,
                                Y: PivotedLinePattern.VARIABLES.LastPoint.Y
                            };
                        },
                        set: function(x, y) {
                            PivotedLinePattern.VARIABLES.LastPoint.X = x;
                            PivotedLinePattern.VARIABLES.LastPoint.Y = y;
                        }
                    },
                    action = null;

                function drawLineSegmentFromLastPoint(options) {
                    var
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

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    action = $('[name=tool-options]:checked').val();

                    var drawLines = function() {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mousemove,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
            },
            ContextMenu: {
                activate: function(options) {
                    var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                    var createToolOptions = function() {
                        var createBasicOption = function(id, name, value) {
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
                        var
                            slider = initialSlider()
                            .attr('value', PivotedLinePattern.VARIABLES.width)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                PivotedLinePattern.VARIABLES.width = $(this).val();
                            })
                            .appendTo(container);

                        container.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForLineWidth(options);
                    createToolOptions();
                },

                deactivate: function(options) {
                    function removeSliderForLineWidth(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForLineWidth(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'PivotedLinePatternContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = PivotedLinePattern.ContextMenu;

                    setupToolTips(tool, PivotedLinePattern.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        }
                    );
                }
            }
        };

        PivotedLinePattern.Events.register({
            toolId: PivotedLinePattern.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: PivotedLinePattern.start,
            stop: PivotedLinePattern.stop,
            toolName: 'Pivoted Line Pattern'
        });
    });

    $(function() {


        var PointWalker = {
            CONSTANTS: {
                id: 'PointWalkerTool',
                selectionId: '#PointWalkerTool',
                class: 'main-tool',
                title: 'Click to draw random point walker. Click again to disable.'
            },
            VARIABLES: {
                steps: 100
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    i = 0;

                $(canvasId).on(event, function(e) {
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
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

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
                            var
                                slider = getInputElement('pointWalkerSptes', '500', options.maxStepsAllowed, 'Steps for random point walk generation.')
                                .attr('value', PointWalker.VARIABLES.steps)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('change', function() {
                                    PointWalker.VARIABLES.steps = $(this).val();
                                });
                            return slider;
                        }
                        return COMMON.genericLabel().append(options.stepLabel).append(createStepSlider(options));
                    }
                    container.append(addStepController(options));
                    container.appendTo($(options.containerSelectionCriterion));
                },
                deactivate: function(options) {
                    $('#' + options.id).remove();
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'PointWalkerContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar',
                        maxStepsAllowed: 100000,
                        stepLabel: 'Steps: ',
                    };
                }
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = PointWalker.ContextMenu;

                    setupToolTips(tool, PointWalker.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        });
                }
            }
        };

        PointWalker.Events.register({
            toolId: PointWalker.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: CONSTANTS.canvasId,
            start: PointWalker.start,
            stop: PointWalker.stop,
            toolName: 'Point Walker'
        });
    });

    $(function() {


        var Rectangle = {
            CONSTANTS: {
                id: 'RectangleTool',
                selectionId: '#RectangleTool',
                class: 'main-tool',
                title: 'Click to draw rectangles. Click again to disable.',
                previewId: 'previewRectangle'
            },
            VARIABLES: {
                length: 20,
                breadth: 10,
                xyPlaneRotationAngle: 360
            },
            start: function(options) {
                var
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
                    var
                        div = $('<div></div>')
                        .attr('id', Rectangle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                        })
                        .appendTo('.utilities')
                        .on('click', function(eClick) {
                            var
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
                        .on('mousemove', function(ev) {
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

                $(canvasId).on('mousemove', function(e) {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
                $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
                $('#' + Rectangle.CONSTANTS.previewId).remove();
            },
            ContextMenu: {
                activate: function(options) {
                    var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

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
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val() + ' deg');
                            })
                            .on('input', function() {
                                Rectangle.VARIABLES.xyPlaneRotationAngle = $(this).val();
                            });
                    }

                    function addSliderForLength(options) {
                        var lengthSlider = initialSlider(options.lengthId, options.lengthTitle, 400, 10)
                            .attr('value', Rectangle.VARIABLES.length)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Rectangle.VARIABLES.length = $(this).val();
                            })
                            .appendTo(container);

                        var breadthSlider = initialSlider(options.breadthId, options.breadthTitle, 400, 10)
                            .attr('value', Rectangle.VARIABLES.breadth)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Rectangle.VARIABLES.breadth = $(this).val();
                            })
                            .appendTo(container);
                    }

                    addSliderForLength(options);
                    container.append(getSliderForXYPlaneRotationAngle(options));
                    container.appendTo($(options.containerSelectionCriterion));
                },
                deactivate: function(options) {
                    function removeSliderForSide(options) {
                        $('#' + options.lengthId).remove();
                        $('#' + options.breadthId).remove();
                        $('#xyPlaneRotationAngle').remove();
                    }
                    removeSliderForSide(options);
                    $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
                    $('#' + Rectangle.CONSTANTS.previewId).remove();
                },
                getOptions: function() {
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
    });

    $(function() {

        var Ring = {
            CONSTANTS: {
                id: 'RingTool',
                selectionId: '#RingTool',
                class: 'main-tool',
                title: 'Click to draw ring. Click again to disable.',
                previewId: 'previewRing',
                previewOuterId: 'previewOuterRing'
            },
            VARIABLES: {
                innerRadius: 10,
                outerRadius: 20
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
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
                    var outerDiv = $('<div></div>').attr('id', Ring.CONSTANTS.previewOuterId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%',
                            'height': Ring.VARIABLES.outerRadius * 2,
                            'width': Ring.VARIABLES.outerRadius * 2,
                            'backgruond-color': selectedPrimaryColor,
                        })
                        .appendTo('.utilities');
                    var
                        div = $('<div></div>')
                        .attr('id', Ring.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%'
                        })
                        .appendTo(outerDiv)
                        .on('click', function(eClick) {
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
                        .on('mousemove', function(ev) {
                            $(this).css('top', ev.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollY))
                                .css('left', ev.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(window.scrollX))
                                .css('background-color', selectedAlternativeColor)
                                .css('border', 'thin dashed ' + selectedPrimaryColor)
                                .css('height', Ring.VARIABLES.innerRadius * 2)
                                .css('width', Ring.VARIABLES.innerRadius * 2);

                            outer.css({
                                'position': 'fixed',
                                'top': ev.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollY),
                                'left': ev.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(window.scrollX),
                                'z-index': '2',
                                'border-radius': '50%',
                                'height': Ring.VARIABLES.outerRadius * 2,
                                'width': Ring.VARIABLES.outerRadius * 2,
                                'background-color': selectedPrimaryColor,
                            });

                            previewOffsetLeft = $(this).offset().left + parseInt(Ring.VARIABLES.innerRadius);
                            previewOffsetTop = $(this).offset().top + parseInt(Ring.VARIABLES.innerRadius);
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                                outer.hide();
                            }
                        });

                }
                generatePreview();

                $(canvasId).on('mousemove', function(e) {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
                $('#' + Ring.CONSTANTS.previewId).off('mousemove');
                $('#' + Ring.CONSTANTS.previewId).remove();
                $('#' + Ring.CONSTANTS.previewOuterId).remove();
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider(id, title) {
                        return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                    }

                    function addSliderForRadius(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),

                            innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                            .attr('value', Ring.VARIABLES.innerRadius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Ring.VARIABLES.innerRadius = $(this).val();
                            })
                            .appendTo(div),

                            outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                            .attr('value', Ring.VARIABLES.outerRadius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Ring.VARIABLES.outerRadius = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'RingContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };
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
    });

    $(function() {
        var SpeedCircle = {
            CONSTANTS: {
                id: 'SpeedCircleTool',
                selectionId: '#SpeedCircleTool',
                class: 'main-tool',
                title: 'Click to draw Circles. Click again to disable.'
            },
            VARIABLES: {
                radius: 4
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    R = null;

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    R = SpeedCircle.VARIABLES.radius;
                    CANVASAPI.drawCircle({
                        X: X,
                        Y: Y,
                        innerRadius: R,
                        outerRadius: parseInt(R) + 1,
                        strokeColor: selectedPrimaryColor
                    });
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    var VARS = SpeedCircle.VARIABLES;

                    function initialSlider() {
                        return $('<input id="radiusSpeedCircle" type="range" min="1" max="200" step="1" title="radius for speed circle tool" />');
                    }

                    function addSliderForRadius(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                            slider = initialSlider()
                            .attr('value', VARS.radius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                VARS.radius = $(this).val();
                            }).appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedCircleContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedCircle.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedCircle.start,
            stop: SpeedCircle.stop,
            toolName: 'Speed circle',
            contextMenu: SpeedCircle.ContextMenu,
            constantTitle: SpeedCircle.CONSTANTS.title

        });
    });

    $(function() {
        var SpeedDisc = {
            CONSTANTS: {
                id: 'SpeedDiscTool',
                selectionId: '#SpeedDiscTool',
                class: 'main-tool',
                title: 'Click to draw Discs. Click again to disable.'
            },
            VARIABLES: {
                radius: 4
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    R = null;

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    R = SpeedDisc.VARIABLES.radius;
                    CANVASAPI.fillCirc(X, Y, R);
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    var VARS = SpeedDisc.VARIABLES;

                    function initialSlider() {
                        return $('<input id="radiusSpeedDisc" type="range" min="1" max="200" step="1" title="radius for speed disc tool" />');
                    }

                    function addSliderForRadius(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                            slider = initialSlider()
                            .attr('value', VARS.radius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                VARS.radius = $(this).val();
                            }).appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedDiscContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedDisc.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedDisc.start,
            stop: SpeedDisc.stop,
            toolName: 'Speed disc',
            contextMenu: SpeedDisc.ContextMenu,
            constantTitle: SpeedDisc.CONSTANTS.title
        });
    });

    $(function() {
        var SpeedDot = {
            CONSTANTS: {
                id: 'SpeedDotTool',
                selectionId: '#SpeedDotTool',
                class: 'main-tool',
                title: 'Click to draw dots. Click again to disable.'
            },
            VARIABLES: {},
            ContextMenu: {
                activate: function(options) {},
                getOptions: function() {},
                deactivate: function() {}
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null;

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    CANVASAPI.fillCirc(X, Y, 1);
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId);

                    setupToolTips(tool, SpeedDot.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                        },
                        function() {
                            deactivateTool(options);
                        });
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedDot.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedDot.start,
            stop: SpeedDot.stop,
            toolName: 'Speed dot',
            contextMenu: SpeedDot.ContextMenu,
            constantTitle: SpeedDot.CONSTANTS.title
        });
    });

    $(function() {
        var SpeedPencil = {
            CONSTANTS: {
                id: 'SpeedPencilTool',
                selectionId: '#SpeedPencilTool',
                class: 'main-tool',
                title: 'Click to draw draw free hand lines. Click again to disable.'
            },
            VARIABLES: {
                width: 2,
                LastPoint: {
                    X: -1,
                    Y: -1
                }
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    width = null,
                    last = null,
                    LastPoint = {
                        get: function() {
                            return {
                                X: SpeedPencil.VARIABLES.LastPoint.X,
                                Y: SpeedPencil.VARIABLES.LastPoint.Y
                            };
                        },
                        set: function(x, y) {
                            SpeedPencil.VARIABLES.LastPoint.X = x;
                            SpeedPencil.VARIABLES.LastPoint.Y = y;
                        }
                    };

                function drawLineSegmentFromLastPoint(options) {
                    var
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
                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    width = SpeedPencil.VARIABLES.width;
                    last = LastPoint.get();
                    if (last.X != -1) {
                        drawLineSegmentFromLastPoint({
                            context: context,
                            last: last,
                            current: {
                                X: X,
                                Y: Y
                            },
                            width: width
                        });
                    }
                    CANVASAPI.fillCirc(X, Y, width / 2);
                    LastPoint.set(X, Y);
                });
            },
            stop: function(options) {
                SpeedPencil.VARIABLES.LastPoint.X = -1;
                SpeedPencil.VARIABLES.LastPoint.Y = -1;
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider() {
                        return $('<input id="widthSpeedPencil" type="range" min="1" max="200" step="1" title="width for speed pencil tool." />');
                    }

                    function addSliderForLineWidth(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                            slider = initialSlider()
                            .attr('value', SpeedPencil.VARIABLES.width)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                SpeedPencil.VARIABLES.width = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForLineWidth(options);
                },
                deactivate: function(options) {
                    function removeSliderForLineWidth(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForLineWidth(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedPencilContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedPencil.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedPencil.start,
            stop: SpeedPencil.stop,
            toolName: 'Speed pencil',
            contextMenu: SpeedPencil.ContextMenu,
            constantTitle: SpeedPencil.CONSTANTS.title
        });
    });

    $(function() {
        var SpeedRectangle = {
            CONSTANTS: {
                id: 'SpeedRectangleTool',
                selectionId: '#SpeedRectangleTool',
                class: 'main-tool',
                title: 'Click to draw speed rectangles. Click again to disable.',
            },
            VARIABLES: {
                length: 20,
                breadth: 10
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    side = null,
                    xyPlaneRotationAngle = null;

                $(canvasId).on('mousemove', function(e) {
                    var
                        mouseOptions = {
                            event: e,
                            relativeTo: $(canvasId)
                        },
                        X = Actions.Mouse.getX(mouseOptions),
                        Y = Actions.Mouse.getY(mouseOptions),
                        length = SpeedRectangle.VARIABLES.length,
                        breadth = SpeedRectangle.VARIABLES.breadth;

                    context.fillRect(X - length / 2, Y - breadth / 2, length, breadth);
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider(id, title) {
                        return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                    }

                    function addSliderForLength(options) {
                        var div = $('<div></div>').attr('id', options.id).addClass('menu-item');

                        var lengthSlider = initialSlider(options.lengthId, options.lengthTitle)
                            .attr('value', SpeedRectangle.VARIABLES.length)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                SpeedRectangle.VARIABLES.length = $(this).val();
                            })
                            .appendTo(div);

                        var breadthSlider = initialSlider(options.breadthId, options.breadthTitle)
                            .attr('value', SpeedRectangle.VARIABLES.breadth)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                SpeedRectangle.VARIABLES.breadth = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForLength(options);

                },
                deactivate: function(options) {
                    function removeSliderForSide(options) {
                        $('#' + options.lengthId).remove();
                        $('#' + options.breadthId).remove();
                    }
                    removeSliderForSide(options);
                    $('#' + SpeedRectangle.CONSTANTS.previewId).off('mousemove');
                    $('#' + SpeedRectangle.CONSTANTS.previewId).remove();
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedRectangleContextMenu',
                        lengthId: 'lengthSpeedRectangle',
                        breadthId: 'breadthSpeedRectangle',
                        lengthTitle: 'length for speed rectangle',
                        breadthTitle: 'breadth for speed rectangle',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

        SpeedRectangle.Events.register({
            toolId: SpeedRectangle.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedRectangle.start,
            stop: SpeedRectangle.stop,
            toolName: 'Speed rectangle',
            contextMenu: SpeedRectangle.ContextMenu,
            constantTitle: SpeedRectangle.CONSTANTS.title
        });
    });

    $(function() {
        var SpeedRing = {
            CONSTANTS: {
                id: 'SpeedRingTool',
                selectionId: '#SpeedRingTool',
                class: 'main-tool',
                title: 'Click to draw speed rings. Click again to disable.'
            },
            VARIABLES: {
                innerRadius: 10,
                outerRadius: 20
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    innerRadius = null,
                    outerRadius = null;

                $(canvasId).on(event, function(e) {
                    mouseOptions = {
                        event: e,
                        relativeTo: $(this)
                    };
                    X = Actions.Mouse.getX(mouseOptions);
                    Y = Actions.Mouse.getY(mouseOptions);
                    innerRadius = SpeedRing.VARIABLES.innerRadius;
                    outerRadius = SpeedRing.VARIABLES.outerRadius;
                    CANVASAPI.fillRing({
                        X: X,
                        Y: Y,
                        innerRadius: innerRadius,
                        outerRadius: outerRadius,
                        strokeColor: selectedPrimaryColor,
                        fillColor: selectedAlternativeColor
                    });
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider(id, title) {
                        return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                    }

                    function addSliderForRadius(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),

                            innerSlider = initialSlider("innerRadiusSpeedRing", "inner radius for speed ring tool.")
                            .attr('value', SpeedRing.VARIABLES.innerRadius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                SpeedRing.VARIABLES.innerRadius = $(this).val();
                            })
                            .appendTo(div),

                            outerSlider = initialSlider("outerRadiusSpeedRing", "outer radius for speed ring tool.")
                            .attr('value', SpeedRing.VARIABLES.outerRadius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                SpeedRing.VARIABLES.outerRadius = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedRingContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedRing.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedRing.start,
            stop: SpeedRing.stop,
            toolName: 'Speed ring',
            contextMenu: SpeedRing.ContextMenu,
            constantTitle: SpeedRing.CONSTANTS.title
        });
    });

    $(function() {
        var SpeedSquare = {
            CONSTANTS: {
                id: 'SpeedSquareTool',
                selectionId: '#SpeedSquareTool',
                class: 'main-tool',
                title: 'Click to draw speed squares. Click again to disable.',
            },
            VARIABLES: {
                side: 10,
                xyPlaneRotationAngle: 360
            },
            start: function(options) {
                var
                    event = options.event,
                    canvasId = '#' + options.canvasId,
                    mouseOptions = null,
                    X = null,
                    Y = null,
                    side = null,
                    xyPlaneRotationAngle = null;

                $(canvasId).on('mousemove', function(e) {
                    var
                        mouseOptions = {
                            event: e,
                            relativeTo: $(canvasId)
                        },
                        X = Actions.Mouse.getX(mouseOptions),
                        Y = Actions.Mouse.getY(mouseOptions),
                        side = SpeedSquare.VARIABLES.side,
                        xyPlaneRotationAngle = (SpeedSquare.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;

                    CANVASAPI.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
                });
            },
            stop: function(options) {
                $('#' + options.canvasId).off(options.event);
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider(id, title, max) {
                        return COMMON.generateSlider({
                            id: id,
                            min: min,
                            max: max,
                            step: 1,
                            title: title
                        });
                    }

                    function getContextMenuContainer(options) {
                        var container = $('#' + options.id);
                        if (container.length === 0)
                            return $('<div></div>').attr('id', options.id).addClass('menu-item');
                        else
                            return container;
                    }

                    function addSideLengthController(options) {
                        function getSliderForSide(options) {
                            return initialSlider('sideSpeedSquare', 'side length for square tool', 200)
                                .attr('value', SpeedSquare.VARIABLES.side)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('input', function() {
                                    SpeedSquare.VARIABLES.side = $(this).val();
                                });
                        }
                        return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.sideLabel)
                            .append(getSliderForSide(options));
                    }

                    function addXYPlaneRotationController(options) {
                        function getSliderForXYPlaneRotationAngle(options) {
                            return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360)
                                .attr('value', SpeedSquare.VARIABLES.xyPlaneRotationAngle)
                                .on('mouseover', function() {
                                    $(this).attr('title', $(this).val() + ' deg');
                                })
                                .on('input', function() {
                                    SpeedSquare.VARIABLES.xyPlaneRotationAngle = $(this).val();
                                });
                        }
                        return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.xyPlaneRotationAngle)
                            .append(getSliderForXYPlaneRotationAngle(options));
                    }
                    var contextMenuContainer = getContextMenuContainer(options);
                    addSideLengthController(options).appendTo(contextMenuContainer);
                    addXYPlaneRotationController(options).appendTo(contextMenuContainer);
                    contextMenuContainer.appendTo($(options.containerSelectionCriterion));
                },
                deactivate: function(options) {
                    function removeSliderForSide(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForSide(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SpeedSquareToolContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar',
                        xyPlaneRotationAngle: 'xy plane rotation angle: ',
                        sideLabel: 'side length: '
                    };
                }
            }
        };

        COMMON.registerEventForTool({
            toolId: SpeedSquare.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mousemove,
            canvasId: CONSTANTS.canvasId,
            start: SpeedSquare.start,
            stop: SpeedSquare.stop,
            toolName: 'Speed square',
            contextMenu: SpeedSquare.ContextMenu,
            constantTitle: SpeedSquare.CONSTANTS.title
        });
    });

    $(function() {


        var Square = {
            CONSTANTS: {
                id: 'SquareTool',
                selectionId: '#SquareTool',
                class: 'main-tool',
                title: 'Click to draw squares. Click again to disable.',
                previewId: 'previewSquare'
            },
            VARIABLES: {
                side: 10,
                xyPlaneRotationAngle: 360
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
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
                    var
                        div = $('<div></div>')
                        .attr('id', Square.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                        })
                        .appendTo('.utilities')
                        .on('click', function(eClick) {
                            var
                                mouseOptions = {
                                    event: eClick,
                                    relativeTo: $(canvasId)
                                },
                                X = Actions.Mouse.getX(mouseOptions),
                                Y = Actions.Mouse.getY(mouseOptions),
                                side = Square.VARIABLES.side,
                                xyPlaneRotationAngle = (Square.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;

                            CANVASAPI.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
                        })
                        .on('mousemove', function(ev) {
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

                $(canvasId).on('mousemove', function(e) {
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
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
            },
            ContextMenu: {
                activate: function(options) {
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
                        var container = $('#' + options.id);
                        if (container.length === 0)
                            return $('<div></div>').attr('id', options.id).addClass('menu-item');
                        else
                            return container;
                    }

                    function getSliderForSide(options) {
                        return initialSlider('sideSquare', 'side length for square tool', 200, 10)
                            .attr('value', Square.VARIABLES.side)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Square.VARIABLES.side = $(this).val();
                            });
                    }

                    function getSliderForXYPlaneRotationAngle(options) {
                        return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360, 0)
                            .attr('value', Square.VARIABLES.xyPlaneRotationAngle)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val() + ' deg');
                            })
                            .on('input', function() {
                                Square.VARIABLES.xyPlaneRotationAngle = $(this).val();
                            });
                    }
                    var contextMenuContainer = getContextMenuContainer(options);
                    getSliderForSide(options).appendTo(contextMenuContainer);
                    getSliderForXYPlaneRotationAngle(options).appendTo(contextMenuContainer);
                    contextMenuContainer.appendTo($(options.containerSelectionCriterion));
                },
                deactivate: function(options) {
                    function removeSliderForSide(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForSide(options);
                    $('#' + Square.CONSTANTS.previewId).off('mousemove');
                    $('#' + Square.CONSTANTS.previewId).remove();
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'SquareToolContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = Square.ContextMenu;

                    setupToolTips(tool, Square.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        });
                }
            }
        };

        Square.Events.register({
            toolId: Square.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: CONSTANTS.canvasId,
            start: Square.start,
            stop: Square.stop,
            toolName: 'Square'
        });
    });

    $(function() {


        var Circle = {
            CONSTANTS: {
                id: 'CircleTool',
                selectionId: '#CircleTool',
                class: 'main-tool',
                title: 'Click to draw circle. Click again to disable.',
                previewId: 'previewCircle'
            },
            VARIABLES: {
                innerRadius: 10
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
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
                    var
                        div = $('<div></div>')
                        .attr('id', Circle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%'
                        })
                        .appendTo('.utilities')
                        .on('click', function(eClick) {
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
                        .on('mousemove', function(ev) {
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

                $(canvasId).on('mousemove', function(e) {
                    previewer = previewer || $('#' + Circle.CONSTANTS.previewId);
                    previewer.css('top', e.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                        .css('left', e.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                        .css('border', 'thin solid ' + selectedPrimaryColor)
                        .css('height', Circle.VARIABLES.innerRadius * 2)
                        .css('width', Circle.VARIABLES.innerRadius * 2)
                        .show();
                });
            },
            stop: function(options) {
                var event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
                $('#' + Circle.CONSTANTS.previewId).off('mousemove');
                $('#' + Circle.CONSTANTS.previewId).remove();
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider(id, title) {
                        return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                    }

                    function addSliderForRadius(options) {
                        var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                        var radiusSlider = initialSlider("radiusCircle", "innerRadius for circle tool.")
                            .attr('value', Circle.VARIABLES.innerRadius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Circle.VARIABLES.innerRadius = $(this).val();
                            });
                        radiusSlider.appendTo(div);
                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'CircleContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = Circle.ContextMenu;

                    setupToolTips(tool, Circle.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        });
                }
            }
        };
        Circle.Events.register({
            toolId: Circle.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: CONSTANTS.canvasId,
            start: Circle.start,
            stop: Circle.stop,
            toolName: 'Circle'
        });
    });

    $(function() {


        var Disc = {
            CONSTANTS: {
                id: 'DiscTool',
                selectionId: '#DiscTool',
                class: 'main-tool',
                title: 'Click to draw disc. Click again to disable.',
                previewId: 'previewDisc'
            },
            VARIABLES: {
                radius: 10
            },
            start: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
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
                    var
                        div = $('<div></div>')
                        .attr('id', Disc.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                            'border-radius': '50%'
                        })
                        .appendTo('.utilities')
                        .on('click', function(eClick) {
                            mouseOptions = {
                                event: eClick,
                                relativeTo: $(canvasId)
                            };
                            X = Actions.Mouse.getX(mouseOptions);
                            Y = Actions.Mouse.getY(mouseOptions);
                            radius = Disc.VARIABLES.radius;
                            CANVASAPI.fillCirc(X, Y, radius);
                        })
                        .on('mousemove', function(ev) {
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

                $(canvasId).on('mousemove', function(e) {
                    previewer = previewer || $('#' + Disc.CONSTANTS.previewId);
                    previewer.css('top', e.pageY - Disc.VARIABLES.radius - window.scrollY)
                        .css('left', e.pageX - Disc.VARIABLES.radius - window.scrollX)
                        .css('background-color', selectedPrimaryColor)
                        .css('height', Disc.VARIABLES.radius * 2)
                        .css('width', Disc.VARIABLES.radius * 2)
                        .show();
                });
            },
            stop: function(options) {
                var
                    event = options.event || CONSTANTS.Events.mouseclick,
                    canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                $(canvasId).off(event);
                $('#' + Disc.CONSTANTS.previewId).off('mousemove');
                $('#' + Disc.CONSTANTS.previewId).remove();
            },
            ContextMenu: {
                activate: function(options) {
                    function initialSlider() {
                        return $('<input id="radiusDisc" type="range" min="1" max="200" step="1" title="radius for disc tool." />');
                    }

                    function addSliderForRadius(options) {
                        var
                            div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                            slider = initialSlider()
                            .attr('value', Disc.VARIABLES.radius)
                            .on('mouseover', function() {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function() {
                                Disc.VARIABLES.radius = $(this).val();
                            })
                            .appendTo(div);

                        div.appendTo($(options.containerSelectionCriterion));
                    }
                    addSliderForRadius(options);
                },
                deactivate: function(options) {
                    function removeSliderForRadius(options) {
                        $('#' + options.id).remove();
                    }
                    removeSliderForRadius(options);
                },
                getOptions: function() {
                    return {
                        tool: this,
                        id: 'DiscContextMenu',
                        containerSelectionCriterion: '.contextual-tool-bar'
                    };
                }
            },
            Events: {
                register: function(options) {
                    var
                        toolId = options.toolId,
                        tool = $(toolId),
                        contextMenu = Disc.ContextMenu;

                    setupToolTips(tool, Disc.CONSTANTS.title);
                    options.tool = tool;

                    tool.funcToggle('click',
                        function() {
                            activateTool(options);
                            contextMenu.activate(contextMenu.getOptions());
                        },
                        function() {
                            contextMenu.deactivate(contextMenu.getOptions());
                            deactivateTool(options);
                        });
                }
            }
        };

        Disc.Events.register({
            toolId: Disc.CONSTANTS.selectionId,
            event: CONSTANTS.Events.mouseclick,
            canvasId: CONSTANTS.canvasId,
            start: Disc.start,
            stop: Disc.stop,
            toolName: 'Disc'
        });
    });
});
