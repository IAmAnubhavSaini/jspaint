$(function () {
    "use strict";

    var Disc = {
        CONSTANTS: {
            id: 'DiscTool', selectionId: '#DiscTool', class: 'main-tool',
            title: 'Click to draw disc. Click again to disable.',
            previewId: 'previewDisc'
        },
        VARIABLES: { radius: 10 },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            radius = null,
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
                        .attr('id', Disc.CONSTANTS.previewId)
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
                            radius = Disc.VARIABLES.radius;
                            CANVASAPI.fillCirc(X, Y, radius);
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - Disc.VARIABLES.radius  - scrollY)
                                    .css('left', ev.pageX - Disc.VARIABLES.radius  - scrollX)
                                    .css('background-color', selectedPrimaryColor)
                                    .css('border', 'thin dashed ' + selectedAlternativeColor)
                                    .css('height', Disc.VARIABLES.radius*2)
                                    .css('width', Disc.VARIABLES.radius*2);

                            previewOffsetLeft = parseInt($(this).offset().left) + parseInt(Disc.VARIABLES.radius) ;
                            previewOffsetTop = parseInt($(this).offset().top) + parseInt(Disc.VARIABLES.radius) ;
                            canvasOffsetLeft = $(canvasId).offset().left,
                            canvasOffsetTop = $(canvasId).offset().top;
                            
                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                            }
                        });
            }
            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Disc.CONSTANTS.previewId);
                previewer.css('top', e.pageY - Disc.VARIABLES.radius  - scrollY)
                        .css('left', e.pageX - Disc.VARIABLES.radius  - scrollX)
                        .css('background-color', selectedPrimaryColor)
                        .css('height', Disc.VARIABLES.radius*2)
                        .css('width', Disc.VARIABLES.radius*2)
                        .show();
            });
        },
        stop: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

            $(canvasId).off(event);
            $('#' + Disc.CONSTANTS.previewId).off('mousemove');
            $('#' + Disc.CONSTANTS.previewId).remove();
        },
        ContextMenu: {
            activate: function (options) {
                function initialSlider() {
                    return $('<input id="radiusDisc" type="range" min="1" max="200" step="1" title="radius for disc tool." />');
                }
                function addSliderForRadius(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
                    slider = initialSlider()
                        .attr('value', Disc.VARIABLES.radius)
                        .on('mouseover', function () {
                            $(this).attr('title', $(this).val());
                        })
                        .on('input', function () {
                            Disc.VARIABLES.radius = $(this).val();
                        })
                        .appendTo(div);

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
                var
                toolId = options.toolId || Disc.CONSTANTS.selectionId,
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