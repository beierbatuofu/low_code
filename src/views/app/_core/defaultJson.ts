/*
 * @Author: ben
 * @LastEditTime: 2022-01-13 16:18:18
 */

import { saveOrUpdate, postDefaultProcess } from "@/api/flow";
import { UserModule } from "@/store/modules/user";

import { updateRightList, getRightList } from "@/api/form";
import { VNode } from "vue";

const assigneeList = [
	{
		avatar: UserModule.userInfo.avatar,
		dtUserId: UserModule.userInfo.userId,
		id: UserModule.userInfo.id,
		name: UserModule.userInfo.userName,
		type: "2",
	},
];

const queryListF = [
	{
		type: "process_status",
		prop: "process_status",
		title: { zh: "流程状态", en: "" },
		style: [{ label: "tableDesign.default", value: "0" }],
		defaultStyle: "0",
		component: "RfieldSelect",
		defaultValueComponent: "TDdefaultSelect",
		value: "",
		readonly: false,
		edit: true,
		visible: true,
		dicData: [
			{ label: "进行中", value: "1" },
			{ label: "流转完成", value: "9" },
			{ label: "强制结束", value: "8" },
		],
		method: "eq",
	},
	{
		type: "creater",
		prop: "creater",
		title: { zh: "提交人", en: "submitter" },
		style: [{ label: "tableDesign.default", value: "0" }],
		defaultStyle: "0",
		defaultValueComponent: "TDfieldOther",
		value: { type: "", custom: [], multiple: false },
		component: "RfieldUser",
		readonly: false,
		edit: true,
		otherValue: "0",
		method: "eq",
		otherSelect: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.currentUsers", value: "1" },
		],
		visible: true,
	},
	{
		type: "create_time",
		prop: "create_time",
		title: { zh: "提交时间", en: "Submission time" },
		style: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.range", value: "1" },
		],
		defaultStyle: "0",
		dateOptions: [
			{ label: "tableDesign.today", value: "today" },
			{ label: "tableDesign.yesterday", value: "yesterday" },
			{ label: "tableDesign.theWeek", value: "theWeek" },
			{ label: "tableDesign.lastWeek", value: "lastWeek" },
			{ label: "tableDesign.theMonth", value: "theMonth" },
			{ label: "tableDesign.lastMonth", value: "lastMonth" },
			{ label: "tableDesign.theYear", value: "theYear" },
			{ label: "tableDesign.lastYear", value: "lastYear" },
			{ label: "tableDesign.last7day", value: "last7day" },
			{ label: "tableDesign.last30day", value: "last30day" },
			{ label: "tableDesign.last90day", value: "last90day" },
		],
		defaultValueComponent: "TDdefaultDate",
		component: "TDfieldDatetime",
		method: "between",
		value: { range: [], value: "" },
		readonly: false,
		edit: true,
		visible: true,
	},
];

const queryListC = [
	{
		visible: true,
		method: "eq",
		defaultStyle: "0",
		edit: true,
		type: "creater",
		title: { en: "submitter", zh: "提交人" },
		component: "RfieldUser",
		otherSelect: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.currentUsers", value: "1" },
		],
		readonly: false,
		prop: "creater",
		defaultValueComponent: "TDfieldOther",
		style: [{ label: "tableDesign.default", value: "0" }],
		value: { custom: [], multiple: false, type: "" },
		otherValue: "0",
	},
	{
		visible: true,
		method: "between",
		defaultStyle: "0",
		edit: true,
		type: "create_time",
		title: { en: "Submission time", zh: "提交时间" },
		dateOptions: [
			{ label: "tableDesign.today", value: "today" },
			{ label: "tableDesign.yesterday", value: "yesterday" },
			{ label: "tableDesign.theWeek", value: "theWeek" },
			{ label: "tableDesign.lastWeek", value: "lastWeek" },
			{ label: "tableDesign.theMonth", value: "theMonth" },
			{ label: "tableDesign.lastMonth", value: "lastMonth" },
			{ label: "tableDesign.theYear", value: "theYear" },
			{ label: "tableDesign.lastYear", value: "lastYear" },
			{ label: "tableDesign.last7day", value: "last7day" },
			{ label: "tableDesign.last30day", value: "last30day" },
			{ label: "tableDesign.last90day", value: "last90day" },
		],
		component: "TDfieldDatetime",
		readonly: false,
		prop: "create_time",
		defaultValueComponent: "TDdefaultDate",
		style: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.range", value: "1" },
		],
		value: { range: [], value: "" },
	},
	{
		visible: true,
		method: "between",
		defaultStyle: "0",
		edit: true,
		type: "update_time",
		title: { en: "Update time", zh: "更新时间" },
		dateOptions: [
			{ label: "tableDesign.today", value: "today" },
			{ label: "tableDesign.yesterday", value: "yesterday" },
			{ label: "tableDesign.theWeek", value: "theWeek" },
			{ label: "tableDesign.lastWeek", value: "lastWeek" },
			{ label: "tableDesign.theMonth", value: "theMonth" },
			{ label: "tableDesign.lastMonth", value: "lastMonth" },
			{ label: "tableDesign.theYear", value: "theYear" },
			{ label: "tableDesign.lastYear", value: "lastYear" },
			{ label: "tableDesign.last7day", value: "last7day" },
			{ label: "tableDesign.last30day", value: "last30day" },
			{ label: "tableDesign.last90day", value: "last90day" },
		],
		component: "TDfieldDatetime",
		readonly: false,
		prop: "update_time",
		defaultValueComponent: "TDdefaultDate",
		style: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.range", value: "1" },
		],
		value: { range: [], value: "" },
	},
];

let checkListTbF = [
	{
		type: "process_status",
		prop: "process_status",
		title: { zh: "流程状态", en: "" },
		style: [{ label: "tableDesign.default", value: "0" }],
		defaultStyle: "0",
		component: "RfieldSelect",
		defaultValueComponent: "TDdefaultSelect",
		value: "",
		readonly: false,
		edit: true,
		visible: true,
		dicData: [
			{ label: "进行中", value: "0" },
			{ label: "流转完成", value: "1" },
			{ label: "强制结束", value: "8" },
		],
		method: "eq",
	},
	{
		type: "creater",
		prop: "creater",
		title: { zh: "提交人", en: "submitter" },
		style: [{ label: "tableDesign.default", value: "0" }],
		defaultStyle: "0",
		defaultValueComponent: "TDfieldOther",
		value: { type: "", custom: [], multiple: false },
		component: "RfieldUser",
		readonly: false,
		edit: true,
		otherValue: "0",
		method: "eq",
		otherSelect: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.currentUsers", value: "1" },
		],
		visible: true,
	},
	{
		type: "create_time",
		prop: "create_time",
		title: { zh: "提交时间", en: "Submission time" },
		style: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.range", value: "1" },
		],
		defaultStyle: "0",
		dateOptions: [
			{ label: "tableDesign.today", value: "today" },
			{ label: "tableDesign.yesterday", value: "yesterday" },
			{ label: "tableDesign.theWeek", value: "theWeek" },
			{ label: "tableDesign.lastWeek", value: "lastWeek" },
			{ label: "tableDesign.theMonth", value: "theMonth" },
			{ label: "tableDesign.lastMonth", value: "lastMonth" },
			{ label: "tableDesign.theYear", value: "theYear" },
			{ label: "tableDesign.lastYear", value: "lastYear" },
			{ label: "tableDesign.last7day", value: "last7day" },
			{ label: "tableDesign.last30day", value: "last30day" },
			{ label: "tableDesign.last90day", value: "last90day" },
		],
		defaultValueComponent: "TDdefaultDate",
		component: "TDfieldDatetime",
		method: "between",
		value: { range: [], value: "" },
		readonly: false,
		edit: true,
		visible: true,
	},
];

let checkListTbC = [
	{
		type: "creater",
		prop: "creater",
		title: { zh: "提交人", en: "submitter" },
		style: [{ label: "tableDesign.default", value: "0" }],
		defaultStyle: "0",
		defaultValueComponent: "TDfieldOther",
		value: { type: "", custom: [], multiple: false },
		component: "RfieldUser",
		readonly: false,
		edit: true,
		otherValue: "0",
		method: "eq",
		otherSelect: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.currentUsers", value: "1" },
		],
		visible: true,
	},
	{
		type: "create_time",
		prop: "create_time",
		title: { zh: "提交时间", en: "Submission time" },
		style: [
			{ label: "tableDesign.default", value: "0" },
			{ label: "tableDesign.range", value: "1" },
		],
		defaultStyle: "0",
		dateOptions: [
			{ label: "tableDesign.today", value: "today" },
			{ label: "tableDesign.yesterday", value: "yesterday" },
			{ label: "tableDesign.theWeek", value: "theWeek" },
			{ label: "tableDesign.lastWeek", value: "lastWeek" },
			{ label: "tableDesign.theMonth", value: "theMonth" },
			{ label: "tableDesign.lastMonth", value: "lastMonth" },
			{ label: "tableDesign.theYear", value: "theYear" },
			{ label: "tableDesign.lastYear", value: "lastYear" },
			{ label: "tableDesign.last7day", value: "last7day" },
			{ label: "tableDesign.last30day", value: "last30day" },
			{ label: "tableDesign.last90day", value: "last90day" },
		],
		defaultValueComponent: "TDdefaultDate",
		component: "TDfieldDatetime",
		method: "between",
		value: { range: [], value: "" },
		readonly: false,
		edit: true,
		visible: true,
	},
	{
		visible: true,
		method: "between",
		edit: true,
		defaultStyle: "0",
		type: "update_time",
		title: {
			en: "Update time",
			zh: "更新时间",
		},
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
		component: "TDfieldDatetime",
		readonly: false,
		prop: "update_time",
		defaultValueComponent: "TDdefaultDate",
		style: [
			{
				label: "tableDesign.default",
				value: "0",
			},
			{
				label: "tableDesign.range",
				value: "1",
			},
		],
		value: {
			range: [],
			value: "",
		},
	},
];

let viewStructure: any = {
	buttonList: [{ type: "add", prop: "add" }],
	tabList: [
		{
			type: "tableSet",
			prop: "tableSet",
			checkListTb: [],
			tableSet: true,
			tabSelect: "update_time",
			pageSelect: "10",
			sequenceData: [
				{ label: "提交时间", value: "create_time" },
				{ label: "更新时间", value: "update_time" },
				{ label: "流程状态", value: "process_status" },
			],
			pageData: [
				{ label: "5条", value: "5" },
				{ label: "10条", value: "10" },
				{ label: "20条", value: "20" },
				{ label: "50条", value: "50" },
			],
			tabRadio: "2",
			method: "eq",
			title: { zh: "表格", en: "table" },
		},
	],
};

export const defaultViewStructure = function (flowType: string) {
	let queryList: any = [];
	if (flowType == "F") {
		queryList = queryListF;
		viewStructure.tabList[0].checkListTb = checkListTbF;
	} else if (flowType == "C") {
		queryList = queryListC;
		viewStructure.tabList[0].checkListTb = checkListTbC;
	}

	viewStructure["queryList"] = queryList;
	return viewStructure;
};
