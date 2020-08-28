// from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const withCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const fixArticle = require('./fixArticle');
const exampleArticles = require('./exampleArticles');

const textBox = document.querySelector('.text-box');
const textBoxParagraphs = document.querySelector('.text-box .paragraphs');

const selectBox = document.querySelector('select.select-article');

const updateArticle = () => {
  const article = exampleArticles[selectBox.value];

  textBoxParagraphs.innerHTML = '';

  // meta for original article (link, word count, published date)
  (() => {
    const wordCount = article.content.split(' ').length;
    const published = article.date;
    const link = article.url;
    const separator = '&nbsp;&nbsp;&bull;&nbsp;&nbsp;';
    const metaHTML = `${withCommas(
      wordCount
    )} words${separator}${published}${separator}<a href='${link}' target='_blank' title='Article Link'>Original Article on NY Times</a>`;
    document.querySelector('.container .row div:first-child p').innerHTML = metaHTML;
  })();

  let fixedWordsCount = 0;
  fixArticle(article.content, (originalParagraphHTML, fixedParagraphHTML) => {
    // update amount of words fixed
    fixedWordsCount += (fixedParagraphHTML.match(/<\/strong>/g) || []).length;
    document.querySelector('.container .row div:last-child p span:first-child').innerText = `${withCommas(
      fixedWordsCount
    )} Errors Identified and Fixed`;

    const row = document.createElement('div');
    row.classList.add('paragraph');

    const originalParagraphElm = document.createElement('p');
    const fixedParagraphElm = document.createElement('p');

    originalParagraphElm.innerHTML = originalParagraphHTML;
    fixedParagraphElm.innerHTML = fixedParagraphHTML;

    row.appendChild(originalParagraphElm);
    row.appendChild(fixedParagraphElm);

    textBoxParagraphs.appendChild(row);
  });
};

window.addEventListener('load', () => {
  exampleArticles.forEach((article, idx) => {
    const elm = document.createElement('option');
    elm.value = idx;
    elm.innerText = article.title;
    selectBox.appendChild(elm);
  });
  selectBox.value = 0;

  updateArticle();
});

selectBox.addEventListener('change', updateArticle);

document.getElementById('highlight').addEventListener('click', (e) => {
  console.log(e.target.checked);
  if (e.target.checked) {
    textBox.classList.add('highlighted');
  } else {
    textBox.classList.remove('highlighted');
  }
});
