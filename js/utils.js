// Get language from /lang/*.json
function getLanguage() {
  let xhr = new XMLHttpRequest();
  let languageSaved = localStorage.getItem('language');

  if (languageSaved == null) {
    setLanguage('en');
  }

  xhr.onload = function() {
    if (xhr.status === 200) {
      _language = JSON.parse(xhr.response);
    }
  };

  xhr.open('GET', `/lang/${languageSaved}.json`, false);
  xhr.send();
}

// Set language
function setLanguage(language) {
  localStorage.setItem('language', language);
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

// Set difficulty by decreasing guess time
function setDifficulty(time, decreaseAmount) {
  guessTime = time - winCount * decreaseAmount;

  if (guessTime <= 0) guessTime = timeDecrease;
}

// Play a sound file
function playSound(file, volume = 0.25) {
  if (!soundEnabled || localStorage.getItem('soundEnabled') == false) return;
  let audio = new Audio('sound/' + file);
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
