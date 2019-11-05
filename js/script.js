// Available languages
let languages = ['en', 'sv'];

var selectedWord; // Current word (randomly selected)
var guessedLetters; // Letters that have been guessed so far

var guesses; // Attempts before game over
var guessTime; // Countdown timer

var isRunning; // Is game running?

// Audio
var sounds = {
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

function guessClick() {
  if (guesses === 0) return;

  var letter = this.value;

  // Was the guess right or wrong?
  if (selectedWord.indexOf(letter) === -1) {
    guesses--;
  } else {
    this.classList.add('selected');
  }

  guessedLetters.push(letter);
  // renderLetters();
  // renderCanvas();
  playSound(sounds.alphabetButton);
  this.disabled = true;
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
(function translate() {
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
  renderButtons(elButtonContainer, _language.alphabet, guessClick);
})();
