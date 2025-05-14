import RfieldDefine, { TFieldConf } from "./RfieldDefine";
export default class RfieldCore {
	public fieldConsMap: TJson = {};
	// del
	private fieldDefineMap: TJson = {};
	private parentMap: TJson = {};
	private oField: object = {};

	public static readonly sysfieldIds = ["id", "create_time", "update_time", "creater", "updater", "is_deleted", "process_status", "process_instance_id", "parent_data_id"];

	private static instance: RfieldCore | null = null;

	public static ins() {
		if (!RfieldCore.instance) {
			RfieldCore.instance = new RfieldCore();
		}
		return RfieldCore.instance;
	}

	/**
	 * @description:
	 * @param {TJson} opts FieldType字段类型 FormType数据类型 apiConf接口返回的数据
	 * @return {*}
	 * createfield return config
	 */
	public createField(config: Partial<TFieldConf>, formType: TFormType = "form") {
		if (!config.type) return config;
		this.oField = new (RfieldCore.ins().fieldConsMap[config.type])(config, formType);

		return this.oField;
	}
	/**
	 * @description:
	 * @param {TJson} opts method查询方法
	 * @return {*}
	 * createfield return config
	 */

	/**
	 * @description:
	 * @param {string} attr 属性
	 * @param {TJson} components 属性注册表
	 * @return {*} 返回属性
	 */
	public hasFormAttr(attr: string, components: TJson = {}, prefix: string = "Attr"): string | void {
		let strCompNames = String(Object.keys(Object.getPrototypeOf(components)));
		let compName = `${prefix}-${attr}`;
		let reg = new RegExp(compName.split("-").join(""), "i");
		if (String(attr) == "defVal") {
			return String((<TJson>this.oField).rfDef.formDefValComp);
		}
		if (reg.test(strCompNames)) return `Attr-${attr}`;
	}

	public copyFieldAttr(cloneConf: TFieldConf) {
		let fieldConf: Record<string, any> = this.createField({ type: cloneConf.type });
		cloneConf.fieldId = RfieldDefine.setProp();
		cloneConf.children &&
			cloneConf.children.forEach((element: TJson) => {
				element.fieldId = RfieldDefine.setProp();
				let childConf: Record<string, any> = this.createField({ type: element.type });
				element.rely = childConf.config.rely;
				console.log(element);
			});
		cloneConf.rely = fieldConf.config.rely;

		return cloneConf;
	}
	/**
	 * @description:
	 * @param {array} args [fielId,configList]
	 * @return {*}
	 */
	public getFieldParent(...args: any[]) {
		let [fieldId, configList] = args;
		if (!configList || !fieldId) return;
		let that = this;
		(function findParent(fieldId: string, list: TJson[], parent: TJson = {}) {
			// if (that.parentMap.hasOwnProperty(fieldId)) {
			// 	return;
			// }
			list.forEach((config: TJson) => {
				if (config.fieldId == fieldId) {
					that.parentMap[fieldId] = parent;
					return true;
				} else if (config.children && config.children.length && config.type == "table") {
					findParent(fieldId, config.children, config);
				} else if (config.type == "tab") {
					config.children &&
						config.children.forEach((item: Record<string, any>) => {
							if (item.configList) {
								findParent(fieldId, item.configList);
							}
						});
				}
			});
		})(fieldId, configList);
		return this.parentMap[fieldId];
	}
}
