(function ($) {
    "use strict";

    $(function () {
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
              .attr('title', 'Left click for primary color, Right click for alternative color.')
              .attr('data-toggle', 'tooltip')
              .attr('data-placement', 'bottom')
          .on('click', function () {
              selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
          })
          .on('contextmenu', function (e) {
              e.preventDefault();
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
