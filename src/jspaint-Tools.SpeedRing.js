$(function () {
    "use strict";

    var SpeedRing = {
        CONSTANTS: {
            id: 'SpeedRingTool', selectionId: '#SpeedRingTool', class: 'main-tool',
            title: 'Click to draw speed rings. Click again to disable.'
        },
        VARIABLES: {
            innerRadius: 10, outerRadius: 20
        },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            innerRadius = null,
            outerRadius = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                innerRadius = SpeedRing.VARIABLES.innerRadius;
                outerRadius = SpeedRing.VARIABLES.outerRadius;
                CANVASAPI.fillRing({
                    X: X,
                    Y: Y,
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
                    strokeColor: selectedPrimaryColor,
                    fillColor: selectedAlternativeColor
                });
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
                function addSliderForRadius(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),

                    innerSlider = initialSlider("innerRadiusSpeedRing", "inner radius for speed ring tool.")
                                    .attr('value', SpeedRing.VARIABLES.innerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        SpeedRing.VARIABLES.innerRadius = $(this).val();
                                    })
                                    .appendTo(div),

                    outerSlider = initialSlider("outerRadiusSpeedRing", "outer radius for speed ring tool.")
                                    .attr('value', SpeedRing.VARIABLES.outerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        SpeedRing.VARIABLES.outerRadius = $(this).val();
                                    })
                                    .appendTo(div);

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
                    id: 'SpeedRingContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedRing.ContextMenu;

                setupToolTips(tool, SpeedRing.CONSTANTS.title);
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

    SpeedRing.Events.register({
        toolId: SpeedRing.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedRing.start,
        stop: SpeedRing.stop,
        toolName: 'Speed ring'
    });
});