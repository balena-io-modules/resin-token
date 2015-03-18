path = require('path')
_ = require('lodash')
chai = require('chai')
expect = chai.expect
settings = require('../lib/settings')

describe 'Settings:', ->

	describe '.storage', ->

		it 'should be a string', ->
			expect(_.isString(settings.storage)).to.be.true

		it 'should be an absolute path', ->
			isAbsolute = settings.storage is path.resolve(settings.storage)
			expect(isAbsolute).to.be.true

	describe '.key', ->

		it 'should be a string', ->
			expect(_.isString(settings.key)).to.be.true
