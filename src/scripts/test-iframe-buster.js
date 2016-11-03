function strike(tests) {
  var success = 0;
  var failure = 0;
  tests.forEach(function (t) {
    match(t.toTest, t.testedFor, t.description) ? success++ : failure++;
  });
  console.log(success, 'succeeded;', failure, 'failed!');
}

function match(a, b, desc) {
  var out = a === b ? true : false;
  if (console && !out) {
    console.log('match failed: ', desc, ':', a, '(toTest) is not (testedFor)', b);
  }
  return out;
}

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
  }
];

strike(tests);
