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
            side: 10
        },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            side = null,
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
                            'z-index': '100',
                        })
                        .appendTo('.utilities')
                        .on('click', function (eClick) {
                            var mouseOptions = { event: eClick, relativeTo: $(canvasId) },
                                X = Actions.Mouse.getX(mouseOptions),
                                Y = Actions.Mouse.getY(mouseOptions),
                                side = Square.VARIABLES.side;
                            CANVASAPI.fillSquare(X - side / 2, Y - side / 2, side);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Square.VARIABLES.side / 2 - scrollY)
                                    .css('left', ev.pageX - Square.VARIABLES.side / 2 - scrollX)
                                    .css('background-color', selectedPrimaryColor)
                                    .css('border', 'thin dashed '+selectedAlternativeColor)
                                    .css('height', Square.VARIABLES.side)
                                    .css('width', Square.VARIABLES.side);

                            previewOffsetLeft = $(this).offset().left + Square.VARIABLES.side / 2;
                            previewOffsetTop = $(this).offset().top + Square.VARIABLES.side / 2;
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
                previewer = previewer || $('#' + Square.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Square.VARIABLES.side / 2 - scrollY)
                        .css('left', e.pageX - Square.VARIABLES.side / 2 - scrollX)
                        .css('background-color', selectedPrimaryColor)
                        .css('height', Square.VARIABLES.side)
                        .css('width', Square.VARIABLES.side)
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
                function initialSlider() {
                    return $('<input id="sideSquare" type="range" min="1" max="200" step="1" title="side length for square tool" />');
                }
                function addSliderForSide(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                    slider = initialSlider()
                        .attr('value', Square.VARIABLES.side)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Square.VARIABLES.side = $(this).val();
                        })
                        .appendTo(div);

                    div.appendTo($(options.containerSelectionCriterion));
                }
                addSliderForSide(options);
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
                toolId = options.toolId || Square.CONSTANTS.selectionId,
                tool = $(toolId),
                contextMenu = Square.ContextMenu;

                setupToolTips(tool, Square.CONSTANTS.title);
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

    Square.Events.register({
        toolId: Square.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Square.start,
        stop: Square.stop
    });
});