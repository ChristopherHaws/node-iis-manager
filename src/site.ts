import { AppCmd } from './app-cmd'

export interface IListSiteResult {
	id: string;
	name: string;
	bindings: string;
	state: string;
}

export class Site {
	public async list(): Promise<IListSiteResult[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('site')
			.exec(this.mapSiteResults);

		return results.value;
	}

	private mapSiteResults(value: any): IListSiteResult[] {
		return value.appcmd.SITE.map(x => {
			return {
				id: x.$['SITE.ID'],
				name: x.$['SITE.NAME'],
				bindings: x.$['bindings'],
				state: x.$['state']
			}
		});
	}
}
