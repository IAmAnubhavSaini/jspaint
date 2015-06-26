;
var JSPaintMouse = function($){
 var MouseTrack = function (options) {
          var canvas = $('#'+options.currentCanvas),
              context = $(canvas)[0].getContext("2d"),
              trackCallback = options.trackCallback,
              color = "#000000",
              backgroundColor = "#FFffFF";

          $(canvas).on("mousemove", function (event) {
              trackCallback(event);
              context.fillRect( (event.pageX - $(this).offset().left),
                                (event.pageY - $(this).offset().top),
                                2, 2);
          });
      };
      var StopMouseTrack = function(options){
        $('#'+options.canvasId).off("mousemove");
      };

      var CreateOptionsForSpeedDotFreeStyle = function(options){
        var container = $('#'+options.subMenuContainerId),
            stopButton = $('<div id="StopCurrentTool">Close</div>'),
            drawColor = '<input type="color" id="drawColor" />',
            submit = '<input type="submit" id="submitOptions" />',
            context = options.context;

        $(stopButton)
          .addClass('stopToolButton')
          .bind('click', function(){
            DestroyOptionsForSpeedDotFreeStyle(options.subMenuContainerId);
          });
        $(stopButton).appendTo(container);
        $(drawColor).appendTo(container);
        $(submit)
            .bind("click", function(){
                context.fillStyle = $('#drawColor').val();
                DestroyOptionsForSpeedDotFreeStyle(options.subMenuContainerId);
            })
            .appendTo(container);
        container.children().css({'padding':'10px', 'margin':'10px'});
        container.show();
      };

      var DestroyOptionsForSpeedDotFreeStyle = function(subMenuContainerId){
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
