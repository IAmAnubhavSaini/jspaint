$(function(){
  "use strict";

  var canvasId = "jspaint-canvas";
  var containerId = "jspaint-paint-area";
  var jspaint = new JSPaint({$: jQuery, containerId: containerId, canvasId: canvasId});

  (function (){
    $('#ToolSubMenuBar').hide();
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
