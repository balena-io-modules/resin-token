jsonwebtoken = require('jsonwebtoken')

SECRET = '_SECRET_'

signToken = (data, options = {}) ->
	jsonwebtoken.sign(data, SECRET, options)

timeToSec = (timestamp) -> Math.floor(timestamp / 1000)

nowInSec = -> timeToSec(Date.now())

futureInSec = (delaySec) -> timeToSec(delaySec * 1000 + Date.now())

johndoeData =
	id: 1344
	email: 'johndoe@johndoe.com'
	username: 'johndoe1'
	features: []
	hasPasswordSet: true
	iat: 1426783312
	intercomUserHash: 'e03778dd29e157445f272acc921170cf2810b62f502645265cc349d6deda3524'
	needsPasswordReset: false
	permissions: []
	public_key: false
	social_service_account: null

expiredData = {
	id: 1344
	email: 'johndoe+expired@johndoe.com'
	iat: nowInSec()
	exp: futureInSec(0.9)
}

module.exports = {
	johndoe: {
		token: signToken(johndoeData),
		data: johndoeData
	},
	expired: {
		token: signToken(expiredData),
		data: expiredData
	}
}
