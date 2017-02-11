import { apps } from '../'

class Program {
	public static async Main() {
		let results = await apps.list();
		console.log(results);
	}
}

Program.Main();
