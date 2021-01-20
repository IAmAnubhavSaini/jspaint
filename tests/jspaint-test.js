tests = function () {
    if (window.location.href.startsWith("file://")) {
        mocha.setup('bdd');
        mocha.reporter('html');
        var assert = chai.assert;

        var runEventTest = function (options) {
                describe("Events are installed properly for " + options.name, function () {
                    var tool = $(options.selectionCriterion);
                    var events = $._data(tool[0], "events");
                    it("There is exactly one event.", function () {
                        assert(1, events.length);
                    });
                    it("There is exactly one click event.", function () {
                        assert(events.click !== "undefined");
                    });
                });
            },

            checkingForInstalledEvents = function () {
                runEventTest({name: Tools.Pencil.CONSTANTS.id, selectionCriterion: Tools.Pencil.CONSTANTS.selectionId});
                runEventTest({
                    name: Tools.SpeedDot.CONSTANTS.id,
                    selectionCriterion: Tools.SpeedDot.CONSTANTS.selectionId
                });
                runEventTest({name: Tools.Square.CONSTANTS.id, selectionCriterion: Tools.Square.CONSTANTS.selectionId});
                runEventTest({name: Tools.Square.CONSTANTS.id, selectionCriterion: Tools.Square.CONSTANTS.selectionId});
                runEventTest({
                    name: Tools.Disc.CONSTANTS.id, selectionCriterion: Tools.Disc.CONSTANTS.selectionId
                });
                runEventTest({name: "Reset Canvas", selectionCriterion: '#reset-canvas'});
                runEventTest({name: "Save Image", selectionCriterion: '#save-as-image'});
                runEventTest({name: "Color Picker", selectionCriterion: '#allColorsPicker'});

                runEventTest({name: "Basic colors", selectionCriterion: '.color'});
            };
        describe('Testing.', function () {
            checkingForInstalledEvents();
        });
    }
    if (navigator.userAgent.indexOf('PhantomJS') < 0) {
        mocha.run();
    }
},
