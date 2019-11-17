// Main render
function render() {
  // Get formatted time object
  let formattedTime = formatTime(_time);
  let currentTime = `${formattedTime.minutes} : ${formattedTime.seconds}`;

  // End game if time or guesses have run out
  if (_time <= 0 || guesses === 0) end();

  // Clear figure if game is reset
  if (guesses === 6) elFigure.innerHTML = '';

  // Change fill style to red when time remaining is 10 seconds or less
  if (_time > 0 && _time <= 10) {
    elTimer.classList.add('text-red');

    // Play tick tock sound
    if (_elapsed !== previousSecond) {
      playSound(previousSecond % 2 ? sounds.tick : sounds.tock);
    }
  }

  previousSecond = _elapsed;
  elTimer.innerText = currentTime;
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
  // Current score - based on amount of correct characters
  let score = 0;
  // Get computed style for current word
  let elWordComputedStyle = getComputedStyle(elWord);
  // Parse integer to get rid of "px"
  let fontSize = parseInt(elWordComputedStyle.fontSize);
  // Split words by whitespace
  let splitWords = selectedWord.split(' ');

  elWord.innerHTML = '';

  // Loop through words
  splitWords.forEach(function(word, indexWord, words) {
    // Container for separate words
    let elWordWrapper = document.createElement('span');
    elWordWrapper.innerHTML = '';
    elWordWrapper.className = 'selectedword__word';

    // Loop through letters in current split word
    for (let indexLetter = 0; indexLetter < word.length; indexLetter++) {
      let letter = word[indexLetter];
      let elLetter = document.createElement('span');
      elLetter.className = 'selectedword__letter';

      // Render underscores or correctly guessed letter
      if (guessedLetters.length > 0 && guessedLetters.indexOf(letter) !== -1) {
        score++;
        elLetter.innerHTML += '<span class="selectedword__underline">' + letter + '</span>';
        elLetter.innerHTML += '_';
      } else {
        elLetter.innerHTML += '_';
      }
      elWordWrapper.appendChild(elLetter);
    }

    // Current word as underscores
    let underscoreWord = word.replace(/./gi, '_');
    // Measure word width in pixels
    let wordWidth = measureTextWidth(underscoreWord, elWordComputedStyle.fontFamily, fontSize);
    let padding = 0;

    if (indexWord !== words.length - 1) {
      // Add score to compensate for each whitespace character
      score++;

      // Apply padding if word is within bounds of container
      if (elMain.clientWidth > wordWidth) {
        padding = measureTextWidth('_', elWordComputedStyle.fontFamily, fontSize);
        wordWidth += padding;
        elWordWrapper.style.marginRight = `${padding}px`;
      }
    }

    // Decrease font size as long as word is wider than container
    while (elMain.clientWidth < wordWidth) {
      if (minFontSize && fontSize <= minFontSize) {
        break;
      }

      fontSize--;
      wordWidth = measureTextWidth(underscoreWord, elWordComputedStyle.fontFamily, fontSize, padding);
      elWordWrapper.style.fontSize = `${fontSize}px`;
    }

    elWord.appendChild(elWordWrapper);
  });

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

  // Loop through alphabet and create buttons
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
