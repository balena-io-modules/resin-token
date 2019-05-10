/**
 * @module token
 */
import * as Promise from 'bluebird';
interface ResinTokenOptions {
    dataDirectory?: string;
}
declare class ResinToken {
    private storage;
    constructor({ dataDirectory }?: ResinTokenOptions);
    /**
     * @member parse
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
    parse: (token: any) => Promise<{
        [index: string]: any;
    }>;
    /**
     * @member isValid
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
    isValid: (token: any) => Promise<boolean>;
    /**
     * @member isExpired
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
    isExpired: (token: string) => Promise<boolean>;
    /**
     * @member set
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
    set: (token: any) => Promise<void>;
    /**
     * @member get
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
    get: () => Promise<string | number | object | undefined>;
    /**
     * @member has
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
    has: () => Promise<boolean>;
    /**
     * @member remove
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
    remove: () => Promise<void>;
    /**
     * @member getData
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
    getData: () => Promise<{
        [property: string]: any;
    } | undefined>;
    /**
     * @member getProperty
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
    getProperty: <T>(property: string) => Promise<T | undefined>;
    /**
     * @member getUsername
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
    getUsername: () => Promise<string | undefined>;
    /**
     * @member getUserId
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
    getUserId: () => Promise<string | undefined>;
    /**
     * @member getEmail
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
    getEmail: () => Promise<string | undefined>;
    /**
     * @member getAge
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
    getAge: () => Promise<number | undefined>;
}
declare const getToken: (options: ResinTokenOptions) => ResinToken;
export = getToken;
