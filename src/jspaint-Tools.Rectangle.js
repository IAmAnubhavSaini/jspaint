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
            length: 20, breadth: 10
        },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
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
            previewOffsetTop = null;

            function generatePreview(options) {
                var
                div = $('<div></div>')
                        .attr('id', Rectangle.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '100',
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            var
                            mouseOptions = { event: eClick, relativeTo: $(canvasId) },
                            X = Actions.Mouse.getX(mouseOptions),
                            Y = Actions.Mouse.getY(mouseOptions),
                            length = Rectangle.VARIABLES.length,
                            breadth = Rectangle.VARIABLES.breadth;

                            context.fillRect(X - length / 2, Y - breadth / 2, length, breadth);
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
                function initialSlider(id, title) {
                    return $('<input id="'+id+'" type="range" min="1" max="200" step="1" title="'+title+'" />');
                }
                function addSliderForLength(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item');

                    var lengthSlider = initialSlider(options.lengthId, options.lengthTitle)
                        .attr('value', Rectangle.VARIABLES.length)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.length = $(this).val();
                        })
                        .appendTo(div);

                    var breadthSlider = initialSlider(options.breadthId, options.breadthTitle)
                        .attr('value', Rectangle.VARIABLES.breadth)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Rectangle.VARIABLES.breadth = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForLength(options);
                
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.lengthId).remove();
                    $('#' + options.breadthId).remove();
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
                toolId = options.toolId || Rectangle.CONSTANTS.selectionId,
                tool = $(toolId),
                contextMenu = Rectangle.ContextMenu;

                setupToolTips(tool, Rectangle.CONSTANTS.title);
                options.tool = tool;

                tool.funcToggle('click',
                    function () {
                        activateTool(options);
                        contextMenu.activate(contextMenu.getOptions());
                        activeTool = tool;
                    },
                    function () {
                        activeTool = null;
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
        stop: Rectangle.stop
    });
});