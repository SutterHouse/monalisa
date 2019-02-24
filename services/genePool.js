const fs = require('fs');
const _ = require('lodash');

const DNA = require('./dna');
const { getSourceImagePixels, pixelDiff } = require('./imageTools')
const config = require('../config');

class GenePool {
  constructor() {
    // config vars
    this.genePoolPopulationSize = config.genePool.populationSize;
    this.genePoolMatingProbability = config.genePool.matingProbability;
    this.genePoolMaxAge = config.genePool.maxAge;
    this.genePoolImmigrantsPerEpoch = config.genePool.immigrantsPerEpoch;

    // mutable vars
    this.dnas = _.times(this.genePoolPopulationSize, () => new DNA().populate());
  }

  getSourceImagePixels() {  // async
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

  sortDnasByDiff () {
    this.dnas.sort((dna1, dna2) => {
      return dna1.diffScore - dna2.diffScore;
    })
  }

  mate (dna1, dna2) {
    var child = new DNA();
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
        if (Math.random() < this.genePoolMatingProbability) {
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
      return dna.age <= this.genePoolMaxAge;
    });
  }

  cullAll () {
    this.dnas = this.dnas.slice(0, this.genePoolPopulationSize);
  }

  mutateAll () {
    this.dnas.forEach(dna => dna.mutate());
  }

  introduceImmigrants () {
    const numberOfImmigrants = Math.floor(this.genePoolPopulationSize * this.genePoolImmigrantsPerEpoch);
    this.dnas.push(..._.times(numberOfImmigrants, () => new DNA().populate()));
  }

  writeFittestToFile (fileName) {
    return this.dnas[0].writeCanvasToPNG(fileName);
  }

};

module.exports = GenePool;