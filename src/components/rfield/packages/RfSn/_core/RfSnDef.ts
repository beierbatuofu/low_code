import RfieldDefine from "../../../core/RfieldDefine";

export default class RfSnDef extends RfieldDefine {
	public static readonly type = "sn";
	private static instance: null | RfSnDef;
	public static ins() {
		if (!RfSnDef.instance) {
			RfSnDef.instance = new RfSnDef();
		}
		return RfSnDef.instance;
	}
	public ext = {};

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

	public static readonly chartMethods = RfSnDef.methods;

	public FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			private rules = [
				{
					type: "count",
					digitsNum: 4,
					check: true,
				},
				{
					type: "createTime",
					format: "yyyyMMdd",
					check: true,
				},
				{
					type: "fixedChars",
					value: "",
					check: true,
				},
				{
					type: "field",
					fieldId: "",
					check: true,
				},
			];
			constructor() {
				super(RfSnDef);
				this.fieldId = "sn";
			}
		})();

		public static readonly fieldSort: string[] = ["AttrType", "AttrTitle", "AttrDesc", "AttrVisible", "AttrSnRule", "AttrWidth"];
	};

	public QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
			};
			constructor() {
				super(RfSnDef);
				this.linkVal = "contain";
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultValue", "TDreadonly"];
	};
}
