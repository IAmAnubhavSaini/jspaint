'use strict';

function strike(tests, where) {
  var success = 0;
  var failure = 0;
  tests.forEach(function (t) {
    if(t instanceof Array) {
      t.forEach(function(u){
        match(u.toTest, u.testedFor, u.description) ? success++ : failure++;
      })
    } else {
      match(t.toTest, t.testedFor, t.description) ? success++ : failure++;
    }
  });
  console.log(success, 'succeeded;', failure, 'failed!', 'in', where);
}

function match(a, b, desc) {
  var out = a === b ? true : false;
  if (console && !out) {
    console.log('match failed: ', desc, ':', a, '(toTest) is not (testedFor)', b);
  }
  return out;
}
