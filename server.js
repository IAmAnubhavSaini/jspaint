const express = require('express')
const app = express()
const {join} = require('path')

const blue = require('@f0c1s/color-blue')
const red = require('@f0c1s/color-red')
const yellow = require('@f0c1s/color-yellow')

console.log(red(' getting started with server '))

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './src/index.html'))
}).listen(9050)
