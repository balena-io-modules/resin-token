chai = require('chai')
expect = chai.expect
token = require('../lib/token')
johnDoeFixture = require('./tokens.json').johndoe

describe 'Token:', ->

	describe '.set()', ->

		it 'should throw if no token', ->
			expect ->
				token.set()
			.to.throw('Missing parameter: token')

		it 'should throw if token is not a string', ->
			expect ->
				token.set(123)
			.to.throw('Invalid parameter token: 123. not a string.')

		it 'should throw if token is an empty string', ->
			expect ->
				token.set('')
			.to.throw('Invalid parameter token: . empty string')

		it 'should throw if token is a string containing spaces', ->
			expect ->
				token.set('    ')
			.to.throw('Invalid parameter token: . empty string')

		describe 'given no token', ->

			beforeEach ->
				token.remove()

			it 'should set the token', ->
				expect(token.has()).to.be.false
				token.set('1234')
				expect(token.get()).to.equal('1234')

			it 'should trim the token', ->
				expect(token.has()).to.be.false
				token.set('   1234    ')
				expect(token.get()).to.equal('1234')

		describe 'given a token', ->

			beforeEach ->
				token.set('1234')

			it 'should be able to replace the token', ->
				expect(token.get()).to.equal('1234')
				token.set('5678')
				expect(token.get()).to.equal('5678')

	describe '.get()', ->

		describe 'given no token', ->

			beforeEach ->
				token.remove()

			it 'should return undefined', ->
				expect(token.get()).to.be.undefined

		describe 'given a token', ->

			beforeEach ->
				token.set('1234')

			it 'should return that token', ->
				expect(token.get()).to.equal('1234')

	describe '.has()', ->

		describe 'given no token', ->

			beforeEach ->
				token.remove()

			it 'should return false', ->
				expect(token.has()).to.be.false

		describe 'given a token', ->

			beforeEach ->
				token.set('1234')

			it 'should return true', ->
				expect(token.has()).to.be.true

	describe '.remove()', ->

		describe 'given a token', ->

			beforeEach ->
				token.set('1234')

			it 'should remove the token', ->
				expect(token.has()).to.be.true
				token.remove()
				expect(token.has()).to.be.false

	describe '.parse()', ->

		it 'should throw if no token', ->
			expect ->
				token.parse()
			.to.throw('Missing parameter: token')

		it 'should throw if token is not a string', ->
			expect ->
				token.parse(123)
			.to.throw('Invalid parameter token: 123. not a string.')

		it 'should throw if token is an empty string', ->
			expect ->
				token.parse('')
			.to.throw('Invalid parameter token: . empty string')

		it 'should throw if token is a string containing spaces', ->
			expect ->
				token.parse('    ')
			.to.throw('Invalid parameter token: . empty string')

		describe 'given a valid token', ->

			beforeEach ->
				@fixture = johnDoeFixture

			it 'should parse the token', ->
				result = token.parse(johnDoeFixture.token)
				expect(result.email).to.equal(johnDoeFixture.data.email)
				expect(result.username).to.equal(johnDoeFixture.data.username)

		describe 'given an invalid token', ->

			describe 'given a non base64 data', ->

				beforeEach ->
					@token = '1234.asdf.5678'

				it 'should throw an error', ->
					expect =>
						token.parse(@token)
					.to.throw("Malformed token: #{@token}")

			describe 'given a token without three sections separated by a colon', ->

				beforeEach ->
					@token = '1234'

				it 'should throw an error', ->
					expect =>
						token.parse(@token)
					.to.throw("Malformed token: #{@token}")

	describe '.getUsername()', ->

		describe 'given a logged in user', ->

			beforeEach ->
				token.set(johnDoeFixture.token)

			it 'should return the correct username', ->
				username = token.getUsername()
				expect(username).to.equal(johnDoeFixture.data.username)

		describe 'given not logged in user', ->

			beforeEach ->
				token.remove()

			it 'should return undefined', ->
				expect(token.getUsername()).to.be.undefined

	describe '.getUserId()', ->

		describe 'given a logged in user', ->

			beforeEach ->
				token.set(johnDoeFixture.token)

			it 'should return a number', ->
				userId = token.getUserId()
				expect(userId).to.be.a('number')

			it 'should return the correct user id', ->
				userId = token.getUserId()
				expect(userId).to.equal(johnDoeFixture.data.id)

		describe 'given not logged in user', ->

			beforeEach ->
				token.remove()

			it 'should return undefined', ->
				expect(token.getUserId()).to.be.undefined
