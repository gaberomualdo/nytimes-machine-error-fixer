// see webpack config file to see how this file is loaded

import './css/tryit.css';
import './pages/tryit.hbs';
import './js/utils';

const fixArticle = require('./fixArticle');

const textarea = document.querySelector('.container .text-box .left textarea');
const textBox = document.querySelector('.container .text-box');
const outputArea = document.querySelector('.container .text-box .right');
const fixedCountElm = document.querySelector('.container .row div:last-child p span:first-child');

const fixArticleBtn = document.querySelector('.container .text-box .left > .button-container button');

fixArticleBtn.addEventListener('click', () => {
  fixArticleBtn.blur();

  const toFix = textarea.value;

  if (toFix.trim().length === 0) {
    return;
  }

  let fixedCount = 0;
  outputArea.innerHTML = '';

  fixArticle(textarea.value, {
    delimiterFunction: 'default',
    async: true,
    paragraphCallback: (original, fixed) => {
      const newParagraph = document.createElement('p');
      newParagraph.innerHTML = fixed;
      console.log(fixed);
      fixedCount += Array.from(newParagraph.querySelectorAll('strong')).length;
      outputArea.appendChild(newParagraph);

      fixedCountElm.innerText = `${withCommas(fixedCount)} Error${fixedCount === 1 ? '' : 's'} Identified and Fixed`;
    },
  });
});

document.getElementById('highlight').addEventListener('click', (e) => {
  if (e.target.checked) {
    textBox.classList.add('highlighted');
  } else {
    textBox.classList.remove('highlighted');
  }
});
