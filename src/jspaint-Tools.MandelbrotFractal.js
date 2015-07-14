$(function () {
    "use strict";

    var MandelbrotFractal = {
        CONSTANTS: {
            id: "MandelbrotFractalTool", selectionId: '#MandelbrotFractalTool', class: 'main-tool',
            title: 'Click to draw Mandelbrot Fractal. Click again to disable.',
            maxHeight: -1,
            maxWidth: -1
        },
        VARIABLES: { iterations: 1000, xMax: 1, yMax: 1, xMin: -2, yMin: -1, height: -1, width: -1 },
        start: function (options) {
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
                                }
                                else if (c < 2) {
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
            $(canvasId).on(event, function (e) {
                var
                mouseOptions = { event: e, relativeTo: $(canvasId) },
                X = Actions.Mouse.getX(mouseOptions),
                Y = Actions.Mouse.getY(mouseOptions),
                startX = X - Math.floor(MandelbrotFractal.VARIABLES.width / 2),
                startY = Y - Math.floor(MandelbrotFractal.VARIABLES.height / 2);
                if (startX < 0) { startX = 0; }
                if (startY < 0) { startY = 0; }
                if (startX + Math.floor(MandelbrotFractal.VARIABLES.width) > MandelbrotFractal.CONSTANTS.maxWidth) {
                    startX -= startX + Math.floor(MandelbrotFractal.VARIABLES.width) - MandelbrotFractal.CONSTANTS.maxWidth;
                }
                if (startY + Math.floor(MandelbrotFractal.VARIABLES.height) > MandelbrotFractal.CONSTANTS.maxHeight) {
                    startY -= startY + Math.floor(MandelbrotFractal.VARIABLES.height) - MandelbrotFractal.CONSTANTS.maxHeight;
                }
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
                var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return $('<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="1" title="' + title + '" />');
                }

                function addIterationController(options) {
                    function createIterationSlider(options) {
                        var
                        slider = getInputElement('mandelbrotIterations', '10', options.maxIterationsAllowed, 'Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.')
                            .attr('value', MandelbrotFractal.VARIABLES.iterations)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                var val = $(this).val();
                                if (val > options.maxIterationsAllowed) {
                                    if (confirm('Beware! It might crash your browser. Go back?', 'back', 'No, I want these many iterations')) {
                                        val = options.maxIterationsAllowed;
                                    }
                                }
                                MandelbrotFractal.VARIABLES.iterations = val;
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.iterationLabel)
                            .append(createIterationSlider(options));
                }
                function addHeightController(options) {
                    function createHeightSlider(options) {
                        var
                        slider = getInputElement('mandelbrotHeight', '100', MandelbrotFractal.CONSTANTS.maxHeight, 'Height for mandelbrot fractal generation.')
                            .attr('value', MandelbrotFractal.CONSTANTS.maxHeight)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                var val = $(this).val();
                                if (val > MandelbrotFractal.CONSTANTS.maxHeight) {
                                    val = MandelbrotFractal.CONSTANTS.maxHeight;
                                }
                                MandelbrotFractal.VARIABLES.height = val;
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.heightLabel)
                            .append(createHeightSlider(options));
                }
                function addWidthController(options) {
                    function createWidthSlider(options) {
                        var
                        slider = getInputElement('mandelbrotWidth', '100', MandelbrotFractal.CONSTANTS.maxWidth, 'Width for mandelbrot fractal generation.')
                            .attr('value', MandelbrotFractal.CONSTANTS.maxWidth)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                var val = $(this).val();
                                if (val > MandelbrotFractal.CONSTANTS.maxWidth) {
                                    val = MandelbrotFractal.CONSTANTS.maxWidth;
                                }
                                MandelbrotFractal.VARIABLES.width = val;
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.widthLabel)
                            .append(createWidthSlider(options));
                }
                function addXMaxController(options) {
                    function createXMaxSlider(options) {
                        var
                        slider = getInputElement('mandelbrotXMax', '0', '3', 'XMax for mandelbrot fractal generation.')
                            .attr('value', '1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.xMax = $(this).val();
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.xMaxLabel)
                            .append(createXMaxSlider(options));
                }
                function addYMaxController(options) {
                    function createYMaxSlider(options) {
                        var
                        slider = getInputElement('mandelbrotYMax', '0', '3', 'YMax for mandelbrot fractal generation.')
                            .attr('value', '1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.yMax = $(this).val();
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.yMaxLabel)
                            .append(createYMaxSlider(options));
                }
                function addXMinController(options) {
                    function createXMinSlider(options) {
                        var
                        slider = getInputElement('mandelbrotXMin', '-3', '1', 'XMin for mandelbrot fractal generation.')
                            .attr('value', '-2')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.xMin = $(this).val();
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.xMinLabel)
                            .append(createXMinSlider(options));
                }
                function addYMinController(options) {
                    function createYMinSlider(options) {
                        var
                        slider = getInputElement('mandelbrotYMin', '-2', '1', 'YMin for mandelbrot fractal generation.')
                            .attr('value', '-1')
                            .attr('disabled', 'disabled')
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                MandelbrotFractal.VARIABLES.yMin = $(this).val();
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.yMinLabel)
                            .append(createYMinSlider(options));
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
                var
                toolId = options.toolId,
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



    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: '#' + CONSTANTS.canvasId,
        start: MandelbrotFractal.start,
        stop: MandelbrotFractal.stop,
        toolName: 'Mandelbrot fractal'
    });
});