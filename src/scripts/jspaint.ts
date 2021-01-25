const COLOR = {
  rgb2hex(r: string, g: string, b: string) {
    return [r, g, b]
      .map((c) => parseInt(c).toString(16))
      .map(c => c.toUpperCase())
      .map(c => c.padStart(2, '0'))
      .reduce((a, c) => a + c, '#')
  },
  hex2rgb(hex: string) {
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
      .pop()
  }
}


var CONSTANTS = {
  canvasId: "jspaint-canvas",
  canvasContainerId: "jspaint-paint-area",
  basicColors: [{
    hex: '00FFFF',
    name: "Aqua"
  }, {
    hex: '000000',
    name: "Black"
  }, {
    hex: '0000FF',
    name: "Blue"
  }, {
    hex: 'FF00FF',
    name: "Fuchsia"
  }, {
    hex: '808080',
    name: "Gray"
  }, {
    hex: '008000',
    name: "Green"
  }, {
    hex: '00FF00',
    name: "Lime"
  }, {
    hex: '800000',
    name: "Maroon"
  }, {
    hex: '000080',
    name: "Navy"
  }, {
    hex: '808000',
    name: "Olive"
  }, {
    hex: '800080',
    name: "Purple"
  }, {
    hex: 'FF0000',
    name: "Red"
  }, {
    hex: 'C0C0C0',
    name: "Silver"
  }, {
    hex: '008080',
    name: "Teal"
  }, {
    hex: 'FFFFFF',
    name: "White"
  }, {
    hex: 'FFFF00',
    name: "Yellow"
  },],
  Events: {
    mousemove: 'mousemove',
    mouseclick: 'click'
  }
};

let activeTool: any;
let LocalStorageAvailable = function () {
    return localStorage !== undefined && localStorage !== null;
  },
  getSizeFromURL = function () {
    return (window.location.toString().split('?')[1] || '=').split('=')[1];
  },

  size = function (): string {
    return (LocalStorageAvailable() ? localStorage.getItem('dimensionsWxH') : getSizeFromURL()) || 'x';
  },

  sizeX = size().split('x')[0] || '',
  sizeY = size().split('x')[1] || '',

  selectedAlternativeColor = '#FF0000',
  selectedPrimaryColor = '#000000',
  context: { beginPath: () => void; arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number, arg5: boolean) => void; fill: () => void; save: () => void; lineWidth: number; strokeStyle: any; stroke: () => void; restore: () => void; fillRect: (arg0: any, arg1: any, arg2: any, arg3: any) => void; translate: (arg0: number, arg1: number) => void; rotate: (arg0: any) => void; fillStyle: string; getImageData: (arg0: any, arg1: any, arg2: any, arg3: any) => any; putImageData: (arg0: any, arg1: number, arg2: number) => void; } | null = null,
  CanvasState: ImageData[] = [],

  Actions = {
    Mouse: {
      getX: function (options: any) {
        var
          event = options.event,
          relativeTo = options.relativeTo,
          X = event.pageX - relativeTo.offset().left;

        return X;
      },
      getY: function (options: any) {
        var
          event = options.event,
          relativeTo = options.relativeTo,
          Y = event.pageY - relativeTo.offset().top;

        return Y;
      }
    }
  },

  CANVASAPI = {
    fillCirc: function (x: number, y: number, radius: number) {
      (<CanvasRenderingContext2D>context).beginPath();
      (<CanvasRenderingContext2D>context).arc(x, y, radius, 0, 2 * Math.PI, false);
      (<CanvasRenderingContext2D>context).fill();
    },
    drawCircle: function (options: any) {
      (<CanvasRenderingContext2D>context).save();
      (<CanvasRenderingContext2D>context).beginPath();
      (<CanvasRenderingContext2D>context).arc(options.X, options.Y, options.innerRadius, 0, 2 * Math.PI, false);
      (<CanvasRenderingContext2D>context).lineWidth = options.outerRadius - options.innerRadius;
      (<CanvasRenderingContext2D>context).strokeStyle = options.strokeColor;
      (<CanvasRenderingContext2D>context).stroke();
      (<CanvasRenderingContext2D>context).restore();
    },
    fillSquare: function (x: number, y: number, side: number) {
      (<CanvasRenderingContext2D>context).fillRect(x, y, side, side);
    },
    fillRoatedSquare: function (x: number, y: number, side: number, xyPlaneRotationAngle: number) {
      (<CanvasRenderingContext2D>context).save();
      (<CanvasRenderingContext2D>context).translate(x + side / 2, y + side / 2);
      (<CanvasRenderingContext2D>context).rotate(xyPlaneRotationAngle);
      (<CanvasRenderingContext2D>context).translate(-1 * (x + side / 2), -1 * (y + side / 2));
      CANVASAPI.fillSquare(x, y, side);
      (<CanvasRenderingContext2D>context).restore();
    },
    fillRotatedRectangle: function (x: number, y: number, length: number, breadth: number, xyPlaneRotationAngle: number) {
      (<CanvasRenderingContext2D>context).save();
      (<CanvasRenderingContext2D>context).translate(x + length / 2, y + breadth / 2);
      (<CanvasRenderingContext2D>context).rotate(xyPlaneRotationAngle);
      (<CanvasRenderingContext2D>context).translate(-1 * (x + length / 2), -1 * (y + breadth / 2));
      (<CanvasRenderingContext2D>context).fillRect(x, y, length, breadth);
      (<CanvasRenderingContext2D>context).restore();
    },
    fillRing: function (options: any) {
      CANVASAPI.fillCirc(options.X, options.Y, options.outerRadius);
      (<CanvasRenderingContext2D>context).save();
      (<CanvasRenderingContext2D>context).fillStyle = options.fillColor;
      CANVASAPI.fillCirc(options.X, options.Y, options.innerRadius);
      (<CanvasRenderingContext2D>context).restore();
    },
    drawLineSegmentFromLastPoint: function (options: any) {
      var
        context = options.context,
        last = options.last,
        current = options.current,
        width = options.width;

      context.beginPath();
      context.moveTo(last.X, last.Y);
      context.lineTo(current.X, current.Y);
      context.lineWidth = width;
      context.strokeStyle = selectedPrimaryColor;
      context.stroke();

      CANVASAPI.fillCirc(current.X, current.Y, width / 2);
    }
  },

  saveCanvasState = function (options: any) {
    CanvasState.push((<CanvasRenderingContext2D>context).getImageData(options.startX, options.startY, options.width, options.height));
    // #TODO: Figure out a way to persist image data. #210
  },

  Color = {
    generateBasicColorPalette: function (options: any) {
      let IContainBasicColors = options.appendHere || '.BasicColorPalette',
        div1 = $('<div></div>'),
        div2 = $('<div></div>'),
        row = div1,
        hex = null,
        colors = options.basicColors || CONSTANTS.basicColors,
        len = colors.length,
        i = 0;

      for (i = 0; i < len; i++) {
        row = i < len / 2 ? div1 : div2;
        hex = '#' + colors[i].hex;
        $('<div></div>')
          .addClass('color')
          .attr('id', 'Color-Hex-' + hex)
          .css('background-color', hex)
          .appendTo(row);
      }
      div1.appendTo(IContainBasicColors);
      div2.appendTo(IContainBasicColors);
    },
    hexToRgb: COLOR.hex2rgb,
    rgbToHex: COLOR.rgb2hex
  },

  setupToolTips = function (tool: JQuery, title: string) {
    tool.attr('title', title)
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom');
  },

  activateTool = function (options: any) {
    if (activeTool !== null) {
      activeTool.trigger('click');
    }
    activeTool = options.tool;
    $('label#activated-tool-name').html(options.toolName);
    options.start(options);
  },

  deactivateTool = function (options: any) {
    activeTool = null;
    $('label#activated-tool-name').html('no active tool');
    options.stop(options);
  };
activeTool = null;

let CanvasApi = CANVASAPI;





;(function ($) {
  "use strict";
  $(function () {
    interface ICanvasContextOptions {
      sizeX: string;
      sizeY: string;
      canvasId: string;
      canvasContainerId: string;
      width?: string;
      height?: string
    }

    function initializeCanvas(options: ICanvasContextOptions): HTMLCanvasElement {
      const canvas = $('<canvas/>', {
        id: options.canvasId
      })
        .prop({
          'width': options.width,
          'height': options.height
        })
        .appendTo('#' + options.canvasContainerId);

      return <HTMLCanvasElement>canvas[0];
    }

    function initializeContext(options: ICanvasContextOptions): CanvasRenderingContext2D {
      const sizeX = options.sizeX || '600';
      const sizeY = options.sizeY || '400';

      options.width = (parseInt(sizeX) - 2).toString();
      options.height = (parseInt(sizeY) - 2).toString();

      return <CanvasRenderingContext2D>initializeCanvas(options).getContext('2d');
    }

    function generateHexColorStringFromThisElementsId(element: JQuery): string {
      const attr = (element.attr('id') || '#').split('#')[1]
      return '#' + attr;
    }

    let
      registerColorEvents = function () {
        function updatePrimaryColor(selectedPrimaryColor: string): void {
          const label = <HTMLElement>document.querySelector('label#primary-color-name');
          label.style.color = selectedPrimaryColor;
          label.innerHTML = selectedPrimaryColor;
        }

        function updataAlternativeColorLabel(selectedAlternativeColor: string): void {
          const label = <HTMLElement>document.querySelector('label#alternative-color-name');
          label.style.color = selectedAlternativeColor;
          label.innerHTML = selectedAlternativeColor;
        }

        $('.color')
          .attr('title', 'Left click for primary color, Right click for alternative color.')
          .attr('data-toggle', 'tooltip')
          .attr('data-placement', 'bottom')
          .on('click', function () {
            selectedPrimaryColor = (<CanvasRenderingContext2D>context).fillStyle = generateHexColorStringFromThisElementsId($(this));
            (<HTMLElement>document.querySelector('#SelectedPrimaryColor')).style.backgroundColor = <string>selectedPrimaryColor;
            updatePrimaryColor(<string>selectedPrimaryColor);
          })
          .on('contextmenu', function (e) {
            e.preventDefault();
            selectedAlternativeColor = generateHexColorStringFromThisElementsId($(this));
            $('#SelectedAlternativeColor').css('background-color', selectedAlternativeColor);
            updataAlternativeColorLabel(selectedAlternativeColor);
          });
        updatePrimaryColor(selectedPrimaryColor);
        updataAlternativeColorLabel(selectedAlternativeColor);
      },

      registerAllColorsPickerEvents = function (options: any) {
        $('#' + options.toolId)
          .on('input', function () {
            selectedPrimaryColor = (<CanvasRenderingContext2D>context).fillStyle = <string>($(this).val() || '');
          });
      },

      registerSaveImageEvents = function (options: any) {
        $('#' + options.toolId)
          .on('click', function () {
            window.open((<HTMLCanvasElement>$('#' + CONSTANTS.canvasId)[0]).toDataURL("image/png"), "_blank");
          });
      },

      registerResetCanvasEvents = function (options: any) {
        $('#' + options.toolId)
          .on('click', function () {
            var
              canvasId = '#' + (options.canvasId || CONSTANTS.canvasId),
              canvas = <HTMLCanvasElement>$(canvasId)[0],
              canvasHeight = canvas.height,
              canvasWidth = canvas.width,
              context = <CanvasRenderingContext2D>canvas.getContext('2d');

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            CanvasState = [];
          });
      },

      registerUndoEvents = function (options: any) {
        $(options.toolSelection)
          .on('click', function () {
            const state: ImageData | undefined = CanvasState.pop();
            if (state !== undefined) {
              (<CanvasRenderingContext2D>context).putImageData(state, 0, 0);
            }
          });
        $(options.canvasId)
          .on('mousedown', function () {
            saveCanvasState({
              startX: 0,
              startY: 0,
              width: $(this).width(),
              height: $(this).height()
            });
          });
      },

      registerEvents = function () {
        registerColorEvents();
        registerAllColorsPickerEvents({
          toolId: 'allColorsPicker',
          containerId: 'HTML5ColorPicker'
        });
        registerSaveImageEvents({
          toolId: 'save-as-image',
          containerId: 'SaveImageButton'
        });
        registerResetCanvasEvents({
          toolId: 'reset-canvas',
          containerId: 'ResetCanvas'
        });
        registerUndoEvents({
          toolSelection: '#undo-button',
          canvasId: '#' + CONSTANTS.canvasId
        });
      },

      mustAssignDimensionsToCanvasContainer = function () {
        let _sizex = parseInt(sizeX || '')
        if (_sizex > 2500) {
          _sizex = 2500;
        } else if (_sizex < 320) {
          _sizex = 320;
        }
        let _sizey = parseInt(sizeY || '')
        if (_sizey > 2500) {
          _sizey = 2500;
        } else if (_sizey < 320) {
          _sizey = 320;
        }
        sizeX = _sizex.toString()
        sizeY = _sizex.toString()
        $('#jspaint-paint-area').css({
          width: sizeX,
          height: sizeY
        });
      },

      init = function () {
        mustAssignDimensionsToCanvasContainer();
        const canvasContextOptions: ICanvasContextOptions = {
          sizeX: sizeX || '',
          sizeY: sizeY || '',
          canvasId: CONSTANTS.canvasId,
          canvasContainerId: CONSTANTS.canvasContainerId
        };
        initializeContext(canvasContextOptions);
        Color.generateBasicColorPalette({
          appendHere: '.BasicColorPalette',
          basicColors: CONSTANTS.basicColors
        });
        registerEvents();
        $('#PencilTool').trigger('click');
        $('#SelectedPrimaryColor').css('background-color', selectedPrimaryColor);
        $('#SelectedAlternativeColor').css('background-color', selectedAlternativeColor);
      };
    init();
  });
})(jQuery);
