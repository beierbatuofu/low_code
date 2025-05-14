import RfieldDefine from "../../../core/RfieldDefine";

export default class RfUploadFileDef extends RfieldDefine {
	public static readonly type = "uploadFile";
	public readonly queryComp = "RfieldSelect";
	private static instance: null | RfUploadFileDef;
	public static ins() {
		if (!RfUploadFileDef.instance) {
			RfUploadFileDef.instance = new RfUploadFileDef();
		}
		return RfUploadFileDef.instance;
	}

	public readonly ext = {};

	public static readonly methods = [
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	];

	public static readonly chartMethods = RfUploadFileDef.methods;

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public multiple: boolean = false;

			constructor() {
				super(RfUploadFileDef);
				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrVisible", "AttrEdit", "AttrRequired", "AttrMultiple", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			// public queryOptions = [
			//   {
			//     label: "tableDesign.range",
			//     value: "default",
			//   },
			//   {
			//     label: "tableDesign.dynamic",
			//     value: "select",
			//   },
			// ];
			public link = [
				{
					label: "为空",
					value: "empty",
				},
				{
					label: "不为空",
					value: "not_empty",
				},
			];
			constructor() {
				super(RfUploadFileDef);

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
		public static readonly fieldSort: string[] = ["TDlink", "TDreadonly"];
	};
}
