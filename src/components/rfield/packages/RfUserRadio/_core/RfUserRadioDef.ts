import RfieldDefine from "../../../core/RfieldDefine";

export default class RfUserRadioDef extends RfieldDefine {
	public static readonly type = "userRadio";

	public readonly formDefValComp = "AttrdefaultOrg";
	public readonly ext = {
		multiple: false,
	};

	private static instance: null | RfUserRadioDef;
	public static ins() {
		if (!RfUserRadioDef.instance) {
			RfUserRadioDef.instance = new RfUserRadioDef();
		}
		return RfUserRadioDef.instance;
	}
	public static readonly methods = [
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
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

	public static readonly chartMethods = RfUserRadioDef.methods;

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			constructor() {
				super(RfUserRadioDef);
				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultOrg", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfUserRadioDef);
				this.defVal = [];
				this.linkVal = "eq";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
				// 	// {
				// 	// 	label: "tableDesign.range",
				// 	// 	value: "select",
				// 	// },
				// ];
				// this.link = [
				//   {
				// 		label: "等于",
				// 		value: "eq",
				// 	},{
				// 		label: "不等于",
				// 		value: "ne",
				// 	},
				//   // {
				// 	// 	label: "开头为",
				// 	// 	value: "default",
				// 	// },
				//   {
				// 		label: "为空",
				// 		value: "empty",
				// 	},{
				// 		label: "不为空",
				// 		value: "not_empty",
				// 	},
				// ]
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultOrg", "TDreadonly"];
	};
}
