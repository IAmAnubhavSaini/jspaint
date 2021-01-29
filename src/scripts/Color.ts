enum BasicColors {
  Aqua = '#00FFFF',
  Black = '#000000',
  Blue = '#0000FF',
  Fuchsia = '#FF00FF',
  Gray = '#808080',
  Green = '#008000',
  Lime = '#00FF00',
  Maroon = '#800000',
  Navy = '#000080',
  Olive = '#808000',
  Purple = '#800080',
  Red = '#FF0000',
  Silver = '#C0C0C0',
  Teal = '#008080',
  White = '#FFFFFF',
  Yellow = '#FFFF00'
}

class Color {
  static rgb2hex(r: string, g: string, b: string) {
    return [r, g, b]
      .map((c) => parseInt(c).toString(16))
      .map(c => c.toUpperCase())
      .map(c => c.padStart(2, '0'))
      .reduce((a, c) => a + c, '#');
  }

  static hex2rgb(hex: string) {
    return [hex || '#000']
      .map(h => h.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_matches, r, g, b) => '' + r + r + g + g + b + b))
      .map(h => /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h))
      .map(mrgb => (mrgb || [0, 0, 0, 0]).slice(1))
      .map((rgb: (string | number)[]) => rgb.map(c => parseInt(c.toString()).toString(16)))
      .map(rgb => ({
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        rgb: `rgb(${rgb.join(', ')})`,
        rgba: `rgba(${rgb.join(', ')}, 1)`
      }))
      .pop();
  }
}

export {
  Color,
  BasicColors
};
