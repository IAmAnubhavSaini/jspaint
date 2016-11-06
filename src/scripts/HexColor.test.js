'use strict';

var tests = [
  {
    toTest: typeof HexColor,
    testedFor: typeof function () { },
    description: 'HexColor is a function'
  },
  (function () {
    var allColorCases = [];
    for (var c = 0; c < 255; c++) {
      var actual = (new RGBColor(c, c, c)).toHexColor();
      var hex = c.toString(16);
      var expected = new HexColor(hex, hex, hex).value;
      allColorCases.push({
        toTest: '#' + actual.red + actual.green + actual.blue,
        testedFor: expected,
        description: 'HexColor via RGBColor'
      });
    }
    return allColorCases;
  })(),
  {
    toTest: typeof (new HexColor(10, 10, 10)).toLongColorString,
    testedFor: typeof function () { },
    description: 'HexColor has toLongColorString as a method'
  },
  {
    toTest: typeof (new HexColor(10, 10, 10)).toShortColorString,
    testedFor: typeof function () { },
    description: 'HexColor has toShortColorString as a method'
  },
];

strike(tests, 'HexColor.test.js');
