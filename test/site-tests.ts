require('mocha');
require('should');
import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { Sites } from '../'

describe('Sites', async () => {
	let sites = await Sites.list();

	it('should be equal to 5', () => {
		sites.should.containEql({
			name: 'Default Web Site'
		})
	});
});
