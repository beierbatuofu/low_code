/*
 * @Author: cc
 * @Date: 2021-12-01 14:01:32
 * @LastEditTime: 2022-03-01 13:28:43
 * @LastEditors: Please set LastEditors
 * @Description: debug 打开正式环境console
 * @FilePath: \risen\src\utils\RLog.ts
 */
export default class RLog {
	private static isDev: boolean = process.env.NODE_ENV == "development";

	public static instance: RLog | null = null;

	public static ins() {
		if (!RLog.instance) {
			RLog.instance = new RLog();
		}
		return RLog.instance;
	}

	public log(...data: any[]): void {
		if (RLog.isDev) {
			winConsole.log(...data);
		}
		winConsole.log(...data);
	}

	// debug
	public debug(...log: any[]): void {
		if (RLog.isDev) {
			winConsole.log(...log);
		}
	}

	// info
	public info(...log: any[]): void {
		winConsole.info(...log);
	}

	// warn
	public warn(...log: any[]): void {
		winConsole.warn(...log);
	}

	// error
	public error(...log: any[]): void {
		winConsole.error(...log);
	}
}

//copy console
let winConsole = Object.create({});

Object.keys((<TJson>window).console).forEach((key) => {
	Object.defineProperty(winConsole, key, <TJson>Object.getOwnPropertyDescriptor((<TJson>window).console, key));
});
// process.env.NODE_ENV !== "development" && ((<TJson>window).console = RLog.ins());
