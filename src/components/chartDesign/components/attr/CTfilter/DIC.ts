interface TDICITEM<T> {
	label: T;
	value: T;
}

interface TDIC {
	[key: string]: Array<TDICITEM<string | number>>;
}

export const DIC: TDIC = {
	input: [
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
		{
			label: "contain",
			value: "contain",
		},
		{
			label: "not_contain",
			value: "not_contain",
		},
	],
	textarea: [
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
		{
			label: "contain",
			value: "contain",
		},
		{
			label: "not_contain",
			value: "not_contain",
		},
	],
	select: [
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
	],
	radio: [
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
	],
	number: [
		{
			label: "between",
			value: "between",
		},
	],
	datetime: [
		{
			label: "between",
			value: "between",
		},
	],
	deptRadio: [
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
	],
	userRadio: [
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
	],
	user: [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "contain_all",
			value: "contain_all",
		},
		{
			label: "eq_all",
			value: "eq_all",
		},
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	],
	dept: [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "contain_all",
			value: "contain_all",
		},
		{
			label: "eq_all",
			value: "eq_all",
		},
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	],
	selectMulti: [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "contain_all",
			value: "contain_all",
		},
		{
			label: "eq_all",
			value: "eq_all",
		},
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	],
	checkbox: [
		{
			label: "contain_one",
			value: "contain_one",
		},
		{
			label: "contain_all",
			value: "contain_all",
		},
		{
			label: "eq_all",
			value: "eq_all",
		},
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	],
	uploadFile: [
		{
			label: "empty",
			value: "empty",
		},
		{
			label: "not_empty",
			value: "not_empty",
		},
	],
	creater: [
		{
			label: "eq",
			value: "eq",
		},
		{
			label: "ne",
			value: "ne",
		},
		{
			label: "contain_one",
			value: "contain_one",
		},
	],
	create_time: [
		{
			label: "between",
			value: "between",
		},
	],
	update_time: [
		{
			label: "between",
			value: "between",
		},
	],
	process_status: [
		{
			label: "eq",
			value: "eq",
		},
		{
			label: "ne",
			value: "ne",
		},
	],
	DATATYPE: [
		{
			label: "custom", //自定义
			value: 0,
		},
	],
};
