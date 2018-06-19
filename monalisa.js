const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
  <head>
  </head>
  <body>
  <canvas id="canvas"></canvas>
  </body>
  </html>
`);

var canvas = dom.window.document.getElementById('canvas');
console.log(canvas);
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgba(20, 24, 159, 0.59)';
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(200,50);
ctx.lineTo(50, 100);
ctx.lineTo(0, 90);
ctx.closePath();
ctx.fill();

ctx.fillStyle = 'rgba(20, 244, 15, 0.59)';
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(150, 300);
ctx.lineTo(100, 300);
ctx.closePath();
ctx.fill();
