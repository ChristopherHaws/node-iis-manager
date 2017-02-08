import { AppPools } from '../'

class Program {
	public static async Main() {
		let results = await AppPools.list();
		console.log(results);
	}
}

Program.Main();
