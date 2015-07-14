$(function () {
    "use strict";

    var SpeedSquare = {
        CONSTANTS: {
            id: 'SpeedSquareTool',
            selectionId: '#SpeedSquareTool',
            class: 'main-tool',
            title: 'Click to draw speed squares. Click again to disable.',
        },
        VARIABLES: {
            side: 10, xyPlaneRotationAngle: 360
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
                side = SpeedSquare.VARIABLES.side,
                xyPlaneRotationAngle = (SpeedSquare.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;

                CANVASAPI.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title, max) {
                    return $('<input id="' + id + '" type="range" min="1" max="' + max + '" step="1" title="' + title + '" />');
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
                                .on('mouseover', function () {
                                    $(this).attr('title', $(this).val());
                                })
                                .on('input', function () {
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
                                .on('mouseover', function () {
                                    $(this).attr('title', $(this).val() + ' deg');
                                })
                                .on('input', function () {
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
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.id).remove();
                }
                removeSliderForSide(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'SpeedSquareToolContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    xyPlaneRotationAngle: 'xy plane rotation angle: ',
                    sideLabel: 'side length: '
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedSquare.ContextMenu;

                setupToolTips(tool, SpeedSquare.CONSTANTS.title);
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

    SpeedSquare.Events.register({
        toolId: SpeedSquare.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedSquare.start,
        stop: SpeedSquare.stop,
        toolName: 'Speed square'
    });
});