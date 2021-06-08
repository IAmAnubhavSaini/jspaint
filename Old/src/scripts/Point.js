"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = -1; }
        if (y === void 0) { y = -1; }
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Point.prototype, "X", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "Y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Point.default = function () {
        return new Point();
    };
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=Point.js.map