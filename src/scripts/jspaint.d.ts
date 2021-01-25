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
    defaultColor: {
        hex: string;
        name: string;
    };
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
declare var generateSliderString: (options: any) => string;
declare function generateLabelString(options: {
    hexColor: string;
    fontSize: string;
}): string;
declare function randomLoop(width: number, height: number, operation: any): void;
declare var TOOLS: {
    CONSTANTS: {
        MandelbrotFractal: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            maxHeight: number;
            maxWidth: number;
        };
        Pencil: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
        };
        PivotedLinePattern: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            ACTIONS: {
                pivots: string;
                Ydrops: string;
                godRays: string;
                Xextends: string;
            };
        };
        Rectangle: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            previewId: string;
        };
        Ring: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            previewId: string;
            previewOuterId: string;
        };
        Disc: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            previewId: string;
        };
        Square: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            previewId: string;
        };
        Circle: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
            previewId: string;
        };
        PointWalker: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
        };
        FamilyPointWalker: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
        };
        OrganismPointWalker: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
        };
        UniCellularParasiteTool: {
            id: string;
            selectionId: string;
            class: string;
            title: string;
        };
    };
    VARIABLES: {
        MandelbrotFractal: {
            iterations: number;
            xMax: number;
            yMax: number;
            xMin: number;
            yMin: number;
            height: number;
            width: number;
        };
        Pencil: {
            width: number;
            LastPoint: {
                X: number;
                Y: number;
            };
        };
        PivotedLinePattern: {
            width: number;
            LastPoint: {
                X: number;
                Y: number;
            };
        };
        Rectangle: {
            length: number;
            breadth: number;
            xyPlaneRotationAngle: number;
        };
        Ring: {
            innerRadius: number;
            outerRadius: number;
        };
        Disc: {
            radius: number;
        };
        Square: {
            side: number;
            xyPlaneRotationAngle: number;
        };
        Circle: {
            innerRadius: number;
        };
        PointWalker: {
            steps: number;
        };
        FamilyPointWalker: {
            steps: number;
            durationBetweenDanceStepsInMiliSeconds: number;
        };
        OrganismPointWalker: {
            steps: number;
            durationBetweenDanceStepsInMiliSeconds: number;
        };
        UniCellularParasiteTool: {
            steps: number;
            durationBetweenParasiticActsInMiliSeconds: number;
            dieOutSteps: number;
        };
    };
};
declare var MandelbrotFractal: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        maxHeight: number;
        maxWidth: number;
    };
    VARIABLES: {
        iterations: number;
        xMax: number;
        yMax: number;
        xMin: number;
        yMin: number;
        height: number;
        width: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Pencil: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
    };
    VARIABLES: {
        width: number;
        LastPoint: {
            X: number;
            Y: number;
        };
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var PivotedLinePattern: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        ACTIONS: {
            pivots: string;
            Ydrops: string;
            godRays: string;
            Xextends: string;
        };
    };
    VARIABLES: {
        width: number;
        LastPoint: {
            X: number;
            Y: number;
        };
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Rectangle: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
    };
    VARIABLES: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Ring: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
        previewOuterId: string;
    };
    VARIABLES: {
        innerRadius: number;
        outerRadius: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Disc: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
    };
    VARIABLES: {
        radius: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Square: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
    };
    VARIABLES: {
        side: number;
        xyPlaneRotationAngle: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var Circle: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
        previewId: string;
    };
    VARIABLES: {
        innerRadius: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var PointWalker: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
    };
    VARIABLES: {
        steps: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var FamilyPointWalker: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
    };
    VARIABLES: {
        steps: number;
        durationBetweenDanceStepsInMiliSeconds: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var OrganismPointWalker: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
    };
    VARIABLES: {
        steps: number;
        durationBetweenDanceStepsInMiliSeconds: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
declare var UniCellularParasiteTool: {
    CONSTANTS: {
        id: string;
        selectionId: string;
        class: string;
        title: string;
    };
    VARIABLES: {
        steps: number;
        durationBetweenParasiticActsInMiliSeconds: number;
        dieOutSteps: number;
    };
    start: undefined;
    stop: undefined;
    ContextMenu: undefined;
    Events: {};
};
//# sourceMappingURL=jspaint.d.ts.map