const defQueryList = [
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
		dateFormat: "yyyy-MM-dd HH:mm",
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
		dateFormat: "yyyy-MM-dd HH:mm",
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

//formData:表单设计数据配置 Array
//queryData:列表设计数据配置 Object:buttonList、queryList、tabList
//isProcess:是否为流程表单
export default (formData: any, queryData: any, isProcess: boolean) => {
	//根据判断是否为流程表单，获取不同的默认字段
	let newFormData: any = []; //将要过滤后的所有查询条件
	let newQueryData: any = { tableList: { tableHeader: [] } };
	let allTableHeaderList: any = []; //所有的表头字段
	let propsArr = isProcess ? ["creater", "create_time", "process_status"] : ["creater", "create_time", "update_time"];
	//需要过滤的字段 分割线
	let filterConfArr = ["separator", "tab"]; //需要过滤的字段

	// 递归函数 判断是否有children

	function fn(list: any[], newList: any[]) {
		// console.log(list);
		list.forEach((item: any) => {
			if (item.children && item.type == "table") {
				item.children.forEach((it: any) => {
					// 子表格的children 的title 为 表格 + '-' + children.title
					//为子表格children 加上父级id字段parentId
					Object.keys(item.title).forEach((l: string) => {
						it.title[l] = item.title[l] + "-" + it.title[l];
					});
					it.parentId = item.fieldId;
				});

				fn(item.children, newList);
			} else {
				newList.push(item);
			}
		});
	}
	let arrList: any = [];

	//table的子字段赋值
	if (formData) {
		fn(
			formData.configList.filter((item: Record<string, any>) => item.type != "tab"),
			arrList
		);
	}

	// arrList.forEach((item: any) => {
	// 	if (item.tab && item.tab.length > 0) {
	// 		let str = item.tab.split(",")[0];
	// 		let obj = formData.configList.find((it: any) => it.fieldId == str);
	// 		item.title.en = obj.title.en + " - " + item.title.en;
	// 		item.title.zh = obj.title.zh + " - " + item.title.zh;
	// 		//item.parentId = obj.fieldId;
	// 	}
	// });

	//  过滤后的查询条件
	newFormData = formData ? formData.configList.filter((item: any) => !filterConfArr.includes(item.type)) : [];

	arrList = arrList ? arrList.filter((item: any) => !filterConfArr.includes(item.type)) : [];
	let newDefQueryList = defQueryList.filter((item: any) => propsArr.includes(item.type));

	// 默认的 不包括子表格内容 有子表格字段
	newFormData = [...newFormData, ...newDefQueryList];

	// 查询条件 包括子表格所有条件
	let fCAll = [...arrList, ...newDefQueryList];
	let newTableHeaderList: any = [];

	allTableHeaderList = newFormData.map((item: any) => {
		let obj: any = {};
		if (item.type == "number") {
			obj = {
				numFormat: item.numFormat,
				type: item.type,
				title: item.title,
				fieldId: item.fieldId,
			};
		} else if (item.type == "datetime" || item.type == "create_time" || item.type == "update_time") {
			obj = {
				dateFormat: item.dateFormat,
				type: item.type,
				title: item.title,
				fieldId: item.fieldId,
			};
		} else {
			obj = {
				type: item.type,
				title: item.title,
				fieldId: item.fieldId,
			};
		}
		return obj;
	});

	//判断是否在列表设计保存过
	if (queryData) {
		//保存过
		let { queryList, tabList: tableList, buttonList } = queryData;
		let newQueryList: any = [];
		// 查找出保存接口字段 对比表单设计结构是否有删除结构

		queryList &&
			queryList.forEach((item: any) => {
				let testQuery = fCAll.find((it: any) => item.fieldId == it.fieldId);

				if (testQuery) {
					item.title = testQuery.title;
					item.dicData && (item.dicData = testQuery.dicData);
					item.formDesignConf = testQuery;
					newQueryList.push({ ...item, parentId: testQuery.parentId });
				}
			});

		//过滤出表格仅需的字段 title，fieldId

		//判断是否有保存表格头部   在列表设计未加入字段
		if (tableList.tableHeader) {
			tableList.tableHeader.forEach((item: any) => {
				let testTable = allTableHeaderList.find((it: any) => item.fieldId == it.fieldId);
				testTable && newTableHeaderList.push(testTable);
			});
		} else {
			//没有 展示默认的查询条件
			newTableHeaderList = allTableHeaderList.filter((item: any) => propsArr.includes(item.type));
		}

		// 是否筛选
		if (tableList && tableList.headerFilter == "no") {
			newQueryData.tableList.tableHeader = allTableHeaderList;
		} else {
			newQueryData.tableList.tableHeader = newTableHeaderList;
		}

		newQueryData.buttonList = buttonList;
		newQueryData.queryList = newQueryList;

		newQueryData.tableList.pageSize = tableList.pageSize;
		newQueryData.tableList.sortOrder = tableList.sortOrder;
		newQueryData.tableList.headerFilter = tableList.headerFilter; //是否筛选

		//判断是否有删除查询字段  有:将默认排序条件设为默认值  无:赋值上次保存的
		let haveCondition = newFormData.find((item: any) => item.fieldId == tableList.sortCondition);
		newQueryData.tableList.sortCondition = haveCondition ? tableList.sortCondition : "create_time";

		return {
			fCAll,
			newFormData,
			newQueryData,
		};
	} else {
		//没保存过，显示默认字段
		newQueryData.tableList.tableHeader = allTableHeaderList;
		newQueryData.tableList.pageSize = "10"; //每页条数
		newQueryData.tableList.sortCondition = "create_time"; //默认排序条件
		newQueryData.tableList.sortOrder = "desc"; //排序顺序 （升序asc，降序desc）
		newQueryData.tableList.headerFilter = "no"; //是否筛选

		newQueryData.buttonList = [{ fieldId: "add", type: "add" }];

		newQueryData.queryList = newDefQueryList;

		return {
			fCAll,
			newFormData,
			newQueryData,
		};
	}
};
