"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
var Rectangle = /** @class */ (function () {
    function Rectangle(context, sideShort, sideLong) {
        if (sideShort === void 0) { sideShort = 1; }
        if (sideLong === void 0) { sideLong = 2; }
        this.sideShort = 1;
        this.sideLong = 1;
        this.sideShort = sideShort;
        this.sideLong = sideLong;
        this.context = context;
    }
    Rectangle.prototype.drawAt = function (point2d) {
        this.context.fillRect(point2d.X, point2d.Y, this.sideShort, this.sideLong);
        return this;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=Rectangle.js.map