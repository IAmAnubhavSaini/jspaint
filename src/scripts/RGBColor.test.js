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
  {
    toTest: typeof (new RGBColor()).toColorString,
    testedFor: typeof function () { },
    description: 'RGBColor has toColorString as a method'
  },
  (function () {
    var allColorCases = [];
    for (var c = 0; c < 255; c++) {
      var actual = (new RGBColor(c, c, c)).toColorString();
      var expected = 'rgb(' + c + ', ' + c + ', ' + c + ')';
      allColorCases.push({
        toTest: actual,
        testedFor: expected,
        description: '(new RGBColor(c, c, c)).toColorString()'
      });
    }
    return allColorCases;
  })()
];

strike(tests, 'RGBColor.test.js');
