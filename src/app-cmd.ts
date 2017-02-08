import * as os from 'os';
import { exec } from 'child-process-promise';
import { XmlParser } from './util/xml-parser'

export interface IAppCmdResult<T> {
	value?: T;
	exitCode: number;
}

export class AppCmd {
	private path: string;
	private args: string[] = [];

	constructor(path?: string) {
		if (path) {
			this.path = path;
		} else if (os.arch() === "x64") {
			this.path = process.env["windir"] + "\\syswow64\\inetsrv\\appcmd.exe";
		} else {
			this.path = process.env["windir"] + "\\system32\\inetsrv\\appcmd.exe";
		}
	}

	public arg(name: string, value?: string, skipIfNull?: boolean): AppCmd {
		if (!value && skipIfNull) {
			return this;
		}

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

	public async exec<T>(translate?: (value: Object) => T, verbose?: boolean): Promise<IAppCmdResult<T>> {
		if (translate && this.args.indexOf('/xml') == -1) {
			this.arg('/xml');
		}

		let execResult = await exec(this.path + ' ' + this.args.join(' '));

		if (verbose) {
			console.log(execResult.stdout);
			console.log(execResult.stderr);
		}

		let result: IAppCmdResult<T> = {
			exitCode: execResult.childProcess.exitCode
		};

		if (translate) {
			let parsedResult = await XmlParser.parse<any>(execResult.stdout);
			result.value = translate(parsedResult);
		}

		return result;
	}
}
