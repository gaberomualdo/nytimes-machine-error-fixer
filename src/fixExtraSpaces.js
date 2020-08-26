const dictionary = require('./dictionary');

const isAWord = (word) => {
  return !word.isNumber() && word.length > 0;
};

const getWordCommonRating = (word) => {
  const idxInDict = dictionary.indexOf(word);
  if (idxInDict > -1) {
    return dictionary.length - idxInDict;
  }
  return -dictionary.length;
};

const shouldCombine = (firstWord, secondWord) => {
  const combinationMultiplier = 2;
  return getWordCommonRating(firstWord + secondWord) * combinationMultiplier > getWordCommonRating(firstWord) + getWordCommonRating(secondWord);
};

const isProperNoun = (words, wordIdx) => {
  const { capitalized } = words[wordIdx];
  let beginningOfSentence = wordIdx === 0;
  if (wordIdx >= 1) {
    beginningOfSentence = beginningOfSentence || words[wordIdx - 1].endOfSentence;
  }
  return capitalized && !beginningOfSentence;
};

module.exports = (text) => {
  const clean = (x) => x.getCleanWordObj();
  const words = text.getWords().map(clean);

  let combinationIndices = [];

  words.forEach(({ word }, i) => {
    if (isAWord(word) && i >= 1) {
      // never combine two proper nouns in a row; ex: 'North Vietnam' or 'Southeast Asia'
      // this will knowingly result in incorrect ignored cases like 'Mc Donald' not becoming 'McDonald'
      if (isProperNoun(words, i) && isProperNoun(words, i - 1)) {
        return;
      }

      const previousWord = words[i - 1].word;
      if (isAWord(previousWord) && shouldCombine(previousWord, word)) {
        console.log(`Consider combining '${previousWord}' and '${word}' to form '${previousWord + word}'`);
        combinationIndices.push(i - 1);
      }
    }
  });

  return text.combineWordsAtIndices(combinationIndices);
};
