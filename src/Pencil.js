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
//# sourceMappingURL=Pencil.js.map