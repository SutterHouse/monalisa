var DNA = require('./dna.js');
var gaussian = require('gaussian');
var dist = gaussian(0, Math.pow(100,2));
var sample = dist.ppf(Math.random());
console.log(sample)

var dna = new DNA(6, 100, 100);
dna.populate();
console.log(JSON.stringify(dna));
dna.mutate();
console.log(JSON.stringify(dna));