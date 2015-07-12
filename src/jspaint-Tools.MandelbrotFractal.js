$(function () {
    "use strict";

    var MandelbrotFractal = {
        CONSTANTS: {
            id: "MandelbrotFractalTool", selectionId: '#MandelbrotFractalTool', class: 'main-tool',
            title: 'Click to draw Mandelbrot Fractal. Click again to disable.'
        },
        VARIABLES: {},
        start: function (options) {
            var event = options.event,
            canvasId = '#' + options.canvasId,
            width = $(canvasId).width(),
            height = $(canvasId).height();
            
            function drawMandelbrotFractal(options) {
                function mandelIter(cx, cy, maxIter) {
                    var x = 0.0;
                    var y = 0.0;
                    var xx = 0;
                    var yy = 0;
                    var xy = 0;

                    var i = maxIter;
                    while (i-- && xx + yy <= 4) {
                        xy = x * y;
                        xx = x * x;
                        yy = y * y;
                        x = xx - yy + cx;
                        y = xy + xy + cy;
                    }
                    return maxIter - i;
                }

                function mandelbrot(context, xmin, xmax, ymin, ymax, iterations) {
                    
                    var ctx = context;
                    var img = ctx.getImageData(0, 0, width, height);
                    var pix = img.data;

                    for (var ix = 0; ix < width; ++ix) {
                        for (var iy = 0; iy < height; ++iy) {
                            var x = xmin + (xmax - xmin) * ix / (width - 1);
                            var y = ymin + (ymax - ymin) * iy / (height - 1);
                            var i = mandelIter(x, y, iterations);
                            var ppos = 4 * (width * iy + ix);

                            if (i > iterations) {
                                pix[ppos] = 0;
                                pix[ppos + 1] = 0;
                                pix[ppos + 2] = 0;
                            } else {
                                var c = 3 * Math.log(i) / Math.log(iterations - 1.0);

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
                mandelbrot(context, -2, 1, -1, 1, 1000);
            }
            $(canvasId).on(event, function () {
                drawMandelbrotFractal(options)
            });
        },
        stop: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId;

            $(canvasId).off(event);
        },
        
        Events: {
            register: function (options) {
                var
                toolId = options.toolId || MandelbrotFractal.CONSTANTS.selectionId,
                tool = $(toolId);
                
                setupToolTips(tool, MandelbrotFractal.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                      activeTool = $(this);
                  },
                  function () {
                      activeTool = null;
                      deactivateTool(options);
                  });
            }
        }
    };

    MandelbrotFractal.Events.register({
        toolId: MandelbrotFractal.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: MandelbrotFractal.start,
        stop: MandelbrotFractal.stop
    });
});