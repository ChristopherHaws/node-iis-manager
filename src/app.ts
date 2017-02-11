import { AppCmd } from './app-cmd';

export interface App {
	path: string;
	name: string;
	appPoolName: string;
	siteName: string;
}

export interface AppOptions {
	name: string;
	virtualPath: string;
	physicalPath: string;
}

export class AppManager {
	public async add(options: AppOptions): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('add')
			.arg('app')
			.arg('/site.name', options.name)
			.arg('/path', options.virtualPath)
			.arg('/physicalPath', options.physicalPath)
			.exec();
	}

	public async exists(name: string): Promise<boolean> {
		let apps = await this.list();

		return apps.some(x => x.name === name);
	}

	public async list(): Promise<App[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('app')
			.exec(this.map);

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

	public async setAppPool(appName: string, appPoolName: string): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('set')
			.arg('app')
			.arg('/app.name', appName)
			.arg('/applicationPool', appPoolName)
			.exec();
	}

	public async setWindowsAuthentication(appPath: string, enable: boolean): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('set')
			.arg('config')
			.arg(appPath)
			.arg('/section', 'windowsAuthentication')
			.arg('/enabled', enable.toString())
			.exec();
	}

	public async setAnonymousAuthentication(appPath: string, enable: boolean): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('set')
			.arg('config')
			.arg(appPath)
			.arg('/section', 'anonymousAuthentication')
			.arg('/enabled', enable.toString())
			.exec();
	}

	private map(value: any): App[] {
		return value.appcmd.APP.map(app => {
			return {
				path: app.$['path'],
				name: app.$['APP.NAME'],
				appPoolName: app.$['APPPOOL.NAME'],
				siteName: app.$['SITE.NAME']
			} as App
		});
	}
}

export var apps = new AppManager();
