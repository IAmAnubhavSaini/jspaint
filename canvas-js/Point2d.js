"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point2d = void 0;
var Point2d = /** @class */ (function () {
    function Point2d(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Point2d.prototype, "X", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point2d.prototype, "Y", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Point2d.prototype.toString = function () {
        return "{".concat(this.x, ", ").concat(this.y, "}"); // {x, y}
    };
    Point2d.prototype.distanceFrom = function (other2DPoint) {
        return Math.sqrt(Math.pow(this.x - other2DPoint.X, 2) + Math.pow(this.y - other2DPoint.Y, 2));
    };
    Point2d.prototype.translate = function (scalar) {
        return new Point2d(this.x * scalar, this.y * scalar);
    };
    Point2d.prototype.flip = function () {
        return new Point2d(this.y, this.x);
    };
    return Point2d;
}());
exports.Point2d = Point2d;
//# sourceMappingURL=Point2d.js.map