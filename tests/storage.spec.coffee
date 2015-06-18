m = require('mochainon')
storage = require('../lib/storage')

describe 'Storage:', ->

	it 'should expose a function called getItem()', ->
		m.chai.expect(storage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called setItem()', ->
		m.chai.expect(storage.getItem).to.be.an.instanceof(Function)

	it 'should expose a function called removeItem()', ->
		m.chai.expect(storage.getItem).to.be.an.instanceof(Function)
