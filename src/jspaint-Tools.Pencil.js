$(function () {
    Pencil = {
        CONSTANTS: {
            id: "PencilTool", selectionId: '#PencilTool', class: 'main-tool',
            title: 'Click to draw free hand lines of fixed width on draw area using click+drag. Click again to disable.'
        },
        VARIABLES: {
            width: 2,
            height: 2,
            LastPoint: { X: -1, Y: -1 }
        },
        start: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            width = null,
            last = null;

            function setLastPoint(X, Y) {
                Pencil.VARIABLES.LastPoint.X = X;
                Pencil.VARIABLES.LastPoint.Y = Y;
            }
            function getLastPoint() {
                return {
                    X: Pencil.VARIABLES.LastPoint.X,
                    Y: Pencil.VARIABLES.LastPoint.Y
                };
            }
            function drawLineSegmentFromLastPoint(options) {
                var context = options.context,
                    last = options.last,
                    current = options.current,
                    width = options.width;

                context.beginPath();
                context.moveTo(last.X, last.Y);
                context.lineTo(current.X, current.Y);
                context.lineWidth = width;
                context.strokeStyle = selectedPrimaryColor;
                context.stroke();
            }
            $(canvasId).on(event, function (e) {
                mouseOptions = { event: e, relativeTo: $(this) };
                if (e.buttons !== undefined) {
                    if (e.buttons === 1) {
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        width = Pencil.VARIABLES.width;
                        last = getLastPoint();
                        if (last.X != -1) {
                            drawLineSegmentFromLastPoint({
                                context: context,
                                last: last,
                                current: { X: X, Y: Y },
                                width: width
                            });
                        }
                        CANVASAPI.fillCirc(X, Y, width / 2);
                        setLastPoint(X, Y);
                    } else {
                        Pencil.VARIABLES.LastPoint.X = -1;
                        Pencil.VARIABLES.LastPoint.Y = -1;
                    }
                }
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mousemove,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);
            Pencil.VARIABLES.LastPoint.X = -1;
            Pencil.VARIABLES.LastPoint.Y = -1;
            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return $('<input id="widthPencil" type="range" min="1" max="100" step="1" title="width for pencil tool." />');
                }
                function addSliderForLineWidth(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var slider = initialSlider()
                        .attr('value', Pencil.VARIABLES.width)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Pencil.VARIABLES.width = $(this).val();
                        });

                    slider.appendTo(div);
                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForLineWidth(options);
            },
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
                    $('#' + options.id).remove();
                }
                removeSliderForLineWidth(options);
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'PencilContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Pencil.CONSTANTS.selectionId,
                    tool = $(toolId),
                    contextMenu = Pencil.ContextMenu;

                setupToolTips(tool, Pencil.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                  function () {
                      activateTool(options);
                      contextMenu.activate(contextMenu.getOptions());
                      activeTool = $(this);
                  },
                  function () {
                      activeTool = null;
                      deactivateTool(options);
                      contextMenu.deactivate(contextMenu.getOptions());
                  }
                );
            }
        }
    };

    Pencil.Events.register({
        toolId: Pencil.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mousemove,
        canvasId: CONSTANTS.canvasId,
        start: Pencil.start,
        stop: Pencil.stop
    });
});