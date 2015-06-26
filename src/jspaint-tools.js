;
var JSPaintTools = function($, options){
  "use strict";
  var canvasId = options.canvasId,
      context = options.context,
      cursorWhenActive = options.cursorWhenActive,
      jspaintMouseTools = options.jspaintMouseTools,
      selectAllTools = options.allMainToolsClass;

  var InitAllMainToolsTitle = function(){
    $('.'+selectAllTools).attr('title', 'Click to activate;\nRight-click to deactivate;\nDouble-click to see special menu.');
  }();

  var ActivateSpeedDotFreeStyle = function(options){
    $('#'+canvasId).addClass(cursorWhenActive);
    $(options.tool).addClass('active-tool');
    jspaintMouseTools.MouseTrack(canvasId, function(e){});
  }
  var DeactivateSpeedDotFreeStyle = function(options){
    $('#'+canvasId).removeClass(cursorWhenActive);
    $(options.tool).removeClass('active-tool');
    jspaintMouseTools.StopMouseTrack(canvasId);
  }
  return {
    ActivateSpeedDotFreeStyle : ActivateSpeedDotFreeStyle,
    DeactivateSpeedDotFreeStyle : DeactivateSpeedDotFreeStyle
  }
  // var workingWithToolsClass = options.workingWithToolsClassName,
  //     allMainToolsClass = options.allMainToolsClass,
  // ActivateTool = function(toolId){
  //   var elementId = '#'+toolId;
  //   if($(elementId)[0]===undefined){
  //     var errorMessage = 'Error - toolId: ' + toolId + ' not found!';
  //     console.log(errorMessage);
  //     throw new Error(errorMessage);
  //   } else{
  //     $('.'+allMainToolsClass).DeactivateTool();
  //     $
  //   }
  // }
};
