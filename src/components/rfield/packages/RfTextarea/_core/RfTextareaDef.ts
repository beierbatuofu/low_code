import RfieldDefine from "../../../core/RfieldDefine";

export default class RfTextareaDef extends RfieldDefine {
	public static readonly type = "textarea";
	public readonly ext = {
		textRange: {
			min: 0,
			max: 5000,
		},
	};
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
	public static readonly chartMethods = RfTextareaDef.methods;

	private static instance: null | RfTextareaDef;
	public static ins() {
		if (!RfTextareaDef.instance) {
			RfTextareaDef.instance = new RfTextareaDef();
		}
		return RfTextareaDef.instance;
	}

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
				codeType: "scanQrCode",
			};

			public textRange = {
				enable: false,
				min: "undefined",
				max: "undefined",
			};
			constructor() {
				super(RfTextareaDef);
			}
		})();
		public static readonly fieldSort: string[] = [
			"AttrType",
			"AttrFieldId",
			"AttrTitle",
			"AttrDesc",
			"AttrdefaultInput",
			"AttrVisible",
			"AttrEdit",
			"AttrRequired",
			"AttrNoSameVal",
			"AttrTextRange",
			"AttrWidth",
		];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfTextareaDef);
				this.linkVal = "contain";
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
