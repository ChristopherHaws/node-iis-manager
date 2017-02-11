require('mocha');
require('chai').should();
import * as uuid from 'uuid';
import { sites, apps, AppOptions, SiteOptions } from '../';

describe('app', () => {
	it('can be retrieved after being created', async () => {
		let siteName = uuid();
		let appName = uuid();

		try {
			await sites.add({
				name: siteName,
				protocol: 'http',
				host: siteName,
				port: 80,
				path: 'C:\\inetpub\\wwwroot'
			} as SiteOptions);

			await apps.add({
				siteName: siteName,
				virtualPath: `/${appName}`,
				physicalPath: 'C:\\inetpub\\wwwroot\\AppPath'
			} as AppOptions);

			let app = await apps.get(siteName, appName);

			app.path.should.equal(`/${appName}`);
			app.name.should.equal(`${siteName}/${appName}`);
		} finally {
			if (await apps.exists(siteName, appName)) {
				await apps.remove(siteName, appName);
			}

			if (await sites.exists(siteName)) {
				await sites.remove(siteName);
			}
		}
	});
});
