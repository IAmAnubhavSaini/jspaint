(function ($) {
    "use strict";

    $(function () {
        
         var Tools = {
            
            Ring: {
                CONSTANTS: {
                    id: 'RingTool', selectionId: '#RingTool', class: 'main-tool',
                    title: 'Click to draw ring. Click again to disable.'
                },
                VARIABLES: { innerRadius: 10, outerRadius: 20 },
                start: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
                        mouseOptions = null,
                        X = null,
                        Y = null,
                        radius = null,
                        innerRadius = null,
                        outerRadius = null;

                    $(canvasId).on(event, function (e) {
                        mouseOptions = { event: e, relativeTo: $(this) };
                        X = Actions.Mouse.getX(mouseOptions);
                        Y = Actions.Mouse.getY(mouseOptions);
                        innerRadius = Tools.Ring.VARIABLES.innerRadius;
                        outerRadius = Tools.Ring.VARIABLES.outerRadius;
                        CANVASAPI.fillRing({ X: X, Y: Y, innerRadius: innerRadius, outerRadius: outerRadius });
                    });
                },
                stop: function (options) {
                    var event = options.event || CONSTANTS.Events.mouseclick,
                        canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

                    $(canvasId).off(event);
                },
                ContextMenu: {
                    activate: function (options) {
                        function initialSlider(id, title) {
                            return $('<input id="' + id + '" type="range" min="1" max="200" step="1" title="' + title + '" />');
                        }
                        function addSliderForRadius(options) {
                            var div = $('<div></div>').attr('id', options.id).addClass('menu-item');
                            var innerSlider = initialSlider("innerRadiusRing", "inner radius for ring tool.")
                                            .attr('value', Tools.Ring.VARIABLES.innerRadius)
                                            .on('mouseover', function () {
                                                $(this).attr('title', $(this).val());
                                            })
                                            .on('input', function () {
                                                Tools.Ring.VARIABLES.innerRadius = $(this).val();
                                            });
                            var outerSlider = initialSlider("outerRadiusRing", "outer radius for ring tool.")
                                            .attr('value', Tools.Ring.VARIABLES.outerRadius)
                                            .on('mouseover', function () {
                                                $(this).attr('title', $(this).val());
                                            })
                                            .on('input', function () {
                                                Tools.Ring.VARIABLES.outerRadius = $(this).val();
                                            });
                            outerSlider.appendTo(div);
                            innerSlider.appendTo(div);
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
                        var toolId = options.toolId || Tools.Ring.CONSTANTS.selectionId,
                                     tool = $(toolId),
                                     contextMenu = Tools.Ring.ContextMenu;

                        setupToolTips(tool, Tools.Ring.CONSTANTS.title);
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
            },
        };

        var
        initializeCanvas = function (options) {
            var canvas = $('<canvas/>', { id: options.canvasId })
                .prop({ 'width': options.width, 'height': options.height })
                .appendTo('#' + options.canvasContainerId);
            return canvas[0];
        },

        initializeContext = function (options) {
            var sizeX = options.sizeX || 600,
                sizeY = options.sizeY || 400,
                width = sizeX - 2,
                height = sizeY - 2,
                canvas = null;

            options.width = width;
            options.height = height;
            canvas = initializeCanvas(options);
            return canvas.getContext('2d');
        },

      generateHexColorStringFromThisElementsId = function (element) {
          return '#' + element.attr('id').split('#')[1];
      },

      
      registerColorEvents = function () {
          $('.color')
          .on('click', function () {
              selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
          })
          .on('contextmenu', function () {
              selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
          });
      },

      registerAllColorsPickerEvents = function (options) {
          $('#' + options.containerId + ' #' + options.toolId).on('input', function () {
              selectedPrimaryColor = context.fillStyle = $(this).val();
          });
      },

      registerSaveImageEvents = function (options) {
          $('#' + options.toolId).on('click', function () {
              window.open($('#' + CONSTANTS.canvasId)[0].toDataURL("image/png"), "_blank");
          });
      },
      registerResetCanvasEvents = function (options) {
          $('#' + options.toolId).on('click', function () {
              var canvas = $('#' + CONSTANTS.canvasId)[0];
              var canvasHeight = canvas.height;
              var canvasWidth = canvas.width;
              var context = canvas.getContext('2d');
              context.save();
              context.transform(1, 0, 0, 1, 0, 0);
              context.fillStyle = resetCanvasColor;
              context.fillRect(0, 0, canvasWidth, canvasHeight);
              context.restore();

          });
      },

      registerEvents = function () {
          registerColorEvents();

          Tools.Ring.Events.register({
              toolId: Tools.Ring.CONSTANTS.selectionId,
              event: CONSTANTS.Events.mouseclick,
              canvasId: CONSTANTS.canvasId,
              start: Tools.Ring.start,
              stop: Tools.Ring.stop
          });
          registerAllColorsPickerEvents({ toolId: 'allColorsPicker', containerId: 'HTML5ColorPicker' });
          registerSaveImageEvents({ toolId: 'save-as-image', containerId: 'SaveImageButton' });
          registerResetCanvasEvents({ toolId: 'reset-canvas', containerId: 'ResetCanvas' });
      },

      mustAssignDimensionsToCanvasContainer = function () {
          if (sizeX > 2500){
              sizeX = 2500;
          } else if (sizeX < 320) {
              sizeX = 320;
          }
          if (sizeY > 2500) {
              sizeY = 2500;
          } else if (sizeY < 320) {
              sizeY = 320;
          }
          $('#jspaint-paint-area').css({ width: sizeX, height: sizeY });
      },

      initializeTopTakerWidget = function () {
          $('.top-taker').TopTaker({ 'theme': 'dark' });
      },

      init = function () {
          mustAssignDimensionsToCanvasContainer();
          context = initializeContext({ sizeX: sizeX, sizeY: sizeY, canvasId: CONSTANTS.canvasId, canvasContainerId: CONSTANTS.canvasContainerId });
          initializeTopTakerWidget();
          Color.generateBasicColorPalette({ appendHere: '.BasicColorPalette', basicColors: CONSTANTS.basicColors });
          registerEvents();
          $('#PencilTool').trigger('click');
          $('[data-toggle="tooltip"]').tooltip();
      };
        init();
    });
})(jQuery);
