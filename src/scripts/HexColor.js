'use strict';

var HexColor = function (r, g, b) {
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
    var self = this instanceof HexColor ? this : Object.create(HexColor.prototype);
    self.red = r.toString(16);
    self.green = g.toString(16);
    self.blue = b.toString(16);
    self.value = '#' + self.red + self.green + self.blue;
    return self;
}

HexColor.prototype.toLongColorString = function () {
    return this.value;
};

HexColor.prototype.toShortColorString = function () {
    return '#' + this.value.substr(1, 1) + this.value.substr(3, 1) + this.value.substr(5, 1);  
};