global.dictionary = require('./rawDictionary');
require('./utils');
require('./textUtils');

const fixExtraSpaces = require('./fixExtraSpaces');

const fixArticle = (articleContent, paragraphCallback) => {
  const delimiterFunc = (colorIdx) => {
    const colors = '#27ae60,#3498db,#e67e22,#e74c3c,#8e44ad,#f39c12'.split(',');
    return {
      start: `<strong style="color: ${colors[colorIdx % colors.length]}">`,
      end: '</strong>',
    };
  };

  articleContentParagraphs = articleContent
    .split('\n')
    .map((line) => line.noHTML())
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let originalChangedWordsCount = 0;
  let fixedChangedWordsCount = 0;

  const fixParagraph = (paragraphIdx) => {
    const paragraph = articleContentParagraphs[paragraphIdx];
    const { text, newWordIndices, originalWordIndices } = fixExtraSpaces(paragraph);

    const original = addWordIndicies(paragraph, originalWordIndices, (useless) => {
      originalChangedWordsCount++;
      return delimiterFunc(originalChangedWordsCount);
    });
    const fixed = addWordIndicies(text, newWordIndices, (useless) => {
      fixedChangedWordsCount++;
      return delimiterFunc(fixedChangedWordsCount);
    });

    paragraphCallback(original, fixed);

    if (paragraphIdx + 1 < articleContentParagraphs.length) {
      setTimeout(() => {
        fixParagraph(paragraphIdx + 1);
      }, 0);
    }
  };

  fixParagraph(0);
};

const addWordIndicies = (text, wordIndicies, delimiters) => {
  if (wordIndicies.length === 0) {
    return text;
  }

  rVal = '';

  let currentDelimiters;

  let wordsDone = 0;
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];

    if (wordsDone < wordIndicies.length && wordIndicies[wordsDone].start === i) {
      currentDelimiters = delimiters(wordsDone);
      rVal += currentDelimiters.start;
    }

    rVal += letter;

    if (wordsDone < wordIndicies.length && wordIndicies[wordsDone].end === i) {
      rVal += currentDelimiters.end;
      wordsDone += 1;
    }
  }

  return rVal;
};

module.exports = fixArticle;
