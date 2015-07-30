var xspacing = 60;
var w;
var theta = 0.0;
var amplitude = 75.0;
var period = 500.0;
var dx;
var yvalues = [];
var canvas;

function setup() {
    canvas = createCanvas(1600, 600);
    canvas.parent('container');
    w = width - 250;
    dx = ((Math.PI * 2) / period) * xspacing;
}

function draw() {
    background(0);
    amplitude = map(mouseX, 0, 1600, 0, 200);
    calcWave();
    for (var i = 0; i < 10; i++) {
        translate(i * 5, i * 5);
        renderWave(map(i, 0, 10, 0, 255));
    }
}

function calcWave() {
    theta += 0.02;
    var x = theta;
    for (var i = 0; i < w / xspacing; i++) {
        yvalues[i] = (Math.sin(x) * amplitude);
        x += dx;
    }
}

function renderWave(c) {
    noStroke();
    fill(c);
    push();
    for (var x = 0; x < w / xspacing; x++) {
        if (x > 0) {
            strokeWeight(0.8);
            stroke(c);
            noFill();
            ellipse(x * xspacing, height / 4 + yvalues[x], 5, 5);
            line(x*xspacing, height/4+yvalues[x], (x-1)*xspacing + 10, height/4+yvalues[x] - 50);
            if (x > 1) {
                strokeWeight(0.5);
                line(x * xspacing, height / 4 + yvalues[x], (x - 1) * xspacing, height / 4 + yvalues[x - 1]);
            }
        }
    }
    pop();
}
