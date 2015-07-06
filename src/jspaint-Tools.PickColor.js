$(function () {
    "use strict";

    var PickColor = {
        CONSTANTS: {
            id: 'pick-color', selectionId: '#pick-color', class: 'string-menu-item', containerId: 'PickColorTool',
            title: 'Click to pick color under mouse pointer tip; picks until some other tool is selected. Click again to disable.'
        },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            data = null,
            r = 0,
            g = 0,
            b = 0,
            a = 0;
            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                data = context.getImageData(X - 0.5, Y - 0.5, X + 0.5, Y + 0.5).data;
                r = data[0];
                g = data[1];
                b = data[2];
                a = data[3];
                selectedPrimaryColor = context.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            });
        },
        stop: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId || PickColor.CONSTANTS.selectionId,
                tool = $(toolId);

                setupToolTips(tool, PickColor.CONSTANTS.title);
                options.tool = tool;
                tool.funcToggle('click',
                    function () {
                        activateTool(options);
                        activeTool = $(this);
                    },
                    function () {
                        activeTool = null;
                        deactivateTool(options);
                    });
            }
        }
    };

    PickColor.Events.register({
        toolId: PickColor.CONSTANTS.selectionId,
        containerId: PickColor.CONSTANTS.containerId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: PickColor.start,
        stop: PickColor.stop
    });
});