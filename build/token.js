"use strict";
/*
Copyright 2016-17 Resin.io

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
var Promise = require("bluebird");
var jwtDecode = require("jwt-decode");
var errors = require("resin-errors");
var getStorage = require("resin-settings-storage");
var TOKEN_KEY = 'token';
/**
 * The class encapsulating all resin-token-related functionality.
 */
var ResinToken = (function () {
    function ResinToken(_a) {
        var dataDirectory = (_a === void 0 ? { dataDirectory: undefined } : _a).dataDirectory;
        this.storage = getStorage({ dataDirectory: dataDirectory });
    }
    /**
     * @summary Parse a token
     * @function
     * @public
     *
     * @description
     * This function does't save the token. Use `token.set()` if you want to persist it afterwards.
     * The returned promise is rejected if the token is invalid.
     *
     * @param {String} token - token
     * @returns {Promise<Object>} parsed token
     *
     * @example
     * token.parse('...').then((parsedTokenData) => {
     * 	console.log(parsedTokenData);
     * });
     */
    ResinToken.prototype.parse = function (token) {
        return Promise.try(function () {
            if (typeof token !== 'string') {
                throw new errors.ResinMalformedToken(token);
            }
            return jwtDecode(token.trim());
        }).catch(function () {
            throw new errors.ResinMalformedToken(token);
        });
    };
    /**
     * @summary Check if a token is valid
     * @function
     * @public
     *
     * @param {String} token - token
     * @returns {Promise<Boolean>} is valid
     *
     * @example
     * token.isValid('...').then((isValid) => {
     * 	if (isValid) {
     * 		console.log('The token is valid!');
     * 	}
     * });
     */
    ResinToken.prototype.isValid = function (token) {
        return this.parse(token)
            .return(true)
            .catch(errors.ResinMalformedToken, function () { return false; });
    };
    /**
     * @summary Check if the given token has expired
     * @function
     * @public
     *
     * @returns {Promise<boolean>}
     *
     * @example
     * token.isExpired(jwtToken).then((isExpired) => {
     * 	console.log(isExpired);
     * });
     */
    ResinToken.prototype.isExpired = function (token) {
        return this.parse(token)
            .get('exp')
            .then(function (exp) {
            if (exp == null) {
                return false;
            }
            // exp stands for "expires", and represents a date in seconds
            return Date.now() > exp * 1000;
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
     * token.set('...');
     */
    ResinToken.prototype.set = function (token) {
        var _this = this;
        return this.isValid(token)
            .then(function (isTokenValid) {
            if (!isTokenValid) {
                throw new Error('The token is invalid');
            }
        })
            .then(function () { return _this.isExpired(token); })
            .then(function (isTokenExpired) {
            if (isTokenExpired) {
                throw new Error('The token has expired');
            }
            return _this.storage.set(TOKEN_KEY, token.trim());
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
     * token.get().then((sessionToken) => {
     * 	console.log(sessionToken);
     * });
     */
    ResinToken.prototype.get = function () {
        return this.storage.get(TOKEN_KEY);
    };
    /**
     * @summary Has a token
     * @function
     * @public
     *
     * @returns {Promise<Boolean>} has token
     *
     * @example
     * token.has().then((hasToken) => {
     * 	if (hasToken) {
     * 		console.log('There is a token!');
     * 	} else {
     * 		console.log('There is not a token!');
     * 	}
     * });
     */
    ResinToken.prototype.has = function () {
        return this.storage.has(TOKEN_KEY);
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
     * token.remove();
     */
    ResinToken.prototype.remove = function () {
        return this.storage.remove(TOKEN_KEY);
    };
    /**
     * @summary Get the data encoded in the saved token
     * @function
     * @public
     *
     * @description
     * It will resolve to `undefined` if there's no saved token
     *
     * @returns {Promise<Object>} token data
     *
     * @example
     * token.getData().then((parsedTokenData) => {
     * 	console.log(parsedTokenData);
     * });
     */
    ResinToken.prototype.getData = function () {
        var _this = this;
        return this.get().then(function (token) {
            if (!token) {
                // TODO: this shouldn't be needed but TS fails with bare `return` here
                return Promise.resolve(undefined);
            }
            return _this.parse(token);
        });
    };
    /**
     * @summary Get a property from a saved token
     * @function
     * @public
     *
     * @description
     * This function resolves to `undefined` for any property name if there is no token.
     * It also resolved to `undefined` if the property name is invalid.
     *
     * @param {String} property - property name
     * @returns {Promise<*>} property value
     *
     * @example
     * token.getProperty('username').then((username) => {
     * 	console.log(username);
     * });
     */
    ResinToken.prototype.getProperty = function (property) {
        return this.getData().then(function (data) {
            return data != null ? data[property] : undefined;
        });
    };
    /**
     * @summary Get the username of the saved token
     * @function
     * @public
     *
     * @description
     * This function resolves to `undefined` if there is no token
     *
     * @returns {Promise<String>} username
     *
     * @example
     * token.getUsername().then((username) => {
     * 	console.log(username);
     * });
     */
    ResinToken.prototype.getUsername = function () {
        return this.getProperty('username');
    };
    /**
     * @summary Get the user id of the saved token
     * @function
     * @public
     *
     * @description
     * This function resolves to `undefined` if there is no token
     *
     * @returns {Promise<Number>} user id
     *
     * @example
     * token.getUserId().then((userId) => {
     * 	console.log(userId);
     * });
     */
    ResinToken.prototype.getUserId = function () {
        return this.getProperty('id');
    };
    /**
     * @summary Get the email of the saved token
     * @function
     * @public
     *
     * @description
     * This function resolves to `undefined` if there is no token
     *
     * @returns {Promise<String>} email
     *
     * @example
     * token.getEmail().then((email) =>
     * 	console.log(email);
     * });
     */
    ResinToken.prototype.getEmail = function () {
        return this.getProperty('email');
    };
    /**
     * @summary Get the age of the saved token
     * @function
     * @public
     *
     * @description
     * This function resolves to `undefined` if there is no token
     *
     * @returns {Promise<Number>} age in milliseconds
     *
     * @example
     * token.getAge().then((age) => {
     * 	console.log(age);
     * });
     */
    ResinToken.prototype.getAge = function () {
        return this.getProperty('iat').then(function (iat) {
            if (iat == null) {
                return;
            }
            // iat stands for "issued at", and represents a date in seconds,
            // but we convert to milliseconds for consistency
            return Date.now() - iat * 1000;
        });
    };
    return ResinToken;
}());
var getToken = function (options) {
    return new ResinToken(options);
};
module.exports = getToken;
//# sourceMappingURL=token.js.map