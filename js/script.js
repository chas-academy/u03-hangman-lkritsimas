let languages = ['en', 'sv'];
let dialogButtons = document.querySelectorAll('.dialog__footer button');

getLanguage();

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
    }

    button.addEventListener('click', function() {
      setLanguage(language);
      getLanguage();
      translate();
    });

    elLanguage.querySelector('ul').appendChild(button);
  });

  dialogButtons.forEach(button => {
    button.textContent = _language[button.value];
  });
})();
