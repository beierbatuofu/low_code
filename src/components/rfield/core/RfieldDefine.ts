//组件属性基本配置
import en from "@/lang/languages/en";
import zh from "@/lang/languages/zh";

export interface TFieldConf {
	title: Record<"zh" | "en", string>;
	desc: string;
	visible: boolean;
	edit: boolean;
	required: boolean;
	type: string;
	titleShow: boolean;
	fieldId: string;
	tab: string;
	defVal?: any;
	width: string;
	rely?: Record<"type" | "relation", any>;
	dicData?: Record<"label" | "value", any>[];
	children?: Record<string, any>[];
}

export default abstract class RfieldDefine {
	public abstract ext: TJson;

	public static readonly langConf: TFJson<object> = {
		en,
		zh,
	};
	public static readonly AttrUISort = class AttrUISort {
		public fieldSort: string[] = [];
	};

	//表单设计字段基础属性
	public static readonly commonConf = class commonConf {
		public title: TJson = {};
		public desc: string = "";
		public visible: boolean = true;
		public edit: boolean = true;
		public required: boolean = false;
		public type: string = "";
		public titleShow: boolean = true;
		public fieldId: string = RfieldDefine.setProp();
		public tab: string = "";
		constructor(RfDef: TRfDef) {
			this.type = RfDef.type;
			this.title = RfieldDefine.setDefaultTitle(RfDef.type);
		}
	};

	//表单设计普通字段基础属性
	public static readonly formConfBase = class formConfBase extends RfieldDefine.commonConf {
		public defVal: any = "";
		public width: string = "100%";
		public rely: TJson = {
			type: "custom",
			relation: "",
		};
		constructor(RfDef: TRfDef) {
			super(RfDef);
		}
	};

	//列表设计基础属性
	public static readonly tableConfBase = class tableConfBase {
		public queryStyle: string = "default";
		// public queryOptions: TJson[] = [];
		// public link:any[] =[]
		public linkVal: any = "";
		public edit: boolean = true;
		public type: string = "";
		public defVal: any = "";
		public method: string = "eq";
		public fieldId: string = "";
		public title: TJson = {};
		constructor(RfDef: TRfDef) {
			this.type = RfDef.type;
			this.title = RfieldDefine.setDefaultTitle(RfDef.type);
		}
	};

	//多语言设置
	public static setDefaultTitle(type: string): TJson {
		let title: TJson = {};

		Object.keys(RfieldDefine.langConf).forEach((key) => {
			let lang: TJson = RfieldDefine.langConf[key];
			title[key] = lang["Rfield"][type];
		});
		return title;
	}

	public static setProp() {
		return Date.now() + "_" + Math.ceil(Math.random() * 99999);
	}
}
