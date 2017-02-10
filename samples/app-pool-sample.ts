import { appPool } from '../'

class Program {
	public static async Main() {
		let results = await appPool.list();
		console.log(results);
	}
}

Program.Main();
