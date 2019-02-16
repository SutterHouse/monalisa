module.exports = {
  projectName: 'genesis',
  epochCount: 10000,
  epochLogInterval: 100,
  dna: {
    polygonCount: 150,
    vertexCount: 3,
    mutationProbability: 0.1,
    immigrantsPerEpoch: 0.2,
    polygonMaxAge: 10,
  },
  genePool: {
    populationSize: 50,
    matingPercentage: 0.2,
  },
  image: {
    dir: './spec/compareImages/monalisa.png',
    height: 350,
    width: 350,
  }

};
