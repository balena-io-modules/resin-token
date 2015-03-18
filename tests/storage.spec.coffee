chai = require('chai')
expect = chai.expect
storage = require('../lib/storage')

describe 'Storage:', ->

	it 'should expose a function called getItem()', ->
		expect(storage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called setItem()', ->
		expect(storage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called removeItem()', ->
		expect(storage.getItem).to.be.an.instanceof(Function)
