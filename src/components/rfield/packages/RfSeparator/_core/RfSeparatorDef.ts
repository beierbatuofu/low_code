import RfieldDefine from "../../../core/RfieldDefine";

export default class RfSeparatorDef extends RfieldDefine {
	public static readonly type = "separator";

	private static instance: null | RfSeparatorDef;
	public static ins() {
		if (!RfSeparatorDef.instance) {
			RfSeparatorDef.instance = new RfSeparatorDef();
		}
		return RfSeparatorDef.instance;
	}

	public readonly formDefValComp = "";
	public readonly ext = {};

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public lineStyle = {
				color: "#989898",
				lineType: "thin",
			};
			constructor() {
				super(RfSeparatorDef);
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrVisible", "AttrLineStyle"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfSeparatorDef);
			}
		})();
		public static readonly fieldSort: string[] = [];
	};
}
