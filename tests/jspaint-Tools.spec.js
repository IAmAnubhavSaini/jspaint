describe("Testing jspaint-tools under GitHub issue #206", function(){
  describe("generateSliderString generates input with type range.", function(){
    it('generateSliderString({min: 0, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="0" max="100" step="1" title="title" />\'', function(){
      expect(generateSliderString({min: 0, max: 100, title: "title", id: "id", step: 1})).toBe('<input id="id" type="range" min="0" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 100, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="100" max="100" step="1" title="title" />\'', function(){
      expect(generateSliderString({min: 100, max: 100, title: "title", id: "id", step: 1})).toBe('<input id="id" type="range" min="100" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 1000, max: 100, title: "title", id: "id", step: 1}) generates \'<input id="id" type="range" min="1000" max="100" step="1" title="title" />\'', function(){
      expect(generateSliderString({min: 1000, max: 100, title: "title", id: "id", step: 1})).toBe('<input id="id" type="range" min="1000" max="100" step="1" title="title" />');
    });
    it('generateSliderString({min: 200, max: 100, title: "title", id: "id", step: -1}) generates \'<input id="id" type="range" min="200" max="100" step="-1" title="title" />\'', function(){
      expect(generateSliderString({min: 200, max: 100, title: "title", id: "id", step: -1})).toBe('<input id="id" type="range" min="200" max="100" step="-1" title="title" />');
    });
    
  });

  describe("generateLableString generates label with given color and font size", function(){
    it('generateLabelString({hexColor: "#000000", fontSize: "10px"}) generates <label style="color: #000000; font-size: 10px;"></label>', function(){
      expect(generateLabelString({hexColor: '000000', fontSize: '10px'})).toBe('<label style="color: #000000; font-size: 10px;"></label>');
    });
    it('generateLabelString({hexColor: "#FFFFFF", fontSize: "15px"}) generates <label style="color: #FFFFFF; font-size: 15px;"></label>', function(){
      expect(generateLabelString({hexColor: 'FFFFFF', fontSize: '15px'})).toBe('<label style="color: #FFFFFF; font-size: 15px;"></label>');
    });
    it('generateLabelString({hexColor: "#000000", fontSize: "20px"}) generates <label style="color: #000000; font-size: 20px;"></label>', function(){
      expect(generateLabelString({hexColor: '000000', fontSize: '20px'})).toBe('<label style="color: #000000; font-size: 20px;"></label>');
    });
  });

  describe("TOOLS", function() {
    it("has CONSTANTS", function() {
      expect(TOOLS.CONSTANTS).toBeDefined();
    });
    it("has VARIABLES", function() {
      expect(TOOLS.VARIABLES).toBeDefined();
    });
    describe("CONSTANTS", function() {
      it("has MandelbrotFractal", function() {
        expect(TOOLS.CONSTANTS.MandelbrotFractal).toBeDefined();
      });
      describe("MandelbrotFractal", function() {
        it("has accurate properties", function() {
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
      it("has Pencil", function() {
        expect(TOOLS.CONSTANTS.Pencil).toBeDefined();
      });
      describe("Pencil", function() {
        it("has accurate properties", function() {
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
      it("has PickColor", function() {
        expect(TOOLS.CONSTANTS.PickColor).toBeDefined();
      });
      describe("PickColor", function() {
        it("has accurate properties", function() {
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
      it("has PivotedLinePattern", function() {
        expect(TOOLS.CONSTANTS.PivotedLinePattern).toBeDefined();
      });
      describe("PivotedLinePattern", function() {
        it("has accurate properties", function() {
          expect(TOOLS.CONSTANTS.PivotedLinePattern.id).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.id).toBe("PivotedLinePatternTool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.selectionId).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.selectionId).toBe("#PivotedLinePatternTool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.class).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.class).toBe("main-tool");
          expect(TOOLS.CONSTANTS.PivotedLinePattern.title).toBeDefined();
          expect(TOOLS.CONSTANTS.PivotedLinePattern.title).toBe("Click to draw amazing pattern. Click again to disable.");
          describe("ACTIONS", function() {
            expect(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS).toBeDefined();
            describe("has accurate properties", function() {
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.godRays).toBeDefined();
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.godRays).toBe("god-rays");
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.pivots).toBeDefined();
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.pivots).toBe("pivots");
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Xextends).toBeDefined();
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Xextends).toBe("extends");
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Ydrops).toBeDefined();
              it(TOOLS.CONSTANTS.PivotedLinePattern.ACTIONS.Ydrops).toBe("drops ");
            });
          });
        });
      });
      it("has Rectangle", function() {
        expect(TOOLS.CONSTANTS.Rectangle).toBeDefined();
      });
      it("has Ring", function() {
        expect(TOOLS.CONSTANTS.Ring).toBeDefined();
      });
      it("has Disc", function() {
        expect(TOOLS.CONSTANTS.Disc).toBeDefined();
      });
      it("has Square", function() {
        expect(TOOLS.CONSTANTS.Square).toBeDefined();
      });
      it("has Circle", function() {
        expect(TOOLS.CONSTANTS.Circle).toBeDefined();
      });
      it("has PointWalker", function() {
        expect(TOOLS.CONSTANTS.PointWalker).toBeDefined();
      });
      it("has FamilyPointWalker", function() {
        expect(TOOLS.CONSTANTS.FamilyPointWalker).toBeDefined();
      });
      it("has OrganismPointWalker", function() {
        expect(TOOLS.CONSTANTS.OrganismPointWalker).toBeDefined();
      });
      it("has UniCellularParasiteTool", function() {
        expect(TOOLS.CONSTANTS.UniCellularParasiteTool).toBeDefined();
      });
    });
  });
});