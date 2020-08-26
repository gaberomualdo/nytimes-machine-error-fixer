const fs = require('fs');

const dictionary = fs
  .readFileSync('original_dictionary.txt')
  .toString()
  .split('\n')
  .map((line) => line.split('\t')[0]);

let newDict = '';

const valid = [
  'ab',
  'ad',
  'ah',
  'ai',
  'am',
  'an',
  'as',
  'at',
  'aw',
  'be',
  'bi',
  'bo',
  'by',
  'do',
  'eh',
  'ex',
  'gi',
  'go',
  'ha',
  'he',
  'hi',
  'ho',
  'if',
  'in',
  'is',
  'it',
  'ma',
  'me',
  'my',
  'no',
  'od',
  'of',
  'oh',
  'oi',
  'ok',
  'on',
  'op',
  'or',
  'ow',
  'ox',
  'oy',
  'oz',
  'pa',
  'so',
  'to',
  'uh',
  'um',
  'up',
  'us',
  'we',
  'ye',
  'yo',
  'a',
  'i',
  'o',
];

dictionary.forEach((e, i) => {
  word = e.split('\t')[0];
  if (word.length > 2 || valid.indexOf(word.toLowerCase()) > -1) {
    newDict += word + '\n';
    if (valid.indexOf(word.toLowerCase()) > -1) {
      console.log(word, i);
    }
  }
});

fs.writeFileSync('dictionary.txt', newDict);
