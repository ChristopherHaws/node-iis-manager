import { Apps } from '../'

class Program {
	public static async Main() {
		let results = await Apps.list();
		console.log(results);
	}
}

Program.Main();
