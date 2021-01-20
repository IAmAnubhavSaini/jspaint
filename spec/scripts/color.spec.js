const COLOR = require('../../src/scripts/color')

describe('COLOR', () => {
    describe('has', () => {
        it('rgb2hex as a function', () => {
            expect(typeof COLOR.rgb2hex).toEqual('function')
            expect(COLOR.rgb2hex.length).toEqual(3)
        })
        it('hex2rgb as a function', () => {
            expect(typeof COLOR.hex2rgb).toEqual('function')
            expect(COLOR.hex2rgb.length).toEqual(1)
        })
    })
    describe('.rgb2hex(r, g, b)', () => {
        it('returns hex representation of rgb', () => {
            const rgb = [255, 0, 255]
            const actual = COLOR.rgb2hex.apply(null, rgb)
            const expected = '#FF00FF'
            expect(actual).toEqual(expected)
        })
    })
    describe('hex2rgb', () => {
        it('should return rgb values for a full 6 letter hex value', () => {
            const hex = '#FF00FF'
            const actual = COLOR.hex2rgb(hex)
            const expected = {r: 255, g: 0, b: 255, rgb: `rgb(255, 0, 255)`, rgba: `rgba(255, 0, 255, 1)`}
            expect(actual.rgb).toEqual(expected.rgb)
            expect(actual.rgba).toEqual(expected.rgba)
            expect(Object.keys(actual)).toEqual(Object.keys(expected))
        })
        it('should return black for undefined input', () => {
            const actual = COLOR.hex2rgb()
            const expected = {r: 0, g: 0, b: 0, rgb: `rgb(0, 0, 0)`, rgba: `rgba(0, 0, 0, 1)`}
            expect(actual.rgb).toEqual(expected.rgb)
            expect(actual.rgba).toEqual(expected.rgba)
            expect(Object.keys(actual)).toEqual(Object.keys(expected))
        })
        it('should return black for bad input', () => {
            const actual = COLOR.hex2rgb('#a')
            const expected = {r: 0, g: 0, b: 0, rgb: `rgb(0, 0, 0)`, rgba: `rgba(0, 0, 0, 1)`}
            expect(actual.rgb).toEqual(expected.rgb)
            expect(actual.rgba).toEqual(expected.rgba)
            expect(Object.keys(actual)).toEqual(Object.keys(expected))
        })
        it('should return black for long, bad input', () => {
            const actual = COLOR.hex2rgb('#abcdefghijklmnop')
            const expected = {r: 0, g: 0, b: 0, rgb: `rgb(0, 0, 0)`, rgba: `rgba(0, 0, 0, 1)`}
            expect(actual.rgb).toEqual(expected.rgb)
            expect(actual.rgba).toEqual(expected.rgba)
            expect(Object.keys(actual)).toEqual(Object.keys(expected))
        })
        it('should return black for non-hex, bad input', () => {
            const actual = COLOR.hex2rgb('#zzyyxx')
            const expected = {r: 0, g: 0, b: 0, rgb: `rgb(0, 0, 0)`, rgba: `rgba(0, 0, 0, 1)`}
            expect(actual.rgb).toEqual(expected.rgb)
            expect(actual.rgba).toEqual(expected.rgba)
            expect(Object.keys(actual)).toEqual(Object.keys(expected))
        })
    })
})
