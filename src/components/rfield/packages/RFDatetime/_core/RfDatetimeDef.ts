import RfieldDefine from "../../../core/RfieldDefine";

export default class RfDatetimeDef extends RfieldDefine {
	public static readonly type = "datetime";
	private static instance: null | RfDatetimeDef;
	public static ins() {
		if (!RfDatetimeDef.instance) {
			RfDatetimeDef.instance = new RfDatetimeDef();
		}
		return RfDatetimeDef.instance;
	}

	public readonly ext = {};
	public readonly formDefValComp = "AttrdefaultDatetime";
	public static readonly methods = [
		{
			label: "between",
			value: "between",
		},
		{
			label: "eq_ymd",
			value: "eq_ymd",
		},
		{
			label: "eq_ym",
			value: "eq_ym",
		},
		{
			label: "eq_year",
			value: "eq_year",
		},
	];

	public static readonly chartMethods = [
		{
			label: "between",
			value: "between",
		},
		{
			label: "dynamic",
			value: "dynamic",
		},
	];

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public dateFormat = "yyyy-MM-dd HH:mm";
			constructor() {
				super(RfDatetimeDef);
				this.defVal = "";
			}
		})();
		public static readonly fieldSort: string[] = [
			"AttrType",
			"AttrFieldId",
			"AttrTitle",
			"AttrDesc",
			"AttrDateFormat",
			"AttrdefaultDatetime",
			"AttrVisible",
			"AttrEdit",
			"AttrRequired",
			"AttrWidth",
		];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public queryOptions = [
				{
					label: "tableDesign.range",
					value: "default",
				},
				{
					label: "tableDesign.dynamic",
					value: "select",
				},
			];
			constructor() {
				super(RfDatetimeDef);
				this.defVal = [];
				this.linkVal = "between";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.range",
				// 		value: "default",
				// 	},
				// 	{
				// 		label: "tableDesign.dynamic",
				// 		value: "select",
				// 	},
				// ];
			}
		})();
		public static readonly fieldSort: string[] = ["TDqueryStyle", "TDdefaultDate", "TDreadonly"];
	};
}
