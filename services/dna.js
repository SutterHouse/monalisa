const Canvas = require('canvas');
const fs = require('fs');
const Promise = require('bluebird');
const gaussian = require('gaussian');

var config = require('./config.js');

class DNA {
  constructor() {
    this.NUMBER_OF_POLYGONS = config.dna.NUMBER_OF_POLYGONS;
    this.CANVAS_WIDTH = config.dna.CANVAS_WIDTH;
    this.CANVAS_HEIGHT = config.dna.CANVAS_HEIGHT;

    this.NUMBER_OF_VERTICES = config.dna.NUMBER_OF_VERTICES;
    this.POLYGON_ALPHA = config.dna.POLYGON_ALPHA;
    this.PROBABILITY_OF_MUTATION = config.dna.PROBABILITY_OF_MUTATION;

    this.polygons = [];
    this.diffScore = null;
  }

  populate() {
    for (var i = 0; i < this.NUMBER_OF_POLYGONS; i++) {
      var polygon = {
        coordinates: [],
        color: {}
      };

      //add polygon coordinates
      for (var j = 0; j < this.NUMBER_OF_VERTICES; j++) {
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
    var x = Math.floor(Math.random() * (this.CANVAS_WIDTH + 1));
    var y = Math.floor(Math.random() * (this.CANVAS_HEIGHT + 1));
    return { x, y };
  }

  createColor() {
    var r = Math.floor(Math.random() * (255 + 1));
    var g = Math.floor(Math.random() * (255 + 1));
    var b = Math.floor(Math.random() * (255 + 1));

    return { r, g, b };
  }

  mutateValue (original, min, max, isInteger = false) {
    if (original < min || original > max) {
      return null;
    }
    //should mutation occur?
    var p = Math.random();
    var result = original;
    if (p <= this.PROBABILITY_OF_MUTATION) {
      //choose perturbation from a normal dist and apply to original value
      var dist = gaussian(0, 100);
      var perturbation = dist.ppf(Math.random());
      result += perturbation;
    }

    //check if result is invalid, try again if so
    if (result < min || result > max) {
      return this.mutateValue(original, min, max, isInteger);
    }

    //convert to integer if necessary
    if (isInteger) {
      result = Math.floor(result);
    }

    return result;
  }

  mutateCoordinate(coordinate) {
    coordinate.x = this.mutateValue(coordinate.x, 0, this.CANVAS_WIDTH);
    coordinate.y = this.mutateValue(coordinate.y, 0, this.CANVAS_HEIGHT);
  }

  mutateColor(color) {
    color.r = this.mutateValue(color.r, 0, 255, true);
    color.g = this.mutateValue(color.g, 0, 255, true);
    color.b = this.mutateValue(color.b, 0, 255, true);
  }

  mutateNumberOfVertices (polygon) {
    var pMutate = Math.random();
    if (pMutate < this.PROBABILITY_OF_MUTATION) {
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

  render(fileName, ctx) {
    //create canvas if none exists
    if (ctx === undefined) {
      var canvas = new Canvas(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
      ctx = canvas.getContext('2d');
    }

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    
    //iterate through polygons
    this.polygons.forEach(polygon => {
      //set polygon color
      ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${this.POLYGON_ALPHA})`;

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
      var dir  = __dirname + `/../${config.PROJECT_NAME}`;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      var out = fs.createWriteStream(dir + `/${fileName}.png`);
      var stream = ctx.canvas.pngStream();

      stream.on('data', function(chunk){
        out.write(chunk);
      });
      
      stream.on('end', function(){
        resolve(ctx);
      });
    });
    
  }

  clone() {
    var newDNA = new DNA(this.NUMBER_OF_POLYGONS, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
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