require('mocha');
require('chai').should()
import { sites } from '../'

describe('site', () => {
	describe('exists', () => {
		it('returns false when a site does not exist', async () => {
			let exists = await sites.exists('ThisIsANonexistantWebsiteName');

			exists.should.be.false;
		});

		it('returns true when a site does exist', async () => {
			let exists = await sites.exists('Default Web Site');

			exists.should.be.true;
		});
	});
});
