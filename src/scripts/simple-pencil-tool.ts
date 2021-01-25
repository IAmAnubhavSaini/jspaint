class Pencil {
  id = "PencilTool"
  selectionId = '#PencilTool'
  width = 2
  LastPoint = {
    X: -1,
    Y: -1
  }
  classes = 'main-tool'
  title = 'Click to draw free-hand lines. Click again to disable.'

  start(options: any) {
    var event = options.event,
      canvasId = '#' + options.canvasId,
      mouseOptions:any = null,
      X = null,
      Y = null,
      width = null,
      last = null,
      LastPoint = {
        get: () => {
          return {
            X: this.LastPoint.X,
            Y: this.LastPoint.Y
          };
        },
        set: (x: number, y: number) => {
          this.LastPoint.X = x;
          this.LastPoint.Y = y;
        }
      };

    $(canvasId).on(event, function (e) {
      mouseOptions = {
        event: e,
        relativeTo: $(this)
      };

      var drawLines = () => {
        X = Actions.Mouse.getX(mouseOptions);
        Y = Actions.Mouse.getY(mouseOptions);
        width = this.width;
        last = LastPoint.get();
        if (last.X != -1) {
          CANVASAPI.drawLineSegmentFromLastPoint({
            context: context,
            last: last,
            current: {
              X: X,
              Y: Y
            },
            width: width
          });
        }
        LastPoint.set(X, Y);
      };

      if (e.buttons !== undefined) {
        if (e.buttons === 1) {
          drawLines();
        } else {
          this.LastPoint.X = -1;
          this.LastPoint.Y = -1;
        }
      }
    })
  }

  stop(options: any) {
    var event = options.event || CONSTANTS.Events.mousemove,
      canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);

    $(canvasId).off(event);
  }

  ContextMenu = {
    activate: function (options: any) {
      function initialSlider() {
        return COMMON.generateSlider({
          id: "widthPencil",
          min: 1,
          max: 200,
          step: 1,
          title: "Width for pencil tool."
        });
      }

      function addSliderForLineWidth(options: any) {
        var div = $('<div></div>').attr('id', options.id).addClass('menu-item'),
          slider = initialSlider()
            .attr('value', Pencil.VARIABLES.width)
            .on('mouseover', function () {
              $(this).attr('title', $(this).val());
            })
            .on('input', function () {
              Pencil.VARIABLES.width = $(this).val();
            })
            .appendTo(div);

        div.appendTo($(options.containerSelectionCriterion));
      }

      addSliderForLineWidth(options);
    },
    deactivate: function (options: any) {
      function removeSliderForLineWidth(options: any) {
        $('#' + options.id).remove();
      }

      removeSliderForLineWidth(options);
    },
    getOptions: function () {
      return {
        tool: this,
        id: 'PencilContextMenu',
        containerSelectionCriterion: '.contextual-tool-bar'
      };
    }
  }
}

COMMON.registerEventForTool({
  toolId: Pencil.CONSTANTS.selectionId,
  event: CONSTANTS.Events.mousemove,
  canvasId: CONSTANTS.canvasId,
  start: Pencil.start,
  stop: Pencil.stop,
  toolName: 'Pencil',
  contextMenu: Pencil.ContextMenu,
  constantTitle: Pencil.CONSTANTS.title
});
$('#PencilTool').trigger('click');


export default Pencil;
