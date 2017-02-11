require('mocha');
require('chai').should();
import * as uuid from 'uuid';
import {IMock, Mock, It, Times} from 'moq.ts';
import { sites, SiteOptions, CommandExecutor, CommandResponse } from '../';
import { AppCmd } from '../src/app-cmd';

describe('AppCmd', () => {
	let mockCommandExecutor: IMock<CommandExecutor>;

	beforeEach(() => {
		mockCommandExecutor = new Mock<CommandExecutor>()
			.setup(x => x.execute(It.Is<string>(x => true)))
			.returns({
				exitCode: 0,
				stdout: '',
				stderr: ''
			} as CommandResponse);
	});

	it('with no arguments', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd');

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd'), Times.Once());
	});

	it('arg adds one argument', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list');

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list'), Times.Once());
	});

	it('arg adds quotations to multi-word argument', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list stuff');

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd "list stuff"'), Times.Once());
	});

	it('arg adds arguments with values', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.arg('app')
			.arg('/site.name', 'Default Web Site');

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list app /site.name:"Default Web Site"'), Times.Once());
	});

	it('argIf does not add argument if condition is false', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.argIf(false, 'app')

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list'), Times.Once());
	});

	it('argIf does not add argument with value if condition is false', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.argIf(false, '/site.name', 'Default Web Site')

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list'), Times.Once());
	});

	it('argIf adds argument if condition is true', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.argIf(true, 'app')

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list app'), Times.Once());
	});

	it('argIf adds argument if condition is true', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.argIf(true, '/site.name', 'Default Web Site')

		let response = await appCmd.exec();

		mockCommandExecutor.verify(x => x.execute('appcmd list /site.name:"Default Web Site"'), Times.Once());
	});

	it('execute adds xml argument when map function is passed', async () => {
		let appCmd = new AppCmd(mockCommandExecutor.object, 'appcmd')
			.arg('list')
			.arg('site');

		let response = await appCmd.exec(value => {
			return value;
		});

		mockCommandExecutor.verify(x => x.execute('appcmd list site /xml'), Times.Once());
	});
});
