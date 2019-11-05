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
