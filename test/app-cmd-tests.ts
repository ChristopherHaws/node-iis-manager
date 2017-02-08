require('mocha');
require('should');

describe('Five', () => {
	it('should be equal to 5', () => {
		(5).should.be.exactly(5).and.be.a.Number();
	});
});
