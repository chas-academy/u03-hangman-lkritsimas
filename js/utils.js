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

// Renders an image on canvas
function renderImage(ctx, file) {
  var img = new Image();

  img.onload = function() {
    img.width = 400;
    img.height = 400;
    ctx.drawImage(img, 0, 0);
  };
  img.src = file;
}

// Set language
function setLanguage(language) {
  localStorage.setItem('language', language);
}

// Play a sound file
function playSound(file, volume = 0.25) {
  if (!sound || localStorage.getItem('sound') == false) return;
  var audio = new Audio('sound/' + file);
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

    elItem.appendChild(elButton);
    container.appendChild(elItem);
  }

  window.removeEventListener('keyup', callback);
  window.addEventListener('keyup', callback);
}

// Format time
function formatTime(time) {
  var minutes = parseInt(time / 60, 10);
  var seconds = parseInt(time % 60, 10);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return { minutes: minutes, seconds: seconds };
}

// Render dialog
function renderDialog(title, message = null, buttons, className = null) {
  let container = document.querySelector('.dialog__content');
  let heading = container.querySelector('h2');

  let footer = container.querySelector('.dialog__footer');
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
    container.classList.remove(className);
    container.classList.add(className);
  }
  // Render message if set
  if (message) {
    let elMessage = document.createElement('p');
    elMessage.innerHTML = message;
    container.appendChild(elMessage);
  }

  document.querySelector('.dialog').style.display = 'flex';
}
