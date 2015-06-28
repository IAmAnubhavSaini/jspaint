var JSPaintMouse = function(options){
  "use strict";

  var $ = options.$,
      context = options.context,
      canvasId = options.canvasId;

  var MouseTrack = function () {
    var color = "#000000",
        backgroundColor = "#FFffFF";

      $('#'+canvasId).on("mousemove", function (event) {
        context.fillRect( (event.pageX - $(this).offset().left),
                          (event.pageY - $(this).offset().top),
                           2, 2);
      });
  },
  StopMouseTrack = function(){
    $('#'+canvasId).off("mousemove");
  };

  return {
    MouseTrack: MouseTrack,
    StopMouseTrack: StopMouseTrack
  };
};
