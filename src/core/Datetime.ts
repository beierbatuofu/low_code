/*
 * @Author: ben
 * @LastEditTime: 2021-11-03 17:44:48
 */

export default class Datetime {
	public static instance: Datetime;

	public static ins() {
		if (!Datetime.instance) {
			Datetime.instance = new Datetime();
		}
		return Datetime.instance;
	}
	private readonly baseConfig: TJson = Object.freeze({
		yyyy: "-01-01 00:00:00.000",
		"yyyy-MM": "-01 00:00:00.000",
		"yyyy-MM-dd": " 00:00:00.000",
		"yyyy-MM-dd HH:mm": ":00.000",
		"yyyy-MM-dd HH:mm:ss": ".000",
	});

	private yyyy = (date: any) => {
		return new Date(date).getFullYear();
	};

	private MM = (date: any) => String(Number(new Date(date).getMonth()) + 1).padStart(2, "0");

	private dd = (date: any) => String(new Date(date).getDate()).padStart(2, "0");

	private HH = (date: any) => String(new Date(date).getHours()).padStart(2, "0");

	private mm = (date: any) => String(new Date(date).getMinutes()).padStart(2, "0");

	private ss = (date: any) => String(new Date(date).getSeconds()).padStart(2, "0");

	public convert(date: Date, sFormat: string) {
		if (!date) return date;
		return sFormat.replace(/(yyyy|MM|dd|HH|mm|ss)/g, ($0: any, $1: string): any => (<any>this)[$1].call(this, date));
	}

	public completion(sDatetime: string, format: string = "yyyy") {
		let sText = sDatetime;
		if (!sText) return sText;
		sText += this.baseConfig[format];
		return sText;
	}
}
