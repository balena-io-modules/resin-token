_ = require('lodash')
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
