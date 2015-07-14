$(function () {
    "use strict";

    var SpeedRectangle = {
        CONSTANTS: {
            id: 'SpeedRectangleTool',
            selectionId: '#SpeedRectangleTool',
            class: 'main-tool',
            title: 'Click to draw speed rectangles. Click again to disable.',
        },
        VARIABLES: {
            length: 20, breadth: 10
        },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            side = null,
            xyPlaneRotationAngle = null;

            $(canvasId).on('mousemove', function (e) {
                var
                mouseOptions = { event: e, relativeTo: $(canvasId) },
                X = Actions.Mouse.getX(mouseOptions),
                Y = Actions.Mouse.getY(mouseOptions),
                length = SpeedRectangle.VARIABLES.length,
                breadth = SpeedRectangle.VARIABLES.breadth;

                context.fillRect(X - length / 2, Y - breadth / 2, length, breadth);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                }
                function addSliderForLength(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');

                    var lengthSlider = initialSlider(options.lengthId, options.lengthTitle)
                        .attr('value', SpeedRectangle.VARIABLES.length)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            SpeedRectangle.VARIABLES.length = $(this).val();
                        })
                        .appendTo(div);

                    var breadthSlider = initialSlider(options.breadthId, options.breadthTitle)
                        .attr('value', SpeedRectangle.VARIABLES.breadth)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            SpeedRectangle.VARIABLES.breadth = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForLength(options);

            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.lengthId).remove();
                    $('#' + options.breadthId).remove();
                }
                removeSliderForSide(options);
                $('#' + SpeedRectangle.CONSTANTS.previewId).off('mousemove');
                $('#' + SpeedRectangle.CONSTANTS.previewId).remove();
            },
            getOptions: function () {
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
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedRectangle.ContextMenu;

                setupToolTips(tool, SpeedRectangle.CONSTANTS.title);
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

    SpeedRectangle.Events.register({
        toolId: SpeedRectangle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedRectangle.start,
        stop: SpeedRectangle.stop,
        toolName: 'Speed rectangle'
    });
});