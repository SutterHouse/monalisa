const config = require('./services/config');
const GenePool = require('./services/genePool');
const DNA = require('./services/dna');
const fossilFunctions = require('./services/fossilize')

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
    fossilFunctions.fossilize(genePool, config.PROJECT_NAME);
  }
  
  genePool.incrementAges();
  genePool.reapTheElderly();
  genePool.mutateAll();
  genePool.introduceImmigrants();
  genePool.initiateMatingSeason();
  genePool.renderDnas()
    .then(() => genePool.calculateDiffs())
    .then(() => {
      genePool.rankAllByDiff();
      genePool.cullAll();
      return genePool.renderFittest(++epochIdx % config.FILE_ROTATION_THRESHOLD);
    })
    .then(() => advanceEpoch());
}