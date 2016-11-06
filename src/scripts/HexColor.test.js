'use strict';

var tests = [
  {
    toTest: typeof HexColor,
    testedFor: typeof function () { },
    description: 'HexColor is a function'
  }
];

strike(tests, 'HexColor.test.js');
