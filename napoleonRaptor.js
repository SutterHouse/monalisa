const config = require('./config');
const GenePool = require('./services/genePool');
const DNA = require('./services/dna');
// const Fossil = require('./services/fossilize');


const simulate = async () => {
  const genePool = new GenePool;
  await genePool.getSourceImagePixels();

  for (let epochIdx = 0; epochIdx < config.epochCount; epochIdx++) {
    console.log(epochIdx)
    advanceEpoch(genePool, epochIdx);
  }
}

const advanceEpoch = (genePool, epochIdx) => {
  // change genetic code
  genePool.mutateAll();
  genePool.incrementAges();
  // genePool.reapTheElderly();
  genePool.initiateMatingSeason();
  
  // post-render methods
  genePool.renderDnas();
  genePool.calculateDiffs();
  genePool.sortDnasByDiff();
  genePool.cullAll();

  if (epochIdx % config.epochLogInterval === 0) {
    genePool.writeFittestToFile(epochIdx);
  }

  // genePool.introduceImmigrants(); // decide if we want to use this
}

simulate();