type TformType = "F" | "C" | "P";
interface TreeCoreResult {
	formCode: string;
	title: TJson;
	leaf: boolean;
	appCode: string;
	skey: string;
	formType: TformType;
	code: string;
	multiLanguage: TJson;
	type: TformType;
	formTitle: string;
	fieldId: string;
	item: TJson;
}
type TBaseOptionsParam = Pick<TreeCoreResult, "type" | "skey" | "title" | "multiLanguage" | "leaf" | "appCode">;
type TreeCoreOptionsParams = (TBaseOptionsParam & Pick<TreeCoreResult, "formCode" | "code">) | {};
type TreeChildDataOptionsParams = (TBaseOptionsParam & Pick<TreeCoreResult, "item" | "formTitle" | "fieldId">) | {};

abstract class TreeCore {
	protected lang = () => localStorage.getItem("lang") || "zh";
	public result: Partial<TreeCoreResult> = {};
}

export class TreeParentData extends TreeCore {
	public static instance: TreeParentData | null = null;

	public static ins() {
		if (!TreeParentData.instance) {
			TreeParentData.instance = new TreeParentData();
		}
		return TreeParentData.instance;
	}

	public get options() {
		return this.result;
	}

	public set options(opts: TreeCoreOptionsParams) {
		this.result = {
			formCode: "code" in opts ? opts.code : "",
			title: "multiLanguage" in opts ? opts.multiLanguage : {},
			leaf: false,
			appCode: "appCode" in opts ? opts.appCode : "",
			skey: `data_${"code" in opts ? opts.code : ""}`,
			formType: "type" in opts ? opts.type : "C",
		};
	}
}

export class TreeChildData extends TreeCore {
	public static instance: TreeChildData | null = null;
	public static ins() {
		if (!TreeChildData.instance) {
			TreeChildData.instance = new TreeChildData();
		}
		return TreeChildData.instance;
	}
	private parentData: TJson = {};
	private whitelist = ["separator"];

	public get options() {
		return this.result;
	}

	public set options(opts: TJson) {
		if (opts.item.type == "table") {
			console.log(opts);
			console.log(opts.item.subCode);
		}
		let title: TJson = opts.item.title;
		let lang = this.lang();
		let skey = opts.item.type == "table" ? `sub_${opts.item.subCode}` : `${opts.item.fieldId}`;

		if (Object.keys(opts.parent).length && opts.parent.type == "table") {
			title[lang] = opts.parent.title[lang] + "(" + title[lang] + ")";
			skey = `${opts.item.fieldId}`;
		} else {
			title[lang] = title[lang];
		}

		this.result = {
			formTitle: this.parentData.title,
			formCode: this.parentData.formCode,
			fieldId: opts.item.fieldId,
			leaf: true,
			title,
			appCode: this.parentData.appCode,
			type: opts.item.type,
			skey,
		};
	}

	public getChildData(parentData: TJson, configList: TJson[], subFormCodes: Record<string, string>) {
		let list: any[] = [];
		let that: TreeChildData = this;
		this.parentData = parentData;
		(function deep(arr: any[], parentNode: TJson = {}) {
			arr.forEach((item: TJson) => {
				if (item.type == "table") {
					item["subCode"] = subFormCodes[item.fieldId];
				}

				if (item.type !== "tab") {
					that.options = {
						parent: parentNode,
						item,
					};
					!that.whitelist.includes(item.type) && list.push(that.options);
				}

				if (item.children && item.children.length && item.type !== "tab") {
					// item.children.push({
					// 	fieldId: "parent_data_id",
					// 	title: {
					// 		zh: "parent_data_id",
					// 		en: "parent_data_id",
					// 	},
					// 	type: "input",
					// });

					return deep(item.children, item);
				}
			});
		})(configList);
		console.log(configList, "configListconfigListconfigList");

		// add system 字段
		list.unshift(
			{
				appCode: parentData.appCode,
				formCode: parentData.formCode,
				leaf: true,
				fieldId: "parent_data_id",
				skey: "parent_data_id",
				title: {
					zh: "parent_data_id",
					en: "parent_data_id",
				},
				type: "input",
			},
			{
				fieldId: "id",
				appCode: parentData.appCode,
				formCode: parentData.formCode,
				skey: "id",
				leaf: true,
				title: {
					zh: "id",
					en: "id",
				},
				type: "input",
			}
		);
		return list;
	}

	// public getSystemList(formType: string) {
	// 	let systemFieldids = formType == "F" ? ["process_status", "creater", "create_time"] : ["creater", "create_time", "update_time"];
	// 	let systemlist: TJson[] = [];
	// 	systemFieldids.forEach((type: string) => {
	// 		let fieldObj: TJson = RfieldCore.ins().createField({ type }, "query");
	// 		let { fieldId, title } = fieldObj.config;
	// 		systemlist.push({
	// 			fieldId,
	// 			title,
	// 			type,
	// 			leaf: true,
	// 		});
	// 	});
	// 	return systemlist;
	// }
}
