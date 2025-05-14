import RfieldDefine from "../../../core/RfieldDefine";

export default class RfInputDef extends RfieldDefine {
	public static readonly type = "input";
	private static instance: null | RfInputDef;
	public static ins() {
		if (!RfInputDef.instance) {
			RfInputDef.instance = new RfInputDef();
		}
		return RfInputDef.instance;
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
		{
			label: "contain",
			value: "contain",
		},
		{
			label: "not_contain",
			value: "not_contain",
		},
	];

	public static readonly chartMethods = RfInputDef.methods;

	public readonly ext = {
		textRange: {
			min: 0,
			max: 300,
		},
	};

	public FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
			};
			public textRange = {
				enable: false,
				min: "undefined",
				max: "undefined",
			};
			constructor() {
				super(RfInputDef);
			}
		})();

		public static readonly fieldSort: string[] = [
			"AttrType",
			"AttrFieldId",
			"AttrTitle",
			"AttrDesc",
			"AttrdefaultInput",
			"AttrScanQrCode",
			"AttrVisible",
			"AttrEdit",
			"AttrRequired",
			"AttrNoSameVal",
			"AttrTextRange",
			"AttrWidth",
		];
	};

	public QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
			};
			constructor() {
				super(RfInputDef);
				this.linkVal = "contain";
				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
				// ];

				// this.link = [
				//   {
				// 		label: "包含",
				// 		value: "like",
				// 	},{
				// 		label: "不包含",
				// 		value: "unlike",
				// 	},{
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
		public static readonly fieldSort: string[] = ["TDdefaultValue", "TDreadonly"];
	};
}
