import * as jsonwebtoken from 'jsonwebtoken';

const SECRET = '_SECRET_';

const signToken = (data: object, options: object = {}) =>
	jsonwebtoken.sign(data, SECRET, options);

const timeToSec = (timestamp: number) => Math.floor(timestamp / 1000);

const nowInSec = () => timeToSec(Date.now());

const futureInSec = (delaySec: number) =>
	timeToSec(delaySec * 1000 + Date.now());

const johndoeData = {
	id: 1344,
	email: 'johndoe@johndoe.com',
	username: 'johndoe1',
	features: [],
	hasPasswordSet: true,
	iat: 1426783312,
	intercomUserHash:
		'e03778dd29e157445f272acc921170cf2810b62f502645265cc349d6deda3524',
	needsPasswordReset: false,
	permissions: [],
	public_key: false,
	social_service_account: null
};

const expiredData = {
	id: 1344,
	email: 'johndoe+expired@johndoe.com',
	iat: nowInSec(),
	exp: futureInSec(0.9)
};

export default {
	johndoe: {
		token: signToken(johndoeData),
		data: johndoeData
	},
	expired: {
		token: signToken(expiredData),
		data: expiredData
	}
};
