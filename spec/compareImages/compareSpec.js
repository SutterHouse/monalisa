let compare = require(__dirname + '/../../services/imageDiff.js');

compare('napoleon.png', 'raptor.png').then((diff) => {
  console.log(`Napoleon vs Raptor diff: ${diff}`);
});
compare('napoleon.png', 'blank.png').then((diff) => {
  console.log(`Napoleon vs Blank diff: ${diff}`);
});
compare('raptor.png', 'raptor.png').then((diff) => {
  console.log(`Raptor vs Raptor diff: ${diff}`);
});