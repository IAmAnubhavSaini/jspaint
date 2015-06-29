(function($){
  "use strict";

  $(function(){
    var CONSTANTS = { canvasId: "jspaint-canvas",
                      containerId: "jspaint-paint-area",
                      activeToolCursorClass: "working-with-tools",
                      maintoolsClass: "main-tool",
                      basicColors: [
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
        GenerateBasicColorPalette = function(){
          for(var i = 0, len = CONSTANTS.basicColors.length; i < len; i++){
            var hex = '#'+CONSTANTS.basicColors[i].id;
            var color = $('<div class="color" id="Color-Hex-'+hex+'" style="background-color: '+hex+';"></div>');
            color.appendTo('.BasicColorPalette');
          }
        },
        SetupStart = function(options){
          $('#'+CONSTANTS.canvasId).addClass(CONSTANTS.activeToolCursorClass);
          $(options.tool).addClass('active-tool');
        },
        SetupStop = function (options){
          $('#'+CONSTANTS.canvasId).removeClass(CONSTANTS.activeToolCursorClass);
          $(options.tool).removeClass('active-tool');
        },
        InitializeCanvas = function(){
          var width = sizeX,
              height = sizeY;
              $('<canvas/>', { id: CONSTANTS.canvasId })
                .prop({'width': width,'height': height})
                .appendTo('#'+CONSTANTS.containerId);
          return $('#'+CONSTANTS.canvasId)[0].getContext('2d');
        },
        startSpeedDotsFreeStyleTool = function(){
          $('#'+CONSTANTS.canvasId).on("mousemove", function (event) {
            context.fillRect(
              (event.pageX - $(this).offset().left),
              (event.pageY - $(this).offset().top),
              2, 2
            );
          });
        },
        stopSpeedDotsFreeStyleTool = function(){
          $('#'+CONSTANTS.canvasId).off("mousemove");
        },
        fillCirc = function(x, y, radius){
          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI, false);
          context.fill();
        },
        startCircleStampTool = function(){
          $('#'+CONSTANTS.canvasId).on("click", function (event) {
            fillCirc(
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
        RegisterEvents = function (){
          $('#SpeedDotsFreeStyleTool').bind('click', function() {
            new SetupStart({tool: this});
            startSpeedDotsFreeStyleTool({tool: this});
          })
          .bind('contextmenu', function(e){
            e.preventDefault();
            stopSpeedDotsFreeStyleTool({tool: this});
            new SetupStop({tool: this});
            return false;
          });

          $('#CircleStampTool').bind('click', function(){
            new SetupStart({tool: this});
            startCircleStampTool({tool: this});
          })
          .bind('contextmenu', function(){
            stopCircleStampTool({tool: this});
            new SetupStop({tool: this});
          });

          $('.color').on('click', function(){
            selectedPrimaryColor = context.fillStyle = generateHexColorStringFromThisElementsId($(this));
          })
          .on('contextmenu', function(){
            selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
          });
        },
        Init = function (){
          $('#jspaint-paint-area').css({
            width: sizeX, height: sizeY
          });
          context = new InitializeCanvas();
          $('.'+CONSTANTS.maintoolsClass).attr('title', 'Click to activate;\nRight-click to deactivate;');
          $('.top-taker').TopTaker({'theme': 'dark'});
          new GenerateBasicColorPalette();
          new RegisterEvents();
        };

        new Init();


  });
})(jQuery);
