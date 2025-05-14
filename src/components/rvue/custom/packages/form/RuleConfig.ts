/*
 * @Author: ben
 * @LastEditTime: 2022-06-13 14:15:54
 */
import i18n from "@/lang";

//私有属性
const blur = Symbol("blur");
const change = Symbol("change");
const config = Symbol("config");
const result = Symbol("result");

interface TRulesMap {
	textRange: "textRange";
	numRange: "numRange";
	multiple: "multiple";
}

const RulesMap: TRulesMap = {
	textRange: "textRange",
	numRange: "numRange",
	multiple: "multiple",
};

export default class RuleConfig {
	//event
	private [blur] = "blur";

	public static readonly vm: (Vue & { $refs: Record<string, any> }) | null = null;

	private [result]: any[] = [];
	//字段数据
	private [config]: TJson = {};

	public static tableFieldConf: Record<string, any> = {};

	private selectErrorTabIdx() {
		let conf = Object.keys(this[config]).length ? this[config] : RuleConfig.tableFieldConf;

		if (conf.tab && RuleConfig.vm) {
			let ids = conf.tab.split(",");

			try {
				RuleConfig.vm.$refs[ids[0]][0].$refs.temp.activeName = ids[1];
			} catch (err) {}
		}
	}

	private getFieldRules(attrs: TJson) {
		let rules: TJson = {};
		Object.keys(attrs).forEach((key: string) => {
			if (RulesMap.hasOwnProperty(key)) {
				let k = RulesMap[<keyof TRulesMap>key];
				rules[k] = this[k];
			}
		});

		return rules;
	}

	//默认校验规则
	private get rules() {
		return this[result];
	}
	private set rules(conf: any) {
		let { required } = conf;
		let rules = this.getFieldRules(conf);

		this[config] = conf;
		let newRules: TJson = {
			notEmpty: this.notEmpty,
			...rules,
		};
		!required && delete newRules.notEmpty;
		this[result] = Object.keys(newRules).map((k: string, idx: number) => newRules[k]);
	}

	//为空校验
	private notEmpty = {
		required: true,
		validator: (rule: any, value: any, cb: (params?: any) => any) => {
			let { type } = this[config];

			if (type == "address") {
				if (!Object.values(value).join("")) {
					return cb(new Error((<any>i18n.t)("rules.requiredFields")));
				}
			}
			if (typeof value == "undefined") {
				value = "";
			}
			if (!String(value).replace(/(^\s*|\s*$)/, "")) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.requiredFields")));
			}
			return cb();
		},
		trigger: this[blur],
	};

	//校验数字类型
	private isNumeric = {
		required: true,
		validator: (rule: any, value: string, cb: (params?: any) => any) => {
			let num = Number(value);
			if (typeof value !== "number" && isNaN(num)) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.isNumeric")));
			}
			return cb();
		},
		trigger: this[blur],
	};

	//检验数值范围
	private numRange = {
		required: true,
		validator: (rule: any, value: string, cb: (params?: any) => any) => {
			let num = Number(value);

			let { numRange } = this[config];

			let max = numRange.max == undefined || numRange.max == null || isNaN(1 * numRange.max) ? numRange.maxInfinity : numRange.max;
			let min = numRange.min == undefined || numRange.min == null || isNaN(1 * numRange.min) ? numRange.minInfinity : numRange.min;
			console.log(num, numRange, min);
			if (num < min) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.numRangeMax", [min])));
			}

			if (num > max) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.numRangeMin", [max])));
			}

			// if (num > max || num < min) {
			// 	this.selectErrorTabIdx();
			// 	return cb(new Error((<any>i18n.t)("rules.numRange", [min, max])));
			// }

			return cb();
		},
		trigger: this[blur],
	};

	private textRange = {
		required: true,
		validator: (rule: any, value: string, cb: (params?: any) => any) => {
			let len = String(value).length;
			let { textRange } = this[config];
			let min = textRange.min || textRange.minInfinity;
			let max = textRange.max || textRange.maxInfinity;

			if (len < min) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.textLenMin", [min])));
			}

			if (len > max) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.textLenMax", [max])));
			}

			return cb();
		},
		trigger: this[blur],
	};

	//检验表格是否有填
	public formIsEmpty = (list: Array<TJson>) => ({
		required: true,
		validator: (rule: any, value: string, cb: (params?: any) => any) => {
			//判断list是否是全空
			let boolean: Boolean = false;
			list.forEach((item: any) => {
				//如果是Boolean 那就是另一种情况
				for (var key in item) {
					if (item.hasOwnProperty(key) && key != "status" && key != "index_") {
						if (Object.prototype.toString.call(item[key]) === "[object Boolean]") {
							if (item[key]) {
								boolean = true;
								break;
							}
						} else if (!Array.isArray(item[key])) {
							if (item[key] && item[key].replace(/(^\s*|\s*$)/, "")) {
								boolean = true;
								break;
							}
							//复选框数组
						} else if (Array.isArray(item[key]) && item[key].length > 0) {
							boolean = true;
							break;
						}
					}
				}
			});
			if (!boolean) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("rules.isFormEmpty")));
			}

			return cb();
		},
		trigger: this[blur],
	});

	public notSame(err: TJson, vm: any) {
		let props = err.msg;
		let formItems: any[] | undefined = (<Record<string, any>>vm.$refs.rvueForm).$el?.querySelector(".el-row").querySelectorAll(".el-col");
		for (const key in JSON.parse(props)) {
			if (JSON.parse(props)[key].length && typeof JSON.parse(props)[key] != "string") {
				let children = JSON.parse(props)[key];
				children.forEach((item: Record<string, any>) => {
					let [arr] = Object.entries(item);
					vm.$refs.rvueForm.form[key].data.forEach((formItem: TJson, index: number) => {
						if (formItem[arr[0]] == item[arr[0]]) {
							this.selectErrorTabIdx();
							vm.$set(vm.$refs.rvueForm.customError, arr[0] + `_$${index}`, "");
							Promise.resolve().then(() => {
								vm.$set(vm.$refs.rvueForm.customError, arr[0] + `_$${index}`, vm.$t("global.errNoSameVal"));

								if (formItems) {
									let errItem: Record<string, any> | undefined = Array.from(formItems).find((item: Record<string, any>) => item && item.getAttribute("fieldId") == key);
									errItem && (<Vue & Record<string, any>>vm.$refs).rvueForm.$el.parentNode.scrollTo(0, errItem.offsetTop);
								}
							});
						}
					});
				});
			} else {
				vm.$refs.rvueForm.customError[key] = "";

				//普通字段重复
				Promise.resolve().then(() => {
					this.selectErrorTabIdx();
					if (formItems) {
						let errItem: Record<string, any> | undefined = Array.from(formItems).find((item: Record<string, any>) => item && item.getAttribute("fieldId") == key);
						errItem && (<Vue & Record<string, any>>vm.$refs).rvueForm.$el.parentNode.scrollTo(0, errItem.offsetTop);
					}

					vm.$refs.rvueForm.customError[key] = vm.$t("global.errNoSameVal");
				});
			}
		}

		// for (const key in JSON.parse(props)) {
		// 	if (JSON.parse(props)[key].length && typeof JSON.parse(props)[key] != "string") {
		// 		//表格中重复
		// 		try {
		// 			JSON.parse(props)[key].forEach((item: TJson) => {
		// 				//keyCell == prop

		// 				for (const keyCell in item) {
		// 					vm.$refs.rvueForm.form[key].data.forEach((formItem: TJson, index: number) => {
		// 						//找到重复值

		// 						if (formItem[keyCell] == item[keyCell]) {
		// 							formItem["isSameError_" + keyCell] = true;

		// 							vm.$refs.rvueForm.customError[keyCell + `_$${index}`] = vm.$t("global.errNoSameVal");
		// 							console.log(vm.$refs.rvueForm.customError);
		// 						}
		// 					});
		// 				}
		// 			});
		// 		} catch (err) {}
		// 	} else {
		// 		vm.$refs.rvueForm.customError[key] = "";

		// 		//普通字段重复
		// 		Promise.resolve().then(() => {
		// 			vm.$refs.rvueForm.customError[key] = vm.$t("global.errNoSameVal");
		// 		});
		// 	}
		// }
	}
	//不允许上传多个
	public multiple = {
		required: true,
		validator: (rule: any, value: string, cb: (params?: any) => any) => {
			let { multiple } = this[config];
			let val: any;
			try {
				val = (value && JSON.parse(value)) || [];
			} catch (error) {
				val = value || [];
			}

			if (val.length > 1 && multiple) {
				this.selectErrorTabIdx();
				return cb(new Error((<any>i18n.t)("global.isMultiple")));
			}
			return cb();
		},
		trigger: "change",
	};
}
