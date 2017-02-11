require('mocha');
require('chai').should();
import * as uuid from 'uuid';
import { IMock, Mock, It, Times } from 'moq.ts';
import { sites, apps, AppManager, AppOptions, SiteOptions, CommandExecutor, CommandResponse } from '../';

describe('app', () => {
	describe('list', () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<appcmd>
	<APP path="/" APP.NAME="Default Web Site/" APPPOOL.NAME="DefaultAppPool" SITE.NAME="Default Web Site" />
	<APP path="/" APP.NAME="TestSite/" APPPOOL.NAME="DefaultAppPool" SITE.NAME="TestSite" />
</appcmd>`;

		let mockCommandExecutor: IMock<CommandExecutor>;

		beforeEach(() => {
			mockCommandExecutor = new Mock<CommandExecutor>()
				.setup(x => x.execute(It.Is<string>(x => true)))
				.returns({
					exitCode: 0,
					stdout: xml,
					stderr: ''
				} as CommandResponse);
		});

		it('default', async () => {
			let appManager = new AppManager(mockCommandExecutor.object, 'appcmd');

			let apps = await appManager.list();

			mockCommandExecutor.verify(x => x.execute('appcmd list app /xml'), Times.Once());
		});

		it('/site.name:"Default Web Site" /xml', async () => {
			let appManager = new AppManager(mockCommandExecutor.object, 'appcmd');

			let apps = await appManager.list({
				siteName: 'Default Web Site'
			});

			mockCommandExecutor.verify(x => x.execute('appcmd list app /site.name:"Default Web Site" /xml'), Times.Once());
		});
	});
});
