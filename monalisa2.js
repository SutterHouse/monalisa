const config = require('./services/config');
const GenePool = require('./services/genePool');

var numberOfEpochs = config.NUMBER_OF_EPOCHS;
var epochIdx = 0;


//initialize gene pool
var genePool = new GenePool();
genePool.renderDnas(genePool.dnas)
  .then(() => genePool.calculateDiffs(genePool.dnas))
  .then(() => {
    genePool.rankAllByDiff();
    return genePool.renderFittest(epochIdx);
  })
  .then(() => advanceEpoch());

//define advanceEpoch function
var advanceEpoch = () => {
  if (epochIdx === numberOfEpochs) {
    return;
  }
  if (epochIdx % config.LOG_EVERY_X_EPOCHS === 0) {
    console.log(epochIdx, genePool.dnas.map(dna => dna.diffScore));
  }

  var children = genePool.mateAllTopDna();
  genePool.renderDnas(children)
    .then(() => genePool.calculateDiffs(children))
    .then(() => {
      children.forEach(child => genePool.dnas.push(child));
      genePool.rankAllByDiff();
      genePool.cullAll();
      // genePool.mutateAll();
      return genePool.renderFittest(++epochIdx);
    })
    .then(() => advanceEpoch());
}