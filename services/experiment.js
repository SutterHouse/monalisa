var DNA = require('./dna.js');

var dna = new DNA(6, 100, 100);
dna.populate();
console.log(JSON.stringify(dna));
dna.mutate();
console.log(JSON.stringify(dna));