import RfieldDefine from "../../../core/RfieldDefine";

export default class RfCeaterDef extends RfieldDefine {
	public static readonly type = "creater";
	private static instance: null | RfCeaterDef;
	public static ins() {
		if (!RfCeaterDef.instance) {
			RfCeaterDef.instance = new RfCeaterDef();
		}
		return RfCeaterDef.instance;
	}

	public readonly queryComp = "RfieldCreater";
	public readonly formDefValComp = "AttrdefaultOrg";

	public static readonly methods = [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "eq",
			value: "eq",
		},
		{
			label: "ne",
			value: "ne",
		},
	];

	public static readonly chartMethods = RfCeaterDef.methods;

	public readonly ext = {
		multiple: true,
	};
	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			constructor() {
				super(RfCeaterDef);

				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["type", "title", "titleShow", "desc", "defVal", "visible", "edit", "required", "width"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public fieldId = "creater";
			public defVal = [];
			constructor() {
				super(RfCeaterDef);
				this.linkVal = "eq";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	}
				// ];
			}
		})();
		public static readonly fieldSort: string[] = ["TDfieldOther", "TDreadonly"];
	};
}
