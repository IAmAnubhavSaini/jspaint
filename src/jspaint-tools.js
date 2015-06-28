var JSPaintTools = function(options){
  "use strict";

  var $ = options.$,
      canvasId = options.canvasId,
      context = options.context,
      cursorWhenActive = options.cursorWhenActive,
      selectAllTools = options.allMainToolsClass,
      MouseTools = null;

  (function(){
    MouseTools = new JSPaintMouse({
      $: $,
      canvasId: canvasId,
      context: context,
      cursorWhenActive: cursorWhenActive,
      selectAllTools: selectAllTools
    });
  })();

  var InitAllMainToolsTitle = function(){
    $('.'+selectAllTools).attr('title', 'Click to activate;\nRight-click to deactivate;');
  }();

  var ActivateSpeedDotsFreeStyleTool = function(options){
    $('#'+canvasId).addClass(cursorWhenActive);
    $(options.tool).addClass('active-tool');
    MouseTools.MouseTrack({tool: options.tool, 'currentCanvas': canvasId, 'trackCallback': function(e){}});
  },
  DeactivateSpeedDotsFreeStyleTool = function(options){
    $('#'+canvasId).removeClass(cursorWhenActive);
    $(options.tool).removeClass('active-tool');
    MouseTools.StopMouseTrack({tool: options.tool, canvasId: canvasId});
  };

  return {
    startSpeedDotsFreeStyleTool : ActivateSpeedDotsFreeStyleTool,
    stopSpeedDotsFreeStyleTool : DeactivateSpeedDotsFreeStyleTool
  };
};
