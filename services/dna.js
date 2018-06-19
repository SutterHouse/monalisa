class DNA {
  constructor(numberOfPolygons, canvasWidth, canvasHeight) {
    this.numberOfPolygons = numberOfPolygons;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.averagePolygonVertices = 5;

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
      for (var j = 0; j < this.averagePolygonVertices; j++) {
        var x = Math.floor(Math.random() * (canvasWidth + 1));
        var y = Math.floor(Math.random() * (canvasHeight + 1));
        polygon.coordinates.push({x, y});
      }

      //add polygon color
      polygon.color.r = Math.floor(Math.random() * (255 + 1));
      polygon.color.g = Math.floor(Math.random() * (255 + 1));
      polygon.color.b = Math.floor(Math.random() * (255 + 1));


      this.polygons.push(polygon);
    }
  }
  //Edge cases to address:
  //  x or y mutation can go past image boundary
  //  0 values cannot be mutated
  mutate() {
    this.polygons.forEach((polygon) => {
      polygon.coordinates.forEach((coordinate) => {
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
      });

      let pr = Math.floor(Math.random() * (3 + 1));
      let pg = Math.floor(Math.random() * (3 + 1));
      let pb = Math.floor(Math.random() * (3 + 1));
      
      if (pr === 2) {
        polygon.color.r *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
      } else if (pr === 3) {
        polygon.color.r *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
      }
      if (pg === 2) {
        polygon.color.g *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
      } else if (pg === 3) {
        polygon.color.g *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
      }
      if (pb === 2) {
        polygon.color.b *= Math.random() * (this.LO_COLOR_MUT_UB - this.LO_COLOR_MUT_LB) + this.LO_COLOR_MUT_LB;
      } else if (pb === 3) {
        polygon.color.b *= Math.random() * (this.HI_COLOR_MUT_UB - this.HI_COLOR_MUT_LB) + this.HI_COLOR_MUT_LB;
      }
    });
  }
}

var dna = new DNA(50, 200, 200);
console.log(JSON.stringify(dna));
dna.mutate();
console.log(JSON.stringify(dna));