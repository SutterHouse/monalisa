var DNA = require('./services/dna.js');
var imageDiff = require('./services/imageDiff.js');
var fs = require('fs');

var NUMBER_OF_EPOCHS = 1000;
var projectName = 'test';
var sourceImageDir = __dirname + '/spec/compareImages/raptor.png';
var changeCounter = 1;

var dna1 = new DNA(10, 383, 500);
dna1.populate();
dna1.render('0', projectName);
var i = 0;

var nextCanvas = (dna1Score) => {
  if (i === 100) {
    return;
  }

  console.log(i);
  //make deep copy of dna1 and mutate it
  var dna2 = dna1.clone();
  dna2.mutate();

  //render dna2 and get score
  dna2.render(changeCounter, projectName);
  imageDiff(sourceImageDir, __dirname + `/services/${projectName}/${changeCounter}.png`).then((dna2Score) => {
    //compare scores of dna1 and dna2
    if (dna1Score > dna2Score) {
      console.log('found a better match!');
      console.log('Diff: ', dna2Score);
      //found a better match
      changeCounter++;
      dna1 = dna2;
      dna1Score = dna2Score;
    }
    i++;
    nextCanvas(dna1Score);
  });
}


imageDiff(sourceImageDir, __dirname + `/services/${projectName}/0.png`).then((dna1Score) => {
  nextCanvas(dna1Score);
});


console.log('finished!!');