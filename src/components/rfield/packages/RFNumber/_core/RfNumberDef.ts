import RfieldDefine from "../../../core/RfieldDefine.ts";

export default class RfNumberDef extends RfieldDefine {
	public static readonly type = "number";

	private static instance: null | RfNumberDef;
	public static ins() {
		if (!RfNumberDef.instance) {
			RfNumberDef.instance = new RfNumberDef();
		}
		return RfNumberDef.instance;
	}

	public readonly formDefValComp = "AttrdefaultNumber";
	public readonly ext = {
		// numRange: {
		// 	minInfinity: 0,
		// 	maxInfinity: 300,
		// },
	};

	public static readonly methods = [
		{
			label: "between",
			value: "between",
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
			label: "gt",
			value: "gt",
		},
		{
			label: "ge",
			value: "ge",
		},
		{
			label: "lt",
			value: "lt",
		},
		{
			label: "le",
			value: "le",
		},
	];

	public static readonly chartMethods = RfNumberDef.methods;

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		public fieldConf: TJson = new (class FormAttrDate extends (RfieldDefine as Record<string, any>).formConfBase {
			public numRange = {
				enable: false,
				min: "undefined",
				max: "undefined",
			};
			public numFormat = {
				format: "number",
				allowDecimalDigits: false,
				decimalDigitsNum: 0,
			};
			constructor() {
				super(RfNumberDef);
				this.defVal = undefined;
			}
		})();
		public static readonly fieldSort: string[] = [
			"AttrType",
			"AttrFieldId",
			"AttrTitle",
			"AttrDesc",
			"AttrNumFormat",
			"AttrdefaultNumber",
			"AttrVisible",
			"AttrEdit",
			"AttrRequired",
			"AttrNoSameVal",
			"AttrNumRange",
			"AttrWidth",
		];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		public fieldConf = new (class FormAttrDate extends (RfieldDefine as Record<string, any>).tableConfBase {
			public numRange = {
				enable: false,
				min: "undefined",
				max: "undefined",
				minInfinity: Number("9".repeat(15) + "8") * -1,
				maxInfinity: Number("9".repeat(15) + "8") * 1,
			};
			public numFormat = {
				format: "number",
				allowDecimalDigits: false,
				decimalDigitsNum: 6,
			};

			constructor() {
				super(RfNumberDef);
				this.defVal = {
					"0": "undefined",
					"1": "undefined",
				};
				this.linkVal = "between";
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultNumber", "TDreadonly"];
	};
}
