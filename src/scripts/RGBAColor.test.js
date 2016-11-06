'use strict';

var tests = [
  {
    toTest: typeof RGBAColor,
    testedFor: typeof function () { },
    description: 'RGBAColor is a function'
  }
];

strike(tests, 'RGBAColor.test.js');
