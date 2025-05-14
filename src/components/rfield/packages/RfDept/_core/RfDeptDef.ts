import RfieldDefine from "../../../core/RfieldDefine";

export default class RfDeptDef extends RfieldDefine {
	public static readonly type = "dept";
	public readonly formDefValComp = "AttrdefaultOrg";
	public readonly ext = {};

	private static instance: null | RfDeptDef;
	public static ins() {
		if (!RfDeptDef.instance) {
			RfDeptDef.instance = new RfDeptDef();
		}
		return RfDeptDef.instance;
	}
	public static readonly methods = [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "contain_all",
			value: "contain_all",
		},
		{
			label: "eq_all",
			value: "eq_all",
		},
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	];

	public static readonly chartMethods = RfDeptDef.methods;

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			constructor() {
				super(RfDeptDef);
				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultOrg", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfDeptDef);
				this.defVal = [];
				this.linkVal = "contain_all";
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
				// 		label: "包含任意一个",
				// 		value: "contain_either",
				// 	},{
				// 		label: "同时包含",
				// 		value: "contain_multiple",
				// 	},{
				// 		label: "全等",
				// 		value: "eq",
				// 	},{
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
