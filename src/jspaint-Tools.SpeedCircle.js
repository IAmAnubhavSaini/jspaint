$(function () {
    "use strict";

    var SpeedCircle = {
        CONSTANTS: {
            id: 'SpeedCircleTool', selectionId: '#SpeedCircleTool', class: 'main-tool',
            title: 'Click to draw Circles. Click again to disable.'
        },
        VARIABLES: {
            radius: 4
        },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            R = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                R = SpeedCircle.VARIABLES.radius;
                CANVASAPI.drawCircle({ X: X, Y: Y, innerRadius: R, outerRadius: parseInt(R)+1, strokeColor: selectedPrimaryColor });
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var VARS = SpeedCircle.VARIABLES;
                function initialSlider() {
                    return $('<input id="radiusSpeedCircle" type="range" min="1" max="200" step="1" title="radius for speed circle tool" />');
                }
                function addSliderForRadius(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                    slider = initialSlider()
                        .attr('value', VARS.radius)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            VARS.radius = $(this).val();
                        }).appendTo(div);

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
                    id: 'SpeedCircleContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedCircle.ContextMenu;

                setupToolTips(tool, SpeedCircle.CONSTANTS.title);
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

    SpeedCircle.Events.register({
        toolId: SpeedCircle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedCircle.start,
        stop: SpeedCircle.stop,
        toolName: 'Speed circle'
    });
});