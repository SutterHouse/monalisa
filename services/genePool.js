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

  renderDnas () { // async
    var promiseArray = [];
    this.dnas.forEach((dna, index) => {
      promiseArray.push(dna.render(`temp_${index}`));
    });
    return Promise.all(promiseArray);
  }

  calculateDiffs () { // async
    var promiseArray = [];
    this.dnas.forEach((dna, index) => {
      promiseArray.push(
        imageDiff(config.sourceImage.DIR, `./${config.PROJECT_NAME}/temp_${index}.png`)
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
        child.polygons[i] = {};
        child.polygons[i].color = Object.assign({}, dna1.polygons[i].color);
        child.polygons[i].coordinates = dna1.polygons[i].coordinates.map((coordinate) => {
          return Object.assign({}, coordinate);
        });
      } else {
        child.polygons[i] = {};
        child.polygons[i].color = Object.assign({}, dna2.polygons[i].color);
        child.polygons[i].coordinates = dna2.polygons[i].coordinates.map((coordinate) => {
          return Object.assign({}, coordinate);
        });
      }
    }
    return child;
  }

  initiateMatingSeason () {
    var topIndex = Math.floor(this.dnas.length * config.genePool.MATING_PERCENTAGE);
    for (var i = 0; i < topIndex - 1; i++) {
      let j = i;
      while(j === i) {
        j = Math.floor(Math.random() * this.popSize);
      }
      this.dnas.push(this.mate(this.dnas[i], this.dnas[j]));
    }
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

  introduceImmigrants () {
    const numberOfImmigrants = Math.floor(this.popSize * config.dna.IMMIGRANTS_PER_EPOCH);

    for (let i = 0; i < numberOfImmigrants; i++) {
      const dna = new DNA();
      dna.populate();
      this.dnas.push(dna);
    }
  }

  renderFittest (fileName) {
    return this.dnas[0].render(fileName);
  }

};