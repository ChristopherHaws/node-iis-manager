import { appPool } from '../'

class Program {
	public static async Main() {
		await appPool.stop('DefaultAppPool');
	}
}

Program.Main();
