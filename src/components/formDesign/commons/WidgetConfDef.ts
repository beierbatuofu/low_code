import { defaultWidgetList } from "./defaultValue";
export default class WidgetConfDef {
	public static widgetList = defaultWidgetList.concat();

	private static wcValidateFunction: TJson = {
		numRange: function (val: any, conf: any) {
			if (val.min > val.max && val.max && val.min) {
				[val.min, val.max] = [val.max, val.min];
			}

			return val;
		},
		textRange: function (val: any, conf: any) {
			if (val.min > val.max && val.max && val.min) {
				[val.min, val.max] = [val.max, val.min];
			}
			return val;
		},
	};

	// 表单设计器中保存时或切换组件时，验证当前控件属性值
	public static validateWidgetConf(conf: any) {
		for (const key of Object.keys(conf)) {
			if (WidgetConfDef.wcValidateFunction[key]) {
				conf[key] = WidgetConfDef.wcValidateFunction[key].apply(this, [conf[key], conf]);
			}
		}

		return conf;
	}
}
