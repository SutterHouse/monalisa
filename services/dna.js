const Canvas = require('canvas');
const fs = require('fs');
const Promise = require('bluebird');

class DNA {
  constructor(numberOfPolygons, canvasWidth, canvasHeight) {
    this.numberOfPolygons = numberOfPolygons;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.DEFAULT_NUMBER_OF_VERTICES = 5;
    this.DEFAULT_POLYGON_ALPHA = 0.5;

    this.LO_COORD_MUT_LB = .95;
    this.LO_COORD_MUT_UB = 1.05;
    this.HI_COORD_MUT_LB = .90;
    this.HI_COORD_MUT_UB = 1.10;
    
    this.LO_COLOR_MUT_LB = .95;
    this.LO_COLOR_MUT_UB = 1.05;
    this.HI_COLOR_MUT_LB = .90;
    this.HI_COLOR_MUT_UB = 1.10;

    this.polygons = [];

  }

  populate() {
    for (var i = 0; i < this.numberOfPolygons; i++) {
      var polygon = {
        coordinates: [],
        color: {}
      };

      //add polygon coordinates
      for (var j = 0; j < this.DEFAULT_NUMBER_OF_VERTICES; j++) {
        polygon.coordinates.push(this.createVertex());
      }

      //add polygon color
      polygon.color = this.createColor();


      this.polygons.push(polygon);
    }
  }
  
  //Edge cases to address:
  //  x or y mutation can go past image boundary
  //  0 values cannot be mutated
  mutate() {
    this.polygons.forEach((polygon) => {
      polygon.coordinates.forEach((coordinate) => {
        this.mutateCoordinate(coordinate);
      });

      this.mutateColor(polygon.color);

      this.mutateNumberOfVertices(polygon);
    });
  }

  createVertex() {
    var x = Math.floor(Math.random() * (this.canvasWidth + 1));
    var y = Math.floor(Math.random() * (this.canvasHeight + 1));
    return { x, y };
  }

  createColor() {
    var r = Math.floor(Math.random() * (255 + 1));
    var g = Math.floor(Math.random() * (255 + 1));
    var b = Math.floor(Math.random() * (255 + 1));

    return { r, g, b };
  }

  mutateCoordinate(coordinate) {
    let px = Math.floor(Math.random() * (3 + 1));
    let py = Math.floor(Math.random() * (3 + 1));

    if (px === 2) {
      if (coordinate.x) {
        coordinate.x = Math.random() * (this.LO_COORD_MUT_UB * coordinate.x - this.LO_COORD_MUT_LB * coordinate.x) + this.LO_COORD_MUT_LB * coordinate.x;
        coordinate.x %= this.canvasWidth;
      } else {
        coordinate.x += Math.random() * (this.LO_COORD_MUT_UB * coordinate.x - this.LO_COORD_MUT_LB * coordinate.x) + this.LO_COORD_MUT_LB * coordinate.x;
      }
    } else if (px === 3) {
      if (coordinate.x) {
        coordinate.x = Math.random() * (this.HI_COORD_MUT_UB * coordinate.x - this.HI_COORD_MUT_LB * coordinate.x) + this.HI_COORD_MUT_LB * coordinate.x;
        coordinate.x %= this.canvasWidth;
      } else {
        coordinate.x += Math.random() * (this.HI_COORD_MUT_UB * coordinate.x - this.HI_COORD_MUT_LB * coordinate.x) + this.HI_COORD_MUT_LB * coordinate.x;
      }
    }
    if (py === 2) {
      if (coordinate.y) {
        coordinate.y = Math.random() * (this.LO_COORD_MUT_UB * coordinate.y - this.LO_COORD_MUT_LB * coordinate.y) + this.LO_COORD_MUT_LB * coordinate.y;
        coordinate.y %= this.canvasWidth;
      } else {
        coordinate.y += Math.random() * (this.LO_COORD_MUT_UB * coordinate.y - this.LO_COORD_MUT_LB * coordinate.y) + this.LO_COORD_MUT_LB * coordinate.y;
      }
    } else if (py === 3) {
      if (coordinate.y) {
        coordinate.y = Math.random() * (this.HI_COORD_MUT_UB * coordinate.y - this.HI_COORD_MUT_LB * coordinate.y) + this.HI_COORD_MUT_LB * coordinate.y;
        coordinate.y %= this.canvasWidth;
      } else {
        coordinate.y += Math.random() * (this.HI_COORD_MUT_UB * coordinate.y - this.HI_COORD_MUT_LB * coordinate.y) + this.HI_COORD_MUT_LB * coordinate.y;
      }
    }
  }

  mutateColor(color) {
    let pr = Math.floor(Math.random() * (3 + 1));
    let pg = Math.floor(Math.random() * (3 + 1));
    let pb = Math.floor(Math.random() * (3 + 1));
    
    if (pr === 2) {
      if (color.r) {
        color.r = Math.random() * (this.LO_COLOR_MUT_UB * color.r - this.LO_COLOR_MUT_LB * color.r) + this.LO_COLOR_MUT_LB * color.r;
        color.r %= 255;
      } else {
        color.r += Math.floor(Math.random() * (12 + 1));
      }
    } else if (pr === 3) {
      if (color.r) {
        color.r = Math.random() * (this.HI_COLOR_MUT_UB * color.r - this.HI_COLOR_MUT_LB * color.r) + this.HI_COLOR_MUT_LB * color.r;
        color.r %= 255;
      } else {
        color.r += Math.floor(Math.random() * (12 + 1));
      }
    }
    if (pg === 2) {
      if (color.g) {
        color.g = Math.random() * (this.LO_COLOR_MUT_UB * color.g - this.LO_COLOR_MUT_LB * color.g) + this.LO_COLOR_MUT_LB * color.g;
        color.g %= 255;
      } else {
        color.g += Math.floor(Math.random() * (12 + 1));
      }
    } else if (pg === 3) {
      if (color.g) {
        color.g = Math.random() * (this.HI_COLOR_MUT_UB * color.g - this.HI_COLOR_MUT_LB * color.g) + this.HI_COLOR_MUT_LB * color.g;
        color.g %= 255;
      } else {
        color.g += Math.floor(Math.random() * (12 + 1));
      }
    }
    if (pb === 2) {
      if (color.b) {
        color.b = Math.random() * (this.LO_COLOR_MUT_UB * color.b - this.LO_COLOR_MUT_LB * color.b) + this.LO_COLOR_MUT_LB * color.b;
        color.b %= 255;
      } else {
        color.b += Math.floor(Math.random() * (12 + 1));
      }
    } else if (pb === 3) {
      if (color.b) {
        color.b = Math.random() * (this.HI_COLOR_MUT_UB * color.b - this.HI_COLOR_MUT_LB * color.b) + this.HI_COLOR_MUT_LB * color.b;
        color.b %= 255;
      } else {
        color.b += Math.floor(Math.random() * (12 + 1));
      }
    }
    color.r = Math.floor(color.r);
    color.b = Math.floor(color.b);
    color.g = Math.floor(color.g);
  }

  mutateNumberOfVertices (polygon) {
    var pMutate = Math.random();
    if (pMutate < 0.05) {
      var pAdd = Math.random();
      if (pAdd >= 0.5) {
        this.addVertex(polygon);
      } else {
        this.removeVertex(polygon);
      }
    }
  }

  addVertex (polygon) {
    var newVertex = this.createVertex();
    polygon.coordinates.push(newVertex);
  }

  removeVertex(polygon) {
    if (polygon.coordinates.length > 3) {
      var removalIndex = Math.floor(Math.random() * polygon.length);
      polygon.coordinates.splice(removalIndex, 1);
    }
    
  }

  render(fileName, projectName, ctx) {
    //create canvas if none exists
    if (ctx === undefined) {
      var canvas = new Canvas(this.canvasWidth, this.canvasHeight);
      ctx = canvas.getContext('2d');
    }

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,this.canvasWidth, this.canvasHeight);
    
    //iterate through polygons
    this.polygons.forEach(polygon => {
      //set polygon color
      ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${this.DEFAULT_POLYGON_ALPHA})`;

      ctx.beginPath();
      ctx.moveTo(polygon.coordinates[0].x, polygon.coordinates[0].y);
      for (var i = 1; i < polygon.coordinates.length; i++) {
        ctx.lineTo(polygon.coordinates[i].x, polygon.coordinates[i].y);
      }
      ctx.closePath();
      ctx.fill();
    });

    return new Promise((resolve) => {
      //output to generated_image.png
      var dir  = __dirname + `/${projectName}`;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      // let imageData = canvas.toDataURL().split(';base64,').pop();

      // fs.writeFileSync(dir + `/${fileName}.png`, imageData, {encoding: 'base64'});


      var out = fs.createWriteStream(dir + `/${fileName}.png`);
      var stream = ctx.canvas.pngStream();

      stream.on('data', function(chunk){
        out.write(chunk);
      });
      
      stream.on('end', function(){
        // ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        resolve(ctx);
      });
    });
    
  }

  clone() {
    var newDNA = new DNA(this.numberOfPolygons, this.canvasWidth, this.canvasHeight);
    for (var i = 0; i < this.polygons.length; i++) {
      var newPolygon = {};
      newPolygon.color = Object.assign({}, this.polygons[i].color);

      newPolygon.coordinates = [];
      for (var j = 0; j < this.polygons[i].coordinates.length; j++) {
        newPolygon.coordinates[j] = Object.assign({}, this.polygons[i].coordinates[j]);
      }
      newDNA.polygons.push(newPolygon);
    }
    return newDNA;
  }

}


module.exports = DNA;


var dna = new DNA(50, 200, 200);
dna.render(1, 'test');