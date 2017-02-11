import { AppCmd } from './app-cmd'

export interface IListAppResult {
	path: string;
	name: string;
	appPoolName: string;
	siteName: string;
}

export class App {
	public async exists(name: string): Promise<boolean> {
		let apps = await this.list();

		return apps.some(x => x.name === name);
	}

	public async list(): Promise<IListAppResult[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('app')
			.exec(this.mapSiteResults);

		return results.value;
	}

	public async start(name: string): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('start')
			.arg('app')
			.arg(name)
			.exec();

		console.log(results.stdout);
	}

	public async stop(name: string): Promise<void> {
		let command = new AppCmd();

		try {
			let results = await command
				.arg('stop')
				.arg('app')
				.arg(name)
				.exec();

			console.log(results.stdout);
		} catch (err) {
			console.log(err.stdout);
		}
	}

	private mapSiteResults(value: any): IListAppResult[] {
		return value.appcmd.APP.map(app => {
			return {
				path: app.$['path'],
				name: app.$['APP.NAME'],
				appPoolName: app.$['APPPOOL.NAME'],
				siteName: app.$['SITE.NAME']
			} as IListAppResult
		});
	}
}

export var app = new App();
