_ = require('lodash')
atob = require('atob')
settings = require('./settings')
storage = require('./storage')

exports.set = (token) ->

	if not token?
		throw new Error('Missing token')

	if not _.isString(token)
		throw new Error("Invalid token: not a string: #{token}")

	token = token.trim()

	if _.isEmpty(token)
		throw new Error('Invalid token: empty string')

	storage.setItem(settings.key, token)

exports.get = ->
	return storage.getItem(settings.key) or undefined

exports.has = ->
	return exports.get()?

exports.remove = ->
	storage.removeItem(settings.key)

exports.parse = (token) ->

	if not token?
		throw new Error('Missing token')

	if not _.isString(token)
		throw new Error("Invalid token: not a string: #{token}")

	token = token.trim()

	if _.isEmpty(token)
		throw new Error('Invalid token: empty string')

	try
		[ header, data, signature ] = token.split('.')
		return JSON.parse(atob(data))
	catch
		throw new Error("Invalid token: #{token}")

exports.getUsername = ->
	return if not exports.has()
	token = exports.get()
	tokenData = exports.parse(token)
	return tokenData.username
