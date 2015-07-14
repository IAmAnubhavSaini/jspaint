$(function () {
    "use strict";

    var SpeedDot = {
        CONSTANTS: {
            id: 'SpeedDotTool', selectionId: '#SpeedDotTool', class: 'main-tool',
            title: 'Click to draw dots. Click again to disable.'
        },
        VARIABLES: {},
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null;

            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                CANVASAPI.fillCirc(X, Y, 1);
            });
        },
        stop: function (options) {
            $('#' + options.canvasId).off(options.event);
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId);

                setupToolTips(tool, SpeedDot.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                  },
                  function () {
                      deactivateTool(options);
                  });
            }
        }
    };

    SpeedDot.Events.register({
        toolId: SpeedDot.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: SpeedDot.start,
        stop: SpeedDot.stop,
        toolName: 'Speed dot'
    });
});