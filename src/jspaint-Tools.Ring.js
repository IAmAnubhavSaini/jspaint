$(function () {
    "use strict";

    var Ring = {
        CONSTANTS: {
            id: 'RingTool', selectionId: '#RingTool', class: 'main-tool',
            title: 'Click to draw ring. Click again to disable.',
            previewId: 'previewRing',
            previewOuterId: 'previewOuterRing'
        },
        VARIABLES: { innerRadius: 10, outerRadius: 20 },
        start: function (options) {
            var
            event = options.event || CONSTANTS.Events.mouseclick,
            canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
            mouseOptions = null,
            X = null,
            Y = null,
            radius = null,
            innerRadius = null,
            outerRadius = null,
            previewer = null,
            canvasOffsetLeft = null,
            canvasOffsetTop = null,
            canvasHeight = $(canvasId).height(),
            canvasWidth = $(canvasId).width(),
            previewOffsetLeft = null,
            previewOffsetTop = null,
            outer = null;

            function generatePreview(options) {
                var outerDiv = $('<div></div>').attr('id', Ring.CONSTANTS.previewOuterId)
                        .css({
                            'position': 'fixed',
                            'z-index': '100',
                            'border-radius': '50%',
                            'height': Ring.VARIABLES.outerRadius * 2,
                            'width': Ring.VARIABLES.outerRadius * 2,
                            'backgruond-color': selectedPrimaryColor,
                        })
                        .appendTo('.utilities');
                var
                div = $('<div></div>')
                        .attr('id', Ring.CONSTANTS.previewId)
                        .css({
                            'position': 'fixed',
                            'z-index': '100',
                            'border-radius': '50%'
                        })
                        .appendTo(outerDiv)
                        .on('click', function (eClick) {
                            mouseOptions = { event: eClick, relativeTo: $(canvasId) };
                            X = Actions.Mouse.getX(mouseOptions);
                            Y = Actions.Mouse.getY(mouseOptions);
                            innerRadius = Ring.VARIABLES.innerRadius;
                            outerRadius = Ring.VARIABLES.outerRadius;
                            CANVASAPI.fillRing({
                                X: X,
                                Y: Y,
                                innerRadius: innerRadius,
                                outerRadius: outerRadius,
                                strokeColor: selectedPrimaryColor,
                                fillColor: selectedAlternativeColor
                            });
                        })
                        .on('mousemove', function (ev) {
                            $(this).css('top', ev.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(scrollY))
                                    .css('left', ev.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(scrollX))
                                    .css('background-color', selectedAlternativeColor)
                                    .css('border', 'thin dashed ' + selectedPrimaryColor)
                                    .css('height', Ring.VARIABLES.innerRadius*2)
                                    .css('width', Ring.VARIABLES.innerRadius * 2);

                            outer.css({
                                'position': 'fixed',
                                'top': ev.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(scrollY),
                                'left': ev.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(scrollX),
                                'z-index': '100',
                                'border-radius': '50%',
                                'height': Ring.VARIABLES.outerRadius * 2,
                                'width': Ring.VARIABLES.outerRadius * 2,
                                'background-color': selectedPrimaryColor,
                            })

                            previewOffsetLeft = $(this).offset().left + parseInt(Ring.VARIABLES.innerRadius);
                            previewOffsetTop = $(this).offset().top + parseInt(Ring.VARIABLES.innerRadius);
                            canvasOffsetLeft = $(canvasId).offset().left,
                            canvasOffsetTop = $(canvasId).offset().top;
                            console.log(previewOffsetLeft + ', ' + previewOffsetTop + '; ' + canvasOffsetLeft + ', ' + canvasOffsetTop);
                            if (canvasOffsetLeft > previewOffsetLeft || parseInt(canvasOffsetLeft) + parseInt(canvasWidth) < previewOffsetLeft ||
                                canvasOffsetTop > previewOffsetTop || parseInt(canvasOffsetTop) + parseInt(canvasHeight) < previewOffsetTop) {
                                $(this).hide();
                                outer.hide();
                            }
                        });
                        
            }
            generatePreview();

            $(canvasId).on('mousemove', function (e) {
                previewer = previewer || $('#' + Ring.CONSTANTS.previewId);
                previewer.css('top', e.pageY - parseInt(Ring.VARIABLES.innerRadius) - parseInt(scrollY))
                        .css('left', e.pageX - parseInt(Ring.VARIABLES.innerRadius) - parseInt(scrollX))
                        .css('background-color', selectedAlternativeColor)
                        .css('height', Ring.VARIABLES.innerRadius*2)
                        .css('width', Ring.VARIABLES.innerRadius*2)
                        .show();
                outer = outer || $('#' + Ring.CONSTANTS.previewOuterId);
                outer.css({
                    'position': 'fixed',
                    'top': e.pageY - parseInt(Ring.VARIABLES.outerRadius) - parseInt(scrollY),
                    'left': e.pageX - parseInt(Ring.VARIABLES.outerRadius) - parseInt(scrollX),
                    'z-index': '100',
                    'border-radius': '50%',
                    'height': Ring.VARIABLES.outerRadius * 2,
                    'width': Ring.VARIABLES.outerRadius * 2,
                    'background-color': selectedPrimaryColor,
                }).show();
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
                function initialSlider(id, title) {
                    return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                }
                function addSliderForRadius(options) {
                    var
                    div = $('<div></div>').attr('id', options.id).addClass('menu-item'),

                    innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                                    .attr('value', Ring.VARIABLES.innerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Ring.VARIABLES.innerRadius = $(this).val();
                                    })
                                    .appendTo(div),

                    outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                                    .attr('value', Ring.VARIABLES.outerRadius)
                                    .on('mouseover', function () {
                                        $(this).attr('title', $(this).val());
                                    })
                                    .on('input', function () {
                                        Ring.VARIABLES.outerRadius = $(this).val();
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
                    id: 'RingContextMenu',
                    containerSelectionCriterion: '.contextual-tool-bar'
                };
            }
        },
        Events: {
            register: function (options) {
                var
                toolId = options.toolId || Ring.CONSTANTS.selectionId,
                tool = $(toolId),
                contextMenu = Ring.ContextMenu;

                setupToolTips(tool, Ring.CONSTANTS.title);
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
    Ring.Events.register({
        toolId: Ring.CONSTANTS.selectionId,
        event: CONSTANTS.Events.mouseclick,
        canvasId: CONSTANTS.canvasId,
        start: Ring.start,
        stop: Ring.stop
    });
});
