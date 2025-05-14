import RfieldDefine from "../../../core/RfieldDefine";

export default class RfTableSetDef extends RfieldDefine {
	public static readonly type = "tableSet";
	private static instance: null | RfTableSetDef;
	public static ins() {
		if (!RfTableSetDef.instance) {
			RfTableSetDef.instance = new RfTableSetDef();
		}
		return RfTableSetDef.instance;
	}
	public readonly formDefValComp = "AttrdefaultSelect";
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
			constructor() {
				super(RfTableSetDef);

				this.defVal = "";
			}
		})();
		public static readonly fieldSort: string[] = ["type", "title", "titleShow", "desc", "dicData", "defVal", "visible", "edit", "required", "width"];
	};

	public readonly QueryConf = class QueryConf {
		//列表设计数据
		public fieldConf = new (class QueryAttrData {
			public tableSet = true;
			public sortCondition = "create_time";
			public pageSize = "10";
			public fieldId = "tableSet";
			public sortOptions = [
				{
					label: "提交时间",
					value: "create_time",
				},
				{
					label: "更新时间",
					value: "update_time",
				},
				{
					label: "流程状态",
					value: "process_status",
				},
			];
			public pageOptios = [
				{
					label: "5条",
					value: "5",
				},
				{
					label: "10条",
					value: "10",
				},
				{
					label: "20条",
					value: "20",
				},
				{
					label: "50条",
					value: "50",
				},
			];
			public headerFilter = "no";
			public sortOrder = "desc"; //排序顺序 （升序asc，降序desc）
			public type = "tableSet";
			constructor() {}
		})();
	};
}
