$(function () {
    "use strict";

    var MandelbrotFractal = {
        CONSTANTS: {
            id: "MandelbrotFractalTool", selectionId: '#MandelbrotFractalTool', class: 'main-tool',
            title: 'Click to draw Mandelbrot Fractal. Click again to disable.'
        },
        VARIABLES: { iterations: 1000, xMax: 1, yMax: 1, xMin: -2, yMin: -1 },
        start: function (options) {
            var event = options.event,
            canvasId = '#' + options.canvasId,
            width = $(canvasId).width(),
            height = $(canvasId).height(),
            XMin = MandelbrotFractal.VARIABLES.xMin,
            XMax = MandelbrotFractal.VARIABLES.xMax,
            YMin = MandelbrotFractal.VARIABLES.yMin,
            YMax = MandelbrotFractal.VARIABLES.yMax;

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
                    ctx.putImageData(img, 0, 0);
                }
                mandelbrot(options);
            }
            $(canvasId).on(event, function () {
                drawMandelbrotFractal({ context: context, XMin: XMin, XMax: XMax, YMin: YMin, YMax: YMax, iterations: MandelbrotFractal.VARIABLES.iterations });
            });
        },
        stop: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId;

            $(canvasId).off(event);
        },
        ContextMenu: {

            activate: function (options) {
                var container = $('<div></div>').attr('id', options.id).addClass('menu-item');
                function initialNumberInput(id, min, max, title) {
                    return $('<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="1" title="' + title + '" />');
                }
                
                function addIterationController(options) {
                    function addSliderForIterations(options) {
                        var
                        slider = initialNumberInput('mandelbrotIterations', '10', options.maxIterationsAllowed, 'Iterations for mandelbrot fractal generation. Beware! If higher values are used, it might crash your browser.')
                            .attr('value', MandelbrotFractal.VARIABLES.iterations)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                var val = $(this).val();
                                if (val > options.maxIterationsAllowed) {
                                    if (confirm('Beware! It might crash your browser. Go back?', 'back', 'No, I want these many iterations')) {
                                        MandelbrotFractal.VARIABLES.iterations = options.maxIterationsAllowed;
                                        return;
                                    }
                                }
                                MandelbrotFractal.VARIABLES.iterations = val;
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.iterationLabel)
                            .append(addSliderForIterations(options));
                }
                container.append(addIterationController(options));
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
                    iterationLabel: 'Iterations: '
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId || MandelbrotFractal.CONSTANTS.selectionId,
                tool = $(toolId),
                contextMenu = MandelbrotFractal.ContextMenu;

                setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                      contextMenu.activate(contextMenu.getOptions());
                      activeTool = $(this);
                  },
                  function () {
                      activeTool = null;
                      contextMenu.deactivate(contextMenu.getOptions());
                      deactivateTool(options);
                  });
            }
        }
    };

    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: MandelbrotFractal.start,
        stop: MandelbrotFractal.stop
    });
});