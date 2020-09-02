// string is number
String.prototype.isNumber = function () {
  return !isNaN(parseInt(this));
};

// remove punctuation, make lowercase, etc.
String.prototype.getCleanWordObj = function () {
  let returnVal = {
    word: this,
    endOfSentence: false,
    capitalized: false,
  };

  let newWord = this.toLowerCase();

  // words with these indicate a capital letter for the next word
  const endOfSentenceLetters = ['.'];
  for (let i = 0; i < endOfSentenceLetters.length; i++) {
    const letter = endOfSentenceLetters[i];
    if (newWord.includes(letter)) {
      returnVal.endOfSentence = true;
      break;
    }
  }

  // if word is capitalized
  if (this.length >= 1 && this[0] !== this[0].toLowerCase()) {
    returnVal.capitalized = true;
  }

  // ignore certain letters
  const lettersToIgnore = ['.', ',', ';', '(', ')', '[', ']', ':', '¶', '“', '”'];
  lettersToIgnore.forEach((letter) => {
    newWord = newWord.replace(new RegExp('\\' + letter, 'g'), '');
  });

  // special case for any words ending with 's (apostrophe-S)
  const apostropheS = "'s";
  if (newWord.endsWith(apostropheS)) {
    newWord = newWord.slice(0, newWord.length - apostropheS.length);
  }

  returnVal.word = newWord;

  return returnVal;
};

// util variables
const wordSeparators = [' ', '—', '–' /* , '-', '‐' */];

// split text into words
String.prototype.getWords = function () {
  const words = [];
  let curWord = '';

  const addCurWordToList = () => {
    words.push(curWord);
    curWord = '';
  };

  for (let letter of this) {
    if (wordSeparators.contains(letter)) {
      addCurWordToList();
    } else {
      curWord += letter;
    }
  }
  addCurWordToList();

  return words;
};

// combine words
String.prototype.combineWordsAtIndices = function (combinationIndices) {
  let text = this.slice(0);
  const textLength = text.length;
  let curWordIdx = 0;
  let removedCount = 0;
  let originalWordIndices = []; // a list of start and end indices which combined words were originally
  let newWordIndices = []; // a list of start and end indices which fixed words are now

  for (let i = 0; i < textLength; i++) {
    const idx = i - removedCount;
    const letter = text[idx];
    if (wordSeparators.contains(letter)) {
      if (combinationIndices.contains(curWordIdx - 1)) {
        newWordIndices[newWordIndices.length - 1].end = idx;
        originalWordIndices[originalWordIndices.length - 1].end = i;
      }
      if (combinationIndices.contains(curWordIdx + 1)) {
        newWordIndices.push({});
        originalWordIndices.push({});
        newWordIndices[newWordIndices.length - 1].start = idx + 1;
        originalWordIndices[originalWordIndices.length - 1].start = i + 1;
      }

      if (combinationIndices.contains(curWordIdx)) {
        text = text.slice(0, idx) + text.slice(idx + 1);
        removedCount++;
      }

      curWordIdx += 1;
    }
  }

  if (newWordIndices[newWordIndices.length - 1] && !newWordIndices[newWordIndices.length - 1].end) {
    newWordIndices[newWordIndices.length - 1].end = textLength - 1 - removedCount;
    originalWordIndices[originalWordIndices.length - 1].end = textLength - 1;
  }

  return { text, newWordIndices, originalWordIndices };
};
