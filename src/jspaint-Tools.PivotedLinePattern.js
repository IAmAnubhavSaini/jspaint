$(function () {
    "use strict";

    var PivotedLinePattern = {
        CONSTANTS: {
            id: "PivotedLinePatternTool", selectionId: '#PivotedLinePatternTool', class: 'main-tool',
            title: 'Click to draw amazing pattern. Click again to disable.'
        },
        VARIABLES: {
            width: 2,
            LastPoint: { X: -1, Y: -1 }
        },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mousemove,
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
                context.endPath();
            }

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                if (e.buttons !== undefined) {
                    if (e.buttons === 1) {
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        width = PivotedLinePattern.VARIABLES.width;
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
                    } else {
                        PivotedLinePattern.VARIABLES.LastPoint.X = -1;
                        PivotedLinePattern.VARIABLES.LastPoint.Y = -1;
                    }
                }
            });
        },
        stop: function (options) {
            var
            event = options.event || CONSTANTS.Events.mousemove,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return $('<input id="widthPivotedLinePattern" type="range" min="1" max="200" step="1" title="width for pivoted line pattern tool." />');
                }
                function addSliderForLineWidth(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                    slider = initialSlider()
                        .attr('value', PivotedLinePattern.VARIABLES.width)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            PivotedLinePattern.VARIABLES.width = $(this).val();
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
                    id: 'PivotedLinePatternContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId || PivotedLinePattern.CONSTANTS.selectionId,
                tool = $(toolId),
                contextMenu = PivotedLinePattern.ContextMenu;

                setupToolTips(tool, PivotedLinePattern.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                      contextMenu.activate(contextMenu.getOptions());
                      activeTool = $(this);
                  },
                  function () {
                      activeTool = null;
                      deactivateTool(options);
                      contextMenu.deactivate(contextMenu.getOptions());
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
        stop: PivotedLinePattern.stop
    });
});