// Available languages
let languages = ['en', 'sv'];

// Keyboard layout (ABCDEF, QWERTY)
let _layout;

let selectedWord; // Current word (randomly selected)
let guessedLetters; // Letters that have been guessed so far
let winCount = 0;
let guesses; // Attempts before game over
let guessTime; // Countdown timer
let startTime;
let prevSecond; // Previous second since current time

let isRunning; // Is game running?

// Audio
let soundEnabled = true;

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
let elFigure = document.querySelector('.figurewrapper figure');
let elTimer = document.querySelector('#timer');
let elDialog = document.querySelector('.dialog');
let dialogButtons = document.querySelectorAll('.dialog__footer button');
let elButtonContainer = document.querySelector('#alphabet');
let elWord = document.querySelector('#word');

let speed = 1000; // Refresh interval every X ms
// let time = 60 * 5; // 5 minutes
let time = 12;
let timeDecrease = 30; // Decrease time by X every win

let _time;
let _elapsed;
let _gameloop;

function main() {
  if (!isRunning) return;

  let now = +new Date();
  _time = Math.round(guessTime - (now - startTime) * 0.001);
  _elapsed = Math.round(((now - startTime) * 0.001) % 60);

  render();
}

// Main render
function render() {
  /*
   *   Render countdown timer
   */
  let timeStr = formatTime(_time);

  if (_time <= 0 || guesses === 0) end();

  let txt = `${timeStr.minutes} : ${timeStr.seconds}`;

  // Clear canvas if needed
  if (guesses === 6) elFigure.innerHTML = '';

  // Change fill style to red when time remaining is 10 seconds or less
  if (_time > 0 && _time <= 10) {
    elTimer.classList.add('text-red');

    // Play tick tock sound
    if (_elapsed !== prevSecond) {
      playSound(prevSecond % 2 ? sounds.tick : sounds.tock);
    }
  }

  prevSecond = _elapsed;
  elTimer.innerText = txt;
}

// Draw canvas
function renderFigure() {
  if (guesses >= 0 && guesses < 6) renderImage(elFigure, images[guesses]);
}

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
  renderLetters();
  renderFigure();
  playSound(sounds.alphabetButton);
  elButton.disabled = true;
}

// Set difficulty by decreasing guess time
function setDifficulty(time, decreaseAmount) {
  guessTime = time - winCount * decreaseAmount;

  if (guessTime <= 0) guessTime = timeDecrease;
}

function start() {
  playSound(sounds.dialogButton);

  elTimer.classList.remove('text-red');

  setDifficulty(time, timeDecrease);

  // Get a random word from word list
  selectedWord = _language.wordList[Math.floor(Math.random() * _language.wordList.length)];

  guesses = 6;
  guessedLetters = [];

  startTime = +new Date();
  isRunning = true;

  elDialog.style.display = 'none';

  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
  renderLetters();

  clearInterval(_gameloop);
  main();
  _gameloop = setInterval(main, speed);
}

function soundHandler() {
  soundEnabled = this.value;
  localStorage.soundEnabled = this.value;
  playSound(sounds.dialogButton, 0.05);
  translate();
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
      getLanguage();
      translate();
      buildLayout();
    });

    elLanguage.querySelector('ul').appendChild(button);
  });

  let elSound = document.querySelector('#sound');
  elSound.querySelector('h3').textContent = _language.sound;
  soundEnabled = localStorage.getItem('soundEnabled');

  // Sound buttons
  document.querySelectorAll('#sound button').forEach(function(button) {
    button.removeEventListener('click', soundHandler);
    button.addEventListener('click', soundHandler);

    if (button.value == true) {
      button.textContent = _language.on;
    } else {
      button.textContent = _language.off;
    }

    if (button.value == soundEnabled) {
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
  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
}

// Get button layout
function getLayout() {
  if (_layout === null) {
    setLayout('ABCDEF');
  }

  _layout = localStorage.getItem('layout');
}

// Set button layout
function setLayout() {
  localStorage.setItem('layout', this.value);
  playSound(sounds.dialogButton, 0.05);
  buildLayout();
}

// Build button layout
function buildLayout() {
  getLayout();

  document.querySelector('#layout h3').textContent = _language.buttonLayout;

  // Layout buttons
  document.querySelectorAll('#layout button').forEach(function(button) {
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

function renderLetters() {
  let score = 0;
  elWord.innerHTML = '';

  for (let i = 0; i < selectedWord.length; i++) {
    let letter = selectedWord[i];

    let elLetter = document.createElement('span');
    elLetter.className = 'letter';

    // Render underscores or correctly guessed letter
    if (guessedLetters.length > 0 && guessedLetters.indexOf(letter) !== -1) {
      score++;
      elLetter.innerHTML += '<span class="underline">' + letter + '</span>';
      elLetter.innerHTML += '_';
    } else {
      if (letter === ' ') {
        score++;
        elLetter.innerHTML += '<span class="spacer"></span>';
      } else {
        elLetter.innerHTML += '_';
      }
    }
    elWord.appendChild(elLetter);
  }

  // Winner!
  if (score === selectedWord.length) win();
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
  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
  playSound(sounds.correct);
}

// End game
function end() {
  isRunning = false;
  winCount = 0;
  renderDialog(
    _language.gameOver,
    `${_language.theWordWas} <span class="word">${selectedWord}</span>`,
    [
      {
        text: _language.retry,
        callback: start
      }
    ],
    'dialog--lose'
  );
  renderButtons(elButtonContainer, _language.alphabet, _layout, guess);
  playSound(sounds.incorrect);
}

// Get language (default: English)
getLanguage();

(function reset() {
  buildLayout();
  translate();
})();
