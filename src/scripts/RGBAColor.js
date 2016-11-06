'use strict';

var RGBAColor = function (r, g, b, a) {
    var self = this instanceof RGBAColor ? this : Object.create(RGBAColor.prototype);
    self.red = r;
    self.green = g;
    self.blue = b;
    self.alpha = a;
    return self;
};
