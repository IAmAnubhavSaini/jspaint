(function($){
  "use strict";

  $(function(){
    var dimensionEvents = function(){
        $('.dimension-options button').on('click', function(){
          $('.dimension-options button').removeClass('btn-success');
          $(this).addClass('btn-success');
        });
      },
      orientationEvents = function(){
        $('.orientation-options button').on('click', function(){
          $('.orientation-options button').removeClass('btn-success');
          $(this).addClass('btn-success');
        });
      },
      setupEvents = function(){
        dimensionEvents();
        orientationEvents();
      },
      getWidth = function(selected){
        return selected.localeCompare('Max') === 0 ?
                document.documentElement.clientWidth - 21 :
                $('.dimension-options button.btn-success').attr('id').split('x')[0];
      },
      getHeight = function(selected){
        return selected.localeCompare('Max') === 0 ?
                document.documentElement.clientHeight :
                $('.dimension-options button.btn-success').attr('id').split('x')[1];
      },
      getQueryValue = function(orientation, width, height){
        return orientation.localeCompare('landscape') === 0 ?
                     width + 'x' + height :
                     height + 'x' + width ;
      },
      newUri = function(receiver){
        var originalUri = receiver.attr('href'),
         queryPrfix = '?dimension=',
         selected = $('.dimension-options button.btn-success').attr('id'),
         width = getWidth(selected),
         height = getHeight(selected),
         orientation = $('.orientation-options button.btn-success').attr('id'),
         queryValue = getQueryValue(orientation, width, height);

        return originalUri + queryPrfix + queryValue;
      },
      takeMeToPaint = function(uri){
        window.location = uri;
      },
      deferLinkAction = function(e){
        e.preventDefault();
      },
      setup = function(){
        setupEvents();
        $('#jspaint-action').on('click', function(e){
          deferLinkAction(e);
          takeMeToPaint(newUri($(this)));
        });
      },
      init = function(){
        $('#600x400, #landscape').trigger('click');
        $('.top-taker').TopTaker({'theme': 'dark'});
      },
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
      },
      mustRunInSequence = function(){
        setup();
        init();
        tests();
      };
      mustRunInSequence();
  });
})(jQuery);
