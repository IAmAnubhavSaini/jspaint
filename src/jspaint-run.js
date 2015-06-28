$(function(){
  "use strict";

  var canvasId = "jspaint-canvas",
      containerId = "jspaint-paint-area",
      size = window.location.toString().split('?')[1].split('=')[1],
      sizeX = size.split('x')[0],
      sizeY = size.split('x')[1],
      jspaint = null;

  (function (){
    $('#ToolSubMenuBar').hide();
    $('#jspaint-paint-area').css({
      width: sizeX, height: sizeY
    });
    jspaint = new JSPaint({$: jQuery, containerId: containerId, canvasId: canvasId, size: {X:sizeX, Y:sizeY}});

    $('.top-taker').TopTaker({'theme': 'dark'});
  })();

  $('#SpeedDotFreeStyle')
    .bind('click', function(){
      $(this).trigger("start");
    })
    .bind("dblclick", function(){
      jspaint.Tools.showOptionsForSpeedDotFreeStyle({tool: this});
    })
    .bind('contextmenu', function(e){
      e.preventDefault();
      jspaint.Tools.stopSpeedDotFreeStyle({tool: this});
      jspaint.Tools.hideOptionsForSpeedDotFreeStyle({tool: this});
      return false;
    })
    .bind('stop', function(){
      $(this).trigger("contextmenu");
    })
    .bind('start', function(){
      jspaint.Tools.startSpeedDotFreeStyle({tool: this});
    });
});
