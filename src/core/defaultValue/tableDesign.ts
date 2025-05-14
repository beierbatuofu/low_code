export interface TFieldConfig {
	process_status: TJson;
	create_time: TJson;
	input: TJson;
	number: TJson;
	datetime: TJson;
	textarea: TJson;
	dept: TJson;
	user: TJson;
	radio: TJson;
	checkbox: TJson;
	select: TJson;
	add: TJson;
	import: TJson;
	export: TJson;
	batch: TJson;
	delete: TJson;
	recover: TJson;
	table: TJson;
	selectMulti: TJson;
	update_time: TJson;
	tableSet: TJson;
	deptRadio: TJson;
	userRadio: TJson;
	// updater: TJson;
	creater: TJson;
}

export const defaultAttr = {
	inputStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	numberStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	datetimeStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
		{
			label: "tableDesign.range",
			value: "select",
		},
	],
	textareaStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	userStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	deptStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	radiosStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	checkboxStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	selectStyle: [
		{
			label: "tableDesign.default",
			value: "default",
		},
	],
	otherSelect: [
		{
			label: "tableDesign.default",
			value: "0",
		},
		{
			label: "tableDesign.currentUsers",
			value: "1",
		},
	],
	dateOptions: [
		{
			label: "tableDesign.today",
			value: "today",
		},
		{
			label: "tableDesign.yesterday",
			value: "yesterday",
		},
		{
			label: "tableDesign.theWeek",
			value: "theWeek",
		},
		{
			label: "tableDesign.lastWeek",
			value: "lastWeek",
		},
		{
			label: "tableDesign.theMonth",
			value: "theMonth",
		},
		{
			label: "tableDesign.lastMonth",
			value: "lastMonth",
		},
		{
			label: "tableDesign.theYear",
			value: "theYear",
		},
		{
			label: "tableDesign.lastYear",
			value: "lastYear",
		},
		{
			label: "tableDesign.last7day",
			value: "last7day",
		},
		{
			label: "tableDesign.last30day",
			value: "last30day",
		},
		{
			label: "tableDesign.last90day",
			value: "last90day",
		},
	],
	defaultValue: {
		type: "",
		//默认值
		custom: "",
		//数据关联
		relation: {},
	},
	defaultOrgMulit: {
		type: "",
		custom: [],
		multiple: false,
	},
	defaultOrgMulitEs: {
		type: "",
		custom: [],
		multiple: true,
	},
	defaultdicData: [
		{ label: "进行中", value: "1" },
		{ label: "流转完成", value: "9" },
		{ label: "强制结束", value: "8" },
	],
	defaultSeqData: [
		// {
		// 	label: "时间日期字段",
		// 	value: "0",
		// },
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
	],
	defaultpageData: [
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
	],
};

export const fieldsConfig: TFieldConfig = {
	process_status: {
		style: defaultAttr.selectStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		component: "RfieldStatusSelect",
		defaultValueComponent: "TDdefaultSelect",
		defVal: "",
		readonly: false,
		edit: true,
		visible: true,
		dicData: defaultAttr.defaultdicData,
		method: "eq",
		title: {
			zh: "流程状态",
			en: "",
		},
	},
	create_time: {
		style: defaultAttr.datetimeStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		dateOptions: defaultAttr.dateOptions,
		defaultValueComponent: "TDdefaultDate",
		component: "RfieldCreateTime",
		method: "between",
		defVal: "",
		title: {
			zh: "提交时间",
			en: "Submission time",
		},
		readonly: false,
		edit: true,
		visible: true,
	},
	creater: {
		style: defaultAttr.userStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDfieldOther",
		defVal: "",
		component: "RfieldCreater",
		readonly: false,
		edit: true,
		otherValue: "0",
		method: "eq",
		otherSelect: defaultAttr.otherSelect,
		visible: true,
		title: {
			zh: "提交人",
			en: "submitter",
		},
	},
	update_time: {
		style: defaultAttr.datetimeStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultDate",
		dateOptions: defaultAttr.dateOptions,
		component: "RfieldUpdateTime",
		defVal: "",
		title: {
			zh: "更新时间",
			en: "Update time",
		},
		method: "between",
		readonly: false,
		edit: true,
		visible: true,
	},

	// updater: {
	// 	style: defaultAttr.userStyle,
	// 	defaultStyle: defaultAttr.inputStyle[0].value,
	// 	defaultValueComponent: "TDdefaultOrg",
	// 	value: defaultAttr.defaultOrgMulit,
	// 	component: "RfieldUser",
	// 	readonly: false,
	// 	edit: true,
	// 	visible: true,
	//   method:'eq',
	// 	title: {
	// 		zh: "当前负责人",
	// 		en: "",
	// 	},
	// },
	tableSet: {
		// style:defaultAttr.selectStyle,
		// defaultStyle:defaultAttr.inputStyle[0].value,
		// component:"RfieldSelect",
		tableSet: true,
		tabSelect: "update_time",
		pageSelect: "10",
		sequenceData: defaultAttr.defaultSeqData,
		pageData: defaultAttr.defaultpageData,
		tabRadio: "2",
		checkListTb: [],
		method: "eq",
		// readonly:false,
		// edit:true,
		// visible:true,
		title: {
			zh: "表格",
			en: "table",
		},
	},
	input: {
		style: defaultAttr.inputStyle,
		defaultValueComponent: "TDdefaultValue",
		defaultStyle: defaultAttr.inputStyle[0].value,
		value: defaultAttr.defaultValue,
		readonly: false,
		edit: true,
		visible: true,
		method: "eq",
	},
	number: {
		style: defaultAttr.numberStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultNumber",
		component: "TDfieldNumber",
		method: "between",
		value: {
			custom: {
				min: "undefined",
				max: "undefined",
			},
		},
		readonly: false,
		edit: true,
		visible: true,
	},
	datetime: {
		style: defaultAttr.datetimeStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		dateOptions: defaultAttr.dateOptions,
		defaultValueComponent: "TDdefaultDate",
		component: "RfieldDatetime",
		value: {
			range: [],
			custom: "",
		},
		method: "between",
		readonly: false,
		edit: true,
		visible: true,
	},
	textarea: {
		style: defaultAttr.textareaStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultValue",
		value: defaultAttr.defaultValue,
		readonly: false,
		edit: true,
		visible: true,
		method: "eq",
	},
	// TODO
	user: {
		style: defaultAttr.userStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultOrg",
		value: defaultAttr.defaultOrgMulitEs,
		readonly: false,
		edit: true,
		visible: true,
		method: "eq",
	},
	dept: {
		style: defaultAttr.deptStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultOrg",
		value: defaultAttr.defaultOrgMulitEs,
		readonly: false,
		edit: true,
		visible: true,
		method: "eq",
	},
	deptRadio: {
		style: defaultAttr.deptStyle,
		defaultValueComponent: "TDdefaultOrg",
		defaultStyle: defaultAttr.inputStyle[0].value,
		value: defaultAttr.defaultOrgMulit,
		readonly: false,
		edit: true,
		method: "eq",
		visible: true,
	},
	userRadio: {
		style: defaultAttr.userStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultOrg",
		value: defaultAttr.defaultOrgMulit,
		readonly: false,
		edit: true,
		method: "eq",
		visible: true,
	},
	radio: {
		style: defaultAttr.radiosStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultSelect",
		component: "RfieldSelect",
		value: "",
		method: "eq",
		readonly: false,
		edit: true,
		visible: true,
	},
	checkbox: {
		style: defaultAttr.checkboxStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultSelect",
		component: "RfieldSelectMulti",
		value: [],
		readonly: false,
		method: "eq",
		edit: true,
		visible: true,
	},
	select: {
		style: defaultAttr.selectStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		component: "RfieldSelect",
		defaultValueComponent: "TDdefaultSelect",
		defVal: "",
		readonly: false,
		method: "eq",
		edit: true,
		visible: true,
	},
	selectMulti: {
		style: defaultAttr.checkboxStyle,
		defaultStyle: defaultAttr.inputStyle[0].value,
		defaultValueComponent: "TDdefaultSelect",
		component: "RfieldSelectMulti",
		defVal: [],
		readonly: false,
		edit: true,
		method: "eq",
		visible: true,
	},
	add: {},
	import: {},
	export: {},
	batch: {},
	delete: {},
	recover: {},
	table: {},
};

export const systemList: TJson[] = [
	{
		type: "process_status",
		fieldId: "process_status",
		title: {
			en: "Process status",
			zh: "流程状态",
		},
	},
	{
		type: "creater",
		fieldId: "creater",
		title: {
			en: "submitter",
			zh: "提交人",
		},
	},
	{
		type: "create_time",
		fieldId: "create_time",
		title: {
			en: "Submission time",
			zh: "提交时间",
		},
	},
	{
		type: "update_time",
		fieldId: "update_time",
		title: {
			en: "Update time",
			zh: "更新时间",
		},
	},
	// {
	// 	type: "updater",
	// 	prop: "updater",
	// 	title: {
	// 		en: "",
	// 		zh: "当前负责人",
	// 	},
	// },
];

export const buttonList: TJson[] = [
	{
		type: "add",
		fieldId: "add",
	},
	// {
	//     type:'import',
	//     ...fieldsConfig.import
	// },
	// {
	//     type:'export',
	//     ...fieldsConfig.export
	// },
	// {
	//     type:'batch',
	//     ...fieldsConfig.batch
	// },
	{
		type: "delete",
		fieldId: "delete",
	},
	// {
	//     type:'recover',
	//     ...fieldsConfig.recover
	// }
];

export const tableList: TJson[] = [
	{
		type: "tableSet",
		fieldId: "tableSet",
	},
];
