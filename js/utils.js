let _language;

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

// Set language
function setLanguage(language) {
  localStorage.setItem('language', language);
}

// Play a sound file
function playSound(file, volume = 0.25) {
  if (!soundEnabled || localStorage.getItem('soundEnabled') == false) return;
  let audio = new Audio('sound/' + file);
  audio.volume = volume;
  audio.play();
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

// Format time
function formatTime(time) {
  let minutes = parseInt(time / 60, 10);
  let seconds = parseInt(time % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return { minutes: minutes, seconds: seconds };
}

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
