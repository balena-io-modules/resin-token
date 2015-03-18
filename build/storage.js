var LocalStorage, localStorage, settings;

settings = require('./settings');

if (typeof localStorage === "undefined" || localStorage === null) {
  LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage(settings.storage);
}

module.exports = localStorage;
