import { AppCmd } from './app-cmd'

export interface IListAppPoolResult {
	name: string;
	pipelineMode: string;
	runtimeVersion: string;
	siteName: string;
}

export class AppPool {
	public async list(): Promise<IListAppPoolResult[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('apppool')
			.exec(this.mapListResults);

		return results.value;
	}

	private mapListResults(value: any): IListAppPoolResult[] {
		return value.appcmd.APPPOOL.map(app => {
			return {
				name: app.$['APPPOOL.NAME'],
				pipelineMode: app.$['PipelineMode'],
				runtimeVersion: app.$['RuntimeVersion'],
				siteName: app.$['state']
			}
		});
	}
}
