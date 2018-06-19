let compare = require('../../services/compareImages');

compare.imageTest('spec/compareImages/napoleon.png');
compare.imageDiff('spec/compareImages/napoleon.png', 'spec/compareImages/raptor.png').then((diff) => {
  console.log(`Napoleon vs Raptor diff: ${diff}`);
});
compare.imageDiff('spec/compareImages/napoleon.png', 'spec/compareImages/blank.png').then((diff) => {
  console.log(`Napoleon vs Blank diff: ${diff}`);
});