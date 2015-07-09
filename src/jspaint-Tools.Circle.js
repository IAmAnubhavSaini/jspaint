$(function () {
    "use strict";

    var Circle = {
        CONSTANTS: {
            id: 'CircleTool', selectionId: '#CircleTool', class: 'main-tool',
            title: 'Click to draw circle. Click again to disable.',
            previewId: 'previewCircle'
        },
        VARIABLES: { innerRadius: 10 },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            innerRadius = null,
            outerRadius = null,
            previewer = null,
            canvasOffsetLeft = null,
            canvasOffsetTop = null,
            canvasHeight = $(canvasId).height(),
            canvasWidth = $(canvasId).width(),
            previewOffsetLeft = null,
            previewOffsetTop = null;

            function generatePreview(options) {
                var
                div = $('<div></div>')
                        .attr('id', Circle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '100',
                            'border-radius': '50%'
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            mouseOptions = { event: eClick, relativeTo: $(canvasId) };
                            X = Actions.Mouse.getX(mouseOptions);
                            Y = Actions.Mouse.getY(mouseOptions);
                            innerRadius = Circle.VARIABLES.innerRadius;
                            outerRadius = parseInt(Circle.VARIABLES.innerRadius) + 1;
                            CANVASAPI.drawCircle({ X: X, Y: Y, innerRadius: innerRadius, outerRadius: outerRadius, strokeColor: selectedPrimaryColor });
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                                    .css('left', ev.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                                    .css('border', 'thin solid ' + selectedPrimaryColor)
                                    .css('height', Circle.VARIABLES.innerRadius * 2)
                                    .css('width', Circle.VARIABLES.innerRadius * 2);

                            previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Circle.VARIABLES.innerRadius);
                            previewOffsetTop = parseInt($(this).offset().top) + parseInt(Circle.VARIABLES.innerRadius);
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }
            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Circle.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Circle.VARIABLES.innerRadius - window.scrollY)
                        .css('left', e.pageX - Circle.VARIABLES.innerRadius - window.scrollX)
                        .css('border', 'thin solid ' + selectedPrimaryColor)
                        .css('height', Circle.VARIABLES.innerRadius * 2)
                        .css('width', Circle.VARIABLES.innerRadius * 2)
                        .show();
            });
        },
        stop: function (options) {
            var event = options.event || CONSTANTS.Events.mouseclick,
                canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Circle.CONSTANTS.previewId).off('mousemove');
            $('#' + Circle.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title) {
                    return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                }
                function addSliderForRadius(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                    var radiusSlider = initialSlider("radiusCircle", "innerRadius for circle tool.")
                                    .attr('value', Circle.VARIABLES.innerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Circle.VARIABLES.innerRadius = $(this).val();
                                    });
                    radiusSlider.appendTo(div);
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
                    id: 'CircleContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var toolId = options.toolId || Circle.CONSTANTS.selectionId,
                             tool = $(toolId),
                             contextMenu = Circle.ContextMenu;

                setupToolTips(tool, Circle.CONSTANTS.title);
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
    Circle.Events.register({
        toolId: Circle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Circle.start,
        stop: Circle.stop
    });
});
