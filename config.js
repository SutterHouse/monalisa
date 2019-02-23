module.exports = {
  projectName: 'genesis',
  epochCount: 10000,
  epochLogInterval: 100,
  dna: {
    polygonCount: 150,
    vertexCount: 3,
    mutationProbability: 0.1,
    maxAge: 10,
    polygonAlpha: 0.3
  },
  genePool: {
    populationSize: 50,
    matingProbability: 0.3,
    immigrantsPerEpoch: 0.2,
  },
  image: {
    dir: './spec/compareImages/monalisa.png',
    height: 350,
    width: 350,
  }
};
