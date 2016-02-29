describe("Testing Color code:", function(){
  describe("testing rgb to hex:", function(){
    it("rgb(0, 0, 0) is #000000", function(){
      expect(RGBToHex(0, 0, 0)).toBe('#000000');
    });
    it("rgb(255, 0, 0) is #ff0000", function(){
      expect(RGBToHex(255, 0, 0)).toBe('#ff0000');
    });
    it("rgb(255, 255, 0) is #ffff00", function(){
      expect(RGBToHex(255, 255, 0)).toBe('#ffff00');
    });

    it("rgb(255, 255, 255) is #ffffff", function(){
      expect(RGBToHex(255, 255, 255)).toBe('#ffffff');
    });
    describe("Check against #204 in github issues.", function(){
      it("#000000 is rgb(0, 0, 0)", function(){
        expect(HexToRGB('#000000')).toBe('rgb(0, 0, 0)');
      });
    });
    
  });
});