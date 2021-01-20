describe("Testing Color code:", function () {
    describe("testing rgb to hex:", function () {
        it("rgb(0, 0, 0) is #000000", function () {
            expect(RGBToHex(0, 0, 0)).toBe('#000000');
        });
        it("rgb(255, 0, 0) is #ff0000", function () {
            expect(RGBToHex(255, 0, 0)).toBe('#ff0000');
        });
        it("rgb(255, 255, 0) is #ffff00", function () {
            expect(RGBToHex(255, 255, 0)).toBe('#ffff00');
        });

        it("rgb(255, 255, 255) is #ffffff", function () {
            expect(RGBToHex(255, 255, 255)).toBe('#ffffff');
        });
        // describe("Check against #204 in github issues.", function(){
        //   it("#000000 is rgb(0, 0, 0)", function(){
        //     expect(HexToRGB('#000000')).toBe('rgb(0, 0, 0)');
        //   });
        // });

    });

    describe("Testing constants:", function () {
        it("There are 16 basicColors", function () {
            expect(CONSTANTS.basicColors.length).toBe(16);
        });
        it("First color is Aqua.", function () {
            expect(CONSTANTS.basicColors[0].name).toBe('Aqua');
            expect(CONSTANTS.basicColors[0].hex).toBe('00FFFF');
        });
        it("Second color is Black.", function () {
            expect(CONSTANTS.basicColors[1].name).toBe('Black');
            expect(CONSTANTS.basicColors[1].hex).toBe('000000');
        });
        it("Third color is Blue.", function () {
            expect(CONSTANTS.basicColors[2].name).toBe('Blue');
            expect(CONSTANTS.basicColors[2].hex).toBe('0000FF');
        });
        it("Fourth color is Fuchsia.", function () {
            expect(CONSTANTS.basicColors[3].name).toBe('Fuchsia');
            expect(CONSTANTS.basicColors[3].hex).toBe('FF00FF');
        });
        it("Fifth color is Gray.", function () {
            expect(CONSTANTS.basicColors[4].name).toBe('Gray');
            expect(CONSTANTS.basicColors[4].hex).toBe('808080');
        });
        it("Sixth color is Green.", function () {
            expect(CONSTANTS.basicColors[5].name).toBe('Green');
            expect(CONSTANTS.basicColors[5].hex).toBe('008000');
        });
        it("Seventh color is Lime.", function () {
            expect(CONSTANTS.basicColors[6].name).toBe('Lime');
            expect(CONSTANTS.basicColors[6].hex).toBe('00FF00');
        });
        it("Eigth color is Maroon.", function () {
            expect(CONSTANTS.basicColors[7].name).toBe('Maroon');
            expect(CONSTANTS.basicColors[7].hex).toBe('800000');
        });
        it("Nineth color is Navy.", function () {
            expect(CONSTANTS.basicColors[8].name).toBe('Navy');
            expect(CONSTANTS.basicColors[8].hex).toBe('000080');
        });
        it("Tenth color is Olive.", function () {
            expect(CONSTANTS.basicColors[9].name).toBe('Olive');
            expect(CONSTANTS.basicColors[9].hex).toBe('808000');
        });
        it("Eleventh color is Purple.", function () {
            expect(CONSTANTS.basicColors[10].name).toBe('Purple');
            expect(CONSTANTS.basicColors[10].hex).toBe('800080');
        });
        it("Twelfth color is Red.", function () {
            expect(CONSTANTS.basicColors[11].name).toBe('Red');
            expect(CONSTANTS.basicColors[11].hex).toBe('FF0000');
        });
        it("Thirteenth color is Silver.", function () {
            expect(CONSTANTS.basicColors[12].name).toBe('Silver');
            expect(CONSTANTS.basicColors[12].hex).toBe('C0C0C0');
        });
        it("Fourteenth color is Teal.", function () {
            expect(CONSTANTS.basicColors[13].name).toBe('Teal');
            expect(CONSTANTS.basicColors[13].hex).toBe('008080');
        });
        it("Fifteenth color is White.", function () {
            expect(CONSTANTS.basicColors[14].name).toBe('White');
            expect(CONSTANTS.basicColors[14].hex).toBe('FFFFFF');
        });
        it("Sixteenth color is Yellow.", function () {
            expect(CONSTANTS.basicColors[15].name).toBe('Yellow');
            expect(CONSTANTS.basicColors[15].hex).toBe('FFFF00');
        });
    });
});
