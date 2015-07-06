$(function () {
    SpeedDot = {
        CONSTANTS: {
            id: 'SpeedDotTool', selectionId: '#SpeedDotTool', class: 'main-tool',
            title: 'Click to draw circles of fixed radius on draw area using mouse movement. Click again to disable.'
        },
        VARIABLES: {
            radius: 4
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                R = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                R = SpeedDot.VARIABLES.radius;
                CANVASAPI.fillCirc(X, Y, R);
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);
            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                var VARS = SpeedDot.VARIABLES;
                function initialSlider() {
                    return $('<input id="radiusSpeedDot" type="range" min="1" max="50" step="1" title="radius for speed dot tool" />');
                }
                function addSliderForRadius(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var slider = initialSlider()
                        .attr('value', VARS.radius)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            VARS.radius = $(this).val();
                        });

                    slider.appendTo(div);
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
                    id: 'SpeedDotContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || SpeedDot.CONSTANTS.selectionId,
                    tool = $(toolId),
                    contextMenu = SpeedDot.ContextMenu;

                setupToolTips(tool, SpeedDot.CONSTANTS.title);
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

    SpeedDot.Events.register({
        toolId: SpeedDot.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedDot.start,
        stop: SpeedDot.stop
    });
});