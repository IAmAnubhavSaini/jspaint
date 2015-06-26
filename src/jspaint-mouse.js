;
var JSPaintMouse = function($){
 var MouseTrack = function (currentCanvas, cursorPositionNotifier) {
          var canvas = $('#'+currentCanvas),
              parentOffset = $(canvas).offset(),
              context = $(canvas)[0].getContext("2d"),
              pixelSize = 2,
              color = "#000000",
              backgroundColor = "#FFffFF";

          $(canvas).on("mousemove", function (event) {
              cursorPositionNotifier(event);
              context.fillRect( (event.pageX - $(this).offset().left),
                                (event.pageY - $(this).offset().top),
                                pixelSize, pixelSize);
          });

          // $("#Clear").click(function () {
          //     context.clearRect(0, 0, canvas.width, canvas.height);
          // });
          //
          // $("#Apply").click(function () {
          //     pixelSize = $("#Size").val();
          //     context.fillStyle = $("#Color").val();
          // });

      };
      var StopMouseTrack = function(currentCanvas){
        $('#'+currentCanvas).off("mousemove");
      };

      return {
        MouseTrack: MouseTrack,
        StopMouseTrack: StopMouseTrack
      }
};
