var JSPaint = function(options){
  "use strict";

  var Tools = null,

  InitializeCanvas = function(options){
    var width = $('#'+options.containerId).css('width').replace('px','');
    var height = $('#'+options.containerId).css('height').replace('px','');
    var context = null;
    var canvas = $('<canvas/>', { id: options.canvasId })
                      .prop({
                        'width': width,
                        'height': height
                       });
    $('#'+options.containerId).append(canvas);
    return $('#'+options.canvasId)[0].getContext('2d');
  };

  (function(options){
    Tools = new JSPaintTools({
        $ : options.$,
        canvasId: options.canvasId,
        context: new InitializeCanvas(options),
        cursorWhenActive: "working-with-tools",
        allMainToolsClass: "main-tool",
        subMenuContainerId: "ToolSubMenuBar"
      });
  })(options);

  return{
    Tools: Tools
  };
};
