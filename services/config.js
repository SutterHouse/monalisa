module.exports = {
  PROJECT_NAME: 'test',
  NUMBER_OF_EPOCHS: 10000,
  LOG_EVERY_X_EPOCHS: 100,
  dna: {
    NUMBER_OF_POLYGONS: 50,
    CANVAS_WIDTH: 383,
    CANVAS_HEIGHT: 500,
    NUMBER_OF_VERTICES: 4,
    POLYGON_ALPHA: 0.5,
    PROBABILITY_OF_MUTATION: 0.35
  },
  genePool: {
    POPULATION_SIZE: 10,
    MATING_PERCENTAGE: 0.25,
  },
  sourceImage: {
    DIR: './spec/compareImages/raptor.png'
  }

};
