require('mocha');
require('chai').should();
import * as uuid from 'uuid';
import { IMock, Mock, It, Times } from 'moq.ts';
import { SiteManager, Site, SiteOptions, CommandExecutor, CommandResponse } from '../';

describe('site', () => {
	describe('list', () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<appcmd>
	<SITE SITE.NAME="Default Web Site" SITE.ID="1" bindings="http/*:80:" state="Started" />
	<SITE SITE.NAME="Test Site" SITE.ID="2" bindings="https/*:443:" state="Stopped" />
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

		it('returns multiple items when no filter is passed', async () => {
			let siteManager = new SiteManager(mockCommandExecutor.object, 'appcmd');

			let sites = await siteManager.list();

			sites.should.be.length(2);

			sites.should.contain({
				id: '1',
				name: 'Default Web Site',
				bindings: 'http/*:80:',
				state: 'Started'
			} as Site);

			sites.should.contain({
				id: '2',
				name: 'Test Site',
				bindings: 'https/*:443:',
				state: 'Stopped'
			} as Site);

			mockCommandExecutor.verify(x => x.execute('appcmd list site /xml'), Times.Once());
		});

		it('calls command once', async () => {
			let siteManager = new SiteManager(mockCommandExecutor.object, 'appcmd');

			let sites = await siteManager.list();

			mockCommandExecutor.verify(x => x.execute('appcmd list site /xml'), Times.Once());
		});
	});
});
