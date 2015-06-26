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
      var StopMouseTrack = function(currentCanvas){
        $('#'+currentCanvas).off("mousemove");
      };
      var CreateOptionsForSpeedDotFreeStyle = function(options){
        var container = $('#'+options.subMenuContainerId),
            drawColor = '<input type="color" id="drawColor" />',
            submit = '<input type="submit" id="submitOptions" />',
            context = options.context;

        $(drawColor).appendTo(container);
        $(submit)
            .bind("click", function(){
                context.fillStyle = $('#drawColor').val();
                container.hide();
            })
            .appendTo(container);
        container.children().css({'padding':'10px', 'margin':'10px'});
        container.show();
      };

      var DestroyOptionsForSpeedDotFreeStyle = function(subMenuContainerId){
        $('#'+subMenuContainerId).html('');
        $('#'+subMenuContainerId).hide();
      };


      return {
        MouseTrack: MouseTrack,
        StopMouseTrack: StopMouseTrack,
        CreateOptionsForSpeedDotFreeStyle: CreateOptionsForSpeedDotFreeStyle,
        DestroyOptionsForSpeedDotFreeStyle: DestroyOptionsForSpeedDotFreeStyle
      }
};
