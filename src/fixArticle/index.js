global.dictionary = require('./rawDictionary');
require('./utils');
require('./textUtils');

const fixExtraSpaces = require('./fixExtraSpaces');

// exported function to fix a given article with content and optional options
const fixArticle = (articleContent, options = {}) => {
  // options --> { delimiterFunction: Function, isAsync: boolean, paragraphCallback: Function }

  let hasDelimiters = false;
  let delimiterFunction = () => {
    return { start: '', end: '' };
  };
  if (options.delimiterFunction) {
    hasDelimiters = true;
    if (options.delimiterFunction === 'default') {
      delimiterFunction = (colorIdx) => {
        const colors = '#27ae60,#3498db,#e67e22,#e74c3c,#8e44ad,#f39c12'.split(',');
        return {
          start: `<strong style="color: ${colors[colorIdx % colors.length]}">`,
          end: '</strong>',
        };
      };
    } else {
      delimiterFunction = options.delimiterFunction;
    }
  }

  let isAsync = options.async;
  let paragraphCallback = options.paragraphCallback || (() => {});

  articleContentParagraphs = articleContent
    .split('\n')
    .map((line) => line.noHTML())
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let originalChangedWordsCount = 0;
  let fixedChangedWordsCount = 0;

  let objToReturn = {
    originalParagraphs: [],
    fixedParagraphs: [],
    originalText: '',
    fixedText: '',
  };

  const fixParagraph = (paragraphIdx) => {
    const placeholderWord = '[] '; // to fix bugs with fixes in the first word
    const paragraph = articleContentParagraphs[paragraphIdx];
    let { text, newWordIndices, originalWordIndices } = fixExtraSpaces(placeholderWord + paragraph);

    let original = hasDelimiters
      ? addDelimiters(paragraph, originalWordIndices, () => {
          originalChangedWordsCount++;
          return delimiterFunction(originalChangedWordsCount);
        })
      : paragraph;
    let fixed = hasDelimiters
      ? addDelimiters(text, newWordIndices, () => {
          fixedChangedWordsCount++;
          return delimiterFunction(fixedChangedWordsCount);
        })
      : text;

    original = original.slice(3, original.length);
    fixed = fixed.slice(3, fixed.length);

    paragraphCallback(original, fixed);

    if (paragraphIdx + 1 < articleContentParagraphs.length) {
      if (isAsync) {
        setTimeout(() => {
          fixParagraph(paragraphIdx + 1);
        }, 0);
      } else {
        // stack overflows may occur with text with many paragraphs
        return { original, fixed };
      }
    }
  };

  if (isAsync) {
    fixParagraph(0);
  } else {
    for (let i = 0; i < articleContentParagraphs.length; i++) {
      const { original, fixed } = fixParagraph(i);
      objToReturn.originalParagraphs.push(original);
      objToReturn.fixedParagraphs.push(fixed);
    }

    objToReturn.fixedText = objToReturn.fixedParagraphs.join('\n\n');
    objToReturn.originalText = objToReturn.originalParagraphs.join('\n\n');

    return objToReturn;
  }
};

// given an array of wordIndicies (word numbers of where there were changes made in given text), add delimiters (determined by a given function which takes in the current index in wordIndices)
const addDelimiters = (text, wordIndices, delimiterFunction) => {
  if (wordIndices.length === 0) {
    return text;
  }

  rVal = '';

  let currentDelimiters;

  let wordsDone = 0;
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];

    const isStartIdx = wordsDone < wordIndices.length && wordIndices[wordsDone].start === i;
    const isEndIdx = wordsDone < wordIndices.length && wordIndices[wordsDone].end === i;

    // don't add anything if idx is both start and end
    const isStartAndEndIdx = isStartIdx && isEndIdx;

    if (!isStartAndEndIdx && isStartIdx) {
      currentDelimiters = delimiterFunction(wordsDone);
      rVal += currentDelimiters.start;
    }

    rVal += letter;

    if (!isStartAndEndIdx && isEndIdx) {
      rVal += currentDelimiters.end;
      wordsDone += 1;
    }
  }

  return rVal;
};

module.exports = fixArticle;
