$(function () {
    "use strict";

    var PointWalker = {
        CONSTANTS: {
            id: 'PointWalkerTool', selectionId: '#PointWalkerTool', class: 'main-tool',
            title: 'Click to draw random point walker. Click again to disable.'
        },
        VARIABLES: { steps: 100 },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            i = 0;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(canvasId) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                for (i = 0; i < PointWalker.VARIABLES.steps; i++) {
                    CANVASAPI.fillCirc(X, Y, 1);
                    X += Math.random() < 0.5 ? -1 : 1;
                    Y -= Math.random() < 0.5 ? -1 : 1;
                }
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        ContextMenu: {
            activate: function (options) {
                var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function getInputElement(id, min, max, title) {
                    return $('<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="1" title="' + title + '" />');
                }

                function addStepController(options) {
                    function createStepSlider(options) {
                        var
                        slider = getInputElement('pointWalkerSptes', '500', options.maxStepsAllowed, 'Steps for random point walk generation.')
                            .attr('value', PointWalker.VARIABLES.steps)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('change', function () {
                                PointWalker.VARIABLES.steps = $(this).val();
                            });
                        return slider;
                    }
                    return $('<label style="color: #FFFFFF; font-size: 10px;"></label>')
                            .append(options.stepLabel)
                            .append(createStepSlider(options));
                }
                container.append(addStepController(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                $('#' + options.id).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'PointWalkerContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar',
                    maxStepsAllowed: 100000,
                    stepLabel: 'Steps: ',
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = PointWalker.ContextMenu;

                setupToolTips(tool, PointWalker.CONSTANTS.title);
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

    PointWalker.Events.register({
        toolId: PointWalker.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: PointWalker.start,
        stop: PointWalker.stop,
        toolName: 'Point Walker'
    });
});