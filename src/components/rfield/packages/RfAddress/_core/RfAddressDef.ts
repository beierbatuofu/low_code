import RfieldDefine from "../../../core/RfieldDefine";

export default class RfAddressDef extends RfieldDefine {
	public static readonly type = "address";
	public readonly queryComp = "RfieldInput";
	private static instance: null | RfAddressDef;
	public static ins() {
		if (!RfAddressDef.instance) {
			RfAddressDef.instance = new RfAddressDef();
		}
		return RfAddressDef.instance;
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

	public static readonly chartMethods = RfAddressDef.methods;

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
				super(RfAddressDef);
				this.defVal = {
					province: "",
					city: "",
					district: "",
					detail: "",
				};
			}
		})();

		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultAddress", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
			};
			constructor() {
				super(RfAddressDef);
				this.linkVal = "contain";
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultValue", "TDreadonly"];
	};
}
