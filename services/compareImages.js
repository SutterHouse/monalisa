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
  
  let name1 = image1.split('/');
  name1 = name1[name1.length - 1];
  let name2 = image2.split('/');
  name2 = name2[name2.length - 1];
  console.log(`${name1} vs ${name2} diff: ${diff}`);
  return diff;
};

let imageTest = (image1, image2) => {
  PNG.decode(image1, (pixels1) => {
    console.log('First Pixel: ', pixels1[0]);
  });
};

module.exports = {
  imageTest: imageTest,
  imageDiff: imageDiff
}