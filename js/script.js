// Note: Implementing multi-lang support was harder than I had expected, readability suffered because of it... Oh well!

// Available languages
let languages = ['en', 'sv'];

// Current language
let _language;
// Keyboard layout (ABCDEF, QWERTY)
let _layout;

// Minimum font size when resizing text
let minFontSize = 56;

//  Word from previous round
let previousWord = null;
// Current word (randomly selected)
let selectedWord;
// Letters that have been guessed so far
let guessedLetters;
// How many times in a row has the player won?
let winCount = 0;
// Attempts before game is over
let guesses;
// Countdown timer
let guessTime;
// When did the game start?
let startTime;
// Previous second since current time (needed for the final 10 seconds)
let prevSecond;
// Is the game running?
let isRunning;

// Game options
let speed = 1000; // Refresh interval every X ms
let time = 60 * 5; // 5 minute timer
let timeDecrease = 30; // Decrease time by X every win

let _time;
let _elapsed;
let _gameloop;

// Audio
let _soundEnabled;
let sounds = {
  dialogButton: 'dialog-button.mp3',
  alphabetButton: 'alphabet-button.mp3',
  correct: 'correct.mp3',
  incorrect: 'incorrect.mp3',
  tick: 'tick.wav',
  tock: 'tock.wav'
};

// Visuals
let images = {
  0: 'img/6.jpg',
  1: 'img/5.jpg',
  2: 'img/4.jpg',
  3: 'img/3.jpg',
  4: 'img/2.jpg',
  5: 'img/1.jpg'
};

// Elements
let elMain = document.querySelector('main');
let elFigure = document.querySelector('.figurewrapper figure');
let elTimer = document.querySelector('#timer');
let elDialog = document.querySelector('.dialog');
let elButtonContainer = document.querySelector('#alphabet');
let elWord = document.querySelector('.selectedword__heading');

function main() {
  if (!isRunning) return;

  let now = +new Date();
  _time = Math.round(guessTime - (now - startTime) * 0.001);
  _elapsed = Math.round(((now - startTime) * 0.001) % 60);

  render();
}

function start() {
  // Get a random word from word list
  selectedWord = generateRandomWord();

  // Prevent current word from being the same as the previous one
  if (selectedWord === previousWord && _language.wordList.length > 1) {
    console.log(selectedWord, previousWord);
    // Restart game until a different word has been generated
    start();
  } else {
    previousWord = selectedWord;
  }

  playSound(sounds.dialogButton);
  elTimer.classList.remove('text-red');

  // Set initial difficulty
  setDifficulty(time, timeDecrease);

  // Reset guesses and guessed letters
  guesses = 6;
  guessedLetters = [];

  startTime = +new Date();
  isRunning = true;

  elDialog.style.display = 'none';

  renderButtons(elButtonContainer, _language.alphabet, _layout, guessHandler);
  renderLetters();

  clearInterval(_gameloop);
  main();
  _gameloop = setInterval(main, speed);
}

// Translation
function translate() {
  let elLanguage = document.querySelector('#language');

  elLanguage.querySelector('h3').textContent = _language.language;

  // Reset language options
  elLanguage.querySelector('ul').innerHTML = '';

  languages.forEach(function(language) {
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
      fetchLanguage();
      translate();
      buildLayout();
    });

    elLanguage.querySelector('ul').appendChild(button);
  });

  let elSound = document.querySelector('#sound');
  elSound.querySelector('h3').textContent = _language.sound;
  _soundEnabled = isSoundEnabled();

  // Sound buttons
  document.querySelectorAll('#sound button').forEach(function(button) {
    button.removeEventListener('click', soundHandler);
    button.addEventListener('click', soundHandler);

    if (button.value == true) {
      button.textContent = _language.on;
    } else {
      button.textContent = _language.off;
    }

    if (button.value == _soundEnabled) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  // Render dialog if no classes are set (other dialogs are already open)
  if (document.querySelector('.dialog__content').classList.length === 1) {
    renderDialog(_language.newGame, null, [
      {
        text: _language.startGame,
        callback: start
      }
    ]);
  }

  // Render alphabet buttons
  renderButtons(elButtonContainer, _language.alphabet, _layout, guessHandler);
}

// Build button layout
function buildLayout() {
  _layout = getLayout();

  document.querySelector('#layout h3').textContent = _language.buttonLayout;

  // Layout buttons
  document.querySelectorAll('#layout button').forEach(function(button) {
    button.removeEventListener('click', layoutHandler);
    button.addEventListener('click', layoutHandler);

    if (_layout === button.value) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });

  // Render alphabet buttons
  renderButtons(elButtonContainer, _language.alphabet, _layout, guessHandler);
}

// Player won
function win() {
  winCount++;
  isRunning = false;
  let time = formatTime(_elapsed);
  renderDialog(
    _language.winner,
    `${_language.yourTime}: ${time.minutes}:${time.seconds}`,
    [{ text: _language.playAgain, callback: start }],
    'dialog--win'
  );
  renderButtons(elButtonContainer, _language.alphabet, _layout, guessHandler);
  playSound(sounds.correct);
}

// Player lost
function end() {
  isRunning = false;
  winCount = 0;
  renderDialog(
    _language.gameOver,
    `${_language.theWordWas} <span class="correct-word">${selectedWord}</span>`,
    [
      {
        text: _language.retry,
        callback: start
      }
    ],
    'dialog--lose'
  );
  renderButtons(elButtonContainer, _language.alphabet, _layout, guessHandler);
  playSound(sounds.incorrect);
}

// Initialize game
(function init() {
  // Get language (default: English)
  fetchLanguage();
  isSoundEnabled();
  buildLayout();
  translate();
})();
