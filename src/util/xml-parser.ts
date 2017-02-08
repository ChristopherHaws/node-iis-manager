import { parseString } from 'xml2js'

export class XmlParser {
	public static parse<T>(xml: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			parseString(xml, (err, result) => {
				if (err) {
					reject(err);
				}

				resolve(result as T);
			});
		});
	}
}
