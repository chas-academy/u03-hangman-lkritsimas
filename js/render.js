// Main render
function render() {
  /*
   *   Render countdown timer
   */
  let timeStr = formatTime(_time);

  if (_time <= 0 || guesses === 0) end();

  let txt = `${timeStr.minutes} : ${timeStr.seconds}`;

  // Clear figure if game is reset
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

// Draw figure
function renderFigure() {
  if (guesses >= 0 && guesses < 6) renderImage(elFigure, images[guesses]);
}

// Renders an image
function renderImage(element, file) {
  let img;

  // Create an image if it doesn't already exist
  if (element.querySelector('#image') === null) {
    img = document.createElement('img');
    img.id = 'image';
    element.appendChild(img);
  }

  img = element.querySelector('#image');
  img.src = file;
}

// Render the letters/underscores for the current word
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

// Render alphabet buttons
function renderButtons(container, alphabet, layout, callback) {
  container.innerHTML = '';

  if (layout === 'ABCDEF') {
    // Clone and sort alphabet
    alphabet = alphabet.slice(0).sort();
  }

  for (let i = 0; i < alphabet.length; i++) {
    let elItem = document.createElement('li');
    let elButton = document.createElement('button');
    elButton.classList.add('btn');
    elButton.classList.add('btn--letter');
    elButton.value = alphabet[i];
    elButton.textContent = alphabet[i];
    elButton.removeEventListener('click', callback);
    elButton.addEventListener('click', callback);

    // Dialog focus trap
    if (document.querySelector('.dialog').style.display !== 'none') {
      elButton.tabIndex = -1;
    }

    elItem.appendChild(elButton);
    container.appendChild(elItem);
  }

  window.removeEventListener('keyup', callback);
  window.addEventListener('keyup', callback);
}

// Render dialog
function renderDialog(title, message = null, buttons, className = null) {
  let container = document.querySelector('.dialog__content');
  let heading = container.querySelector('h2');
  let footer = container.querySelector('.dialog__footer');

  window.removeEventListener('load', dialogHandler);
  window.removeEventListener('resize', dialogHandler);
  window.removeEventListener('keydown', dialogHandler);
  window.addEventListener('load', dialogHandler);
  window.addEventListener('resize', dialogHandler);
  window.addEventListener('keydown', dialogHandler);

  footer.innerHTML = '';

  // Loop through buttons and set up listener
  for (let button of buttons) {
    let elButton = document.createElement('button');
    elButton.classList.add('btn');
    elButton.textContent = button.text;
    elButton.addEventListener('click', button.callback);

    footer.appendChild(elButton);
  }

  heading.textContent = title;
  container.prepend(heading);

  if (className) {
    container.className = 'dialog__content';
    container.classList.add(className);
  }

  // Render message if set
  if (message) {
    let elMessage;

    if (!document.querySelector('.dialog__message')) {
      elMessage = document.createElement('p');
      elMessage.className = 'dialog__message';
      container.insertBefore(elMessage, container.querySelector('h2').nextSibling);
    }

    elMessage = document.querySelector('.dialog__message');
    elMessage.innerHTML = message;
  }

  document.querySelector('.dialog').style.display = 'flex';
}
