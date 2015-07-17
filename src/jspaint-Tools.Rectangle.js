$(function () {
    "use strict";

    var Rectangle = {
        CONSTANTS: {
            id: 'RectangleTool',
            selectionId: '#RectangleTool',
            class: 'main-tool',
            title: 'Click to draw rectangles. Click again to disable.',
            previewId: 'previewRectangle'
        },
        VARIABLES: {
            length: 20, breadth: 10, xyPlaneRotationAngle: 360
        },
        start: function (options) {
            var
            event = options.event,
            canvasId = '#' + options.canvasId,
            mouseOptions = null,
            X = null,
            Y = null,
            length = null,
            breadth = null,
            previewer = null,
            canvasOffsetLeft = $(canvasId).offset().left,
            canvasOffsetTop = $(canvasId).offset().top,
            canvasHeight = $(canvasId).height(),
            canvasWidth = $(canvasId).width(),
            previewOffsetLeft = null,
            previewOffsetTop = null,
            xyPlaneRotationAngle = null;

            function generatePreview(options) {
                var
                div = $('<div></div>')
                        .attr('id', Rectangle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '2',
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            var
                            mouseOptions = { event: eClick, relativeTo: $(canvasId) },
                            X = Actions.Mouse.getX(mouseOptions),
                            Y = Actions.Mouse.getY(mouseOptions),
                            length = Rectangle.VARIABLES.length,
                            breadth = Rectangle.VARIABLES.breadth;
                            xyPlaneRotationAngle = (Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;
                            CANVASAPI.fillRotatedRectangle(X - length / 2, Y - breadth / 2, length, breadth, xyPlaneRotationAngle);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                                    .css('left', ev.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                                    .css('background-color', selectedPrimaryColor)
                                    .css('border', 'thin dashed ' + selectedAlternativeColor)
                                    .css('height', Rectangle.VARIABLES.breadth)
                                    .css('width', Rectangle.VARIABLES.length);

                            previewOffsetLeft = $(this).offset().left + Rectangle.VARIABLES.length / 2;
                            previewOffsetTop = $(this).offset().top + Rectangle.VARIABLES.breadth / 2;
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || canvasOffsetLeft + canvasWidth < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || canvasOffsetTop + canvasHeight < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }
            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Rectangle.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Rectangle.VARIABLES.breadth / 2 - window.scrollY)
                        .css('left', e.pageX - Rectangle.VARIABLES.length / 2 - window.scrollX)
                        .css('background-color', selectedPrimaryColor)
                        .css('height', Rectangle.VARIABLES.breadth)
                        .css('width', Rectangle.VARIABLES.length)
                        .css('transform', 'rotate(' + parseInt((Rectangle.VARIABLES.xyPlaneRotationAngle * Math.PI)) / 180 + 'rad)')
                        .show();
            });
        },
        stop: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
            $('#' + Rectangle.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                var container = $('<div></div>').attr('id', options.id).addClass('menu-item');

                function initialSlider(id, title, max) {
                    return $('<input id="' + id + '" type="range" min="1" max="' + max + '" step="1" title="' + title + '" />');
                }

                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360)
                            .attr('value', Rectangle.VARIABLES.xyPlaneRotationAngle)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val() + ' deg');
                            })
                            .on('input', function () {
                                Rectangle.VARIABLES.xyPlaneRotationAngle = $(this).val();
                            });
                }

                function addSliderForLength(options) {
                    var lengthSlider = initialSlider(options.lengthId, options.lengthTitle, 400)
                        .attr('value', Rectangle.VARIABLES.length)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.length = $(this).val();
                        })
                        .appendTo(container);

                    var breadthSlider = initialSlider(options.breadthId, options.breadthTitle, 400)
                        .attr('value', Rectangle.VARIABLES.breadth)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.breadth = $(this).val();
                        })
                        .appendTo(container);
                }

                addSliderForLength(options);
                container.append(getSliderForXYPlaneRotationAngle(options));
                container.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.lengthId).remove();
                    $('#' + options.breadthId).remove();
                    $('#xyPlaneRotationAngle').remove();
                }
                removeSliderForSide(options);
                $('#' + Rectangle.CONSTANTS.previewId).off('mousemove');
                $('#' + Rectangle.CONSTANTS.previewId).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'RectangleContextMenu',
                    lengthId: 'lengthRectangle',
                    breadthId: 'breadthRectangle',
                    lengthTitle: 'length for rectangle',
                    breadthTitle: 'breadth for rectangle',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = Rectangle.ContextMenu;

                setupToolTips(tool, Rectangle.CONSTANTS.title);
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

    Rectangle.Events.register({
        toolId: Rectangle.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Rectangle.start,
        stop: Rectangle.stop,
        toolName: 'Rectangle'
    });
});