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

      this.mutateColor(color);

      this.mutateNumberOfVertices;
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
      coordinate.x *= Math.random() * (this.LO_COORD_MUT_UB - this.LO_COORD_MUT_LB) + this.LO_COORD_MUT_LB;
    } else if (px === 3) {
      coordinate.x *= Math.random() * (this.HI_COORD_MUT_UB - this.HI_COORD_MUT_LB) + this.HI_COORD_MUT_LB;
    }
    if (py === 2) {
      coordinate.y *= Math.random() * (this.LO_COORD_MUT_UB - this.LO_COORD_MUT_LB) + this.LO_COORD_MUT_LB;
    } else if (py === 3) {
      coordinate.y *= Math.random() * (this.HI_COORD_MUT_UB - this.HI_COORD_MUT_LB) + this.HI_COORD_MUT_LB;
    }
  }

  mutateColor(color) {
    let pr = Math.floor(Math.random() * (3 + 1));
    let pg = Math.floor(Math.random() * (3 + 1));
    let pb = Math.floor(Math.random() * (3 + 1));
    
    if (pr === 2) {
      color.r *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
    } else if (pr === 3) {
      polygon.color.r *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
    }
    if (pg === 2) {
      color.g *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
    } else if (pg === 3) {
      color.g *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
    }
    if (pb === 2) {
      color.b *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
    } else if (pb === 3) {
      color.b *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
    }
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

  render(index, projectName) {
    //create canvas
    const Canvas = require('canvas');
    let canvas = new Canvas(this.canvasWidth, this.canvasHeight);
    var ctx = canvas.getContext('2d');

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

    //output to generated_image.png
    var dir  = __dirname + `/${projectName}`;
    var fs = require('fs');

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    
    var out = fs.createWriteStream(dir + `/${index}.png`);
    var stream = canvas.pngStream();

    stream.on('data', function(chunk){
      out.write(chunk);
    });
    
    stream.on('end', function(){

    });
  }

}


module.exports = DNA;


var dna = new DNA(50, 200, 200);
dna.render(1, 'test');