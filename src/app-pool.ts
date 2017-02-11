import { AppCmd } from './app-cmd'

export interface AppPool {
	name: string;
	pipelineMode: string;
	runtimeVersion: string;
	siteName: string;
}

export class AppPoolManager {
	public async add(name: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg('add')
			.arg('apppool')
			.arg('/name', name)
			.exec();
	}

	public async remove(name: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg('delete')
			.arg('apppool')
			.arg('/apppool.name', name)
			.exec();
	}

	public async exists(name: string): Promise<boolean> {
		let appPools = await this.list();

		return appPools.some(x => x.name === name);
	}

	public async list(): Promise<AppPool[]> {
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

	public async recycle(name: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg('recycle')
			.arg('apppool')
			.arg('/apppool.name', name)
			.exec();
	}

	public async setIdentity(name: string, identity: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg('set')
			.arg('config')
			.arg('/section', 'applicationPools')
			.arg('/[name=\'" + name + "\'].processModel.identityType', identity)
			.exec();
	}

	private mapListResults(value: any): AppPool[] {
		return value.appcmd.APPPOOL.map(app => {
			return {
				name: app.$['APPPOOL.NAME'],
				pipelineMode: app.$['PipelineMode'],
				runtimeVersion: app.$['RuntimeVersion'],
				siteName: app.$['state']
			} as AppPool
		});
	}
}

export var appPools = new AppPoolManager();
