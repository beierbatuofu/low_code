/*
 * @Author: your name
 * @Date: 2021-08-10 18:11:32
 * @LastEditTime: 2022-04-15 17:55:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code-zero-ui\src\components\rfield\packages\RfStatusSelect\_core\RfStatusSelectDef.ts
 */
import RfieldDefine from "../../../core/RfieldDefine";

export default class RfStatusSelectDef extends RfieldDefine {
	public static readonly type = "process_status";
	private static instance: null | RfStatusSelectDef;
	public static ins() {
		if (!RfStatusSelectDef.instance) {
			RfStatusSelectDef.instance = new RfStatusSelectDef();
		}
		return RfStatusSelectDef.instance;
	}
	public readonly queryComp = "RfieldStatusSelect";
	public readonly formDefValComp = "AttrdefaultSelect";
	public readonly ext = {};

	public static readonly methods = [
		{
			label: "eq",
			value: "eq",
		},
	];

	public static readonly chartMethods = RfStatusSelectDef.methods;

	public FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			public dicData = [
				{ label: "进行中", value: "1" },
				{ label: "流转完成", value: "9" },
				{ label: "强制结束", value: "8" },
			];
			constructor() {
				super(RfStatusSelectDef);
			}
		})();
		public static readonly fieldSort: string[] = ["type", "title", "titleShow", "desc", "dicData", "value", "visible", "edit", "required", "width", "tableWidth"];
	};

	public QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			public dicData = [
				{ label: "进行中", value: "1" },
				{ label: "流转完成", value: "9" },
				{ label: "强制结束", value: "8" },
			];
			public fieldId = "process_status";
			constructor() {
				super(RfStatusSelectDef);
				this.linkVal = "eq";
				// 	this.queryOptions = [
				//     {
				//         label: "tableDesign.default",
				//         value: "default",
				//     }
				// ]
			}
		})();

		public static readonly fieldSort: string[] = ["TDdefaultSelect", "TDreadonly"];
	};
}
