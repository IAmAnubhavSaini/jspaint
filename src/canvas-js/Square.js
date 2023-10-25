"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Square = void 0;
var Square = /** @class */ (function () {
    function Square(context, side) {
        if (side === void 0) { side = 1; }
        this.side = 1;
        this.side = side;
        this.context = context;
    }
    Square.prototype.drawAt = function (point2d) {
        this.context.fillRect(point2d.X, point2d.Y, this.side, this.side);
        return this;
    };
    return Square;
}());
exports.Square = Square;
//# sourceMappingURL=Square.js.map