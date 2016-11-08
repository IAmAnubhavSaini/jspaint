'use strict';

var tests = [
  {
    toTest: typeof setup,
    testedFor: typeof function () { },
    description: 'setup is a function'
  },
  {
    toTest: typeof createCanvas,
    testedFor: typeof function () { },
    description: 'createCanvas is a function'
  },
  {
    toTest: typeof getBrowserHeight,
    testedFor: typeof function () { },
    description: 'getBrowserHeight is a function'
  },
  {
    toTest: typeof getBrowserWidth,
    testedFor: typeof function () { },
    description: 'getBrowserWidth is a function'
  },
  {
    toTest: typeof getCanvasContainer,
    testedFor: typeof function () { },
    description: 'getCanvasContainer is a function'
  },
  {
    toTest: typeof addNewCanvas,
    testedFor: typeof function () { },
    description: 'addNewCanvas is a function'
  },
  {
    toTest: typeof position,
    testedFor: typeof function () { },
    description: 'position is a function'
  },
  {
    toTest: typeof border,
    testedFor: typeof function () { },
    description: 'border is a function'
  },
  {
    toTest: typeof verticallyStackCanvas,
    testedFor: typeof function () { },
    description: 'verticallyStackCanvas is a function'
  },
  (function positionTests() {
    var tests = [];
    (function (el) {
      tests.push({
        toTest: position(el),
        testedFor: el,
        description: 'position(el) returns same el'
      });
    })({ style: {} });
    (function (el) {
      for (var t = -10; t < 11; t++) {
        tests.push({
          toTest: position(el, 'relative', t + 'px').style.top,
          testedFor: t + 'px',
          description: 'position(el, relative, \'' + t + 'px\') sets up correct style.top value in el'
        });
        tests.push({
          toTest: position(el, 'relative', t + 'px').style.top,
          testedFor: el.style.top,
          description: 'position(el, relative, \'' + t + 'px\') sets up style.top in el'
        });
      }
    })({ style: {} });
    (function (el) {
      for (var b = -10; b < 11; b++) {
        tests.push({
          toTest: position(el, 'relative', undefined, undefined, b + 'px', undefined).style.bottom,
          testedFor: b + 'px',
          description: 'position(el, relative, undefined, undefined, \'' + b + 'px\', undefined) sets up correct style.bottom value in el'
        });
        tests.push({
          toTest: position(el, 'relative', undefined, undefined, b + 'px', undefined).style.bottom,
          testedFor: el.style.bottom,
          description: 'position(el, relative, undefined, undefined, \'' + b + 'px\', undefined) sets up style.bottom value in el'
        });
      }
    })({ style: {} });
    (function (el) {
      for (var r = -10; r < 11; r++) {
        tests.push({
          toTest: position(el, 'relative', undefined, r + 'px', undefined, undefined).style.right,
          testedFor: r + 'px',
          description: 'position(el, relative, undefined, \'' + r + 'px\', undefined, undefined) sets up correct style.right value in el'
        });
        tests.push({
          toTest: position(el, 'relative', undefined, r + 'px', undefined, undefined).style.right,
          testedFor: el.style.right,
          description: 'position(el, relative, undefined, \'' + r + 'px\', undefined, undefined) sets up style.right value in el'
        });
      }
    })({ style: {} });
    (function (el) {
      for (var l = -10; l < 11; l++) {
        tests.push({
          toTest: position(el, 'relative', undefined, undefined, undefined, l + 'px').style.left,
          testedFor: l + 'px',
          description: 'position(el, relative, undefined, undefined, undefined, \'' + l + 'px\') sets up correct style.left value in el'
        });
        tests.push({
          toTest: position(el, 'relative', undefined, undefined, undefined, l + 'px').style.left,
          testedFor: el.style.left,
          description: 'position(el, relative, undefined, undefined, undefined, \'' + l + 'px\') sets up style.left value in el'
        });
      }
    })({ style: {} });
    (function (el) {
      tests.push({
        toTest: position(el, 'relative').style.position,
        testedFor: el.style.position,
        description: 'position(el, relative) sets up relative position in el'
      });
    })({ style: {} });
    return tests;
  })(),

];

strike(tests, 'jspaint.test.js');
