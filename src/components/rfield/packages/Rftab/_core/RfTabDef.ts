import RfieldDefine from "../../../core/RfieldDefine";

export default class RfTabDef extends RfieldDefine {
	public static readonly type = "tab";
	private static instance: null | RfTabDef;
	public static ins() {
		if (!RfTabDef.instance) {
			RfTabDef.instance = new RfTabDef();
		}
		return RfTabDef.instance;
	}
	public ext = {};

	public static setOption() {
		let title = JSON.stringify(RfieldDefine.setDefaultTitle("pane"));
		let end = Math.ceil(Math.random() * 99999);
		let start = Math.ceil(Math.random() * 10000);

		return {
			title: JSON.parse(title),
			id: new Date().getTime() + end.toString(16),
			configList: [],
		};
	}

	public FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).commonConf {
			public children: TJson[] = [];

			constructor() {
				super(RfTabDef);
				new Array(3).fill({}).forEach((item: Record<string, any>, idx: number) => {
					let map = RfTabDef.setOption();
					Object.keys(map.title).forEach((lang: string) => {
						map.title[lang] = map.title[lang] + (idx + 1);
					});
					this.children.push(map);
				});
			}
		})();

		public static readonly fieldSort: string[] = ["AttrType", "AttrTitle", "AttrDesc", "AttrTab"];
	};

	public QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public scanQrCode = {
				allowScan: false,
				editable: true,
			};
			constructor() {
				super(RfTabDef);
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultValue", "TDreadonly"];
	};
}
