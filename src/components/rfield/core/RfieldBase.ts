export default abstract class RfieldBase {
	public config: TJson = {};
	public rfDef: TJson;
	// public abstract getValue(value: any): any;
	private formType: TFormType = "form";

	/**
	 * @description: 获取字段类
	 */

	private getRfDef(config: TJson = {}) {
		switch (this.formType) {
			case "form":
				if (config.fieldId) return config;
				return new this.rfDef.FormConf().fieldConf;

			case "query":
				if (config.queryStyle) return config;
				let baseQueryConf = new this.rfDef.QueryConf().fieldConf;
				let whitelist = ["defVal", "edit"];
				Object.keys(baseQueryConf).forEach((key: string) => {
					if (config.hasOwnProperty(key) && !whitelist.includes(key)) {
						baseQueryConf[key] = config[key];
					}
				});

				return baseQueryConf;
		}
	}

	/**
	 * @description:
	 * @param {TFormType} formType form数据类型 from query
	 * @param {TJson} config 字段的属性
	 * @param {TJson} rfDef 字段的配置
	 * @return {*}
	 */
	public constructor(config: TJson, formType: TFormType, rfDef: TJson) {
		this.formType = formType;
		this.rfDef = rfDef;

		this.config = this.getRfDef(config);

		//this.config = !config.fieldId ? new (this.getRfDef())().fieldConf : config;
	}
}
