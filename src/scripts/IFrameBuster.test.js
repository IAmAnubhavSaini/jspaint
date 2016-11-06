'use strict';

var tests = [
  {
    toTest: typeof IFrameBuster,
    testedFor: typeof function () { },
    description: 'IFrameBuster is a function'
  },
  {
    toTest: (new IFrameBuster()).warningPrefix,
    testedFor: 'You are visiting jspaint in an insecure way!',
    description: 'warningPrefix'
  },
  {
    toTest: (new IFrameBuster()).appHomePage,
    testedFor: 'http://IAmAnubhavSaini.github.io/jspaint',
    description: 'appHomePage'
  },
  {
    toTest: (new IFrameBuster()).alertMessage.indexOf('Security risk! Go to original page: '),
    testedFor: 0,
    description: 'alertMessage'
  },
  {
    toTest: (new IFrameBuster()).activationStatus,
    testedFor: false,
    description: 'activationStatus'
  },
  {
    toTest: typeof IFrameBuster.prototype.isActivated,
    testedFor: typeof function () { },
    description: 'IFrameBuster.prototype.isActivated is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).isActivated,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).isActivated is a function'
  },
  {
    toTest: (new IFrameBuster()).isActivated(),
    testedFor: false,
    description: 'isActivated() returns false for newly created IFrameBuster object'
  },
  {
    toTest: typeof (new IFrameBuster()).alertUserAboutScam,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).alertUserAboutScam is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).setBlockerStyle,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).setBlockerStyle is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).createBlocker,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).createBlocker is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).injectBlocker,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).injectBlocker is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).goToJSPaintHome,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).goToJSPaintHome is a function'
  },
  {
    toTest: typeof (new IFrameBuster()).activate,
    testedFor: typeof function () { },
    description: 'typeof (new IFrameBuster()).activate is a function'
  }
];

strike(tests, 'test-iframe-buster.js');
