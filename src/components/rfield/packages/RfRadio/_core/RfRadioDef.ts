import RfieldDefine from "../../../core/RfieldDefine";

export default class RfRadioDef extends RfieldDefine {
	public static readonly type = "radio";
	private static instance: null | RfRadioDef;
	public static ins() {
		if (!RfRadioDef.instance) {
			RfRadioDef.instance = new RfRadioDef();
		}
		return RfRadioDef.instance;
	}

	public readonly queryComp = "RfieldSelect";

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

	public static readonly chartMethods = RfRadioDef.methods;

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
					value: "3",
				},
			];
			public checkLayout = "vertical";
			constructor() {
				super(RfRadioDef);
				this.defVal = "";
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
				super(RfRadioDef);
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
