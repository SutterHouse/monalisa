var DNA = require('./services/dna.js');
var imageDiff = require('./services/imageDiff.js');
var fs = require('fs');

var NUMBER_OF_EPOCHS = 100;
var projectName = 'test';
var sourceImageDir = __dirname + '/spec/compareImages/raptor.png';
var changeCounter = 1;

var nextCanvas = (dna1Score) => {
  if (i === NUMBER_OF_EPOCHS) {
    return;
  }
  //make deep copy of dna1 and mutate it
  var dna2 = dna1.clone();
  dna2.mutate();

  //render dna2 and get score
  dna2.render('temp', 'temp', canvasContext).then(() => {
    return imageDiff(sourceImageDir, __dirname + `/services/temp/${'temp'}.png`);
  }).then((dna2Score) => {
    //compare scores of dna1 and dna2
    if (dna1Score > dna2Score) {
      console.log('Diff: ', dna2Score);
      console.log('Count: ', i);
      //found a better match
      dna2.render(changeCounter, projectName, canvasContext).then(() => {
        changeCounter++;
        i++;
        nextCanvas(dna2Score);
      });
      
    } else {
      i++;
      nextCanvas(dna1Score);
    }
    
  });
  
}

var dna1 = new DNA(50, 383, 500);
dna1.populate();
var i = 0;

var canvasContext;

dna1.render('0', projectName).then((ctx) => {
  canvasContext = ctx;
  return imageDiff(sourceImageDir, __dirname + `/services/${projectName}/0.png`);
}).then((dna1Score) => {
  nextCanvas(dna1Score);
});