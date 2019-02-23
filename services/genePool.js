const fs = require('fs');
const _ = require('lodash');

const DNA = require('./dna');
const { getSourceImagePixels, pixelDiff } = require('./imageTools')
const config = require('../config');

class GenePool {
  constructor() {
    this.dnas = _.times(config.genePool.populationSize, () => (new DNA()));
  }

  getSourceImagePixels() {
    return getSourceImagePixels().then((pixelArr) => {
      this.sourceImagePixels = pixelArr;
    })
  }

  renderDnas () {
    this.dnas.forEach((dna) => {
      dna.renderToCanvas();
    })
  }

  calculateDiffs () {
    this.dnas.forEach((dna) => {
      dna.diffScore = pixelDiff(dna.getPixelData(), this.sourceImagePixels);
    });
  }

  rankAllByDiff () {
    this.dnas.sort((dna1, dna2) => {
      return dna1.diffScore - dna2.diffScore;
    })
  }

  mate (dna1, dna2) {
    var child = new DNA(false);
    for (var i = 0; i < dna1.polygons.length; i++) {
      var p = Math.random();
      if (p < 0.5) {
        child.polygons.push(_.cloneDeep(dna1.polygons[i]));
      } else {
        child.polygons.push(_.cloneDeep(dna2.polygons[i]));
      }
    }
    return child;
  }

  initiateMatingSeason () {
    const children = [];
    for (var i = 0; i < this.dnas.length; i++) {
      for (var j = 0; j < this.dnas.length; j++) {
        if (Math.random() < config.genePool.matingProbability) {
          children.push(this.mate(this.dnas[i], this.dnas[j]))
        }
      }
    }

  }

  incrementAges () {
    this.dnas.forEach((dna) => {
      dna.age++;
    })
  }

  reapTheElderly() {
    this.dnas = this.dnas.filter((dna) => {
      return dna.age < config.dna.maxAge;
    });
  }

  cullAll () {
    this.dnas = this.dnas.slice(0, config.genePool.populationSize);
  }

  mutateAll () {
    this.dnas.forEach(dna => dna.mutate());
  }

  introduceImmigrants () {
    const numberOfImmigrants = Math.floor(config.genePool.populationSize * config.genePool.immigrantsPerEpoch);
    this.dnas.push(..._.times(numberOfImmigrants, () => new DNA()));
  }

  renderFittest (fileName) {
    return this.dnas[0].writeCanvasToPNG(fileName);
  }

};

module.exports = GenePool;