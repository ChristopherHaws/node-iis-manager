require('mocha');
require('chai').should();
import { sites, SiteOptions } from '../';

describe('site', () => {
	it('can be retrieved after being created', async () => {
		let exists = await sites.exists('TestSite');
		if (exists) {
			await sites.remove('TestSite');
		}

		await sites.add({
			name: 'TestSite',
			protocol: 'http',
			host: 'testsiteurl',
			port: 12345,
			path: 'C:\\inetpub\\wwwroot'
		} as SiteOptions);

		let site = await sites.get('TestSite');

		site.name.should.equal('TestSite');
		site.bindings.should.equal('http/*:12345:testsiteurl');
	});
});
