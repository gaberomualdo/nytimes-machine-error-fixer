import './css/index.css';
import './pages/index.hbs';
import './js/utils';

const exampleArticles = require('./js/exampleArticlesWithFixes');

const textBox = document.querySelector('.text-box');
const textBoxParagraphs = document.querySelector('.text-box .paragraphs');

const selectBox = document.querySelector('select.select-article');

const updateArticle = () => {
  const articleIdx = selectBox.value;
  const article = exampleArticles[articleIdx];

  textBoxParagraphs.innerHTML = '';

  // meta for original article (link, word count, published date)
  (() => {
    const meta = article.meta;
    const separator = '&nbsp;&nbsp;&bull;&nbsp;&nbsp;';

    const metaHTML = `${withCommas(meta.wordCount)} words${separator}${meta.published}${separator}<a href='${
      meta.link
    }' target='_blank' title='Article Link' rel="noreferrer noopener">See Article on the NY Times Website</a>`;

    document.querySelector('.container .row div:first-child p').innerHTML = metaHTML;

    document.querySelector('.container .row div:last-child p span:first-child').innerText = `${withCommas(
      article.fixedWords
    )} Errors Identified and Fixed`;
  })();

  article.original.forEach((originalParagraphHTML, paragraphIdx) => {
    const fixedParagraphHTML = article.fixed[paragraphIdx];

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
  if (e.target.checked) {
    textBox.classList.add('highlighted');
  } else {
    textBox.classList.remove('highlighted');
  }
});
