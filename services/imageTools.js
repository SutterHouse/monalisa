const PNG = require('png-js');
const config = require('../config.js');

const getSourceImagePixels = () => {
  return new Promise((resolve, reject) => {
    try {
      PNG.decode(config.image.dir, (pixelBuffer) => {
        resolve([...pixelBuffer]);
      });
    } catch(err) {
      reject(err);
    }
  });
}

// assumes that pixel arrays in same format
const pixelDiff = (pixels1, pixels2) => {
  pixels1.reduce((score, current, idx) => {
    return score + Math.abs(current - pixels2[idx]);
  }, 0);
};

module.exports = { pixelDiff, getSourceImagePixels };