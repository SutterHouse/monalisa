var DNA = require('./services/dna');
var imageDiff = require('./services/imageDiff');
var config = require('./services/config.js');
var fs = require('fs');

var NUMBER_OF_EPOCHS = 100;
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
  dna2.render('temp', canvasContext).then(() => {
    return imageDiff(config.sourceImage.DIR, __dirname + `/services/${config.PROJECT_NAME}/temp.png`);
  }).then((dna2Score) => {
    //compare scores of dna1 and dna2
    if (dna1Score > dna2Score) {
      console.log('Diff: ', dna2Score);
      console.log('Count: ', i);
      //found a better match
      dna2.render(changeCounter, canvasContext).then(() => {
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

var dna1 = new DNA();
dna1.populate();
var i = 0;

var canvasContext;

dna1.render('0').then((ctx) => {
  canvasContext = ctx;
  return imageDiff(sourceImageDir, __dirname + `/services/${config.PROJECT_NAME}/0.png`);
}).then((dna1Score) => {
  nextCanvas(dna1Score);
});