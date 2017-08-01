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

import * as Promise from 'bluebird';
import * as jwtDecode from 'jwt-decode';
import * as errors from 'resin-errors';
import * as getStorage from 'resin-settings-storage';
import { ResinSettingsStorage } from 'resin-settings-storage/lib/types';

const TOKEN_KEY = 'token';

interface ResinTokenOptions {
	dataDirectory?: string;
}

/**
 * The class encapsulating all resin-token-related functionality.
 */
class ResinToken {
	private storage: ResinSettingsStorage;

	constructor(
		{ dataDirectory }: ResinTokenOptions = { dataDirectory: undefined }
	) {
		this.storage = getStorage({ dataDirectory });
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
	public parse(token: any): Promise<object> {
		return Promise.try(() => {
			if (typeof token !== 'string') {
				throw new errors.ResinMalformedToken(token);
			}
			return jwtDecode(token.trim());
		}).catch(() => {
			throw new errors.ResinMalformedToken(token);
		});
	}

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
	public isValid(token: any): Promise<boolean> {
		return this.parse(token)
			.return(true)
			.catch(errors.ResinMalformedToken, () => false);
	}

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
	public isExpired(token: string): Promise<boolean> {
		return this.parse(token)
			.get<number>('exp')
			.then(exp => {
				if (exp == null) {
					return false;
				}

				// exp stands for "expires", and represents a date in seconds
				return Date.now() > exp * 1000;
			});
	}

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
	public set(token: any): Promise<void> {
		return this.isValid(token)
			.then(isTokenValid => {
				if (!isTokenValid) {
					throw new Error('The token is invalid');
				}
			})
			.then(() => this.isExpired(token))
			.then(isTokenExpired => {
				if (isTokenExpired) {
					throw new Error('The token has expired');
				}
				return this.storage.set(TOKEN_KEY, token.trim());
			});
	}

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
	public get() {
		return this.storage.get(TOKEN_KEY);
	}

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
	public has() {
		return this.storage.has(TOKEN_KEY);
	}

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
	public remove() {
		return this.storage.remove(TOKEN_KEY);
	}

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
	public getData(): Promise<{ [property: string]: any } | undefined> {
		return this.get().then(token => {
			if (!token) {
				// TODO: this shouldn't be needed but TS fails with bare `return` here
				return Promise.resolve(undefined);
			}
			return this.parse(token as string);
		});
	}

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
	public getProperty<T>(property: string): Promise<T | undefined> {
		return this.getData().then(
			(data: { [property: string]: T } | undefined) =>
				data != null ? data[property] : undefined
		);
	}

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
	public getUsername() {
		return this.getProperty<string>('username');
	}

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
	public getUserId() {
		return this.getProperty<string>('id');
	}

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
	public getEmail() {
		return this.getProperty<string>('email');
	}

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
	public getAge() {
		return this.getProperty<number>('iat').then(iat => {
			if (iat == null) {
				return;
			}

			// iat stands for "issued at", and represents a date in seconds,
			// but we convert to milliseconds for consistency
			return Date.now() - iat * 1000;
		});
	}
}

const getToken = (options: ResinTokenOptions) => {
	return new ResinToken(options);
};

export = getToken;
