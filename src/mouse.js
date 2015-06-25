;
var JSPaintMouse = function($){
 var MouseTrack = function (currentCanvas, cursorPositionNotifier) {
          var canvas = $(currentCanvas),
              parentOffset = $(canvas).offset(),
              context = canvas.getContext("2d"),
              pixelSize = 2,
              color = "#000000",
              backgroundColor = "#FFffFF";

          $(canvas).on("mousemove", function (event) {
              $(coordLogArea).text(cursorPositionNotifier(event));
              context.fillRect((event.pageX - parseInt(parentOffset.left)), (event.pageY - parseInt(parentOffset.top)), pixelSize, pixelSize);
          });

          $("#Clear").click(function () {
              context.clearRect(0, 0, canvas.width, canvas.height);
          });

          $("#Apply").click(function () {
              pixelSize = $("#Size").val();
              context.fillStyle = $("#Color").val();
          });

      };
      return {
        MouseTrack: MouseTrack
      }
};
