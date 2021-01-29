"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicColors = exports.Color = void 0;
var BasicColors;
(function (BasicColors) {
    BasicColors["Aqua"] = "#00FFFF";
    BasicColors["Black"] = "#000000";
    BasicColors["Blue"] = "#0000FF";
    BasicColors["Fuchsia"] = "#FF00FF";
    BasicColors["Gray"] = "#808080";
    BasicColors["Green"] = "#008000";
    BasicColors["Lime"] = "#00FF00";
    BasicColors["Maroon"] = "#800000";
    BasicColors["Navy"] = "#000080";
    BasicColors["Olive"] = "#808000";
    BasicColors["Purple"] = "#800080";
    BasicColors["Red"] = "#FF0000";
    BasicColors["Silver"] = "#C0C0C0";
    BasicColors["Teal"] = "#008080";
    BasicColors["White"] = "#FFFFFF";
    BasicColors["Yellow"] = "#FFFF00";
})(BasicColors || (BasicColors = {}));
exports.BasicColors = BasicColors;
var Color = (function () {
    function Color() {
    }
    Color.rgb2hex = function (r, g, b) {
        return [r, g, b]
            .map(function (c) { return parseInt(c).toString(16); })
            .map(function (c) { return c.toUpperCase(); })
            .map(function (c) { return c.padStart(2, '0'); })
            .reduce(function (a, c) { return a + c; }, '#');
    };
    Color.hex2rgb = function (hex) {
        return [hex || '#000']
            .map(function (h) { return h.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (_matches, r, g, b) { return '' + r + r + g + g + b + b; }); })
            .map(function (h) { return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); })
            .map(function (mrgb) { return (mrgb || [0, 0, 0, 0]).slice(1); })
            .map(function (rgb) { return rgb.map(function (c) { return parseInt(c.toString()).toString(16); }); })
            .map(function (rgb) { return ({
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
            rgb: "rgb(" + rgb.join(', ') + ")",
            rgba: "rgba(" + rgb.join(', ') + ", 1)"
        }); })
            .pop();
    };
    return Color;
}());
exports.Color = Color;
//# sourceMappingURL=Color.js.map