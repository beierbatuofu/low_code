/*
 * @Author: ben
 * @LastEditTime: 2022-04-30 11:11:05
 */
// 控件设置值限制
// export const widgetLimit = {
// 	maxInputSize: 300, // 单行文本最大字符数
// 	maxTextareaSize: 5000, // 多行文本最大字符数
// };

// 特定属性默认设置
// export const defaultValAttr = {
// 	numFormat: {
// 		format: "number",
// 		allowDecimalDigits: false,
// 		decimalDigitsNum: 0,
// 	},
// 	numRange: {
// 		enable: false,
// 		min: "undefined",
// 		max: "undefined",
// 		minInfinity: Number("9".repeat(15) + "8") * -1,
// 		maxInfinity: Number("9".repeat(15) + "8") * 1,
// 	},
// 	textRange: {
// 		enable: false,
// 		min: "undefined",
// 		max: "undefined",
// 		minInfinity: 0,
// 		maxInfinity: 300,
// 	},
// 	scanQrCode: {
// 		allowScan: false,
// 		editable: true,
// 		codeType: "scanQrCode",
// 	},
// 	// 日期组件的时间戳格式
// 	dateFormat: {
// 		format: "yyyy-MM-dd",
// 		valueFormat: "yyyy-MM-dd",
// 		dateType: "date",
// 	},
// 	defaultValue: {
// 		type: "custom",
// 		//默认值
// 		custom: "",
// 		//数据关联
// 		relation: {},
// 		trigger: "blur",
// 	},
// 	defaultTimeValue: {
// 		//类型
// 		type: "custom",
// 		custom: "",
// 		//数据关联
// 		relation: {},
// 		trigger: "change",
// 	},
// 	defaultOrgMultiple: {
// 		//类型
// 		type: "",
// 		custom: [],
// 		multiple: true,
// 		// trigger: "change",
// 	},
// 	defaultOrgSingle: {
// 		type: "",
// 		custom: [],
// 		multiple: false,
// 		trigger: "change",
// 	},
// 	defaultNum: {
// 		//类型
// 		type: "custom",
// 		custom: "",
// 		//数据关联
// 		relation: {},
// 		//公式关联
// 		formula: {
// 			data: "",
// 		},
// 		trigger: "blur",
// 	},
// 	defaultUploadFile: {
// 		type: "",
// 		custom: [],
// 		trigger: "change",
// 	},
// 	dicData: [
// 		{ label: "选项一", value: "0" },
// 		{ label: "选项二", value: "1" },
// 		{ label: "选项三", value: "2" },
// 	],
// };

/**
 * 根据字段名动态渲染组件
 */
// export const WidgetDefaultValues = {
// 	dept: {
// 		type: "dept",
// 		component: "RfieldOrganization",
// 		title: {
// 			zh: "部门复选",
// 			en: "dept",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		value: defaultValAttr.defaultOrgMultiple,
// 		defaultValueComponent: "AttrDefaultOrg",

// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	user: {
// 		type: "user",
// 		component: "RfieldUser",
// 		title: {
// 			zh: "成员复选",
// 			en: "user",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		value: defaultValAttr.defaultOrgMultiple,
// 		defaultValueComponent: "AttrDefaultOrg",
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	deptRadio: {
// 		type: "deptRadio",
// 		component: "RfieldOrganizationRadio",
// 		title: {
// 			zh: "部门单选",
// 			en: "deptRadio",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		value: defaultValAttr.defaultOrgSingle,
// 		defaultValueComponent: "AttrDefaultOrg",
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	userRadio: {
// 		type: "userRadio",
// 		component: "RfieldUserRadio",
// 		title: {
// 			zh: "成员单选",
// 			en: "userRadio",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		value: defaultValAttr.defaultOrgSingle,
// 		defaultValueComponent: "AttrDefaultOrg",
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	input: {
// 		type: "input",
// 		title: {
// 			zh: "单行文本",
// 			en: "input",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		defaultValueComponent: "AttrDefaultValue",
// 		value: defaultValAttr.defaultValue,
// 		scanQrCode: defaultValAttr.scanQrCode,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		noSameVal: false,
// 		validateFormStructJson: defaultValAttr.numRange,

// 		textRange: defaultValAttr.textRange,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	textarea: {
// 		type: "textarea",
// 		title: {
// 			zh: "多行文本",
// 			en: "textarea",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		defaultValueComponent: "AttrDefaultValue",
// 		value: defaultValAttr.defaultValue,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		textRange: defaultValAttr.textRange,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	number: {
// 		type: "number",
// 		title: {
// 			zh: "数字",
// 			en: "Number",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		numFormat: defaultValAttr.numFormat,
// 		defaultValueComponent: "AttrDefaultNum",
// 		value: defaultValAttr.defaultNum,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		noSameVal: false,
// 		numRange: defaultValAttr.numRange,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	radio: {
// 		type: "radio",
// 		title: {
// 			zh: "单选按钮组",
// 			en: "radio",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		dicData: defaultValAttr.dicData,
// 		defaultValueComponent: "AttrDefaultSelect",
// 		value: "",
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		checkLayout: "vertical",
// 		width: "100%",
// 		tableWidth: "200",
// 		dicOption: "static",
// 		props: {
// 			label: "label",
// 			value: "value",
// 		},
// 	},
// 	checkbox: {
// 		type: "checkbox",
// 		title: {
// 			zh: "复选按钮组",
// 			en: "checkbox",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		dicData: defaultValAttr.dicData,
// 		defaultValueComponent: "AttrDefaultSelect",
// 		value: [],
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		checkLayout: "vertical",
// 		width: "100%",
// 		tableWidth: "200",
// 		dicOption: "static",
// 		props: {
// 			label: "label",
// 			value: "value",
// 		},
// 	},
// 	select: {
// 		type: "select",
// 		title: {
// 			zh: "下拉单选框",
// 			en: "custom",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		dicData: defaultValAttr.dicData,
// 		defaultValueComponent: "AttrDefaultSelect",
// 		value: "",
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 		dicOption: "static",
// 		props: {
// 			label: "label",
// 			value: "value",
// 		},

// 		component: "RfieldSelect",
// 	},
// 	selectMulti: {
// 		type: "selectMulti",
// 		component: "RfieldSelectMulti",
// 		title: {
// 			zh: "下拉复选框",
// 			en: "custom",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		dicData: defaultValAttr.dicData,
// 		defaultValueComponent: "AttrDefaultSelect",
// 		value: [],
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 		dicOption: "static",
// 		props: {
// 			label: "label",
// 			value: "value",
// 		},
// 	},
// 	datetime: {
// 		type: "datetime",
// 		title: {
// 			zh: "日期时间",
// 			en: "datetime",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		dateFormat: defaultValAttr.dateFormat,
// 		defaultValueComponent: "AttrdefaultDatetime",
// 		value: defaultValAttr.defaultTimeValue,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	separator: {
// 		type: "separator",
// 		title: {
// 			zh: "分割线",
// 			en: "separator",
// 		},
// 		titleShow: true,
// 		visible: true,
// 		lineStyle: {
// 			color: "#989898",
// 			lineType: "thin",
// 		},
// 	},
// 	uploadFile: {
// 		type: "uploadFile",
// 		title: {
// 			zh: "上传附件",
// 			en: "uploadFile",
// 		},
// 		titleShow: true,
// 		desc: "",
// 		defaultValueComponent: "AttrDefaultUpload",
// 		value: defaultValAttr.defaultUploadFile,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		multiple: false,
// 		width: "100%",
// 		tableWidth: "200",
// 	},
// 	table: {
// 		titleShow: true,
// 		type: "table",
// 		title: {
// 			zh: "表格",
// 			en: "table",
// 		},
// 		icon: "icon-table",
// 		span: 24,
// 		visible: true,
// 		edit: true,
// 		required: false,
// 		children: [],
// 		value: [], //初始化值
// 	},
// };
/*
    custom 只渲染该组件
 */
export const defaultWidgetList = [
	{
		title: "customField",
		list: [
			{
				type: "dept",
				icon: "custom-icon-depts",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
			{
				type: "deptRadio",
				icon: "custom-icon-dept",
			},
			{
				type: "user",
				icon: "custom-icon-user",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
			{
				type: "userRadio",
				icon: "el-icon-user",
			},
			{
				type: "separator",
				icon: "el-icon-minus",
			},
			{
				type: "sn",
				icon: "el-icon-document",
			},
			{
				type: "address",
				icon: "el-icon-location-outline",
			},
		],
	},

	{
		title: "inputField",
		list: [
			{
				type: "input",
				icon: "iconinput",
				rules: {
					notEmpty: {
						trigger: "blur",
					},
					textRange: {
						trigger: "blur",
					},
				},
			},
			{
				type: "textarea",
				icon: "icon-textarea",
				rules: {
					notEmpty: {
						trigger: "blur",
					},
					textRange: {
						trigger: "blur",
					},
				},
			},
			{
				type: "number",
				icon: "icon-number",
				rules: {
					notEmpty: {
						trigger: "blur",
					},
					numRange: {
						trigger: "blur",
					},
				},
			},
		],
	},
	{
		title: "selectField",
		list: [
			{
				type: "radio",
				//icon: "custom-icon-record-circle",
				icon: "iconradio",
				otherComp: "configRadio",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
			{
				type: "checkbox",
				icon: "custom-icon-checkbox-circle",
				otherComp: "configCheckbox",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
			{
				type: "select",
				icon: "custom-icon-select-circle",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
			{
				type: "selectMulti",
				icon: "custom-icon-selectMulit-circle",
				rules: {
					notEmpty: {
						trigger: "change",
					},
				},
			},
		],
	},
	{
		title: "datetimeField",
		list: [
			{
				type: "datetime",
				icon: "icon-datetime",
				rules: {
					notEmpty: {
						trigger: "blur",
					},
				},
			},
		],
	},
	{
		title: "uploadFiled",
		list: [
			{
				type: "uploadFile",
				icon: "el-icon-upload",
			},
		],
	},
	{
		title: "tableField",
		list: [
			{
				type: "table",
				icon: "icon-table",
			},
			{
				type: "tab",
				icon: "custom-icon-tag",
			},
		],
	},
];
