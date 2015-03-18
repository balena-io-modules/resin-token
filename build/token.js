var settings, storage, _;

_ = require('lodash');

settings = require('./settings');

storage = require('./storage');

exports.set = function(token) {
  if (token == null) {
    throw new Error('Missing token');
  }
  if (!_.isString(token)) {
    throw new Error("Invalid token: not a string: " + token);
  }
  token = token.trim();
  if (_.isEmpty(token)) {
    throw new Error('Invalid token: empty string');
  }
  return storage.setItem(settings.key, token);
};

exports.get = function() {
  return storage.getItem(settings.key) || void 0;
};

exports.has = function() {
  return exports.get() != null;
};

exports.remove = function() {
  return storage.removeItem(settings.key);
};
