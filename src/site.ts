import { AppCmd } from './app-cmd'

export interface ListSiteResult {
	id: string;
	name: string;
	bindings: string;
	state: string;
}

export class Site {
	public async exists(name: string): Promise<boolean> {
		let sites = await this.list();

		return sites.some(value => {
			return value.name === name;
		});
	}

	public async list(): Promise<ListSiteResult[]> {
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

	private mapSiteResults(value: any): ListSiteResult[] {
		return value.appcmd.SITE.map(x => {
			return {
				id: x.$['SITE.ID'],
				name: x.$['SITE.NAME'],
				bindings: x.$['bindings'],
				state: x.$['state']
			} as ListSiteResult;
		});
	}
}

export var site = new Site();
