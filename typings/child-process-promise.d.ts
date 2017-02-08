declare module "child_process" {
	interface ChildProcess {
		exitCode: number;
	}
}

declare module "child-process-promise" {
	import { ChildProcess } from "child_process";

	export interface IExecResult {
		childProcess: ChildProcess;
		stdout: string;
		stderr: string;
	}

	export function exec(command: string): Promise<IExecResult>;
}
