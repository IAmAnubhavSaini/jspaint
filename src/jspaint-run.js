$(function(){
  "use strict";

  var canvasId = "jspaint-canvas",
      containerId = "jspaint-paint-area",
      size = window.location.toString().split('?')[1].split('=')[1],
      sizeX = size.split('x')[0],
      sizeY = size.split('x')[1],
      jspaint = null,
      currentDrawColor = '',
      currentAlternativeColor = '';

  var GenerateBasicColorPalette = function(){
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
  };

  (function (){
    $('#ToolSubMenuBar').hide();
    $('#jspaint-paint-area').css({
      width: sizeX, height: sizeY
    });
    jspaint = new JSPaint({$: jQuery, containerId: containerId, canvasId: canvasId, size: {X:sizeX, Y:sizeY}});

    $('.top-taker').TopTaker({'theme': 'dark'});
    new GenerateBasicColorPalette();
  })();


  $('#SpeedDotsFreeStyleTool')
    .bind('click', function(){
      $(this).trigger("start");
    })
    .bind('contextmenu', function(e){
      e.preventDefault();
      jspaint.Tools.stopSpeedDotsFreeStyleTool({tool: this});
      return false;
    })
    .bind('stop', function(){
      $(this).trigger("contextmenu");
    })
    .bind('start', function(){
      jspaint.Tools.startSpeedDotsFreeStyleTool({tool: this});
    });

  $('#CircleStampTool')
    .bind('click', function(){
      $(this).trigger('start');
    })
    .bind('start', function(){
      jspaint.Tools.startCircleStampTool({tool: this});
    })
    .bind('contextmenu', function(){
      $(this).trigger('stop');
    })
    .bind('stop', function(){
      jspaint.Tools.stopCircleStampTool({tool: this});
    });

    $('.color')
    .on('click', function(){
      var hex = '#'+$(this).attr('id').split('#')[1];
      currentDrawColor = hex;
      jspaint.Tools.updateCurrentDrawColor(hex);
    })
    .on('contextmenu', function(){
      var hex = '#'+$(this).attr('id').split('#')[1];
      currentAlternativeColor = hex;
      jspaint.Tools.updateCurrentAlternativeColor(hex);
    });

});
