import RfieldDefine from "../../../core/RfieldDefine";

export default class RfTableDef extends RfieldDefine {
	public static readonly type = "table";

	private static instance: null | RfTableDef;
	public static ins() {
		if (!RfTableDef.instance) {
			RfTableDef.instance = new RfTableDef();
		}
		return RfTableDef.instance;
	}

	public readonly formDefValComp = "";
	public readonly ext = {};

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).commonConf {
			public children: any[] = [];
			public rely: TJson = {
				type: "relation",
				relation: "",
			};
			constructor() {
				super(RfTableDef);
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrTitle", "AttrDesc", "AttrVisible", "AttrEdit", "AttrdefaultInput", "AttrRequired"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfTableDef);

				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
				// 	{
				// 		label: "tableDesign.range",
				// 		value: "select",
				// 	},
				// ];
			}
		})();
		public static readonly fieldSort: string[] = ["type", "value", "readyOnlay"];
	};
}
