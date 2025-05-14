import RfieldDefine from "../../../core/RfieldDefine";

export default class RfCreateTimeDef extends RfieldDefine {
	public static readonly type = "create_time";
	private static instance: null | RfCreateTimeDef;
	public static ins() {
		if (!RfCreateTimeDef.instance) {
			RfCreateTimeDef.instance = new RfCreateTimeDef();
		}
		return RfCreateTimeDef.instance;
	}

	public readonly ext = {};
	public readonly queryComp = "RfieldCreateTime";
	public readonly formDefValComp = "AttrdefaultDatetime";
	public readonly queryDefValComp = "TDdefaultDate";
	public static readonly methods = [
		{
			label: "between",
			value: "between",
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
			public fieldId = "create_time";
			constructor() {
				super(RfCreateTimeDef);
			}
		})();
		public static readonly fieldSort: string[] = [];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public fieldId = "create_time";
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
				super(RfCreateTimeDef);
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
