require('mocha');
require('chai').should();
import * as uuid from 'uuid';
import {Mock, It, Times} from 'moq.ts';
import { sites, SiteManager, SiteOptions, CommandExecutor, CommandResponse } from '../';

describe('site', () => {
	// it('foo', async () => {
	// 	let mockCommandExecutor = new Mock<CommandExecutor>()
	// 		.setup(x => x.execute(''))
	// 		.returns({
	// 			exitCode: 0,
	// 			stdout: '',
	// 			stderr: ''
	// 		} as CommandResponse);

	// 	let foo = new SiteManager();
	// });

	it('can be retrieved after being created', async () => {
		let siteName = uuid();

		try {
			await sites.add({
				name: siteName,
				protocol: 'http',
				host: siteName,
				port: 80,
				path: 'C:\\inetpub\\wwwroot'
			} as SiteOptions);

			let site = await sites.get(siteName);

			site.name.should.equal(siteName);
			site.bindings.should.equal(`http/*:80:${siteName}`);
		} finally {
			if (await sites.exists(siteName)) {
				await sites.remove(siteName);
			}
		}
	});
});
