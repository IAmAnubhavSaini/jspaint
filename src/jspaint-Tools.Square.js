$(function () {
    "use strict";

    var Square = {
        CONSTANTS: {
            id: 'SquareTool',
            selectionId: '#SquareTool',
            class: 'main-tool',
            title: 'Click to draw squares. Click again to disable.',
            previewId: 'previewSquare'
        },
        VARIABLES: {
            side: 10, xyPlaneRotationAngle: 360
        },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            side = null,
            xyPlaneRotationAngle = null,
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
                        .attr('id', Square.CONSTANTS.previewId)
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
                            side = Square.VARIABLES.side,
                            xyPlaneRotationAngle = (Square.VARIABLES.xyPlaneRotationAngle * Math.PI) / 180;
                            
                            CANVASAPI.fillRoatedSquare(X - side / 2, Y - side / 2, side, xyPlaneRotationAngle);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', parseInt(ev.pageY) - parseInt(Square.VARIABLES.side / 2) - parseInt(window.scrollY))
                                    .css('left', parseInt(ev.pageX) - parseInt(parseInt(Square.VARIABLES.side / 2)) - parseInt(window.scrollX))
                                    .css('background-color', selectedPrimaryColor)
                                    .css('border', 'thin dashed ' + selectedAlternativeColor)
                                    .css('height', Square.VARIABLES.side)
                                    .css('width', Square.VARIABLES.side);

                            previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Square.VARIABLES.side / 2);
                            previewOffsetTop = parseInt($(this).offset().top) + parseInt(Square.VARIABLES.side / 2);
                            canvasOffsetLeft = $(canvasId).offset().left;
                            canvasOffsetTop = $(canvasId).offset().top;

                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft + canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop + canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }
            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Square.CONSTANTS.previewId);
                previewer.css('top', e.pageY - parseInt(Square.VARIABLES.side / 2) - window.scrollY)
                        .css('left', e.pageX - parseInt(Square.VARIABLES.side / 2) - window.scrollX)
                        .css('background-color', selectedPrimaryColor)
                        .css('height', Square.VARIABLES.side)
                        .css('width', Square.VARIABLES.side)
                        .css('transform', 'rotate('+parseInt((Square.VARIABLES.xyPlaneRotationAngle*Math.PI))/180+'rad)')
                        .show();
            });
        },
        stop: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider(id, title, max) {
                    return $('<input id="' + id + '" type="range" min="1" max="' + max + '" step="1" title="' + title + '" />');
                }
                function getContextMenuContainer(options) {
                    var container = $('#' + options.id);
                    if (container.length === 0)
                        return $('<div></div>').attr('id', options.id).addClass('menu-item');
                    else
                        return container;
                }
                function getSliderForSide(options) {
                    return initialSlider('sideSquare', 'side length for square tool', 200)
                            .attr('value', Square.VARIABLES.side)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val());
                            })
                            .on('input', function () {
                                Square.VARIABLES.side = $(this).val();
                            });
                }
                function getSliderForXYPlaneRotationAngle(options) {
                    return initialSlider('xyPlaneRotationAngle', 'rotation angle for XY plane rotation.', 360)
                            .attr('value', Square.VARIABLES.xyPlaneRotationAngle)
                            .on('mouseover', function () {
                                $(this).attr('title', $(this).val()+' deg');
                            })
                            .on('input', function () {
                                Square.VARIABLES.xyPlaneRotationAngle = $(this).val();
                            });
                }
                var contextMenuContainer = getContextMenuContainer(options);
                getSliderForSide(options).appendTo(contextMenuContainer);
                getSliderForXYPlaneRotationAngle(options).appendTo(contextMenuContainer);
                contextMenuContainer.appendTo($(options.containerSelectionCriterion));
            },
            deactivate: function (options) {
                function removeSliderForSide(options) {
                    $('#' + options.id).remove();
                }
                removeSliderForSide(options);
                $('#' + Square.CONSTANTS.previewId).off('mousemove');
                $('#' + Square.CONSTANTS.previewId).remove();
            },
            getOptions: function () {
                return {
                    tool: this,
                    id: 'SquareToolContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId,
                tool = $(toolId),
                contextMenu = Square.ContextMenu;

                setupToolTips(tool, Square.CONSTANTS.title);
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

    Square.Events.register({
        toolId: Square.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Square.start,
        stop: Square.stop,
        toolName: 'Square'
    });
});