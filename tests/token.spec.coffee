Promise = require('bluebird')
m = require('mochainon')
nock = require('nock')
settings = require('resin-settings-client')
token = require('../lib/token')
johnDoeFixture = require('./fixtures/tokens.json').johndoe

describe 'Token:', ->

	describe '.isValid()', ->

		it 'should become true if the token is valid', ->
			m.chai.expect(token.isValid(johnDoeFixture.token)).to.eventually.be.true

		it 'should become false if the token is invalid',  ->
			m.chai.expect(token.isValid('hello')).to.eventually.be.false

	describe '.set()', ->

		describe 'given an invalid token', ->

			beforeEach ->
				@tokenIsValidStub = m.sinon.stub(token, 'isValid')
				@tokenIsValidStub.returns(Promise.resolve(false))

			afterEach ->
				@tokenIsValidStub.restore()

			it 'should reject with an error message', ->
				m.chai.expect(token.set('asdf')).to.be.rejectedWith('The token is invalid')

		describe 'given any token is valid', ->

			beforeEach ->
				@tokenIsValidStub = m.sinon.stub(token, 'isValid')
				@tokenIsValidStub.returns(Promise.resolve(true))

			afterEach ->
				@tokenIsValidStub.restore()

			describe 'given no token', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should set the token', (done) ->
					m.chai.expect(token.get()).to.eventually.be.undefined
					token.set('1234').then ->
						m.chai.expect(token.get()).to.eventually.equal('1234')
						done()

				it 'should trim the token', (done) ->
					m.chai.expect(token.get()).to.eventually.be.undefined
					token.set('   1234    ').then ->
						m.chai.expect(token.get()).to.eventually.equal('1234')
						done()

			describe 'given a token', ->

				beforeEach (done) ->
					token.set('1234').then(done)

				it 'should be able to replace the token', (done) ->
					m.chai.expect(token.get()).to.eventually.equal('1234')
					token.set('5678').then ->
						m.chai.expect(token.get()).to.eventually.equal('5678')
						done()

	describe 'given any token is valid', ->

		beforeEach ->
			@tokenIsValidStub = m.sinon.stub(token, 'isValid')
			@tokenIsValidStub.returns(Promise.resolve(true))

		afterEach ->
			@tokenIsValidStub.restore()

		describe '.get()', ->

			describe 'given no token', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should eventually be undefined', ->
					m.chai.expect(token.get()).to.eventually.be.undefined

			describe 'given a token', ->

				beforeEach (done) ->
					token.set('1234').then(done)

				it 'should eventually return the token', ->
					m.chai.expect(token.get()).to.eventually.equal('1234')

		describe '.has()', ->

			describe 'given no token', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should eventually be false', ->
					m.chai.expect(token.has()).to.eventually.be.false

			describe 'given a token', ->

				beforeEach (done) ->
					token.set('1234').then(done)

				it 'should eventually be true', ->
					m.chai.expect(token.has()).to.eventually.be.true

		describe '.remove()', ->

			describe 'given a token', ->

				beforeEach (done) ->
					token.set('1234').then(done)

				it 'should remove the token', (done) ->
					m.chai.expect(token.has()).to.eventually.be.true
					token.remove().then ->
						m.chai.expect(token.has()).to.eventually.be.false
						done()

		describe '.parse()', ->

			describe 'given a valid token', ->

				beforeEach ->
					@fixture = johnDoeFixture

				it 'should parse the token', (done) ->
					token.parse(@fixture.token).then (result) =>
						m.chai.expect(result.email).to.equal(@fixture.data.email)
						m.chai.expect(result.username).to.equal(@fixture.data.username)
						done()

			describe 'given an invalid token', ->

				describe 'given a non base64 data', ->

					beforeEach ->
						@token = '1234.asdf.5678'

					it 'should reject the promise with an error message', ->
						m.chai.expect(token.parse(@token)).to.be.rejectedWith("Malformed token: #{@token}")

		describe '.getProperty()', ->

			describe 'given a logged in user', ->

				beforeEach (done) ->
					@fixture = johnDoeFixture
					token.set(@fixture.token).then(done)

				describe 'given the property exists', ->

					it 'should eventually equal the property', ->
						m.chai.expect(token.getProperty('username')).to.eventually.equal(@fixture.data.username)

				describe 'given the property does not exist', ->

					it 'should eventually equal undefined', ->
						m.chai.expect(token.getProperty('foobarbaz')).to.eventually.be.undefined

			describe 'given not logged in user', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should eventually be undefined', ->
					m.chai.expect(token.getProperty('username')).to.eventually.be.undefined

		describe '.getUsername()', ->

			describe 'given a logged in user', ->

				beforeEach (done) ->
					@fixture = johnDoeFixture
					token.set(@fixture.token).then(done)

				it 'should eventually be the correct username', ->
					m.chai.expect(token.getUsername()).to.eventually.equal(@fixture.data.username)

			describe 'given not logged in user', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should eventually be undefined', ->
					m.chai.expect(token.getUsername()).to.eventually.be.undefined

		describe '.getUserId()', ->

			describe 'given a logged in user', ->

				beforeEach (done) ->
					@fixture = johnDoeFixture
					token.set(@fixture.token).then(done)

				it 'should eventually be a number', ->
					m.chai.expect(token.getUserId()).to.eventually.be.a('number')

				it 'should eventually equal the correct user id', ->
					m.chai.expect(token.getUserId()).to.eventually.equal(@fixture.data.id)

			describe 'given not logged in user', ->

				beforeEach (done) ->
					token.remove().then(done)

				it 'should eventually be undefined', ->
					m.chai.expect(token.getUserId()).to.eventually.be.undefined
