$(function () {
    "use strict";

    var Square = {
        CONSTANTS: {
            id: 'SquareTool', selectionId: '#SquareTool', class: 'main-tool',
            title: 'Click to draw squares of fixed side on draw area using click. Click again to disable.'
        },
        VARIABLES: {
            side: 10
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                        mouseOptions = null,
                        X = null,
                        Y = null,
                        side = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                side = Square.VARIABLES.side;
                CANVASAPI.fillSquare(X, Y, side);
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);
            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return $('<input id="sideSquare" type="range" min="1" max="200" step="1" title="side length for square tool" />');
                }
                function addSliderForSide(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var slider = initialSlider()
                        .attr('value', Square.VARIABLES.side)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Square.VARIABLES.side = $(this).val();
                        });

                    slider.appendTo(div);
                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForSide(options);
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
                    id: 'SquareToolContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Square.CONSTANTS.selectionId,
                    tool = $(toolId),
                    contextMenu = Square.ContextMenu;

                setupToolTips(tool, Square.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                    function () {
                        activateTool(options);
                        contextMenu.activate(contextMenu.getOptions());
                        activeTool = tool;
                    },
                    function () {
                        activeTool = null;
                        contextMenu.deactivate(contextMenu.getOptions());
                        deactivateTool(options);
                    });
            }
        }
    };

    Square.Events.register({
        toolId: Square.CONSTANTS.selectionId,
        containerId: 'jspaint-tools',
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Square.start,
        stop: Square.stop
    });
});