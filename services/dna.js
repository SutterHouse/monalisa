class DNA {
  constructor(numberOfPolygons, canvasWidth, canvasHeight) {
    this.numberOfPolygons = numberOfPolygons;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.averagePolygonVertices = 5;

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


}

var dna = new DNA(50, 200, 200);
console.log(JSON.stringify(dna));