import { exec, IExecResult } from 'child-process-promise';

export interface CommandResponse {
	exitCode: number;
	stdout: string;
	stderr: string;
}

export interface CommandExecutor {
	execute(command: string): Promise<CommandResponse>;
}

export class NodeCommandExecutor implements CommandExecutor {
	public async execute(command: string): Promise<CommandResponse> {
		let result = await exec(command);

		return {
			exitCode: result.childProcess.exitCode,
			stdout: result.stdout,
			stderr: result.stderr
		} as CommandResponse;
	}
}
