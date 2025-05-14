//默认配置父类
import en from "@/lang/languages/en";
import zh from "@/lang/languages/zh";

export class baseDConfig {
	public constructor(type: string) {}
	public data = {};
	public matchRules = [];
}

export class baseSConfig {
	public constructor(type: string) {
		this.setTitle(type);
	}
	// public legend: object = {
	// 	show: true, //图例显示
	// 	top: "auto", //显示位置 auto 0 80
	// };
	public title: object = {};
	public static readonly langConf: TJson = {
		en,
		zh,
	};
	private setTitle(type: string) {
		Object.keys(baseSConfig.langConf).forEach((key: string) => {
			let lang = baseSConfig.langConf[key];
			(this.title as any)[key] = lang["RC"][type + "C"];
		});
	}
}
