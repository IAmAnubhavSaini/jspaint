/// <reference types="jquery" />
declare const COLOR: {
    rgb2hex(r: string, g: string, b: string): string;
    hex2rgb(hex: string): {
        r: string | undefined;
        g: string | undefined;
        b: string | undefined;
        rgb: string;
        rgba: string;
    } | undefined;
};
declare var CONSTANTS: {
    canvasId: string;
    canvasContainerId: string;
    basicColors: {
        hex: string;
        name: string;
    }[];
    Events: {
        mousemove: string;
        mouseclick: string;
    };
};
declare let activeTool: any;
declare let LocalStorageAvailable: () => boolean, getSizeFromURL: () => string | undefined, size: () => string, sizeX: string, sizeY: string, selectedAlternativeColor: string, selectedPrimaryColor: string, context: {
    beginPath: () => void;
    arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number, arg5: boolean) => void;
    fill: () => void;
    save: () => void;
    lineWidth: number;
    strokeStyle: any;
    stroke: () => void;
    restore: () => void;
    fillRect: (arg0: any, arg1: any, arg2: any, arg3: any) => void;
    translate: (arg0: number, arg1: number) => void;
    rotate: (arg0: any) => void;
    fillStyle: string;
    getImageData: (arg0: any, arg1: any, arg2: any, arg3: any) => any;
    putImageData: (arg0: any, arg1: number, arg2: number) => void;
} | null, CanvasState: ImageData[], Actions: {
    Mouse: {
        getX: (options: any) => number;
        getY: (options: any) => number;
    };
}, CANVASAPI: {
    fillCirc: (x: number, y: number, radius: number) => void;
    drawCircle: (options: any) => void;
    fillSquare: (x: number, y: number, side: number) => void;
    fillRoatedSquare: (x: number, y: number, side: number, xyPlaneRotationAngle: number) => void;
    fillRotatedRectangle: (x: number, y: number, length: number, breadth: number, xyPlaneRotationAngle: number) => void;
    fillRing: (options: any) => void;
    drawLineSegmentFromLastPoint: (options: any) => void;
}, saveCanvasState: (options: any) => void, Color: {
    generateBasicColorPalette: (options: any) => void;
    hexToRgb: (hex: string) => {
        r: string | undefined;
        g: string | undefined;
        b: string | undefined;
        rgb: string;
        rgba: string;
    } | undefined;
    rgbToHex: (r: string, g: string, b: string) => string;
}, setupToolTips: (tool: JQuery, title: string) => void, activateTool: (options: any) => void, deactivateTool: (options: any) => void;
declare let CanvasApi: {
    fillCirc: (x: number, y: number, radius: number) => void;
    drawCircle: (options: any) => void;
    fillSquare: (x: number, y: number, side: number) => void;
    fillRoatedSquare: (x: number, y: number, side: number, xyPlaneRotationAngle: number) => void;
    fillRotatedRectangle: (x: number, y: number, length: number, breadth: number, xyPlaneRotationAngle: number) => void;
    fillRing: (options: any) => void;
    drawLineSegmentFromLastPoint: (options: any) => void;
};
//# sourceMappingURL=jspaint.d.ts.map