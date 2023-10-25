"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
var Circle = /** @class */ (function () {
    function Circle(context, radius) {
        if (radius === void 0) { radius = 1; }
        this.radius = 1;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        this.antiClockwise = false;
        this.context = context;
        this.radius = radius;
    }
    Circle.prototype.draw = function (withPattern, atPosition) {
        this.drawWith(withPattern);
        this.drawAt(atPosition);
        return this;
    };
    Circle.prototype.drawAt = function (point) {
        this.context.beginPath();
        this.context.arc(point.X, point.Y, this.radius, this.startAngle, this.endAngle, this.antiClockwise);
        this.context.closePath();
        this.context.stroke();
        return this;
    };
    Circle.prototype.drawWith = function (options) {
        this.context.strokeStyle = options.strokePattern;
        this.context.lineWidth = options.lineWidth;
        return this;
    };
    Circle.prototype.fill = function (withPattern, atPosition) {
        this.fillWith(withPattern);
        this.fillAt(atPosition);
        return this;
    };
    Circle.prototype.fillAt = function (point) {
        this.context.beginPath();
        this.context.arc(point.X, point.Y, this.radius, this.startAngle, this.endAngle, this.antiClockwise);
        this.context.closePath();
        this.context.fill();
        return this;
    };
    Circle.prototype.fillWith = function (fillPattern) {
        this.context.fillStyle = fillPattern;
        return this;
    };
    return Circle;
}());
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map