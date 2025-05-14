import RfieldDefine from "../../../core/RfieldDefine";

export default class RfSelectDef extends RfieldDefine {
	public static readonly type = "select";
	private static instance: null | RfSelectDef;
	public static ins() {
		if (!RfSelectDef.instance) {
			RfSelectDef.instance = new RfSelectDef();
		}
		return RfSelectDef.instance;
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

	public static readonly chartMethods = RfSelectDef.methods;

	public readonly ext = {
		// multiple:false
	};
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
					value: "2",
				},
			];
			constructor() {
				super(RfSelectDef);

				this.defVal = "";
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultSelect", "AttrDicData", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfSelectDef);
				this.linkVal = "eq";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
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
		public static readonly fieldSort: string[] = ["TDdefaultSelect", "TDreadonly"];
	};
}
