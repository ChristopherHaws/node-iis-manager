import { AppCmd } from './app-cmd'

export interface IListAppPoolResult {
	name: string;
	pipelineMode: string;
	runtimeVersion: string;
	siteName: string;
}

export class AppPool {
	public async exists(name: string): Promise<boolean> {
		let appPools = await this.list();

		return appPools.some(x => x.name === name);
	}

	public async list(): Promise<IListAppPoolResult[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('apppool')
			.exec(this.mapListResults);

		return results.value;
	}

	public async start(name: string): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('start')
			.arg('apppool')
			.arg(name)
			.exec();

		console.log(results.stdout);
	}

	public async stop(name: string): Promise<void> {
		let command = new AppCmd();

		try {
			let results = await command
				.arg('stop')
				.arg('apppool')
				.arg(name)
				.exec();

			console.log(results.stdout);
		} catch (err) {
			console.log(err.stdout);
		}
	}

	private mapListResults(value: any): IListAppPoolResult[] {
		return value.appcmd.APPPOOL.map(app => {
			return {
				name: app.$['APPPOOL.NAME'],
				pipelineMode: app.$['PipelineMode'],
				runtimeVersion: app.$['RuntimeVersion'],
				siteName: app.$['state']
			} as IListAppPoolResult
		});
	}
}

export var appPool = new AppPool();
