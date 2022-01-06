const {Circle, Point2d, Square, Pencil} = require('canvas-js');

function drawCircle(context) {
    const circle = new Circle(context, 10);
    circle.drawAt(new Point2d(100.5, 100.5));
}

function randomCircle(context, scaleFactor = 500) {
    const radius = Math.floor(Math.random() * scaleFactor * 0.4);
    const circle = new Circle(context, radius);
    circle.drawAt(new Point2d(Math.random() * scaleFactor + 0.5, Math.random() * scaleFactor * 0.5 + 0.5));
}

function randomSquare(context, scaleFactor = 500) {
    const side = Math.floor(Math.random() * scaleFactor * 0.2);
    const circle = new Square(context, side);
    circle.drawAt(new Point2d(Math.random() * scaleFactor + 0.5, Math.random() * scaleFactor * 0.5 + 0.5));
}

function runPencil(context, offset) {
    let last = null;
    let pencil = last ? new Pencil(context, new Point2d(last.x, last.y)) : null;

    function handlePencil(e) {
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        if (!last) {
            last = {x, y};
            return;
        }
        pencil = new Pencil(context, new Point2d(last.x, last.y));
        const pt = new Point2d(x, y);
        pencil.lineTo(pt);
        last = {x, y};
    }

    const f = () => window.jspaint.pencil;
    if (!f()) {
        document.addEventListener('mousemove', handlePencil);
        window.jspaint.pencil = true;
    } else {
        window.jspaint.pencil = false;
        document.removeEventListener('mousemove', handlePencil);
    }
    document.querySelector('#pencil-button').addEventListener('click', () => {
        document.removeEventListener('mousemove', handlePencil);
    });

}

window.jspaint = {drawCircle, randomCircle, randomSquare, runPencil};