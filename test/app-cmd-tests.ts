require('mocha');
require('should');
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

describe('Five', () => {
	it('should be equal to 5', () => {
		(5).should.be.exactly(5).and.be.a.Number();
	});
});

@suite("Six")
class Six {
    @test("should be equal to 6")
	equals_six() {
		(6).should.be.exactly(6).and.be.a.Number();
	}
}

@suite
class Seven {
	@test
	'should be equal to 7'() {
		(7).should.be.exactly(7).and.be.a.Number();
	}
}
