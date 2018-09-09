module.exports = {
  PROJECT_NAME: 'test3',
  NUMBER_OF_EPOCHS: 10000,
  LOG_EVERY_X_EPOCHS: 2,
  FILE_ROTATION_THRESHOLD: 50,
  dna: {
    NUMBER_OF_POLYGONS: 150,
    CANVAS_WIDTH: 350,
    CANVAS_HEIGHT: 350,
    NUMBER_OF_VERTICES: 3,
    POLYGON_ALPHA: 0.3,
    PROBABILITY_OF_MUTATION: 0.1,
    IMMIGRANTS_PER_EPOCH: 0.2,
    MAX_AGE: 10,
  },
  genePool: {
    POPULATION_SIZE: 50,
    MATING_PERCENTAGE: 0.2,
  },
  sourceImage: {
    DIR: './spec/compareImages/monalisa.png'
  }

};
