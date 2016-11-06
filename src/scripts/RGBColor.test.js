'use strict';

var tests = [
  {
    toTest: typeof RGBColor,
    testedFor: typeof function () { },
    description: 'RGBColor is a function'
  },
  {
    toTest: typeof (new RGBColor()).toHexColor,
    testedFor: typeof function () { },
    description: 'RGBColor has toHexColor as a method'
  },
  {
    toTest: typeof (new RGBColor(0, 0, 0)).toHexColor(),
    testedFor: typeof new HexColor(0, 0, 0),
    description: 'RGBColor has toHexColor as a method'
  },
  (function () {
    var allColorCases = [];
    for (var c = 0; c < 255; c++) {
      var actual = (new RGBColor(c, c, c)).toHexColor();
      var hex = c.toString(16);
      var expected = new HexColor(hex, hex, hex);
      var actualString = '(new RGBColor(' + c + ', ' + c + ', ' + c + ')).toHexColor()';
      var expectedString = 'new HexColor(' + hex + ', ' + hex + ', ' + hex + ')';
      allColorCases.push({
        toTest: actual.red,
        testedFor: expected.red,
        description: actualString + '.red === ' + expectedString + '.red'
      });
      allColorCases.push({
        toTest: actual.green,
        testedFor: expected.green,
        description: actualString + '.green === ' + expectedString + '.green'
      });
      allColorCases.push({
        toTest: actual.blue,
        testedFor: expected.blue,
        description: actualString + '.blue === ' + expectedString + '.blue'
      });
    }
    return allColorCases;
  })()
];

strike(tests, 'RGBColor.test.js');
