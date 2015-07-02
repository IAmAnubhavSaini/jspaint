tests = function(){
        if(window.location.href.startsWith("file://")){
          mocha.setup('bdd');
          mocha.reporter('html');
          var assert = chai.assert;
          var dimensionTests = function(){
            describe('Testing dimension events, as in, do objects have right events attached to them?', function(){
              var opt = $('.dimension-options button');
              var events = $._data(opt[0], "events");
              it("'.dimension-options button' should have a defined click event attached to it.", function(){
                assert(events.click !== "undefined");
              });
              it("'.dimension-options button' should have exactly one defined click event attached to it.", function(){
                assert(events.click.length === 1);
              });
            });
          },
          orientationTests = function(){
            describe('Testing orientation events, as in, do objects have right events attached to them?', function(){
              var opt = $('.orientation-options button');
              var events = $._data(opt[0], "events");
              it("'.orientation-options button' should have a defined click event attached to it.", function(){
                assert(events.click !== "undefined");
              });
              it("'.orientation-options button' should have exactly one defined click event attached to it.", function(){
                assert(events.click.length === 1);
              });
            });
          },
          actionTests = function(){
            describe('Testing jspaint-action events, as in, do objects have right events attached to them?', function(){
              var action = $('#jspaint-action');
              var events = $._data(action[0], "events");
              it("'#jspaint-action' should have a defined click event attached to it.", function(){
                assert(events.click !== "undefined");
              });
              it("'#jspaint-action' should have exactly one defined click event attached to it.", function(){
                assert(events.click.length === 1);
              });
            });
            describe("'Let\'s paint' action button is being tested.", function(){
              var action = $('#jspaint-action');
              var originalHref = action.attr('href');
              var newHref = './jspaint.html?dimension=600x400';
              it("should have './jspaint.html' as original value for href.", function(){
                assert(originalHref === './jspaint.html');
              });
              it("should generate uri = " + newHref + " by default", function(){
                var uriObtained = newUri(action);
                assert(uriObtained = newHref);
              });
            });
          },
          defaultOptionTests = function(){
            describe("Default options are selected.", function(){
              var defaultDimension = "600x400",
                  defaultOrientation = "landscape";

              it("should check that default dimension is " + defaultDimension, function(){
                assert($('.dimension-options button.btn-success').attr('id') === defaultDimension);
              });
              it("should check that default orientation is " + defaultOrientation, function(){
                assert($('.orientation-options button.btn-success').attr('id') === defaultOrientation);
              });
            });
          };
          describe('Testing.', function(){
            dimensionTests();
            orientationTests();
            actionTests();
            defaultOptionTests();
          });
        }
        if (navigator.userAgent.indexOf('PhantomJS') < 0) {
          mocha.run();
        }
      }