"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var join = require('path').join;
var red = require('@f0c1s/color-red');
console.log(red(' getting started with server '));
app.get('/', function (_req, res) {
    res.sendFile(join(__dirname, './src/jspaint.html'));
}).listen(9050);
//# sourceMappingURL=server.js.map