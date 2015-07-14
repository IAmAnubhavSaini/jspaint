$(function () {
    "use strict";

    var SpeedPencil = {
        CONSTANTS: {
            id: 'SpeedPencilTool', selectionId: '#SpeedPencilTool', class: 'main-tool',
            title: 'Click to draw draw free hand lines. Click again to disable.'
        },
        VARIABLES: {
            width: 2,
            LastPoint: { X: -1, Y: -1 }
        },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            width = null,
            last = null,
            LastPoint = {
                get: function () {
                    return {
                        X: SpeedPencil.VARIABLES.LastPoint.X,
                        Y: SpeedPencil.VARIABLES.LastPoint.Y
                    };
                },
                set: function (x, y) {
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
            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                width = SpeedPencil.VARIABLES.width;
                last = LastPoint.get();
                if (last.X != -1) {
                    drawLineSegmentFromLastPoint({
                        context: context,
                        last: last,
                        current: { X: X, Y: Y },
                        width: width
                    });
                }
                CANVASAPI.fillCirc(X, Y, width / 2);
                LastPoint.set(X, Y);
            });
        },
        stop: function (options) {
            SpeedPencil.VARIABLES.LastPoint.X = -1;
            SpeedPencil.VARIABLES.LastPoint.Y = -1;
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return $('<input id="widthSpeedPencil" type="range" min="1" max="200" step="1" title="width for speed pencil tool." />');
                }
                function addSliderForLineWidth(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                    slider = initialSlider()
                        .attr('value', SpeedPencil.VARIABLES.width)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            SpeedPencil.VARIABLES.width = $(this).val();
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
                    id: 'SpeedPencilContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedPencil.ContextMenu;

                setupToolTips(tool, SpeedPencil.CONSTANTS.title);
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
        }
    };

    SpeedPencil.Events.register({
        toolId: SpeedPencil.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedPencil.start,
        stop: SpeedPencil.stop,
        toolName: 'Speed pencil'
    });
});