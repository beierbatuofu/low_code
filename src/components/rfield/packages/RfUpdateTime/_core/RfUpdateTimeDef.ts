import RfieldDefine from "../../../core/RfieldDefine";

export default class RfUpdateTimeDef extends RfieldDefine {
	public static readonly type = "update_time";
	private static instance: null | RfUpdateTimeDef;
	public static ins() {
		if (!RfUpdateTimeDef.instance) {
			RfUpdateTimeDef.instance = new RfUpdateTimeDef();
		}
		return RfUpdateTimeDef.instance;
	}

	public readonly ext = {};
	public readonly queryComp = "RfieldUpdateTime";
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
	public readonly FormConf = class FormConf extends RfieldDefine.AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public dateFormat = "yyyy-MM-dd HH:mm";
			constructor() {
				super(RfUpdateTimeDef);
			}
		})();
		public static readonly fieldSort: string[] = ["type", "title", "titleShow", "desc", "dateFormat", "value", "visible", "edit", "required", "width"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public fieldId = "update_time";
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
				super(RfUpdateTimeDef);
				this.defVal = [];
				this.linkVal = "between";
				// this.queryOptions = [
				//   {
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
