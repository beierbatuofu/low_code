/*
 * @Author: your name
 * @Date: 2021-08-10 18:11:32
 * @LastEditTime: 2022-04-15 17:39:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code-zero-ui\src\components\rfield\packages\RfDeptRadio\_core\RfDeptRadioDef.ts
 */
import RfieldDefine from "../../../core/RfieldDefine";

export default class RfDeptRadioDef extends RfieldDefine {
	public static readonly type = "deptRadio";

	private static instance: null | RfDeptRadioDef;
	public static ins() {
		if (!RfDeptRadioDef.instance) {
			RfDeptRadioDef.instance = new RfDeptRadioDef();
		}
		return RfDeptRadioDef.instance;
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
	];

	public static readonly chartMethods = RfDeptRadioDef.methods;

	public readonly formDefValComp = "AttrdefaultOrg";
	public readonly ext = {
		textRange: {
			minInfinity: 0,
			maxInfinity: 300,
		},
		multiple: false,
	};

	public readonly FormConf = class FormConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//表单设计数据
		public fieldConf: TJson = new (class FormAttrData extends (RfieldDefine as Record<string, any>).formConfBase {
			constructor() {
				super(RfDeptRadioDef);

				this.defVal = [];
			}
		})();
		public static readonly fieldSort: string[] = ["AttrType", "AttrFieldId", "AttrTitle", "AttrDesc", "AttrdefaultOrg", "AttrVisible", "AttrEdit", "AttrRequired", "AttrWidth"];
	};

	public readonly QueryConf = class QueryConf extends (RfieldDefine as Record<string, any>).AttrUISort {
		//列表设计数据
		public fieldConf = new (class QueryAttrData extends (RfieldDefine as Record<string, any>).tableConfBase {
			constructor() {
				super(RfDeptRadioDef);
				this.defVal = [];
				this.linkVal = "eq";

				// this.queryOptions = [
				// 	{
				// 		label: "tableDesign.default",
				// 		value: "default",
				// 	},
				// 	// {
				// 	// 	label: "tableDesign.range",
				// 	// 	value: "select",
				// 	// },
				// ];
				// this.link = [
				//   {
				// 		label: "等于",
				// 		value: "eq",
				// 	},{
				// 		label: "不等于",
				// 		value: "ne",
				// 	},
				//   // {
				// 	// 	label: "开头为",
				// 	// 	value: "default",
				// 	// },
				//   {
				// 		label: "为空",
				// 		value: "empty",
				// 	},{
				// 		label: "不为空",
				// 		value: "not_empty",
				// 	},
				// ]
			}
		})();
		public static readonly fieldSort: string[] = ["TDdefaultOrg", "TDreadonly"];
	};
}
