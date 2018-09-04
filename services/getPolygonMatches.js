module.exports = (dna1, dna2) => {
  let count = 0;
  dna1.polygons.forEach((polygon1) => {
    dna2.polygons.forEach((polygon2) => {
      if (JSON.stringify(polygon1.coordinates) === JSON.stringify(polygon2.coordinates)) {
        count++;
      }
    })
  })
  return count;
}