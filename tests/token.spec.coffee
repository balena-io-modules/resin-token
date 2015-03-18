chai = require('chai')
expect = chai.expect
token = require('../lib/token')

describe 'Token:', ->

	describe '.set()', ->

		it 'should throw if no token', ->
			expect ->
				token.set()
			.to.throw('Missing token')

		it 'should throw if token is not a string', ->
			expect ->
				token.set(123)
			.to.throw('Invalid token: not a string: 123')

		it 'should throw if token is an empty string', ->
			expect ->
				token.set('')
			.to.throw('Invalid token: empty string')

		it 'should throw if token is a string containing spaces', ->
			expect ->
				token.set('    ')
			.to.throw('Invalid token: empty string')

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
