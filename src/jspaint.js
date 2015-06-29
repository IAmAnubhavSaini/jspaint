$(function(){
  "use strict";

  var canvasId = "jspaint-canvas",
      containerId = "jspaint-paint-area",
      size = window.location.toString().split('?')[1].split('=')[1],
      sizeX = size.split('x')[0],
      sizeY = size.split('x')[1],
      jspaint = null,
      currentDrawColor = '',
      currentAlternativeColor = '',
      cursorWhenActive= "working-with-tools",
      allMainToolsClass= "main-tool",
      context= null,
      GenerateBasicColorPalette = function(){
        var basicColors = [
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
        ];

        for(var i = 0; i < basicColors.length; i++){
          var hex = '#'+basicColors[i].id;
          var color = $('<div class="color" id="Color-Hex-'+hex+'" style="background-color: '+hex+';"></div>');
          color.appendTo('.BasicColorPalette');
        }
      },
      SetupStart = function(options){
        $('#'+canvasId).addClass(cursorWhenActive);
        $(options.tool).addClass('active-tool');
      },
      SetupStop = function (options){
        $('#'+canvasId).removeClass(cursorWhenActive);
        $(options.tool).removeClass('active-tool');
      },
      InitializeCanvas = function(){
        var width = sizeX,
            height = sizeY;
            $('<canvas/>', { id: canvasId })
              .prop({'width': width,'height': height})
              .appendTo('#'+containerId);
        return $('#'+canvasId)[0].getContext('2d');
      },
      startSpeedDotsFreeStyleTool = function(){
        $('#'+canvasId).on("mousemove", function (event) {
          context.fillRect(
            (event.pageX - $(this).offset().left),
            (event.pageY - $(this).offset().top),
            2, 2
          );
        });
      },
      stopSpeedDotsFreeStyleTool = function(){
        $('#'+canvasId).off("mousemove");
      },
      fillCirc = function(x, y, radius){
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = currentDrawColor;
        context.fill();
      },
      startCircleStampTool = function(){
        $('#'+canvasId).on("click", function (event) {
          fillCirc(
            (event.pageX - $(this).offset().left),
            (event.pageY - $(this).offset().top),
            4
          );
        });
      },
      stopCircleStampTool = function(){
        $('#'+canvasId).off("click");
      };

  (function (){
    $('#jspaint-paint-area').css({
      width: sizeX, height: sizeY
    });
    context = new InitializeCanvas();
    $('.'+allMainToolsClass).attr('title', 'Click to activate;\nRight-click to deactivate;');
    $('.top-taker').TopTaker({'theme': 'dark'});
    new GenerateBasicColorPalette();
  })();

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
    var hex = '#'+$(this).attr('id').split('#')[1];
    currentDrawColor = hex;
    context.fillStyle = hex;
  })
  .on('contextmenu', function(){
    var hex = '#'+$(this).attr('id').split('#')[1];
    currentAlternativeColor = hex;
  });
});
