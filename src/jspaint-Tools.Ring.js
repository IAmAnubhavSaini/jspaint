$(function () {
    "use strict";

    var Ring = {
        CONSTANTS: {
            id: 'RingTool', selectionId: '#RingTool', class: 'main-tool',
            title: 'Click to draw ring. Click again to disable.'
        },
        VARIABLES: { innerRadius: 10, outerRadius: 20 },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                radius = null,
                innerRadius = null,
                outerRadius = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                innerRadius = Ring.VARIABLES.innerRadius;
                outerRadius = Ring.VARIABLES.outerRadius;
                CANVASAPI.fillRing({ X: X, Y: Y, innerRadius: innerRadius, outerRadius: outerRadius });
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
                    var innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                                    .attr('value', Ring.VARIABLES.innerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Ring.VARIABLES.innerRadius = $(this).val();
                                    });
                    var outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                                    .attr('value', Ring.VARIABLES.outerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Ring.VARIABLES.outerRadius = $(this).val();
                                    });
                    outerSlider.appendTo(div);
                    innerSlider.appendTo(div);
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
                    id: 'RingContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Ring.CONSTANTS.selectionId,
                             tool = $(toolId),
                             contextMenu = Ring.ContextMenu;

                setupToolTips(tool, Ring.CONSTANTS.title);
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
    Ring.Events.register({
        toolId: Ring.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Ring.start,
        stop: Ring.stop
    });
});
