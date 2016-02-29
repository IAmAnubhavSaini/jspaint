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
});