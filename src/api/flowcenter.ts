import { RCall } from "@/utils/RCall";

/**
 * 流程中心相关接口
 */
export const getTask = (data: { type: 1 | 2 | 3; appCode?: string; pageIndex?: number; pageSize?: number ;orderDesc?:boolean;}) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/selectProcess`,
		method: "post",
		data,
	});

export const getMyDraft = (
	appCode: string,
	formCode: string,
	data: any //保存和更新我的草稿
) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/${formCode}/saveOrUpdateDraftFormData`,
		method: "post",
		data,
	});

export const deleteMyDraft = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/get/deleteDraftById`,
		method: "post",
		data,
	});
export const getMyDraftList = (page: number | string, pageSize: number | string) =>
	RCall.newIns().request({
		//我的草稿 list
		url: `/codeZero/flow/getDraftData/page/${page}/pageSize/${pageSize}`,
		method: "post",
	});

export const getFlowDetail = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/detail`,
		method: "post",
		data,
	});
// 右侧流程图 todo
export const getFlowChart = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/comment`,
		method: "post",
		data,
	});

// 流程状态流转
/**
 * @description:
 * @param {any} data { dataId ,formCode ,status,nodeId,taskId}
 * @return {*}
 */
export const changeFlowState = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/state/circulation`,
		method: "post",
		data,
	});

// 流程当前节点状态 todo
export const currentFlowState = (formCode: string, dataId: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/get/flow/state/detail/${formCode}/${dataId}`,
		method: "post",
	});

export const getFormDetailData = (formCode: string, dataId: number): Promise<Record<string, any>> => {
	return new Promise((resolve, reject) => {
		RCall.newIns()
			.post(`/codeZero/flow/process/detail/formCode/${formCode}/data/${dataId}`)
			.then((resp) => {
				let configList: Record<string, any>[] = [];
				let tabMaps: Record<string, any> = {};
				let { form, ...data } = resp.data;
				let { structure, ...formData } = form;
				let newResp: Record<string, any> = resp;

				if (structure?.configList) {
					structure.configList.forEach((field: Record<string, any>) => {
						if (field.tab) {
							!tabMaps[field.tab] && (tabMaps[field.tab] = []);
							tabMaps[field.tab].push(field);
						} else {
							configList.push(field);
						}
					});
					configList.forEach((field) => {
						if (field.type == "tab") {
							field.children.forEach((item: Record<string, any>) => {
								let tabId = field.fieldId + "," + item.id;
								!item.configList && (item.configList = []);
								tabMaps[tabId] && item.configList.push(...tabMaps[tabId]);
							});
						}
					});
					newResp = {
						data: {
							...data,
							form: {
								structure: structure,
								...formData,
								dstructure: {
									...structure,
									configList,
								},
							},
						},
					};
				}

				resolve(newResp);
			})
			.catch((err) => {
				reject({ err });
			});
	});
};

export const testDetail = (formCode: string, dataId: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/detail/formCode/${formCode}/data/${dataId}`,
		method: "post",
	});

export const getCenterList = () =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/center`,
		method: "post",
	});

//TODO del
export const postAllData = (formCode: string) => {
	let token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
	return RCall.newIns()
		.header({ token })
		.request({
			url: `/codeZero/form/perm/formal/${formCode}`,
			method: "post",
		});
};

export const getQueryConf = (formCode: string) => {
	let token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
	return RCall.newIns()
		.header({ token })
		.request({
			url: `/codeZero/form/perm/formal/${formCode}`,
			method: "post",
		});
};

export const buttonManage = (
	formCode: string,
	dataId: string //按钮显示隐藏的权限
) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/detail/formCode/${formCode}/data/${dataId}/manage`,
		method: "post",
	});

export const postAddTabelList = (appCode: string, formCode: string, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/${formCode}/save`,
		method: "post",
		data,
	});

export const getNodeDetail = (data: { dataId: string; formCode: string }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/back/nodeDetail`,
		method: "post",
		data,
	});

export const getddData = (formCode: string, dataId: string) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/detail/formCode/${formCode}/data/${dataId}`,
		method: "post",
	});

//获取单个流程实例 信息、路由、日志
export const postProcessInstance = (data: Record<string, string | number>) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/getProcessInstance`,
		method: "post",
		data,
	});

//New 通过
export const postPassProcess = (data: { formDataJson: Record<string, any>; processId: string }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/passProcess`,
		method: "post",
		data,
	});

//New  强制结束
export const postOverProcess = (data: { formDataJson: Record<string, any>; processId: string }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/overProcess`,
		method: "post",
		data,
	});
//New  退回
export const postBackProcess = (data: { formDataJson: Record<string, any>; processId: string }) =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/rollbackProcess`,
		method: "post",
		data,
	});

  //查询应用接口
  export const queryFuzzy = (data: {name :string ;}) =>
	RCall.newIns().request({
		url: `/codeZero/app/queryFuzzy`,
		method: "post",
		data,
	});

