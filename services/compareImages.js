let PNG = require('png-js');

let imageDiff = (image1, image2) => {
  var diff = null;
  return new Promise((resolve, reject) => {
    PNG.decode(image1, (pixels1) => {
      PNG.decode(image2, (pixels2) => {
        resolve(pixels1.reduce((score, current, idx) => {
          return score + Math.abs(current - pixels2[idx]);
        }, 0));
      });
    });
  });
};

module.exports = imageDiff;