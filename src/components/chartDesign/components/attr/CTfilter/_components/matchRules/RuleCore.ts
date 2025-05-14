export interface TRowData {
	type: string; // type 字段类型
	dataType: 0 | 1; //dataType  0-自定义 直接取judgeValues的值  1-匹配字段 直接judgeValues当作key从输入参数中取value
	targetFieldCode: string; // targetFieldCode:目标字段fieldId
	judgeValues: any[]; // judgeValues:[value],
	method: string; // method : 条件
	parentSubFormTargetFieldCode: string; // parentSubFormTargetFieldCode:父层fieldId(子表格)
}

export default class RuleCore {
	public static instance: RuleCore | null = null;
	public static ins() {
		if (!(RuleCore.instance instanceof RuleCore)) {
			RuleCore.instance = new RuleCore();
		}
		return RuleCore.instance;
	}

	public createRowData(): TRowData {
		return {
			type: "input",
			dataType: 0,
			method: "",
			targetFieldCode: "",
			judgeValues: [],
			parentSubFormTargetFieldCode: "",
		};
	}

	public createDefRowData(): [TRowData][] {
		return [[this.createRowData()]];
	}
}
