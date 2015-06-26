;
var JSPaintMouse = function(options){
  var $ = options.$,
      context = options.context,
      canvasId = options.canvasId,
      subMenuContainerId = options.subMenuContainerId;

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

  CreateOptionsForSpeedDotFreeStyle = function(){
        var container = $('#'+subMenuContainerId),
            stopButton = $('<div id="StopCurrentTool">Close</div>'),
            drawColor = '<input type="color" id="drawColor" />',
            submit = '<input type="submit" id="submitOptions" />';

        $(stopButton)
          .addClass('stopToolButton')
          .bind('click', function(){
            DestroyOptionsForSpeedDotFreeStyle();
          });
        $(stopButton).appendTo(container);
        $(drawColor).appendTo(container);
        $(submit)
            .bind("click", function(){
                context.fillStyle = $('#drawColor').val();
                DestroyOptionsForSpeedDotFreeStyle();
            })
            .appendTo(container);
        container.children().css({'padding':'10px', 'margin':'10px'});
        container.show();
      };

      var DestroyOptionsForSpeedDotFreeStyle = function(){
        $('#drawColor').remove();
        $('#submitOptions').remove();
        $('#'+subMenuContainerId).html('').hide();
      };

      return {
        MouseTrack: MouseTrack,
        StopMouseTrack: StopMouseTrack,
        CreateOptionsForSpeedDotFreeStyle: CreateOptionsForSpeedDotFreeStyle,
        DestroyOptionsForSpeedDotFreeStyle: DestroyOptionsForSpeedDotFreeStyle
      }
};
