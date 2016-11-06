'use strict';

var HexColor = function (r, g, b) {
    /* pass hex numbers or strings */
    var self = this instanceof HexColor ? this : Object.create(HexColor.prototype);
    self.red = r;
    self.green = g;
    self.blue = b;
    self.value = '#' + r + g + b;
    return self;
}
