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
  const word = firstWord + secondWord;

  const combinationMultiplier = 2;
  const rVal = getWordCommonRating(word) * combinationMultiplier > getWordCommonRating(firstWord) + getWordCommonRating(secondWord);
  return rVal;
};

const isProperNoun = (words, wordIdx) => {
  const { capitalized } = words[wordIdx];
  let beginningOfSentence = wordIdx === 0;
  if (wordIdx >= 1) {
    beginningOfSentence = beginningOfSentence || words[wordIdx - 1].endOfSentence;
  }
  return capitalized && !beginningOfSentence;
};
const isBeginningOfSentence = (words, wordIdx) => {
  let beginningOfSentence = wordIdx === 0;
  if (wordIdx >= 1) {
    beginningOfSentence = beginningOfSentence || words[wordIdx - 1].endOfSentence;
  }
  return beginningOfSentence;
};

module.exports = (text) => {
  const clean = (x) => x.getCleanWordObj();
  const words = text.getWords().map(clean);

  let combinationIndices = []; // indices at which words are combined
  let combinationRatings = []; // ratings for each combined word

  words.forEach(({ word }, i) => {
    if (isAWord(word) && i >= 1) {
      // never combine two proper nouns in a row; ex: 'North Vietnam' or 'Southeast Asia'
      // this will knowingly result in incorrect ignored cases like 'Mc Donald' not becoming 'McDonald'
      if (isProperNoun(words, i) && isProperNoun(words, i - 1)) {
        return;
      }

      // never combine words where one is the end of a sentence and another is the start of one
      if (isBeginningOfSentence(words, i)) {
        return;
      }

      const previousWord = words[i - 1].word;

      // ignore certain word combinations which have been problems in the past
      if (previousWord === 'et' && word === 'al') {
        return;
      }

      if (isAWord(previousWord) && shouldCombine(previousWord, word)) {
        combinationIndices.push(i - 1);
        combinationRatings.push(getWordCommonRating(previousWord + word));
      }
    }
  });

  // sometimes combinations will conflict, and in this case you must favor the combination with the highest rating
  // ex: 'support ed in' --> 'supported in' or 'support edin' ('edin' as in the Bosnian name). In this case 'supported' would have a higher rating than 'edin' and would be chosen.

  // there will typically be at maximum 3 conflicts for a single word, as spacing issues only seem to occur in hyphenated line breaks

  let finalCombinationIndices = [];
  let consecutiveCount = 0;

  const parseConsecutive = (idx, length) => {
    let bestCombination = combinationIndices[idx];
    let bestRating = combinationRatings[idx];

    for (let i = idx; i < idx + length; i++) {
      if (combinationRatings[i] > bestRating) {
        bestIdx = i;
        bestRating = combinationRatings[i];
        bestCombination = combinationIndices[i];
      }
    }
    finalCombinationIndices.push(bestCombination);
  };

  combinationIndices.forEach((combination, idx) => {
    if (idx >= 1) {
      if (combinationIndices[idx - 1] + 1 === combination) {
        consecutiveCount++;
        return;
      } else if (consecutiveCount > 0) {
        parseConsecutive(idx - (consecutiveCount + 1), consecutiveCount + 1);
        consecutiveCount = 0;
      }
    }

    if (combinationIndices.length > 1 && combinationIndices[idx + 1] - 1 === combination) {
      return;
    }

    finalCombinationIndices.push(combination);
  });

  if (consecutiveCount > 0) {
    parseConsecutive(combinationIndices.length - (consecutiveCount + 1), consecutiveCount + 1);
  }

  return text.combineWordsAtIndices(finalCombinationIndices);
};
