
/*
Copyright 2016 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

/**
 * @module token
 */
var Promise, TOKEN_KEY, errors, getStorage, getToken, jwtDecode, url;

Promise = require('bluebird');

jwtDecode = require('jwt-decode');

url = require('url');

errors = require('resin-errors');

getStorage = require('resin-settings-storage');

TOKEN_KEY = 'token';

module.exports = getToken = function(arg) {
  var dataDirectory, exports, getPropertyFactory, ref, storage;
  dataDirectory = (ref = (arg != null ? arg : {}).dataDirectory) != null ? ref : null;
  storage = getStorage({
    dataDirectory: dataDirectory
  });
  exports = {};

  /**
  	 * @summary Check if a token is valid
  	 * @function
  	 * @public
  	 *
  	 * @param {String} token - token
  	 * @returns {Promise<Boolean>} is valid
  	 *
  	 * @example
  	 * token.isValid('...').then (isValid) ->
  	 * 	if isValid
  	 * 		console.log('The token is valid!')
   */
  exports.isValid = function(token) {
    return exports.parse(token)["return"](true)["catch"](errors.ResinMalformedToken, function() {
      return false;
    });
  };

  /**
  	 * @summary Set the token
  	 * @function
  	 * @public
  	 *
  	 * @param {String} token - token
  	 * @returns {Promise<String>} token
  	 *
  	 * @example
  	 * token.set('...')
   */
  exports.set = function(token) {
    return exports.isValid(token).then(function(isValid) {
      if (!isValid) {
        throw new Error('The token is invalid');
      }
      return storage.set(TOKEN_KEY, token.trim());
    });
  };

  /**
  	 * @summary Get the token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolved to undefined if no token.
  	 *
  	 * @returns {Promise<String>} token
  	 *
  	 * @example
  	 * token.get().then (sessionToken) ->
  	 *		console.log(sessionToken)
   */
  exports.get = function() {
    return storage.get(TOKEN_KEY);
  };

  /**
  	 * @summary Has a token
  	 * @function
  	 * @public
  	 *
  	 * @returns {Promise<Boolean>} has token
  	 *
  	 * @example
  	 * token.has().then (hasToken) ->
  	 *		if hasToken
  	 *			console.log('There is a token!')
  	 *		else
  	 *			console.log('There is not a token!')
   */
  exports.has = function() {
    return storage.has(TOKEN_KEY);
  };

  /**
  	 * @summary Remove the token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This promise is not rejected if there was no token at the time of removal.
  	 *
  	 * @returns {Promise}
  	 *
  	 * @example
  	 * token.remove()
   */
  exports.remove = function() {
    return storage.remove(TOKEN_KEY);
  };

  /**
  	 * @summary Parse a token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function does't save the token. Use `token.set()` if you want to persist it afterwards.
  	 *
  	 * @param {String} token - token
  	 * @returns {Promise<Object>} parsed token
  	 *
  	 * @example
  	 * token.parse('...').then (parsedToken) ->
  	 *		console.log(parsedToken)
   */
  exports.parse = function(token) {
    return Promise["try"](function() {
      return jwtDecode(token.trim());
    })["catch"](function() {
      throw new errors.ResinMalformedToken(token);
    });
  };

  /**
  	 * @summary Get the saved token data
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * In this context, "data" refers to the information encoded in the token.
  	 *
  	 * @returns {Promise<Object>} token data
  	 *
  	 * @example
  	 * token.getData().then (data) ->
  	 *		console.log(data)
   */
  exports.getData = function() {
    return exports.has().then(function(hasToken) {
      if (!hasToken) {
        return;
      }
      return exports.get().then(exports.parse);
    });
  };

  /**
  	 * @summary Get a property from a saved token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolves to undefined for any property name if there is no token.
  	 * It also resolved to undefined if the property name is invalid.
  	 *
  	 * @param {String} property - property name
  	 * @returns {Promise<*>} property value
  	 *
  	 * @example
  	 * token.getProperty('username').then (username) ->
  	 *		console.log(username)
   */
  exports.getProperty = function(property) {
    return exports.getData().then(function(data) {
      return data != null ? data[property] : void 0;
    });
  };
  getPropertyFactory = function(propertyName) {
    return function() {
      return exports.getProperty(propertyName);
    };
  };

  /**
  	 * @summary Get the username of the saved token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolves to undefined if there is no token
  	 *
  	 * @returns {Promise<String>} username
  	 *
  	 * @example
  	 * token.getUsername().then (username) ->
  	 *		console.log(username)
   */
  exports.getUsername = getPropertyFactory('username');

  /**
  	 * @summary Get the user id of the saved token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolves to undefined if there is no token
  	 *
  	 * @returns {Promise<Number>} user id
  	 *
  	 * @example
  	 * token.getUserId().then (userId) ->
  	 *		console.log(userId)
   */
  exports.getUserId = getPropertyFactory('id');

  /**
  	 * @summary Get the email of the saved token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolves to undefined if there is no token
  	 *
  	 * @returns {Promise<String>} email
  	 *
  	 * @example
  	 * token.getEmail().then (email) ->
  	 *		console.log(email)
   */
  exports.getEmail = getPropertyFactory('email');

  /**
  	 * @summary Get the age of the saved token
  	 * @function
  	 * @public
  	 *
  	 * @description
  	 * This function resolves to undefined if there is no token
  	 *
  	 * @returns {Promise<Number>} age in milliseconds
  	 *
  	 * @example
  	 * token.getAge().then (age) ->
  	 *		console.log(age)
   */
  exports.getAge = function() {
    return exports.getProperty('iat').then(function(iat) {
      if (iat == null) {
        return;
      }
      return Date.now() - (iat * 1000);
    });
  };
  return exports;
};
