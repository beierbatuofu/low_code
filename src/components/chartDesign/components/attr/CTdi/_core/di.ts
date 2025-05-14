export const FList = [
	{
		title: {
			zh: "流程状态",
			en: "process_status",
		},
		code: "process_status",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "process_status",
	},
	{
		title: {
			zh: "提交人",
			en: "submitter",
		},
		code: "creater",

		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "creater",
		fieldIdAsName: "",
	},
	{
		title: {
			zh: "提交时间",
			en: "create_time",
		},
		code: "create_time",
		type: "create_time",
		sort: "desc",
		fieldId: "create_time",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "create_time",
		fieldIdAsName: "",
		dateTimeSummary: "DATE",
	},
];
export const CList = [
	{
		title: {
			zh: "提交人",
			en: "submitter",
		},
		code: "creater",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "creater",
		fieldIdAsName: "",
	},
	{
		title: {
			zh: "提交时间",
			en: "create_time",
		},
		code: "create_time",
		type: "create_time",
		fieldId: "create_time",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "create_time",
		fieldIdAsName: "",
		dateTimeSummary: "DATE",
	},
	{
		title: {
			zh: "更新时间",
			en: "update_time",
		},
		code: "update_time",
		type: "update_time",
		fieldId: "update_time",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "update_time",
		fieldIdAsName: "",
		dateTimeSummary: "DATE",
	},
];
