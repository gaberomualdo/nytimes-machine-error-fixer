const fs = require('fs');

global.dictionary = require('./dictionary');
require('./utils');
require('./textUtils');

const fixExtraSpaces = require('./fixExtraSpaces');

const testExampleArticle = async () => {
  let article = JSON.parse(fs.readFileSync('../example_article.json'));
  article.contentParagraphs = article.content.split('\n\n');

  const fixedContentParagraphsWordIndicies = [];

  const fixedContentParagraphs = article.contentParagraphs.map((paragraph) => {
    const { text, newWordIndices, originalWordIndices } = fixExtraSpaces(paragraph);
    fixedContentParagraphsWordIndicies.push({ newWordIndices, originalWordIndices });
    return text;
  });
  const fixedContent = fixedContentParagraphs.join('\n\n');

  let articleContentHTML = article.contentParagraphs
    .map((paragraph, idx) => {
      return addWordIndicies(paragraph, fixedContentParagraphsWordIndicies[idx].originalWordIndices, {
        start: '<strong>',
        end: '</strong>',
      });
    })
    .join('\n\n');
  let fixedContentHTML = fixedContentParagraphs
    .map((paragraph, idx) => {
      return addWordIndicies(paragraph, fixedContentParagraphsWordIndicies[idx].newWordIndices, {
        start: '<strong>',
        end: '</strong>',
      });
    })
    .join('\n\n');

  require('fs').writeFileSync(
    '../example_article.html',
    `<link rel='stylesheet' href='style.css' /><pre>${articleContentHTML}</pre><pre>${fixedContentHTML}</pre>`
  );
};

const addWordIndicies = (text, wordIndicies, delimeters) => {
  if (wordIndicies.length === 0) {
    return text;
  }

  rVal = '';

  let wordsDone = 0;
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];

    if (wordsDone < wordIndicies.length && wordIndicies[wordsDone].start === i) {
      rVal += delimeters.start;
    }

    rVal += letter;

    if (wordsDone < wordIndicies.length && wordIndicies[wordsDone].end === i) {
      rVal += delimeters.end;
      wordsDone += 1;
    }
  }

  return rVal;
};

testExampleArticle();
