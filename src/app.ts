import { AppCmd } from './app-cmd'

export interface IListAppResult {
	path: string;
	name: string;
	appPoolName: string;
	siteName: string;
}

export class App {
	public async list(): Promise<IListAppResult[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('apppool')
			.exec(this.mapSiteResults);

		return results.value;
	}

	private mapSiteResults(value: any): IListAppResult[] {
		return value.appcmd.APP.map(app => {
			return {
				path: app.$['path'],
				name: app.$['APP.NAME'],
				appPoolName: app.$['APPPOOL.NAME'],
				siteName: app.$['SITE.NAME']
			}
		});
	}
}
