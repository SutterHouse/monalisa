const { createCanvas } = require('canvas');
const fs = require('fs');
const gaussian = require('gaussian');
const _ = require('lodash');

var config = require('../config.js');

class DNA {
  constructor(populate = true) {
    if (populate) {
      this.polygons = _.times(config.dna.polygonCount, () => ({
        coordinates: _.times(config.dna.vertexCount, this.createVertex),
        color: this.createColor(),
      }));
    } else {
      this.polygons = [];
    }
    this.canvas = null;
    this.diffScore = null;
    this.age = 0;
  }
  
  mutate() {
    this.polygons.forEach((polygon) => {
      polygon.coordinates.forEach((coordinate) => {
        this.mutateCoordinate(coordinate);
      });

      this.mutateColor(polygon.color);

      // let's leave this out until there's a good reason for it
      // this.mutateNumberOfVertices(polygon);
    });
  }

  createVertex() {
    return { x: _.random(config.image.width), y: _.random(config.image.height) };
  }

  createColor() {
    return {
      r: _.random(255),
      g: _.random(255),
      b: _.random(255),
    };
  }

  mutateValue (original, min, max, isInteger = false) {
    // should mutation occur?
    const p = Math.random();
    let result = original;
    if (p <= config.dna.mutationProbability) {
      // choose perturbation from a normal dist and apply to original value
      
      // we want most mutations to fall between min and max
      // 98% of results are within 2 standard deviations of the mean
      // so max - min represents a distance of 4 SDs
      const variance =  Math.pow((max - min) / 4, 2)
      var perturbation = gaussian(0, variance).ppf(Math.random());
      result += perturbation;
    }

    // check if result is invalid, try again if so
    if (result < min || result > max) {
      return this.mutateValue(original, min, max, isInteger);
    }

    // convert to integer if necessary
    if (isInteger) {
      result = Math.floor(result);
    }

    return result;
  }

  mutateCoordinate(coordinate) {
    coordinate.x = this.mutateValue(coordinate.x, 0, config.image.width);
    coordinate.y = this.mutateValue(coordinate.y, 0, config.image.height);
  }

  mutateColor(color) {
    color.r = this.mutateValue(color.r, 0, 255, true);
    color.g = this.mutateValue(color.g, 0, 255, true);
    color.b = this.mutateValue(color.b, 0, 255, true);
  }

  mutateNumberOfVertices (polygon) {
    var pMutate = Math.random();
    if (pMutate < config.dna.mutationProbability) {
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

  clearCanvas() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, config.image.width, config.image.height);
    }
  }

  renderToCanvas() {
    // create canvas if none exists
    if (!this.canvas) {
      this.canvas = createCanvas(config.image.width, config.image.height);
    }

    const ctx = this.canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, config.image.width, config.image.height);
    
    this.polygons.forEach((polygon, idx) => {
      ctx.fillStyle = `rgba(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b}, ${config.dna.polygonAlpha})`;
      ctx.beginPath();
      ctx.moveTo(polygon.coordinates[0].x, polygon.coordinates[0].y);
      for (var i = 1; i < polygon.coordinates.length; i++) {
        ctx.lineTo(polygon.coordinates[i].x, polygon.coordinates[i].y);
      }
      ctx.closePath();
      ctx.fill();
    });
  }

  getPixelData() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      return ctx.getImageData(0, 0, config.image.width, config.image.height).data;
    }
  }

  writeCanvastoPNG(fileName) {
    if (!this.canvas) {
      return undefined;
    }

    return new Promise((resolve) => {
      var dir = `./projects/${config.projectName}`;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      var out = fs.createWriteStream(dir + `/${fileName}.png`);
      var stream = this.canvas.pngStream();

      stream.on('data', function(chunk){
        out.write(chunk);
      });
      
      stream.on('end', function(){
        resolve();
      });
    });
  }

}

module.exports = DNA;
