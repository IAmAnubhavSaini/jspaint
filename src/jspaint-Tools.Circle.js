$(function () {
    "use strict";

    var Circle = {
        CONSTANTS: {
            id: 'CircleTool', selectionId: '#CircleTool', class: 'main-tool',
            title: 'Click to draw circle. Click again to disable.'
        },
        VARIABLES: { innerRadius: 10},
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                innerRadius = null,
                outerRadius = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                innerRadius = Circle.VARIABLES.innerRadius;
                outerRadius = parseInt(Circle.VARIABLES.innerRadius) + 1;
                CANVASAPI.drawCircle({ X: X, Y: Y, innerRadius: innerRadius, outerRadius: outerRadius, strokeColor: selectedPrimaryColor });
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                }
                function addSliderForRadius(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var radiusSlider = initialSlider("radiusCircle", "innerRadius for circle tool.")
                                    .attr('value', Circle.VARIABLES.innerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Circle.VARIABLES.innerRadius = $(this).val();
                                    });
                    radiusSlider.appendTo(div);
                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForRadius(options);
            },
            deactivate: function (options) {
                function removeSliderForRadius(options) {
                    $('#' + options.id).remove();
                }
                removeSliderForRadius(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'CircleContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Circle.CONSTANTS.selectionId,
                             tool = $(toolId),
                             contextMenu = Circle.ContextMenu;

                setupToolTips(tool, Circle.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                      contextMenu.activate(contextMenu.getOptions());
                      activeTool = tool;
                  },
                  function () {
                      activeTool = null;
                      deactivateTool(options);
                      contextMenu.deactivate(contextMenu.getOptions());
                  });
            }
        }
    };
    Circle.Events.register({
        toolId: Circle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Circle.start,
        stop: Circle.stop
    });
});
