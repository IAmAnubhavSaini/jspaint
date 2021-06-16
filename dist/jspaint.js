(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pencil = void 0;
var Pencil = /** @class */ (function () {
    function Pencil(context, startAt) {
        this.current = startAt;
        this.context = context;
    }
    Pencil.prototype.lineTo = function (to) {
        this.context.beginPath();
        this.context.moveTo(this.current.X, this.current.Y);
        this.context.lineTo(to.X, to.Y);
        this.context.stroke();
        this.current = to;
        return this;
    };
    return Pencil;
}());
exports.Pencil = Pencil;

},{}],3:[function(require,module,exports){
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
        return "{" + this.x + ", " + this.y + "}"; // {x, y}
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pencil = exports.Point2d = exports.Square = exports.Circle = void 0;
var Circle_1 = require("./Circle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return Circle_1.Circle; } });
var Square_1 = require("./Square");
Object.defineProperty(exports, "Square", { enumerable: true, get: function () { return Square_1.Square; } });
var Point2d_1 = require("./Point2d");
Object.defineProperty(exports, "Point2d", { enumerable: true, get: function () { return Point2d_1.Point2d; } });
var Pencil_1 = require("./Pencil");
Object.defineProperty(exports, "Pencil", { enumerable: true, get: function () { return Pencil_1.Pencil; } });

},{"./Circle":1,"./Pencil":2,"./Point2d":3,"./Square":4}],6:[function(require,module,exports){
const {Circle, Point2d, Square, Pencil} = require('canvas-js');

function drawCircle(context) {
    const circle = new Circle(context, 10);
    circle.drawAt(new Point2d(100.5, 100.5));
}

function randomCircle(context, scaleFactor = 500) {
    const radius = Math.floor(Math.random() * scaleFactor * 0.4);
    const circle = new Circle(context, radius);
    circle.drawAt(new Point2d(Math.random() * scaleFactor + 0.5, Math.random() * scaleFactor * 0.5 + 0.5));
}

function randomSquare(context, scaleFactor = 500) {
    const side = Math.floor(Math.random() * scaleFactor * 0.2);
    const circle = new Square(context, side);
    circle.drawAt(new Point2d(Math.random() * scaleFactor + 0.5, Math.random() * scaleFactor * 0.5 + 0.5));
}

function runPencil(context, offset) {
    let last = null;
    let pencil = last ? new Pencil(context, new Point2d(last.x, last.y)) : null;

    function handlePencil(e) {
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        if (!last) {
            last = {x, y};
            return;
        }
        pencil = new Pencil(context, new Point2d(last.x, last.y));
        const pt = new Point2d(x, y);
        pencil.lineTo(pt);
        last = {x, y};
    }

    const f = () => window.jspaint.pencil;
    if (!f()) {
        document.addEventListener('mousemove', handlePencil);
        window.jspaint.pencil = true;
    } else {
        window.jspaint.pencil = false;
        document.removeEventListener('mousemove', handlePencil);
    }
    document.querySelector('#pencil-button').addEventListener('click', () => {
        document.removeEventListener('mousemove', handlePencil);
    });

}

window.jspaint = {drawCircle, randomCircle, randomSquare, runPencil};
},{"canvas-js":5}]},{},[6]);
