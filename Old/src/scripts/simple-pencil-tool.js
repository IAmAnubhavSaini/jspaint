"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point_js_1 = require("./Point.js");
var Pencil = (function () {
    function Pencil() {
        this.id = 'PencilTool';
        this.selectionId = '#PencilTool';
        this.width = 2;
        this.LastPoint = new Point_js_1.Point();
        this.classes = 'main-tool';
        this.title = 'Click to draw free-hand lines. Click again to disable.';
        this.ContextMenu = {
            activate: function (options) {
                function initialSlider() {
                    return COMMON.generateSlider({
                        id: 'widthPencil',
                        min: 1,
                        max: 200,
                        step: 1,
                        title: 'Width for pencil tool.'
                    });
                }
                function addSliderForLineWidth(options) {
                    var div = $('<div></div>').attr('id', options.id).addClass('menu-item'), slider = initialSlider()
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
            deactivate: function (options) {
                function removeSliderForLineWidth(options) {
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
        };
    }
    Pencil.prototype.start = function (options) {
        var event = options.event, canvasId = '#' + options.canvasId, mouseOptions = null, X = null, Y = null, width = null, last = null;
        $(canvasId).on(event, function (e) {
            var _this = this;
            mouseOptions = {
                event: e,
                relativeTo: $(this)
            };
            var drawLines = function () {
                X = Actions.Mouse.getX(mouseOptions);
                Y = Actions.Mouse.getY(mouseOptions);
                width = _this.width;
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
                }
                else {
                    this.LastPoint.X = -1;
                    this.LastPoint.Y = -1;
                }
            }
        });
    };
    Pencil.prototype.stop = function (options) {
        var event = options.event || CONSTANTS.Events.mousemove, canvasId = '#' + (options.canvasId || CONSTANTS.canvasId);
        $(canvasId).off(event);
    };
    return Pencil;
}());
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
exports.default = Pencil;
//# sourceMappingURL=simple-pencil-tool.js.map