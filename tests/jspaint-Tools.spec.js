describe("Testing jspaint-tools under GitHub issue #206", function () {
  describe("generateSliderString generates input with type range.", function () {
    it('generateSliderString({min: 0, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="0" max="100" step="1" title="title" />\'', function () {
      expect(generateSliderString({ min: 0, max: 100, title: "title", id: "id", step: 1 })).toBe('<input id="id" type="range" min="0" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 100, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="100" max="100" step="1" title="title" />\'', function () {
      expect(generateSliderString({ min: 100, max: 100, title: "title", id: "id", step: 1 })).toBe('<input id="id" type="range" min="100" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 1000, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="1000" max="100" step="1" title="title" />\'', function () {
      expect(generateSliderString({ min: 1000, max: 100, title: "title", id: "id", step: 1 })).toBe('<input id="id" type="range" min="1000" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 200, max: 100, title: "title", id: "id", step: -1}) generates \'<input id="id" type="range" min="200" max="100" step="-1" title="title" />\'', function () {
      expect(generateSliderString({ min: 200, max: 100, title: "title", id: "id", step: -1 })).toBe('<input id="id" type="range" min="200" max="100" step="-1" title="title" />');
    });

  });

  describe("generateLableString generates label with given color and font size", function () {
    it('generateLabelString({hexColor: "#000000", fontSize: "10px"}) generates <label style="color: #000000; font-size: 10px;"></label>', function () {
      expect(generateLabelString({ hexColor: '000000', fontSize: '10px' })).toBe('<label style="color: #000000; font-size: 10px;"></label>');
    });
    it('generateLabelString({hexColor: "#FFFFFF", fontSize: "15px"}) generates <label style="color: #FFFFFF; font-size: 15px;"></label>', function () {
      expect(generateLabelString({ hexColor: 'FFFFFF', fontSize: '15px' })).toBe('<label style="color: #FFFFFF; font-size: 15px;"></label>');
    });
    it('generateLabelString({hexColor: "#000000", fontSize: "20px"}) generates <label style="color: #000000; font-size: 20px;"></label>', function () {
      expect(generateLabelString({ hexColor: '000000', fontSize: '20px' })).toBe('<label style="color: #000000; font-size: 20px;"></label>');
    });
  });

  describe("TOOLS", function () {
    it("has CONSTANTS", function () {
      expect(TOOLS.CONSTANTS).toBeDefined();
    });
    it("has VARIABLES", function () {
      expect(TOOLS.VARIABLES).toBeDefined();
    });
    describe("CONSTANTS", function () {
      it("has MandelbrotFractal", function () {
        expect(TOOLS.CONSTANTS.MandelbrotFractal).toBeDefined();
      });
      it("has Pencil", function () {
        expect(TOOLS.CONSTANTS.Pencil).toBeDefined();
      });
      it("has PickColor", function () {
        expect(TOOLS.CONSTANTS.PickColor).toBeDefined();
      });
      it("has PivotedLinePattern", function () {
        expect(TOOLS.CONSTANTS.PivotedLinePattern).toBeDefined();
      });
      it("has Rectangle", function () {
        expect(TOOLS.CONSTANTS.Rectangle).toBeDefined();
      });
      it("has Ring", function () {
        expect(TOOLS.CONSTANTS.Ring).toBeDefined();
      });
      it("has Disc", function () {
        expect(TOOLS.CONSTANTS.Disc).toBeDefined();
      });
      it("has Square", function () {
        expect(TOOLS.CONSTANTS.Square).toBeDefined();
      });
      it("has Circle", function () {
        expect(TOOLS.CONSTANTS.Circle).toBeDefined();
      });
      it("has PointWalker", function () {
        expect(TOOLS.CONSTANTS.PointWalker).toBeDefined();
      });
      it("has FamilyPointWalker", function () {
        expect(TOOLS.CONSTANTS.FamilyPointWalker).toBeDefined();
      });
      it("has OrganismPointWalker", function () {
        expect(TOOLS.CONSTANTS.OrganismPointWalker).toBeDefined();
      });
      it("has UniCellularParasiteTool", function () {
        expect(TOOLS.CONSTANTS.UniCellularParasiteTool).toBeDefined();
      });
      describe("MandelbrotFractal", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.MandelbrotFractal.id).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.id).toBe("MandelbrotFractalTool");
          expect(TOOLS.CONSTANTS.MandelbrotFractal.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.selectionId).toBe("#MandelbrotFractalTool");
          expect(TOOLS.CONSTANTS.MandelbrotFractal.class).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.MandelbrotFractal.title).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.title).toBe("Click to draw Mandelbrot Fractal. Click again to disable.");
          expect(TOOLS.CONSTANTS.MandelbrotFractal.maxHeight).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.maxHeight).toBe(-1);
          expect(TOOLS.CONSTANTS.MandelbrotFractal.maxWidth).toBeDefined();
          expect(TOOLS.CONSTANTS.MandelbrotFractal.maxWidth).toBe(-1);
        });
      });
      describe("Pencil", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Pencil.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Pencil.id).toBe("PencilTool");
          expect(TOOLS.CONSTANTS.Pencil.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Pencil.selectionId).toBe("#PencilTool");
          expect(TOOLS.CONSTANTS.Pencil.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Pencil.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Pencil.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Pencil.title).toBe("Click to draw free-hand lines. Click again to disable.");
        });
      });
      describe("PickColor", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.PickColor.id).toBeDefined();
          expect(TOOLS.CONSTANTS.PickColor.id).toBe("pick-color");
          expect(TOOLS.CONSTANTS.PickColor.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.PickColor.selectionId).toBe("#pick-color");
          expect(TOOLS.CONSTANTS.PickColor.class).toBeDefined();
          expect(TOOLS.CONSTANTS.PickColor.class).toBe("string-menu-item");
          expect(TOOLS.CONSTANTS.PickColor.containerId).toBeDefined();
          expect(TOOLS.CONSTANTS.PickColor.containerId).toBe("PickColorTool");
          expect(TOOLS.CONSTANTS.PickColor.title).toBeDefined();
          expect(TOOLS.CONSTANTS.PickColor.title).toBe("Click to pick color under mouse pointer tip; picks until some other tool is selected. Click again to disable.");
        });
      });
      describe("PivotedLinePattern", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.PivotedLinePattern.id).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.id).toBe("PivotedLinePatternTool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.selectionId).toBe("#PivotedLinePatternTool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.class).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.title).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.title).toBe("Click to draw amazing pattern. Click again to disable.");
        });
        describe("ACTIONS", function () {
          it("is defined", function () {
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS).toBeDefined();
          });
          it("has accurate properties", function () {
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.godRays).toBeDefined();
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.godRays).toBe("god-rays");
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.pivots).toBeDefined();
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.pivots).toBe("pivots");
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Xextends).toBeDefined();
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Xextends).toBe("extends");
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Ydrops).toBeDefined();
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Ydrops).toBe("drops");
          });
        });
      });
      describe("Rectangle", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Rectangle.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Rectangle.id).toBe("RectangleTool");
          expect(TOOLS.CONSTANTS.Rectangle.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Rectangle.selectionId).toBe("#RectangleTool");
          expect(TOOLS.CONSTANTS.Rectangle.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Rectangle.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Rectangle.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Rectangle.title).toBe("Click to draw rectangles. Click again to disable.");
          expect(TOOLS.CONSTANTS.Rectangle.previewId).toBeDefined();
          expect(TOOLS.CONSTANTS.Rectangle.previewId).toBe("previewRectangle");
        });
      });
      describe("Ring", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Ring.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.id).toBe("RingTool");
          expect(TOOLS.CONSTANTS.Ring.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.selectionId).toBe("#RingTool");
          expect(TOOLS.CONSTANTS.Ring.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Ring.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.title).toBe("Click to draw ring. Click again to disable.");
          expect(TOOLS.CONSTANTS.Ring.previewId).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.previewId).toBe("previewRing");
          expect(TOOLS.CONSTANTS.Ring.previewOuterId).toBeDefined();
          expect(TOOLS.CONSTANTS.Ring.previewOuterId).toBe("previewOuterRing");
        });
      });
      describe("Disc", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Disc.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Disc.id).toBe("DiscTool");
          expect(TOOLS.CONSTANTS.Disc.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Disc.selectionId).toBe("#DiscTool");
          expect(TOOLS.CONSTANTS.Disc.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Disc.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Disc.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Disc.title).toBe("Click to draw disc. Click again to disable.");
          expect(TOOLS.CONSTANTS.Disc.previewId).toBeDefined();
          expect(TOOLS.CONSTANTS.Disc.previewId).toBe("previewDisc");
        });
      });
      describe("Square", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Square.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Square.id).toBe("SquareTool");
          expect(TOOLS.CONSTANTS.Square.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Square.selectionId).toBe("#SquareTool");
          expect(TOOLS.CONSTANTS.Square.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Square.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Square.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Square.title).toBe("Click to draw squares. Click again to disable.");
          expect(TOOLS.CONSTANTS.Square.previewId).toBeDefined();
          expect(TOOLS.CONSTANTS.Square.previewId).toBe("previewSquare");
        });
      });
      describe("Circle", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.Circle.id).toBeDefined();
          expect(TOOLS.CONSTANTS.Circle.id).toBe("CircleTool");
          expect(TOOLS.CONSTANTS.Circle.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.Circle.selectionId).toBe("#CircleTool");
          expect(TOOLS.CONSTANTS.Circle.class).toBeDefined();
          expect(TOOLS.CONSTANTS.Circle.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.Circle.title).toBeDefined();
          expect(TOOLS.CONSTANTS.Circle.title).toBe("Click to draw circle. Click again to disable.");
          expect(TOOLS.CONSTANTS.Circle.previewId).toBeDefined();
          expect(TOOLS.CONSTANTS.Circle.previewId).toBe("previewCircle");
        });
      });
      describe("PointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.PointWalker.id).toBeDefined();
          expect(TOOLS.CONSTANTS.PointWalker.id).toBe("PointWalkerTool");
          expect(TOOLS.CONSTANTS.PointWalker.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.PointWalker.selectionId).toBe("#PointWalkerTool");
          expect(TOOLS.CONSTANTS.PointWalker.class).toBeDefined();
          expect(TOOLS.CONSTANTS.PointWalker.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.PointWalker.title).toBeDefined();
          expect(TOOLS.CONSTANTS.PointWalker.title).toBe("Click to draw random point walker. Click again to disable.");
        });
      });
      describe("FamilyPointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.FamilyPointWalker.id).toBeDefined();
          expect(TOOLS.CONSTANTS.FamilyPointWalker.id).toBe("FamilyPointWalkerTool");
          expect(TOOLS.CONSTANTS.FamilyPointWalker.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.FamilyPointWalker.selectionId).toBe("#FamilyPointWalkerTool");
          expect(TOOLS.CONSTANTS.FamilyPointWalker.class).toBeDefined();
          expect(TOOLS.CONSTANTS.FamilyPointWalker.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.FamilyPointWalker.title).toBeDefined();
          expect(TOOLS.CONSTANTS.FamilyPointWalker.title).toBe("Click to draw family random point walker. Click again to disable.");
        });
      });
      describe("OrganismPointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.OrganismPointWalker.id).toBeDefined();
          expect(TOOLS.CONSTANTS.OrganismPointWalker.id).toBe("OrganismPointWalkerTool");
          expect(TOOLS.CONSTANTS.OrganismPointWalker.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.OrganismPointWalker.selectionId).toBe("#OrganismPointWalkerTool");
          expect(TOOLS.CONSTANTS.OrganismPointWalker.class).toBeDefined();
          expect(TOOLS.CONSTANTS.OrganismPointWalker.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.OrganismPointWalker.title).toBeDefined();
          expect(TOOLS.CONSTANTS.OrganismPointWalker.title).toBe("Click to draw organism random point walker. Click again to disable.");
        });
      });
      describe("UniCellularParasiteTool", function () {
        it("has accurate properties", function () {
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.id).toBeDefined();
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.id).toBe("UniCellularParasiteTool");
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.selectionId).toBe("#UniCellularParasiteTool");
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.class).toBeDefined();
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.title).toBeDefined();
          expect(TOOLS.CONSTANTS.UniCellularParasiteTool.title).toBe("Click to create a parasite. Click again to disable.");
        });
      });
    });
    describe("VARIABLES", function () {
      it("has MandelbrotFractal", function () {
        expect(TOOLS.VARIABLES.MandelbrotFractal).toBeDefined();
      });
      it("has Pencil", function () {
        expect(TOOLS.VARIABLES.Pencil).toBeDefined();
      });
      it("has PivotedLinePattern", function () {
        expect(TOOLS.VARIABLES.PivotedLinePattern).toBeDefined();
      });
      it("has Rectangle", function () {
        expect(TOOLS.VARIABLES.Rectangle).toBeDefined();
      });
      it("has Ring", function () {
        expect(TOOLS.VARIABLES.Ring).toBeDefined();
      });
      it("has Disc", function () {
        expect(TOOLS.VARIABLES.Disc).toBeDefined();
      });
      it("has Square", function () {
        expect(TOOLS.VARIABLES.Square).toBeDefined();
      });
      it("has Circle", function () {
        expect(TOOLS.VARIABLES.Circle).toBeDefined();
      });
      it("has PointWalker", function () {
        expect(TOOLS.VARIABLES.PointWalker).toBeDefined();
      });
      it("has FamilyPointWalker", function () {
        expect(TOOLS.VARIABLES.FamilyPointWalker).toBeDefined();
      });
      it("has OrganismPointWalker", function () {
        expect(TOOLS.VARIABLES.OrganismPointWalker).toBeDefined();
      });
      it("has UniCellularParasiteTool", function () {
        expect(TOOLS.VARIABLES.UniCellularParasiteTool).toBeDefined();
      });

      describe("MandelbrotFractal", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.MandelbrotFractal.iterations).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.xMax).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.yMax).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.xMin).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.yMin).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.height).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.width).toBeDefined();
          expect(TOOLS.VARIABLES.MandelbrotFractal.iterations).toBe(1000);
          expect(TOOLS.VARIABLES.MandelbrotFractal.xMax).toBe(1);
          expect(TOOLS.VARIABLES.MandelbrotFractal.yMax).toBe(1);
          expect(TOOLS.VARIABLES.MandelbrotFractal.xMin).toBe(-2);
          expect(TOOLS.VARIABLES.MandelbrotFractal.yMin).toBe(-1);
          expect(TOOLS.VARIABLES.MandelbrotFractal.height).toBe(-1);
          expect(TOOLS.VARIABLES.MandelbrotFractal.width).toBe(-1);
        });
      }/* MandelbrotFractal describe ends here */);

      describe("Pencil", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.Pencil.width).toBeDefined();
          expect(TOOLS.VARIABLES.Pencil.width).toBe(2);
        });
        describe("LastPoint", function () {
          it("is defined", function () {
            expect(TOOLS.VARIABLES.Pencil.LastPoint).toBeDefined();
          });
          it("has accurate properties", function () {
            expect(TOOLS.VARIABLES.Pencil.LastPoint.X).toBeDefined();
            expect(TOOLS.VARIABLES.Pencil.LastPoint.Y).toBeDefined();
            expect(TOOLS.VARIABLES.Pencil.LastPoint.X).toBe(-1);
            expect(TOOLS.VARIABLES.Pencil.LastPoint.Y).toBe(-1);
          });
        });
      }/* Pencil describe ends here */);

      describe("PivotedLinePattern", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.PivotedLinePattern.width).toBeDefined();
          expect(TOOLS.VARIABLES.PivotedLinePattern.width).toBe(2);
        });
        describe("LastPoint", function () {
          it("is defined", function () {
            expect(TOOLS.VARIABLES.PivotedLinePattern.LastPoint).toBeDefined();
          });
          it("has accurate properties", function () {
            expect(TOOLS.VARIABLES.PivotedLinePattern.LastPoint.X).toBeDefined();
            expect(TOOLS.VARIABLES.PivotedLinePattern.LastPoint.Y).toBeDefined();
            expect(TOOLS.VARIABLES.PivotedLinePattern.LastPoint.X).toBe(-1);
            expect(TOOLS.VARIABLES.PivotedLinePattern.LastPoint.Y).toBe(-1);
          });
        });
      }/* PivotedLinePattern describe ends here */);

      describe("Rectangle", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.Rectangle.length).toBeDefined();
          expect(TOOLS.VARIABLES.Rectangle.length).toBe(20);
          expect(TOOLS.VARIABLES.Rectangle.breadth).toBeDefined();
          expect(TOOLS.VARIABLES.Rectangle.breadth).toBe(10);
          expect(TOOLS.VARIABLES.Rectangle.xyPlaneRotationAngle).toBeDefined();
          expect(TOOLS.VARIABLES.Rectangle.xyPlaneRotationAngle).toBe(360);
        });
      }/* Rectangle describe ends here */);

      describe("Ring", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.Ring.innerRadius).toBeDefined();
          expect(TOOLS.VARIABLES.Ring.innerRadius).toBe(10);
          expect(TOOLS.VARIABLES.Ring.outerRadius).toBeDefined();
          expect(TOOLS.VARIABLES.Ring.outerRadius).toBe(20);
        });
      }/* Ring describe ends here */);

      describe("Disc", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.Disc.radius).toBeDefined();
          expect(TOOLS.VARIABLES.Disc.radius).toBe(10);
        });
      }/* Disc describe ends here */);

      describe("Square", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.Square.side).toBeDefined();
          expect(TOOLS.VARIABLES.Square.side).toBe(10);
          expect(TOOLS.VARIABLES.Square.xyPlaneRotationAngle).toBeDefined();
          expect(TOOLS.VARIABLES.Square.xyPlaneRotationAngle).toBe(360);
        });
      }/* Square describe ends here */);

      describe("PointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.PointWalker.steps).toBeDefined();
          expect(TOOLS.VARIABLES.PointWalker.steps).toBe(100);
        });
      }/* PointWalker describe ends here */);

      describe("FamilyPointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.FamilyPointWalker.steps).toBeDefined();
          expect(TOOLS.VARIABLES.FamilyPointWalker.steps).toBe(100);
          expect(TOOLS.VARIABLES.FamilyPointWalker.durationBetweenDanceStepsInMiliSeconds).toBeDefined();
          expect(TOOLS.VARIABLES.FamilyPointWalker.durationBetweenDanceStepsInMiliSeconds).toBe(100);
        });
      }/* FamilyPointWalker describe ends here */);

      describe("OrganismPointWalker", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.OrganismPointWalker.steps).toBeDefined();
          expect(TOOLS.VARIABLES.OrganismPointWalker.steps).toBe(100);
          expect(TOOLS.VARIABLES.OrganismPointWalker.durationBetweenDanceStepsInMiliSeconds).toBeDefined();
          expect(TOOLS.VARIABLES.OrganismPointWalker.durationBetweenDanceStepsInMiliSeconds).toBe(100);
        });
      }/* OrganismPointWalker describe ends here */);

      describe("UniCellularParasiteTool", function () {
        it("has accurate properties", function () {
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.steps).toBeDefined();
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.steps).toBe(1);
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.durationBetweenParasiticActsInMiliSeconds).toBeDefined();
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.durationBetweenParasiticActsInMiliSeconds).toBe(100);
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.dieOutSteps).toBeDefined();
          expect(TOOLS.VARIABLES.UniCellularParasiteTool.dieOutSteps).toBe(10000);
        });
      }/* UniCellularParasiteTool describe ends here */);
    }/* VARIABLES describe ends here */);
  });
});
