const config = require('./services/config');
const GenePool = require('./services/genePool');
const DNA = require('./services/dna');
const fossilFunctions = require('./services/fossilize')
const getPolygonMatches = require('./services/getPolygonMatches');

var numberOfEpochs = config.NUMBER_OF_EPOCHS;
var epochIdx = 0;


//initialize gene pool
var fossil = fossilFunctions.rehydrate(config.PROJECT_NAME);
if (fossil) {
  var genePool = Object.assign(new GenePool(), fossil);
  genePool.dnas = genePool.dnas.map((dna) => Object.assign(new DNA(), dna));
} else {
  var genePool = new GenePool();
}

genePool.renderDnas()
  .then(() => genePool.calculateDiffs())
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
    console.log('matches are', getPolygonMatches(genePool.dnas[0], genePool.dnas[1]))
    fossilFunctions.fossilize(genePool, config.PROJECT_NAME);
  }
  
  genePool.mutateAll();
  genePool.introduceImmigrants();
  genePool.initiateMatingSeason();
  genePool.renderDnas()
    .then(() => genePool.calculateDiffs())
    .then(() => {
      genePool.rankAllByDiff();
      genePool.cullAll();
      return genePool.renderFittest(++epochIdx);
    })
    .then(() => advanceEpoch());
}