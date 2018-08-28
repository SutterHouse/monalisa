const DNA = require('./dna');
const imageDiff = require('./imageDiff')
const config = require('./config');
//const Promise = require('bluebird');

module.exports = class GenePool {
  constructor() {
    this.popSize = config.genePool.POPULATION_SIZE;
    this.dnas = [];
    for (var i = 0; i < this.popSize; i++) {
      var dna = new DNA();
      dna.populate();
      this.dnas.push(dna);
    }

  }

  renderDnas (dnas) { // async
    var promiseArray = [];
    dnas.forEach((dna, index) => {
      promiseArray.push(dna.render(`temp_${index}`));
    });
    return Promise.all(promiseArray);
  }

  calculateDiffs (dnas) { // async
    var promiseArray = [];
    dnas.forEach((dna, index) => {
      promiseArray.push(
        imageDiff(config.sourceImage.DIR, `./services/${config.PROJECT_NAME}/temp_${index}.png`)
          .then(score => {
            dna.diffScore = score;
          })
      );
    });
    return Promise.all(promiseArray);
  }

  rankAllByDiff () {
    this.dnas.sort((dna1, dna2) => {
      return dna1.diffScore < dna2.diffScore ? -1 : 1;
    })
  }

  mate (dna1, dna2) {
    var child = new DNA();
    for (var i = 0; i < dna1.polygons.length; i++) {
      var p = Math.random();
      if (p < 0.5) {
        child.polygons[i] = dna1.polygons[i];
      } else {
        child.polygons[i] = dna2.polygons[i];
      }
    }
    return child;
  }

  mateAllTopDna () {
    var topIndex = Math.floor(this.dnas.length * config.genePool.MATING_PERCENTAGE);
    var children = [];
    for (var i = 0; i < topIndex - 1; i++) {
      for (var j = i + 1; j < topIndex; j++) {
        children.push(this.mate(this.dnas[i], this.dnas[j]));
      }
    }
    return children;
  }

  cullAll () {
    while (this.dnas.length > this.popSize) {
      delete this.dnas.pop();
    }
  }

  mutateAll () {
    this.dnas.forEach(dna => {
      var p = Math.random();
      if (p < config.dna.PROBABILITY_OF_MUTATION) {
        dna.mutate();
      }
    })
  }

  renderFittest (fileName) {
    return this.dnas[0].render(fileName);
  }

};