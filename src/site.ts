import { AppCmd } from './app-cmd';
import { CommandExecutor } from './util';

export interface Site {
	id: string;
	name: string;
	bindings: string;
	state: string;
}

export interface SiteOptions {
	name: string;
	path: string;
	protocol: string;
	host: string;
	port: number;
	bindings?: string;
}

export class SiteManager {
	private readonly commandExecutor?: CommandExecutor;
	private readonly appCmdPath?: string;

	constructor(commandExecutor?: CommandExecutor, appCmdPath?: string) {
		this.commandExecutor = commandExecutor
		this.appCmdPath = appCmdPath;
	}

	public async add(options: SiteOptions): Promise<void> {
		let command = new AppCmd(this.commandExecutor, this.appCmdPath);

		await command
			.arg('add')
			.arg('site')
			.arg('/name', options.name)
			.arg('/bindings', (options.bindings || `${options.protocol}://${options.host}:${options.port}`))
			.arg('/physicalPath', options.path)
			.exec();
	}

	public async remove(name: string): Promise<void> {
		let command = new AppCmd(this.commandExecutor, this.appCmdPath);

		await command
			.arg('delete')
			.arg('site')
			.arg('/site.name', name)
			.exec();
	}

	public async exists(name: string): Promise<boolean> {
		try {
			return !!await this.get(name);
		} catch (err) {
			return false;
		}
	}

	public async get(name: string): Promise<Site> {
		let sites = await this.list();

		return sites.find(x => x.name === name);
	}

	public async list(): Promise<Site[]> {
		let command = new AppCmd(this.commandExecutor, this.appCmdPath);

		let results = await command
			.arg('list')
			.arg('site')
			.exec(this.mapSiteResults);

		return results.value;
	}

	public async start(name: string): Promise<void> {
		let command = new AppCmd(this.commandExecutor, this.appCmdPath);

		let results = await command
			.arg('start')
			.arg('site')
			.arg(name)
			.exec();

		console.log(results.stdout);
	}

	public async stop(name: string): Promise<void> {
		let command = new AppCmd(this.commandExecutor, this.appCmdPath);

		try {
			let results = await command
				.arg('stop')
				.arg('site')
				.arg(name)
				.exec();

			console.log(results.stdout);
		} catch (err) {
			console.log(err.stdout);
		}
	}

	private mapSiteResults(value: any): Site[] {
		return value.appcmd.SITE.map(x => {
			return {
				id: x.$['SITE.ID'],
				name: x.$['SITE.NAME'],
				bindings: x.$['bindings'],
				state: x.$['state']
			} as Site;
		});
	}
}

export var sites = new SiteManager();
