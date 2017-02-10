import { app } from '../'

class Program {
	public static async Main() {
		let results = await app.list();
		console.log(results);
	}
}

Program.Main();
