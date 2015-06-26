var JSPaintTools = function(options){
  "use strict";

  var $ = options.$,
      canvasId = options.canvasId,
      context = options.context,
      cursorWhenActive = options.cursorWhenActive,
      selectAllTools = options.allMainToolsClass,
      subMenuContainerId = options.subMenuContainerId,
      MouseTools = null;

  (function(){
    MouseTools = new JSPaintMouse({
      $: $,
      canvasId: canvasId,
      context: context,
      cursorWhenActive: cursorWhenActive,
      selectAllTools: selectAllTools,
      subMenuContainerId: subMenuContainerId
    });
  })();

  var InitAllMainToolsTitle = function(){
    $('.'+selectAllTools).attr('title', 'Click to activate;\nRight-click to deactivate;\nDouble-click to see special menu.');
  }();

  var ActivateSpeedDotFreeStyle = function(options){
    $('#'+canvasId).addClass(cursorWhenActive);
    $(options.tool).addClass('active-tool');
    MouseTools.MouseTrack({tool: options.tool, 'currentCanvas': canvasId, 'trackCallback': function(e){}});
  },
  DeactivateSpeedDotFreeStyle = function(options){
    $('#'+canvasId).removeClass(cursorWhenActive);
    $(options.tool).removeClass('active-tool');
    MouseTools.StopMouseTrack({tool: options.tool, canvasId: canvasId});
  },
  ShowOptionsForSpeedDotFreeStyle = function(options){
    $(options.tool).addClass('tool-sub-menu-active');
    MouseTools.CreateOptionsForSpeedDotFreeStyle(
      {
        subMenuContainerId: subMenuContainerId,
        context: context
      });
  },
  HideOptionsForSpeedDotFreeStyle = function(options){
    $(options.tool).removeClass('tool-sub-menu-active');
    MouseTools.DestroyOptionsForSpeedDotFreeStyle(subMenuContainerId);
  };

  return {
    startSpeedDotFreeStyle : ActivateSpeedDotFreeStyle,
    stopSpeedDotFreeStyle : DeactivateSpeedDotFreeStyle,
    showOptionsForSpeedDotFreeStyle: ShowOptionsForSpeedDotFreeStyle,
    hideOptionsForSpeedDotFreeStyle: HideOptionsForSpeedDotFreeStyle
  };
};
