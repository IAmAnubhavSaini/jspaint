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
});