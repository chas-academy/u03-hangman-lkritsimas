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

// Set language
function setLanguage(language) {
  localStorage.setItem('language', language);
}

// Play a sound file
function playSound(file, volume = 0.25) {
  var audio = new Audio('sound/' + file);
  audio.volume = volume;
  audio.play();
}

// Render alphabet buttons
function renderButtons(container, alphabet, click) {
  container.innerHTML = '';

  for (let i = 0; i < alphabet.length; i++) {
    let elItem = document.createElement('li');
    let elButton = document.createElement('button');
    elButton.classList.add('btn');
    elButton.classList.add('btn--letter');
    elButton.value = alphabet[i];
    elButton.textContent = alphabet[i];
    elButton.addEventListener('click', click);

    elItem.appendChild(elButton);
    container.appendChild(elItem);
  }
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
    elButton.addEventListener('click', button.click);

    footer.appendChild(elButton);
  }

  heading.textContent = title;
  container.prepend(heading);

  if (className) container.className = className;

  // Render message if set
  if (message) {
    let elMessage = document.createElement('p');
    elMessage.textContent = message;
    container.appendChild(elMessage);
  }
}
