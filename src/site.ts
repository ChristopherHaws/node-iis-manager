import { AppCmd } from './app-cmd';

export interface Site {
	id: string;
	name: string;
	bindings: string;
	state: string;
}

export interface SiteOptions {
	name: string;
	protocol: string;
	host: string;
	port: number;
	bindings?: string;
	path?: string;
}

export class SiteManager {
	public async add(options: SiteOptions): Promise<void> {
		let command = new AppCmd();

		await command
			.arg("add site")
			.arg("/name:" + options.name)
			.arg("/bindings", (options.bindings || `${options.protocol}://${options.host}:${options.port}`))
			.argIf(!!options.path, '/physicalPath', options.path)
			.exec();
	}

	public async remove(name: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg("delete")
			.arg("site")
			.arg("/site.name", name)
			.exec();
	}

	public async exists(name: string): Promise<boolean> {
		let sites = await this.list();

		return sites.some(x => x.name === name);
	}

	public async list(): Promise<Site[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('site')
			.exec(this.mapSiteResults);

		return results.value;
	}

	public async start(name: string): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('start')
			.arg('site')
			.arg(name)
			.exec();

		console.log(results.stdout);
	}

	public async stop(name: string): Promise<void> {
		let command = new AppCmd();

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
