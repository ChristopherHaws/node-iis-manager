import { appPools } from '../'

class Program {
	public static async Main() {
		await appPools.stop('DefaultAppPool');
	}
}

Program.Main();
