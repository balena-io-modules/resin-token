settings = require('./settings')

unless localStorage?
	LocalStorage = require('node-localstorage').LocalStorage
	localStorage = new LocalStorage(settings.storage)

module.exports = localStorage
