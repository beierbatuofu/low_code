import { RCall } from "@/utils/RCall";

/**
 * 流程设计相关接口
 */
export const getDet = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/user/get/tree/dept",
		method: "post",
		data,
	});

export const getUserList = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/user/query/user/list",
		method: "post",
		data,
	});

//模糊查询成员接口
export const allSearchUserList = (data: any, path: string = "dept") => {
	let testPath: string = "get/tree/dept";
	if (path == "user") {
		testPath = "query/user/list";
	}
	return RCall.newIns().request({
		url: `/codeZero/user/${testPath}`,
		method: "post",
		data,
	});
};

//9.24新版查成员
export const searchUserList = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/user/find/user/name",
		method: "post",
		data: data,
	});

//9.24新版部门查询
export const searchDept = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/user/find/dept/name",
		method: "post",
		data,
	});

//获取角色组接口
export const getRoleGroup = (appCode: string, name: any) =>
	RCall.newIns().request({
		url: `/codeZero/appRole/app/${appCode}/queryRoleGroupList/1`,
		method: "post",
		data: { name: name },
	});

export const saveOrUpdate = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/flow/addDefinition",
		method: "post",
		data,
	});

// /codeZero/flow/queryDefinitionList/{appCode}/{formCode}
export const getProcessList = (appCode: string, formCode: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/queryDefinitionList/${appCode}/${formCode}`,
		method: "get",
	});

export const getEnableProcess = (formId: string | number) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/getEnableProcess/${formId}`,
		method: "post",
	});

export const changeFlowStatus = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/change/status`,
		method: "post",
		data,
	});

export const getFields = (appCode: string, formCode: string) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/${formCode}/getFields`,
		method: "post",
	});

//新建流程
export const postUseProcess = (appCode: string, formCode: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/queryLastInUseDefinition/${appCode}/${formCode}`,
		method: "get",
	});

export const postProcessAttribute = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/update/processAttribute`,
		method: "post",
		data,
	});

export const saveForm = (appCode: string, formCode: string, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/${formCode}/save`,
		method: "post",
		data,
	});

export const upDateForm = (appCode: string, formCode: string, id: string, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/${formCode}/update/${id}`,
		method: "post",
		data,
	});

//获取应用与表单关系
export const getAutoNodeAppList = ({ formCode, operationType }: { [key: string]: string | number }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/${formCode}/list/${operationType}`,
		method: "post",
	});

//获取目标表与当前表的字段关系
export const getAutoNodeFieldList = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/field/list`,
		method: "post",
		data,
	});

//查询自动节点信息是否循环
export const postAutoRelation = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/query/auto/relation`,
		method: "post",
		data,
	});

export const postDefaultProcess = (data: Record<string, any>) =>
	RCall.newIns().request({
		url: `/codeZero/flow/activeDefaultDefinition`,
		method: "post",
		data,
	});

//启用流程
export const postEnableDefinition = (appCode: string, formCode: string, definitionId: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/enableDefinition/${appCode}/${formCode}/${definitionId}`,
		method: "post",
	});

//删除流程
export const postDeleteDefinition = (data: { definitionIds: string[] }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/deleteDefinition`,
		method: "post",
		data,
	});
