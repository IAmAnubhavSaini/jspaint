const COLOR = {
    rgb2hex(r, g, b) {
        return [r, g, b]
            .map(c => c.toString(16))
            .map(c => c.toUpperCase())
            .map(c => c.padStart(2, '0'))
            .reduce((a, c) => a + c, '#')
    },
    hex2rgb(hex) {
        return [hex || '#000']
            .map(h => h.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (matches, r, g, b) => '' + r + r + g + g + b + b))
            .map(h => /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h))
            .map(mrgb => (mrgb || [0, 0, 0, 0]).slice(1))
            .map(rgb => rgb.map(c => parseInt(c, 16)))
            .map(rgb => ({
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
                rgb: `rgb(${rgb.join(', ')})`,
                rgba: `rgba(${rgb.join(', ')}, 1)`
            }))
            .pop()
    }
}
