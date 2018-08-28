const config = require('./services/config');
const GenePool = require('./services/genePool');

var numberOfEpochs = config.NUMBER_OF_EPOCHS;
var epochIdx = 0;


//initialize gene pool
var genePool = new GenePool();
console.log("READY")
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

  var children = genePool.mateAllTopDna();
  genePool.renderDnas(children)
    .then(() => genePool.calculateDiffs(children))
    .then(() => {
      children.forEach(child => genePool.dnas.push(child));
      genePool.rankAllByDiff();
      genePool.cullAll();
      genePool.mutateAll();
      return genePool.renderFittest(++epochIdx);
    })
    .then(() => advanceEpoch());
}