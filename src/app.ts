import { AppCmd } from './app-cmd';

export interface App {
	path: string;
	name: string;
	appPoolName: string;
	siteName: string;
}

export interface AppFilter {
	path?: string;
	appPoolName?: string;
	siteName?: string;
}

/**
 * Creates a new application with the specified settings.  At minimum, the parent
 * site's name and application's path must be provided.
 */
export interface AppOptions {
	/**
	 * Site identifier under which this application is created.
	 */
	siteName: string;

	/**
	 * The virtual path of the application.
	 */
	virtualPath: string;

	/**
	 * If specified, will cause the root virtual directory to be created for this
	 * application.  If omitted, the application will be created without a root
	 * virtual directory and will not be usable until one is created.
	 */
	physicalPath: string;
}

export class AppManager {
	public async add(options: AppOptions): Promise<void> {
		let command = new AppCmd();

		let results = await command
			.arg('add')
			.arg('app')
			.arg('/site.name', options.siteName)
			.arg('/path', options.virtualPath)
			.arg('/physicalPath', options.physicalPath)
			.exec();
	}

	public async remove(siteName: string, virtualPath: string): Promise<void> {
		let command = new AppCmd();

		await command
			.arg('delete')
			.arg('app')
			.arg('/app.name', `${siteName}/${virtualPath}`)
			.exec();
	}

	public async exists(siteName: string, virtualPath: string): Promise<boolean> {
		return !!await this.get(siteName, virtualPath);
	}

	public async get(siteName: string, virtualPath: string): Promise<App> {
		let apps = await this.list({
			siteName: siteName,
			path: `/${virtualPath}`
		});

		return apps.find(x => x.name === `${siteName}/${virtualPath}`);
	}

	public async list(filters?: AppFilter): Promise<App[]> {
		let command = new AppCmd();

		let results = await command
			.arg('list')
			.arg('app')
			.argIf(!!filters && !!filters.siteName, '/site.name', filters.siteName)
			.argIf(!!filters && !!filters.path, '/path', filters.path)
			.argIf(!!filters && !!filters.appPoolName, '/apppool.name', filters.appPoolName)
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
