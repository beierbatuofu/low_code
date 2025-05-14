export const FList = [
	{
		type: "process_status",
		fieldId: "process_status",
		title: { en: "", zh: "流程状态" },
		queryOptions: [{ label: "tableDesign.default", value: "default" }],
		queryStyle: "default",
		defVal: "",
		edit: true,
		dicData: [
			{ label: "进行中", value: "1" },
			{ label: "流转完成", value: "9" },
			{ label: "强制结束", value: "8" },
		],
		method: "eq",
	},
	{
		type: "creater",
		fieldId: "creater",
		title: { en: "submitter", zh: "提交人" },
		queryOptions: [{ label: "tableDesign.default", value: "default" }],
		queryStyle: "default",
		defVal: [],
		edit: true,
		method: "eq",
		otherSelect: [
			{
				label: "tableDesign.default",
				value: "0",
			},
			{
				label: "tableDesign.currentUsers",
				value: "currentUsers",
			},
		],
		otherValue: "0",
	},
	{
		type: "create_time",
		fieldId: "create_time",
		title: { en: "Submission time", zh: "提交时间" },
		queryOptions: [
			{
				label: "tableDesign.range",
				value: "default",
			},
			{
				label: "tableDesign.dynamic",
				value: "select",
			},
		],
		queryStyle: "default",
		method: "between",
		defVal: [],
		edit: true,
	},
];
export const CList = [
	{
		type: "creater",
		fieldId: "creater",
		title: { en: "submitter", zh: "提交人" },
		queryOptions: [{ label: "tableDesign.default", value: "default" }],
		queryStyle: "default",
		defVal: [],
		edit: true,
		method: "eq",
		otherSelect: [
			{
				label: "tableDesign.default",
				value: "0",
			},
			{
				label: "tableDesign.currentUsers",
				value: "currentUsers",
			},
		],
		otherValue: "0",
	},
	{
		type: "create_time",
		fieldId: "create_time",
		title: { en: "Submission time", zh: "提交时间" },
		queryOptions: [
			{
				label: "tableDesign.range",
				value: "default",
			},
			{
				label: "tableDesign.dynamic",
				value: "select",
			},
		],
		queryStyle: "default",
		method: "between",
		defVal: [],
		edit: true,
	},
	{
		type: "update_time",
		fieldId: "update_time",
		title: { en: "Update time", zh: "更新时间" },
		queryOptions: [
			{
				label: "tableDesign.range",
				value: "default",
			},
			{
				label: "tableDesign.dynamic",
				value: "select",
			},
		],
		queryStyle: "default",
		method: "between",
		defVal: [],
		edit: true,
	},
];
