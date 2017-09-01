import * as Promise from 'bluebird';
import * as m from 'mochainon';
import * as timekeeper from 'timekeeper';
import * as getToken from '../lib/token';
import fixtures from './fixtures/tokens';
const johnDoeFixture = fixtures.johndoe;
const expiredTokenFixture = fixtures.expired;

const IS_BROWSER = typeof window !== 'undefined';

let dataDirectory;
if (!IS_BROWSER) {
	// tslint:disable-next-line no-var-requires
	const settings = require('resin-settings-client');
	dataDirectory = settings.get('dataDirectory');
}

const token = getToken({ dataDirectory });

describe('Token:', () => {
	describe('.isValid()', () => {
		it('should become true if the token is valid', () => {
			return m.chai
				.expect(token.isValid(johnDoeFixture.token))
				.to.eventually.equal(true);
		});

		it('should become false if the token is invalid', () => {
			return m.chai.expect(token.isValid('hello')).to.eventually.equal(false);
		});

		it('should become false if the token is a number', () => {
			return m.chai
				.expect(token.isValid('1234asdf'))
				.to.eventually.equal(false);
		});

		it('should become false if the token is undefined', () => {
			return m.chai.expect(token.isValid(undefined)).to.eventually.equal(false);
		});

		it('should become false if the token is null', () => {
			return m.chai.expect(token.isValid(null)).to.eventually.equal(false);
		});
	});

	describe('.set()', () => {
		describe('given an invalid token', () => {
			beforeEach(() => {
				this.tokenIsValidStub = m.sinon.stub(token, 'isValid');
				this.tokenIsValidStub.returns(Promise.resolve(false));
			});

			afterEach(() => {
				this.tokenIsValidStub.restore();
			});

			it('should reject with an error message', () => {
				return m.chai
					.expect(token.set('asdf'))
					.to.be.rejectedWith('The token is invalid');
			});
		});

		describe('given any token is valid', () => {
			beforeEach(() => {
				this.tokenIsValidStub = m.sinon.stub(token, 'isValid');
				this.tokenIsValidStub.returns(Promise.resolve(true));
				this.tokenIsExpiredStub = m.sinon.stub(token, 'isExpired');
				this.tokenIsExpiredStub.returns(Promise.resolve(false));
			});

			afterEach(() => {
				this.tokenIsValidStub.restore();
				this.tokenIsExpiredStub.restore();
			});

			describe('given no token', () => {
				beforeEach(() => token.remove());

				it('should set the token', () => {
					return m.chai
						.expect(token.get())
						.to.eventually.equal(undefined)
						.then(() => {
							return token
								.set('1234asdf')
								.then(() =>
									m.chai.expect(token.get()).to.eventually.equal('1234asdf')
								);
						});
				});

				it('should trim the token', () => {
					return m.chai
						.expect(token.get())
						.to.eventually.equal(undefined)
						.then(() => {
							return token
								.set('   1234asdf    ')
								.then(() =>
									m.chai.expect(token.get()).to.eventually.equal('1234asdf')
								);
						});
				});
			});

			describe('given a token', () => {
				beforeEach(() => token.set('1234asdf'));

				it('should be able to replace the token', () => {
					return m.chai
						.expect(token.get())
						.to.eventually.equal('1234asdf')
						.then(() => {
							return token
								.set('5678asdf')
								.then(() =>
									m.chai.expect(token.get()).to.eventually.equal('5678asdf')
								);
						});
				});
			});
		});
	});

	describe('given any token is valid', () => {
		beforeEach(() => {
			this.tokenIsValidStub = m.sinon.stub(token, 'isValid');
			this.tokenIsValidStub.returns(Promise.resolve(true));
			this.tokenIsExpiredStub = m.sinon.stub(token, 'isExpired');
			this.tokenIsExpiredStub.returns(Promise.resolve(false));
		});

		afterEach(() => {
			this.tokenIsValidStub.restore();
			this.tokenIsExpiredStub.restore();
		});

		describe('.get()', () => {
			describe('given no token', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai.expect(token.get()).to.eventually.equal(undefined);
				});
			});

			describe('given a token', () => {
				beforeEach(() => token.set('1234asdf'));

				it('should eventually return the token', () => {
					return m.chai.expect(token.get()).to.eventually.equal('1234asdf');
				});
			});
		});

		describe('.has()', () => {
			describe('given no token', () => {
				beforeEach(() => token.remove());

				it('should eventually be false', () => {
					return m.chai.expect(token.has()).to.eventually.equal(false);
				});
			});

			describe('given a token', () => {
				beforeEach(() => token.set('1234asdf'));

				it('should eventually be true', () => {
					return m.chai.expect(token.has()).to.eventually.equal(true);
				});
			});
		});

		describe('.remove()', () =>
			describe('given a token', () => {
				beforeEach(() => token.set('1234asdf'));

				it('should remove the token', () => {
					return m.chai
						.expect(token.has())
						.to.eventually.equal(true)
						.then(() => {
							return token.remove().then(() => {
								return m.chai.expect(token.has()).to.eventually.equal(false);
							});
						});
				});
			}));

		describe('.parse()', () => {
			describe('given a valid token', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
				});

				it('should parse the token', () => {
					return token
						.parse(this.fixture.token)
						.then((result: typeof johnDoeFixture.data) => {
							m.chai.expect(result.email).to.equal(this.fixture.data.email);
							m.chai
								.expect(result.username)
								.to.equal(this.fixture.data.username);
						});
				});
			});

			describe('given an invalid token', () =>
				describe('given a non base64 data', () => {
					beforeEach(() => {
						this.token = '1234asdf.asdf.5678';
					});

					it('should reject the promise with an error message', () => {
						return m.chai
							.expect(token.parse(this.token))
							.to.be.rejectedWith(`Malformed token: ${this.token}`);
					});
				}));
		});

		describe('.getData()', () => {
			describe('given a logged in user', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
					return token.set(this.fixture.token);
				});

				it('should return all the token data', () => {
					return m.chai
						.expect(token.getData())
						.to.eventually.become(this.fixture.data);
				});
			});

			describe('given not logged in user', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai.expect(token.getData()).to.eventually.equal(undefined);
				});
			});
		});

		describe('.getProperty()', () => {
			describe('given a logged in user', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
					return token.set(this.fixture.token);
				});

				describe('given the property exists', () =>
					it('should eventually equal the property', () => {
						return m.chai
							.expect(token.getProperty('username'))
							.to.eventually.equal(this.fixture.data.username);
					}));

				describe('given the property does not exist', () =>
					it('should eventually equal undefined', () => {
						return m.chai
							.expect(token.getProperty('foobarbaz'))
							.to.eventually.equal(undefined);
					}));
			});

			describe('given not logged in user', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai
						.expect(token.getProperty('username'))
						.to.eventually.equal(undefined);
				});
			});
		});

		describe('.getUsername()', () => {
			describe('given a logged in user', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
					return token.set(this.fixture.token);
				});

				it('should eventually be the correct username', () => {
					return m.chai
						.expect(token.getUsername())
						.to.eventually.equal(this.fixture.data.username);
				});
			});

			describe('given not logged in user', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai
						.expect(token.getUsername())
						.to.eventually.equal(undefined);
				});
			});
		});

		describe('.getUserId()', () => {
			describe('given a logged in user', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
					return token.set(this.fixture.token);
				});

				it('should eventually be a number', () => {
					return m.chai.expect(token.getUserId()).to.eventually.be.a('number');
				});

				it('should eventually equal the correct user id', () => {
					return m.chai
						.expect(token.getUserId())
						.to.eventually.equal(this.fixture.data.id);
				});
			});

			describe('given not logged in user', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai
						.expect(token.getUserId())
						.to.eventually.equal(undefined);
				});
			});
		});

		describe('.getEmail()', () => {
			describe('given a logged in user', () => {
				beforeEach(() => {
					this.fixture = johnDoeFixture;
					return token.set(this.fixture.token);
				});

				it('should eventually be a string', () => {
					return m.chai.expect(token.getEmail()).to.eventually.be.a('string');
				});

				it('should eventually equal the correct email', () => {
					return m.chai
						.expect(token.getEmail())
						.to.eventually.equal(this.fixture.data.email);
				});
			});

			describe('given not logged in user', () => {
				beforeEach(() => token.remove());

				it('should eventually be undefined', () => {
					return m.chai.expect(token.getEmail()).to.eventually.equal(undefined);
				});
			});
		});

		describe('.getAge()', () =>
			describe('given a fixed current time', () => {
				beforeEach(() => {
					this.currentTime = 1500000000000;
					timekeeper.freeze(new Date(this.currentTime));
				});

				afterEach(() => timekeeper.reset());

				describe('given the token was just issued', () => {
					beforeEach(() => {
						this.tokenGetDataStub = m.sinon.stub(token, 'getData');
						this.tokenGetDataStub.returns(
							Promise.resolve({
								iat: this.currentTime / 1000
							})
						);
					});

					afterEach(() => {
						this.tokenGetDataStub.restore();
					});

					it('should eventually equal zero', () => {
						return m.chai.expect(token.getAge()).to.eventually.equal(0);
					});
				});

				describe('given the token was issued an hour ago', () => {
					beforeEach(() => {
						this.tokenGetDataStub = m.sinon.stub(token, 'getData');
						this.tokenGetDataStub.returns(
							Promise.resolve({
								iat: this.currentTime / 1000 - 60 * 60
							})
						);
					});

					afterEach(() => {
						this.tokenGetDataStub.restore();
					});

					it('should eventually equal one hour in milliseconds', () => {
						return m.chai
							.expect(token.getAge())
							.to.eventually.equal(1 * 1000 * 60 * 60);
					});
				});

				describe('given no iat property', () => {
					beforeEach(() => {
						this.tokenGetDataStub = m.sinon.stub(token, 'getData');
						this.tokenGetDataStub.returns(
							Promise.resolve({
								iat: undefined
							})
						);
					});

					afterEach(() => {
						this.tokenGetDataStub.restore();
					});

					it('should eventually be undefined', () => {
						return m.chai.expect(token.getAge()).to.eventually.equal(undefined);
					});
				});
			}));
	});

	describe('.isExpired()', function() {
		this.timeout(5000);
		const expiredToken = expiredTokenFixture.token;

		it('should be true after a delay', done => {
			m.chai
				.expect(token.isExpired(expiredToken))
				.to.eventually.equal(false)
				.notify(() =>
					setTimeout(() => {
						m.chai
							.expect(token.isExpired(expiredToken))
							.to.eventually.equal(true)
							.notify(done);
					}, 1000)
				);
		});

		it('should be taken into account when trying to set the expired token', done =>
			setTimeout(() => {
				m.chai
					.expect(token.set(expiredToken))
					.to.be.rejectedWith('The token has expired')
					.notify(done);
			}, 1000));
	});
});
