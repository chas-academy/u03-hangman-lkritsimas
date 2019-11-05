// Available languages
let languages = ['en', 'sv'];

// Keyboard layout (ABCDEF, QWERTY)
let _layout;

let selectedWord; // Current word (randomly selected)
let guessedLetters; // Letters that have been guessed so far

let guesses; // Attempts before game over
let guessTime; // Countdown timer

let isRunning; // Is game running?

// Audio
let sounds = {
  dialogButton: 'dialog-button.mp3',
  alphabetButton: 'alphabet-button.mp3',
  correct: 'correct.mp3',
  incorrect: 'incorrect.mp3',
  tick: 'tick.wav',
  tock: 'tock.wav'
};

// Elements
let elDialog = document.querySelector('.dialog');
let dialogButtons = document.querySelectorAll('.dialog__footer button');
let elButtonContainer = document.querySelector('#alphabet');

// Get language (default: English)
getLanguage();

function guess(event) {
  // Check if not running, guesses have run out or if pressed key is not in alphabet
  if (!isRunning || guesses === 0 || (event.key && _language.alphabet.indexOf(event.key.toLowerCase()) === -1)) {
    return;
  }

  let letter = this.value || event.key;
  let elButton = document.querySelector(`button[value=${letter}]`);
  letter = letter.toLowerCase();

  // Check if letter has already been guessed
  if (guessedLetters.indexOf(letter) !== -1) return;

  // Was the guess right or wrong?
  if (selectedWord.indexOf(letter) === -1) {
    guesses--;
  } else {
    elButton.classList.add('selected');
  }

  guessedLetters.push(letter);
  // renderLetters();
  // renderCanvas();
  playSound(sounds.alphabetButton);
  elButton.disabled = true;
}

function start() {
  playSound(sounds.dialogButton);

  // Get a random word from word list
  selectedWord = _language.wordList[Math.floor(Math.random() * _language.wordList.length)];

  guesses = 6;
  guessedLetters = [];

  startTime = +new Date();
  isRunning = true;

  elDialog.style.display = 'none';
}

// Translation
function translate() {
  let elLanguage = document.querySelector('#language');

  elLanguage.querySelector('h3').textContent = _language.language;

  // Reset language options
  elLanguage.querySelector('ul').innerHTML = '';

  languages.forEach(language => {
    // Create language buttons
    let button = document.createElement('button');
    button.id = `lang-${language}`;
    button.classList.add('btn');
    button.classList.add('btn--flat');
    button.textContent = _language.languages[language];

    // Check if current language is in localstorage
    if (language === localStorage.getItem('language')) {
      button.classList.add('selected');
      button.disabled = true;
    }

    button.addEventListener('click', function() {
      playSound(sounds.dialogButton, 0.05);
      setLanguage(language);
      getLanguage();
      translate();
    });

    elLanguage.querySelector('ul').appendChild(button);
  });

  // Render dialog
  renderDialog(_language.newGame, null, [
    {
      text: _language.startGame,
      click: start
    }
  ]);

  // Render alphabet buttons
  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
}

function getLayout() {
  if (_layout === null) {
    setLayout('ABCDEF');
  }

  _layout = localStorage.getItem('layout');
}

function setLayout() {
  localStorage.setItem('layout', this.value);
  playSound(sounds.dialogButton, 0.05);
  buildLayout();
}

function buildLayout() {
  getLayout();

  // Layout buttons
  document.querySelectorAll('#layout button').forEach(button => {
    button.removeEventListener('click', setLayout);
    button.addEventListener('click', setLayout);

    if (_layout === button.value) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  // Render alphabet buttons
  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
}

(function reset() {
  buildLayout();
  translate();
})();
