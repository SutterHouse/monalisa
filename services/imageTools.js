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
  return pixels1.reduce((score, current, idx) => {
    return score + Math.pow(current - pixels2[idx], 2);
  }, 0);
};

module.exports = { pixelDiff, getSourceImagePixels };