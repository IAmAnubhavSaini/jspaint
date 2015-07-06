$(function () {
    "use strict";

    var Disc = {
        CONSTANTS: {
            id: 'DiscTool', selectionId: '#DiscTool', class: 'main-tool',
            title: 'Click to draw disc of fixed radius on draw area using click. Click again to disable.'
        },
        VARIABLES: { radius: 10 },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                mouseOptions = null,
                X = null,
                Y = null,
                radius = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                radius = Disc.VARIABLES.radius;
                CANVASAPI.fillCirc(X, Y, radius);
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
                    return $('<input id="radiusDisc" type="range" min="1" max="200" step="1" title="radius for disc tool." />');
                }
                function addSliderForRadius(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var slider = initialSlider()
                        .attr('value', Disc.VARIABLES.radius)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Disc.VARIABLES.radius = $(this).val();
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
                    id: 'DiscContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Disc.CONSTANTS.selectionId,
                             tool = $(toolId),
                             contextMenu = Disc.ContextMenu;

                setupToolTips(tool, Disc.CONSTANTS.title);
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

    Disc.Events.register({
        toolId: Disc.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Disc.start,
        stop: Disc.stop
    });
});