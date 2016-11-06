'use strict';

var RGBColor = function (r, g, b) {
    var err = false;
    var errs = [];
    if(r < 0) {
        err = true;
        errs.push(new RangeError('r should not be less than 0; value provided: ' + r));
    }
    if(r > 255) {
        err = true;
        errs.push(new RangeError('r should not be greater than 255; value provided: ' + r));
    }
    if(g < 0) {
        err = true;
        errs.push(new RangeError('g should not be less than 0; value provided: ' + g));
    }
    if(g > 255) {
        err = true;
        errs.push(new RangeError('g should not be greater than 255; value provided: ' + g));
    }
    if(b < 0) {
        err = true;
        errs.push(new RangeError('b should not be less than 0; value provided: ' + b));
    }
    if(b > 255) {
        err = true;
        errs.push(new RangeError('b should not be greater than 255; value provided: ' + b));
    }
    if(err) {
        var errMessage = errs.reduce(function(p, c, i, a) {
            return p.toLocaleString() + '; ' + c.toLocaleString();
        }, '');
        throw new Error(errMessage);
    }
    var self = this instanceof RGBColor ? this : Object.create(RGBColor.prototype);
    self.red = r;
    self.green = g;
    self.blue = b;
    return self;
};

RGBColor.prototype.toHexColor = function () {
    var r = this.red.toString(16);
    var g = this.green.toString(16);
    var b = this.blue.toString(16);
    return new HexColor(r, g, b);
};
