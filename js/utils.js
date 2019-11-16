/*
 * "Getters" & "Setters"
 */

// Get language from /lang/*.json
function fetchLanguage() {
  let xhr = new XMLHttpRequest();
  let languageSaved = localStorage.getItem('language');

  if (languageSaved === null) {
    languageSaved = 'en';
    setLanguage(languageSaved);
  }

  xhr.onload = function() {
    if (xhr.status === 200) {
      _language = JSON.parse(xhr.response);
    }
  };

  xhr.open('GET', `./lang/${languageSaved}.json`, false);
  xhr.send();
}

// Set language
function setLanguage(language) {
  localStorage.setItem('language', language);
}

// Get button layout
function getLayout() {
  let layout = localStorage.getItem('layout');

  if (layout === null) {
    layout = 'ABCDEF';
    setLayout(layout);
  }

  return layout;
}

// Set button layout
function setLayout(layout) {
  localStorage.setItem('layout', layout);
  _layout = layout;
}

function isSoundEnabled() {
  let isEnabled = localStorage.getItem('soundEnabled');

  if (isEnabled === null) {
    isEnabled = 1;
    setSoundEnabled(isEnabled);
  }

  return isEnabled;
}

function setSoundEnabled(isEnabled) {
  _soundEnabled = isEnabled;
  localStorage.setItem('soundEnabled', isEnabled);
}

// Set difficulty by decreasing guess time
function setDifficulty(time, decreaseAmount) {
  guessTime = time - winCount * decreaseAmount;

  if (guessTime <= 0) guessTime = timeDecrease;
}

/*
 *  Utility functions
 */

// Play a sound file if sound is enabled
function playSound(file, volume = 0.25) {
  if (isSoundEnabled() == 0) return;
  let audio = new Audio('./sound/' + file);
  audio.volume = volume;
  audio.play();
}

// Format time
function formatTime(time) {
  let minutes = parseInt(time / 60, 10);
  let seconds = parseInt(time % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return { minutes: minutes, seconds: seconds };
}

// Get a random word from word list
function generateRandomWord() {
  return _language.wordList[Math.floor(Math.random() * _language.wordList.length)];
}

// Measure a strings width in pixels
function measureTextWidth(text, font, fontSize, padding = 0) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.font = `${fontSize}px ${font}`;

  return context.measureText(text).width + padding;
}

/*
 *  Event handlers
 */

// Callback for dialog
function dialogHandler(event) {
  let dialog = document.querySelector('.dialog');

  if (event.type === 'keydown' && dialog.style.display !== 'none') {
    if (event.code === 'Enter') {
      // Start the game
      start();
    }
  } else {
    // Fixes stupid bug where overlay background does not cover entire body
    let body = document.body;
    let html = document.documentElement;

    let height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    dialog.style.height = `${height}px`;
  }
}

// Callback for sound option buttons
function soundHandler() {
  soundEnabled = this.value;
  localStorage.soundEnabled = this.value;
  playSound(sounds.dialogButton, 0.05);
  translate();
}

function layoutHandler() {
  setLayout(this.value);
  playSound(sounds.dialogButton, 0.05);
  buildLayout();
}

function guessHandler(event) {
  // Check if not running, guesses have run out or if pressed key is not in alphabet
  if (!isRunning || guesses === 0 || (event.key && _language.alphabet.indexOf(event.key.toLowerCase()) === -1)) {
    return;
  }

  let letter = this.value || event.key;
  letter = letter.toLowerCase();
  let elButton = document.querySelector(`button[value=${letter}]`);

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
