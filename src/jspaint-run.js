$(function(){
  "use strict";
  var canvasId = "jspaint-canvas";
  var canvasContainer = "jspaint-paint-area";
  var context = JSPaint(jQuery).InitializePaintArea(canvasContainer, canvasId);
  console.log("Initialized");
  var jspaintMouse = JSPaintMouse(jQuery);

  (function (){
    $('#ToolSubMenuBar').hide();
  })();

  var jspaintTools = JSPaintTools(jQuery,
    {
      canvasId: canvasId,
      context:context,
      cursorWhenActive: "working-with-tools",
      jspaintMouseTools: jspaintMouse,
      allMainToolsClass: "main-tool",
      toolSubMenuBar: "ToolSubMenuBar"
    });

  $('#SpeedDotFreeStyle')
    .bind('click', function(){
      $(this).trigger("contextmenu");
      jspaintTools.ActivateSpeedDotFreeStyle({tool: this});
    })
    .bind("dblclick", function(){
      $(this).trigger("contextmenu");
      jspaintTools.ShowOptionsForSpeedDotFreeStyle({tool: this});
    })
    .bind('contextmenu', function(e){
      e.preventDefault();
      jspaintTools.DeactivateSpeedDotFreeStyle({tool: this});
      jspaintTools.HideOptionsForSpeedDotFreeStyle({tool: this});
      return false;
    });
});
