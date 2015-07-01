(function($){
  "use strict";

  $(function(){
    var CONSTANTS = {
        canvasId: "jspaint-canvas",
        containerId: "jspaint-paint-area",
        activeToolCursorClass: "working-with-tools",
        maintoolsClass: "main-tool",
        basicColors:
          [
            {id: '00FFFF', name:"Aqua"},
            {id: '000000', name:"Black"},
            {id: '0000FF', name:"Blue"},
            {id: 'FF00FF', name:"Fuchsia"},
            {id: '808080', name:"Gray"},
            {id: '008000', name:"Green"},
            {id: '00FF00', name:"Lime"},
            {id: '800000', name:"Maroon"},
            {id: '000080', name:"Navy"},
            {id: '808000', name:"Olive"},
            {id: '800080', name:"Purple"},
            {id: 'FF0000', name:"Red"},
            {id: 'C0C0C0', name:"Silver"},
            {id: '008080', name:"Teal"},
            {id: 'FFFFFF', name:"White"},
            {id: 'FFFF00', name:"Yellow"},
          ]
        },

        size = window.location.toString().split('?')[1].split('=')[1],
        sizeX = size.split('x')[0],
        sizeY = size.split('x')[1],
        jspaint = null,
        selectedAlternativeColor = '',
        selectedPrimaryColor = '',
        resetCanvasColor = 'white',
        context= null,

        generateBasicColorPalette = function(){
          var div1 = $('<div></div>');
          var div2 = $('<div></div>');
          var appendWhere = div1;
          for(var i = 0, len = CONSTANTS.basicColors.length; i < len; i++){
            appendWhere = i < len/2 ? div1 : div2;
            var hex = '#'+CONSTANTS.basicColors[i].id;
            var color = $('<div class="color" id="Color-Hex-'+hex+'" style="background-color: '+hex+';"></div>');
            color.appendTo(appendWhere);

          }
          div1.appendTo('.BasicColorPalette');
          div2.appendTo('.BasicColorPalette');

        },

        initializeCanvas = function(){
          var width = sizeX -2,
              height = sizeY -2;
              $('<canvas/>', { id: CONSTANTS.canvasId })
                .prop({'width': width,'height': height})
                .appendTo('#'+CONSTANTS.containerId);
          return $('#'+CONSTANTS.canvasId)[0].getContext('2d');
        },

        startFreeStyleSpeedDotsTool = function(){
          $('#'+CONSTANTS.canvasId).on("mousemove", function (event) {
            context.fillRect(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              2, 2
            );
          });
        },

        stopFreeStyleSpeedDotsTool = function(){
          $('#'+CONSTANTS.canvasId).off("mousemove");
        },

        CANVASAPI = {
          fillCirc: function(x, y, radius){
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
          }
        },

        startDiscTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            CANVASAPI.fillCirc(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              10
            );
          });
        },

        stopDiscTool = function(){
          $('#'+CONSTANTS.canvasId).off("click");
        },

        startSquareTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            context.fillRect(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              10, 10
            );
          });
        },

        stopSquareTool = function(){
          $('#'+CONSTANTS.canvasId).off("click");
        },

        generateHexColorStringFromThisElementsId = function (element){
          return '#'+element.attr('id').split('#')[1];
        },

        startPencilTool = function(options){
          $('#'+CONSTANTS.canvasId).on('mousemove', function(event){
            if(event.buttons !== undefined){
              if(event.buttons === 1){
                context.fillRect(
                  (event.pageX - $(this).offset().left),
                  (event.pageY - $(this).offset().top),
                  2, 2
                );
              }
            }
          });
        },

        stopPencilTool = function(options){
          $('#'+CONSTANTS.canvasId).off('mousemove');
        },

        activateTool = function(options, start){
          if(activeTool !== null){
            activeTool.trigger('click');
          }
          $(options.tool).toggleClass('active-tool');
          start(options);
        },

        deactivateTool = function(options, stop){
          $(options.tool).toggleClass('active-tool');
          stop(options);
        },

        activeTool = null,

        registerFreeStyleSpeedDotsToolEvents = function(){
          $('#FreeStyleSpeedDotsTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startFreeStyleSpeedDotsTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopFreeStyleSpeedDotsTool);
            }
          );
        },

        registerDiscToolEvents = function(){
          $('#DiscTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startDiscTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopDiscTool);
            }
          );
        },

        registerPencilToolEvents = function(){
          $('#PencilTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startPencilTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopPencilTool);
            }
          );
        },

        registerColorEvents = function(){
          $('.color')
            .on('click', function(){
              selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
            })
            .on('contextmenu', function(){
              selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
            });
        },

        registerAllColorsPickerEvents = function(options){
          $('#'+options.containerId + ' #'+options.toolId).on('input', function(){
            selectedPrimaryColor = context.fillStyle = $(this).val();
          });
        },

        registerSaveImageEvents = function(options){
          $('#'+options.toolId).on('click', function(){
            window.open($('#'+CONSTANTS.canvasId)[0].toDataURL("image/png"), "_blank");
          });
        },
        registerResetCanvasEvents = function(options){
          $('#'+options.toolId).on('click', function(){
            var canvas = $('#'+CONSTANTS.canvasId)[0];
            var canvasHeight = canvas.height;
            var canvasWidth = canvas.width;
            var context = canvas.getContext('2d');
            context.save();
            context.transform(1, 0, 0, 1, 0, 0);
            context.fillStyle = resetCanvasColor;

            context.fillRect(0,0, canvasWidth, canvasHeight);
            context.restore();
          });
        },

        registerSquareToolEvents = function(options){
          $('#'+options.toolId).funcToggle('click',
            function(){
              activateTool({tool: this}, startSquareTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopSquareTool);
            }
          );
        },

        registerEvents = function (){
          registerColorEvents();
          registerPencilToolEvents();
          registerDiscToolEvents();
          registerFreeStyleSpeedDotsToolEvents();
          registerAllColorsPickerEvents({toolId: 'allColorsPicker', containerId:'HTML5ColorPicker'});
          registerSaveImageEvents({toolId: 'save-as-image', containerId: 'SaveImageButton'});
          registerResetCanvasEvents({toolId: 'reset-canvas', containerId: 'ResetCanvas'});
          registerSquareToolEvents({toolId: 'SquareTool', containerId: 'jspaint-tools'});
        },

        mustAssignDimensionsToCanvasContainer = function(){
          $('#jspaint-paint-area').css({
            width: sizeX, height: sizeY
          });
        },

        initializeToolsInfo = function(){
          $('.'+CONSTANTS.maintoolsClass).attr('title', 'Click to activate;\nRight-click to deactivate;');
        },

        initializeTopTakerWidget = function(){
          $('.top-taker').TopTaker({'theme': 'dark'});
        },

        init = function (){
          mustAssignDimensionsToCanvasContainer();
          context = initializeCanvas();
          initializeToolsInfo();
          initializeTopTakerWidget();
          generateBasicColorPalette();
          registerEvents();
          $('#PencilTool').trigger('click');
        };
        init();
  });
})(jQuery);
