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
        context= null,

        generateBasicColorPalette = function(){
          for(var i = 0, len = CONSTANTS.basicColors.length; i < len; i++){
            var hex = '#'+CONSTANTS.basicColors[i].id;
            var color = $('<div class="color" id="Color-Hex-'+hex+'" style="background-color: '+hex+';"></div>');
            color.appendTo('.BasicColorPalette');
          }
        },

        setupStart = function(options){
          $('#'+CONSTANTS.canvasId).awesomeCursor('pencil', {hotspot: 'bottom left'});
          $(options.tool).addClass('active-tool');
        },

        setupStop = function (options){
          $('#'+CONSTANTS.canvasId).awesomeCursor('ban');
          $(options.tool).removeClass('active-tool');
        },

        initializeCanvas = function(){
          var width = sizeX,
              height = sizeY;
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

        startCircleStampTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            CANVASAPI.fillCirc(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              4
            );
          });
        },

        stopCircleStampTool = function(){
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
          setupStart(options);
          start(options);
        },

        deactivateTool = function(options, stop){
          setupStop(options);
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

        registerCircleStampToolEvents = function(){
          $('#CircleStampTool').funcToggle('click',
            function(){
              activateTool({tool: this}, startCircleStampTool);
              activeTool = $(this);
            },
            function(){
              activeTool = null;
              deactivateTool({tool: this}, stopCircleStampTool);
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

        registerEvents = function (){
          registerColorEvents();
          registerPencilToolEvents();
          registerCircleStampToolEvents();
          registerFreeStyleSpeedDotsToolEvents();
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
        };
        init();
  });
})(jQuery);
