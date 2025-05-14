import RfieldDefine from "../../../core/RfieldDefine";

export default class RfSelectMultiDef extends RfieldDefine {
	public static readonly type = "selectMulti";

	private static instance: null | RfSelectMultiDef;
	public static ins() {
		if (!RfSelectMultiDef.instance) {
			RfSelectMultiDef.instance = new RfSelectMultiDef();
		}
		return RfSelectMultiDef.instance;
	}

	public readonly ext = {
		multiple: true,
	};

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

	public static readonly chartMethods = RfSelectMultiDef.methods;

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public dicData = [
				{
					label: "选项一",
					value: "0",
				},
				{
					label: "选项二",
					value: "1",
				},
				{
					label: "选项三",
					value: "3",
				},
			];
			constructor() {
				super(RfSelectMultiDef);
				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultSelect", "AttrDicData", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfSelectMultiDef);
				this.defVal = [];
				this.linkVal = "contain_all";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
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
		public static readonly fieldSort: string[] = ["TDdefaultSelect", "TDreadonly"];
	};
}
