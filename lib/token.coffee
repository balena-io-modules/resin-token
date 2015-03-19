_ = require('lodash')
atob = require('atob')
errors = require('resin-errors')
settings = require('./settings')
storage = require('./storage')

exports.set = (token) ->

	if not token?
		throw new errors.ResinMissingParameter('token')

	if not _.isString(token)
		throw new errors.ResinInvalidParameter('token', token, 'not a string')

	token = token.trim()

	if _.isEmpty(token)
		throw new errors.ResinInvalidParameter('token', token, 'empty string')

	storage.setItem(settings.key, token)

exports.get = ->
	return storage.getItem(settings.key) or undefined

exports.has = ->
	return exports.get()?

exports.remove = ->
	storage.removeItem(settings.key)

exports.parse = (token) ->

	if not token?
		throw new errors.ResinMissingParameter('token')

	if not _.isString(token)
		throw new errors.ResinInvalidParameter('token', token, 'not a string')

	token = token.trim()

	if _.isEmpty(token)
		throw new errors.ResinInvalidParameter('token', token, 'empty string')

	try
		[ header, data, signature ] = token.split('.')
		return JSON.parse(atob(data))
	catch
		throw new errors.ResinMalformedToken(token)

exports.getUsername = ->
	return if not exports.has()
	token = exports.get()
	tokenData = exports.parse(token)
	return tokenData.username
