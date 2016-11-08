'use strict';

var canvases = [];

var getBrowserHeight = function () {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

var getBrowserWidth = function () {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

var getCanvasContainer = function () {
    return document.getElementById('paint-area');
}

var setup = function () {
    addNewCanvas();
};

var addNewCanvas = function () {
    var canvas = createCanvas();
    getCanvasContainer().appendChild(canvas);
    canvases.push(canvas);
}

var position = function (el, p, t, r, b, l) {
    el.style.position = p;
    el.style.top = t;
    el.style.left = l;
    el.style.right = r;
    el.style.bottom = b;
    return el;
}

var border = function (el, value) {
    el.style.border = value;
    return el;
}

var verticallyStackCanvas = function (el) {
    el.style.zIndex = canvases.length;
    return el;
}
var createCanvas = function () {
    var nCanvas = document.createElement('canvas');
    nCanvas.class = 'canvas';
    nCanvas.height = getBrowserHeight() - 20;
    nCanvas.width = getBrowserWidth() - 20;
    nCanvas.style.margin = 'auto';
    position(nCanvas, 'relative', '10px', undefined, undefined, '10px');
    border(nCanvas, 'thin solid #ddd');
    verticallyStackCanvas(nCanvas);
    return nCanvas;
};

setup();
