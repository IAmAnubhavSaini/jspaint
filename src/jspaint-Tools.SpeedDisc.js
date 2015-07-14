$(function () {
    "use strict";

    var SpeedDisc = {
        CONSTANTS: {
            id: 'SpeedDiscTool', selectionId: '#SpeedDiscTool', class: 'main-tool',
            title: 'Click to draw Discs. Click again to disable.'
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
                R = SpeedDisc.VARIABLES.radius;
                CANVASAPI.fillCirc(X, Y, R);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var VARS = SpeedDisc.VARIABLES;
                function initialSlider() {
                    return $('<input id="radiusSpeedDisc" type="range" min="1" max="200" step="1" title="radius for speed disc tool" />');
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
                    id: 'SpeedDiscContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = SpeedDisc.ContextMenu;

                setupToolTips(tool, SpeedDisc.CONSTANTS.title);
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

    SpeedDisc.Events.register({
        toolId: SpeedDisc.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedDisc.start,
        stop: SpeedDisc.stop,
        toolName: 'Speed disc'
    });
});