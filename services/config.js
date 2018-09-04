module.exports = {
  PROJECT_NAME: 'test',
  NUMBER_OF_EPOCHS: 10000,
  LOG_EVERY_X_EPOCHS: 2,
  FILE_ROTATION_THRESHOLD: 100,
  dna: {
    NUMBER_OF_POLYGONS: 50,
    CANVAS_WIDTH: 383,
    CANVAS_HEIGHT: 500,
    NUMBER_OF_VERTICES: 4,
    POLYGON_ALPHA: 0.5,
    PROBABILITY_OF_MUTATION: 0.35,
    IMMIGRANTS_PER_EPOCH: 0.2,
    MAX_AGE: 6,
  },
  genePool: {
    POPULATION_SIZE: 35,
    MATING_PERCENTAGE: 0.5,
  },
  sourceImage: {
    DIR: './spec/compareImages/raptor.png'
  }

};
