function strike(tests) {
  var success = 0;
  var failure = 0;
  tests.forEach(function (t) {
    var res = match(t.toTest, t.testedFor, t.description);
    if (res) {
      success++;
    } else {
      failure++;
    }
  });
  console.log(success, 'succeeded;', failure, 'failed!');
}

function match(a, b, desc) {
  var out;
  if (a === b) {
    out = true;
  } else {
    out = false;
    if (console) {
      console.log('match failed: ', desc, ':', a, '(toTest) is not (testedFor)', b);
    }
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
];

strike(tests);
