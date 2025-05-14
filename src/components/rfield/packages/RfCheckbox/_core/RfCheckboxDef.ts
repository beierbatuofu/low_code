import RfieldDefine from "../../../core/RfieldDefine";

export default class RfCheckboxDef extends RfieldDefine {
	public static readonly type = "checkbox";
	private static instance: null | RfCheckboxDef;
	public static ins() {
		if (!RfCheckboxDef.instance) {
			RfCheckboxDef.instance = new RfCheckboxDef();
		}
		return RfCheckboxDef.instance;
	}
	public readonly queryComp = "RfieldSelectMulti";
	public readonly ext = {
		// multiple:false
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

	public static readonly chartMethods = RfCheckboxDef.methods;

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
			public checkLayout = "vertical";
			constructor() {
				super(RfCheckboxDef);
				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = [
			"AttrType",
			"AttrFieldId",
			"AttrTitle",
			"AttrDesc",
			"AttrdefaultSelect",
			"AttrDicData",
			"AttrVisible",
			"AttrEdit",
			"AttrRequired",
			"AttrCheckLayout",
			"AttrWidth",
		];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfCheckboxDef);
				this.defVal = [];
				this.linkVal = "contain_all";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
				// ];
				//   this.link = [
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
