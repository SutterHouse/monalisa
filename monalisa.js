const Canvas = require('canvas');
let canvas = new Canvas(800, 500);

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

var fs = require('fs')
  , out = fs.createWriteStream(__dirname + '/text.png')
  , stream = canvas.pngStream();
 
stream.on('data', function(chunk){
  out.write(chunk);
});
 
stream.on('end', function(){
  console.log('saved png');
});