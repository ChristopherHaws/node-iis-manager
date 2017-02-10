require('mocha');
require('chai').should()
import { site } from '../'

describe('site', () => {
	describe('exists', () => {
		it('returns false when a site does not exist', async () => {
			let exists = await site.exists('ThisIsANonexistantWebsiteName');

			exists.should.be.false;
		});

		it('returns true when a site does exist', async () => {
			let exists = await site.exists('Default Web Site');

			exists.should.be.true;
		});
	});
});
