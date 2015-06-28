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
  },
  fillCirc = function(x, y, radius){
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#000';
    context.fill();
  },
  StartCircleStamp = function() {
    $('#'+canvasId).on("click", function (event) {
      fillCirc( (event.pageX - $(this).offset().left),
                (event.pageY - $(this).offset().top),
                4);
    });
  },
  StopCircleStamp = function() {
    $('#'+canvasId).off("click");
  };

  return {
    MouseTrack: MouseTrack,
    StopMouseTrack: StopMouseTrack,
    StartCircleStamp: StartCircleStamp,
    StopCircleStamp: StopCircleStamp
  };
};
