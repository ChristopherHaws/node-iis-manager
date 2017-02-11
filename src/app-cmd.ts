import * as os from 'os';
import { CommandExecutor, XmlParser, NodeCommandExecutor } from './util';

export interface IAppCmdResult<T> {
	value?: T;
	stdout: string;
	stderr: string;
	exitCode: number;
}

export class AppCmd {
	private readonly commandExecutor: CommandExecutor;
	private readonly path: string;
	private args: string[] = [];

	constructor(commandExecutor?: CommandExecutor, path?: string) {
		this.commandExecutor = commandExecutor || new NodeCommandExecutor();

		if (path) {
			this.path = path;
		} else if (os.arch() === "x64") {
			this.path = process.env["windir"] + "\\syswow64\\inetsrv\\appcmd.exe";
		} else {
			this.path = process.env["windir"] + "\\system32\\inetsrv\\appcmd.exe";
		}
	}

	public arg(name: string, value?: string): AppCmd {
		if (name && name.indexOf(' ') !== -1) {
			name = `\"${name}\"`;
		}

		if (value && value.indexOf(' ') !== -1) {
			value = `\"${value}\"`;
		}

		if (value) {
			this.args.push(`${name}:${value}`);
		} else {
			this.args.push(name);
		}

		return this;
	}

	public argIf(condition: boolean, name: string, value?: string): AppCmd {
		if (!condition) {
			return this;
		}

		return this.arg(name, value);
	}

	public async exec<T>(map?: (value: Object) => T, verbose?: boolean): Promise<IAppCmdResult<T>> {
		if (map && this.args.indexOf('/xml') == -1) {
			this.arg('/xml');
		}

		let response = await this.commandExecutor.execute((this.path + ' ' + this.args.join(' ')).trim());

		if (verbose) {
			console.log(response.stdout);
			console.log(response.stderr);
		}

		let result: IAppCmdResult<T> = {
			exitCode: response.exitCode,
			stdout: response.stdout,
			stderr: response.stderr
		};

		if (map) {
			let parsedResult = await XmlParser.parse<any>(response.stdout);
			result.value = map(parsedResult);
		}

		return result;
	}
}
