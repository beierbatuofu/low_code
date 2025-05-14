export const tableDefaultConfig = [
	{
		title: {
			zh: "维度",
			en: "dimension",
		},
		code: "dimension",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "dimension",
	},
	{
		title: {
			zh: "指标",
			en: "indicator",
		},
		code: "indicator",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "indicator",
	},
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
	},
	{
		title: {
			zh: "提交时间",
			en: "create_time",
		},
		code: "create_time",
		sort: "desc",
		tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
		dataTypeEnum: "create_time",
	},
];

export const tableDefaultData = [
	{
		dimension: "维度一",
		indicator: "20",
		process_status: "1",
		creater: "王鹤",
		create_time: "1970.1.1",
	},
	{
		dimension: "维度二",
		indicator: "25",
		process_status: "1",
		creater: "王鹤",
		create_time: "1970.1.1",
	},
	{
		dimension: "维度三",
		indicator: "38",
		process_status: "1",
		creater: "王鹤",
		create_time: "1970.1.1",
	},
	{
		dimension: "维度四",
		indicator: "14",
		process_status: "1",
		creater: "王鹤",
		create_time: "1970.1.1",
	},
	{
		dimension: "维度五",
		indicator: "18 ",
		process_status: "1",
		creater: "王鹤",
		create_time: "1970.1.1",
	},
];
