path = require('path')
userHome = require('user-home')

module.exports =

	storage: path.join(userHome, '.resin')

	key: 'token'
