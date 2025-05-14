const baseMethods = [
	{
		value: "COUNT",
		label: "COUNT",
	},
	{
		value: "COUNT_CONTAIN_NULL",
		label: "COUNT_CONTAIN_NULL",
	},
];

export const gatherMethods = {
	input: baseMethods,
	number: [
		{
			value: "COUNT",
			label: "COUNT",
		},
		{
			value: "COUNT_CONTAIN_NULL",
			label: "COUNT_CONTAIN_NULL",
		},
		{
			value: "SUM",
			label: "SUM",
		},
		{
			value: "AVG",
			label: "AVG",
		},
		{
			value: "MAX",
			label: "MAX",
		},
		{
			value: "MIN",
			label: "MIN",
		},
	],
	datetime: baseMethods,
	userRadio: baseMethods,
	deptRadio: baseMethods,
	dept: baseMethods,
	selectMulti: baseMethods,
	user: baseMethods,
	checkbox: baseMethods,
	select: baseMethods,
	radio: baseMethods,
	creater: baseMethods,
	create_time: baseMethods,
	update_time: baseMethods,
	process_status: baseMethods,
	sn: baseMethods,
	address: baseMethods,
};

const dateTimeMethods = [
	{
		value: "YEAR",
		label: "年",
	},
	{
		value: "QUARTER",
		label: "年-季",
	},
	{
		value: "MONTH",
		label: "年-月",
	},
	{
		value: "WEEK",
		label: "年-周",
	},
	{
		value: "DATE",
		label: "年-月-日",
	},
	// {
	// 	value: "HOUR",
	// 	label: "年-月-日-时",
	// },
];

const multiMethods = [
	{
		value: "one",
		label: "methodOne",
	},
	{
		value: "mut",
		label: "methodMut",
	},
];

export const fieldGatherMethodOptions = {
	datetime: dateTimeMethods,
	create_time: dateTimeMethods,
	update_time: dateTimeMethods,
	checkbox: multiMethods,
	selectMulti: multiMethods,
	dept: multiMethods,
	user: multiMethods,
};

export const fieldGatherMethods = ["datetime", "create_time", "update_time"];
export const fieldCheck = ["checkbox", "dept", "user", "selectMulti"];
export const dateAdd = {
	WEEK: "周",
	QUARTER: "季度",
	MONTH: "月",
	DATE: "",
	YEAR: "年",
};
