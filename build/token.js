var atob, errors, settings, storage, _;

_ = require('lodash');

atob = require('atob');

errors = require('resin-errors');

settings = require('./settings');

storage = require('./storage');

exports.set = function(token) {
  if (token == null) {
    throw new errors.ResinMissingParameter('token');
  }
  if (!_.isString(token)) {
    throw new errors.ResinInvalidParameter('token', token, 'not a string');
  }
  token = token.trim();
  if (_.isEmpty(token)) {
    throw new errors.ResinInvalidParameter('token', token, 'empty string');
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

exports.parse = function(token) {
  var data, header, signature, _ref;
  if (token == null) {
    throw new errors.ResinMissingParameter('token');
  }
  if (!_.isString(token)) {
    throw new errors.ResinInvalidParameter('token', token, 'not a string');
  }
  token = token.trim();
  if (_.isEmpty(token)) {
    throw new errors.ResinInvalidParameter('token', token, 'empty string');
  }
  try {
    _ref = token.split('.'), header = _ref[0], data = _ref[1], signature = _ref[2];
    return JSON.parse(atob(data));
  } catch (_error) {
    throw new errors.ResinMalformedToken(token);
  }
};

exports.getUsername = function() {
  var token, tokenData;
  if (!exports.has()) {
    return;
  }
  token = exports.get();
  tokenData = exports.parse(token);
  return tokenData.username;
};
