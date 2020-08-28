// run this program to generate 'dictionary.txt' given the original dictionary at 'original_dictionary.txt'
// original dictionary ('original_dictionary.txt') from https://norvig.com/ngrams/count_1w.txt

const fs = require('fs');

const dictionary = fs
  .readFileSync('original_dictionary.txt')
  .toString()
  .split('\n')
  .map((line) => line.split('\t')[0]);

let newDict = '';
let newDictJS = "export const dictionary = JSON.parse('[";

// words under 3 letters must be in this human-checked Array
const valid = [
  'ab', // Singular of Abs
  'ad', // Short for Advertisement
  'ah', // Exclamation
  'ai', // AI (Artificial Intelligence)
  'am',
  'an',
  'as',
  'at',
  'aw', // Exclamation
  'be',
  'bi', // Bisexual
  'bo', // Acronym
  'by',
  'do',
  'eh', // Exclamation
  'ex', // Hyphenated Prefix
  'go',
  'ha', // Exclamation
  'he',
  'hi',
  'ho', // Exclamation
  'if',
  'in',
  'is',
  'it',
  'ma', // Short for Mother
  'me',
  'my',
  'no',
  'od', // Acronym
  'of',
  'oh', // Exclamation
  'oi', // Exclamation
  'ok',
  'on',
  'op', // Abbreviation for Operation
  'or',
  'ow', // Exclamation
  'ox',
  'oy', // Exclamation
  'oz', // Unit and in 'Wizard of Oz'
  'pa', // Short for Father
  'so',
  'to',
  'uh', // Exclamation
  'um', // Exclamation
  'up',
  'us',
  'we',
  'ye', // Exclamation
  'yo', // Slang
  'a',
  'i',
  'o', // Exclamation
];

dictionary.forEach((e, i) => {
  word = e.split('\t')[0];
  if (word.length > 2 || valid.indexOf(word.toLowerCase()) > -1) {
    newDict += word + '\n';
    newDictJS += `"${word.replace(/\"/g, '\\"')}",`;
    if (valid.indexOf(word.toLowerCase()) > -1) {
      console.log(word, i);
    }
  }
});

newDictJS += "]');";

fs.writeFileSync('dictionary.txt', newDict);
fs.writeFileSync('rawDictionary.js', newDictJS);
