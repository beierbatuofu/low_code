import { RCall } from "@/utils/RCall";
import { transAtToDl, transDlToAt } from "../utils/transform";
import RfieldCore from "@/components/rfield/core/RfieldCore";
import { deepClone } from "@/utils/global.ts";
/**
 * 处理表单相关接口
 */

let timeout = null;

// 查询表单结构-列表
export const getFormList = (appCode) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/query`);
};

// 查询表单结构-单个 查正式
export const getFormSingle = (appCode, formCode) => {
	return new Promise((resolve, reject) => {
		RCall.newIns()
			.post(`/codeZero/app/${appCode}/form/${formCode}/query`)
			.then((resp) => {
				let configList = [];
				let tabMaps = {};

				let { structure, ...data } = resp.data;
				if (structure && structure?.configList) {
					structure.configList.forEach((field) => {
						if (field.tab) {
							!tabMaps[field.tab] && (tabMaps[field.tab] = []);
							tabMaps[field.tab].push(deepClone(field));
						} else {
							configList.push(deepClone(field));
						}
					});

					configList.forEach((field) => {
						if (field.type == "tab") {
							field.children.forEach((item) => {
								let tabId = field.fieldId + "," + item.id;
								!item.configList && (item.configList = []);
								tabMaps[tabId] && item.configList.push(...tabMaps[tabId]);
							});
						}
					});

					resolve({
						...resp,
						data: {
							...data,
							structure: structure,
							dstructure: {
								...structure,
								configList: configList,
							},
						},
					});
				}
				resolve(resp);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

// 查询表单结构-单个
export const getFormSingleTest = (appCode, formCode) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/query`);
};

//
export const getFormFields = (appCode, formCode, isAddSysField = true) => {
	return new Promise((resolve, reject) => {
		RCall.newIns()
			.post(`/codeZero/app/${appCode}/form/${formCode}/query`)
			.then((resp) => {
				let systemFieldids = resp.data.type == "F" ? ["process_status", "creater", "create_time"] : ["creater", "create_time", "update_time"];
				let configList = resp.data?.structure?.configList || [];

				systemFieldids.forEach((type) => {
					let fieldObj = RfieldCore.ins().createField({ type }, "query");
					//fieldObj.config.fieldId = `${formCode}.${fieldObj.config.fieldId}`;
					configList.push({ ...fieldObj.config, formCode });
				});
				//	isAddSysField && configList.push(...systemFields);
				resolve(resp);
			})
			.catch((err) => reject(err));
	});
};

//单独删除表单数据

export const deleteForm = (appCode, formCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/removeIds`, data);
};

//全部删除表单数据
export const deleteAllForm = (appCode, formCode) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/removeAll`);
};

// 保存表单结构-返回表单的唯一code
export const saveFormSingle = (appCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/save`, data);
};

// 修改表单名称
export const updateFormName = (appCode, formCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/rename`, data);
};

// 修改表单结构
export const updateFormSingle = (appCode, formCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/update`, data);
};

// 删除表单结构
export const removeFormSingle = (appCode, formCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/remove`, data);
};

// 系统环境版本发布
export const updateVersionRelease = (appCode) => {
	return RCall.newIns().post(`/codeZero/version/releaseApp`, {}, { appCode });
};

// 生成外链token
export const getToken = (appCode, formCode) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/getToken`);
};

// 外链验证
export const checkToken = (token) => {
	return RCall.newIns().post(`/codeZero/ext-link/check/${token}`);
};

// 外链临时登录
export const tempLogin = (token) => {
	return RCall.newIns().post(`/codeZero/ext-link/login`, { token });
};

// 根据id查询表单数据
export const getData = (appCode, formCode, page = 1, pageSize = 20, filter = {}) => {
	return RCall.newIns()
		.post(`/codeZero/app/${appCode}/form/${formCode}/page/${page}/pageSize/${pageSize}`, filter)
		.then((res) => {
			//return transAtToDl(res);//原:将res中第一个@替换$
			return res;
		});
};

// 保存表单数据，返回表单结构id
export const saveData = (appCode, formCode, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/save`, transDlToAt(data));
};

// 根据id更新表单数据
export const updateData = (appCode, formCode, id, data) => {
	let form = {};

	Object.keys(data).forEach((key) => {
		if (key != "undefined") {
			form[key] = data[key] ?? "";
		}
	});
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/update/${id}`, form);
};

// 根据id删除表单数据-逻辑删除
export const delData = (appCode, formCode, id) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/remove/${id}`);
};

// 查询系统所有的app ———— 废弃
export const getAppTree = () => {
	return RCall.newIns().post(`/codeZero/app/tree`);
};

// 查询具有权限的app集合
export const getAllApp = () => {
	return RCall.newIns().post(`/codeZero/app/perm/apps`);
};

// 获取我的收藏App
export const getCollectApp = () => {
	return RCall.newIns().post(`/codeZero/app/perm/collects`);
};

// 批量查询系统所有的app
export const getApps = () => {
	return RCall.newIns().post(`/codeZero/app/query`, { isApp: true });
};

// 新增app
export const addApp = (data) => {
	return RCall.newIns().post(`/codeZero/app`, data);
};

// 删除app
export const delApp = (data) => {
	return RCall.newIns().post(`/codeZero/app/remove`, {}, data);
};

// 修改app
export const updateApp = (data) => {
	return RCall.newIns().post(`/codeZero/app/update`, data);
};

// 查询单个app
export const queryApp = (id) => {
	return RCall.newIns().post(`/codeZero/app/${id}`);
};

// 新增App收藏
export const saveAppCollection = (appId) => {
	return RCall.newIns().post(`/codeZero/app-collection/save/${appId}`);
};

// 删除App收藏
export const delAppCollection = (appId) => {
	return RCall.newIns().post(`/codeZero/app-collection/delete/${appId}`);
};

// 查询操作类型列表
export const getOperTypeList = () => {
	return RCall.newIns().post(`/codeZero/operType/list`);
};

// 查询表单所有字段
export const getFields = (appCode, formCode) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/getFields`);
};

// -------- 应用->表单发布->权限设置 permGroup ---------
// 保存权限组
export const savePermGroup = (data) => {
	return RCall.newIns().post(`/codeZero/permGroup/save`, data);
};

// 查询权限列表
export const getPermGroupList = (formCode, type) => {
	return RCall.newIns().post(`/codeZero/permGroup/list/${formCode}/${type}`);
};

// 删除权限组
export const delPermGroup = (id) => {
	return RCall.newIns().post(`/codeZero/permGroup/remove/${id}`);
};

// 根据id查询权限组详情
export const getPermGroup = (id) => {
	return RCall.newIns().post(`/codeZero/permGroup/get/${id}`);
};

// 更新权限组
export const updatePermGroup = (data) => {
	return RCall.newIns().post(`/codeZero/permGroup/update`, data);
};

// 更新绑定关系
export const authPermGroup = (data) => {
	return RCall.newIns().post(`/codeZero/permGroup/auth`, data);
};

//获取待办任务
export const getTaskCount = () =>
	RCall.newIns().request({
		url: `/codeZero/flow/process/home/task/count`,
		method: "post",
	});

// app组排序
export const sortAppGroup = (data) => RCall.newIns().post(`/codeZero/app/sort`, data);

// 添加文件夹
export const addFolder = (appCode, data) => RCall.newIns().post(`/codeZero/app/${appCode}/form/add/folder`, data);

// 删除文件夹
export const delFolder = (appCode, folderCode, data) => RCall.newIns().post(`/codeZero/app/${appCode}/form/delete/folder/${folderCode}`, data);

// 更新文件夹
export const updateFolder = (appCode, folderCode, data) => RCall.newIns().post(`/codeZero/app/${appCode}/form/update/folder/${folderCode}`, data);

// v2_查询应用下的表单树形结构及表单数据
export const queryRecursiveTree = (appCode) => RCall.newIns().post(`/codeZero/app/${appCode}/query/recursive/tree`);

// v2_保存应用下的表单树形结构
export const saveRecursiveTree = (appCode, data) => RCall.newIns().post(`/codeZero/app/${appCode}/save/recursive/tree`, data);

// 列表设计权限组查询
export const getRightList = (data) => {
	return RCall.newIns().header({ envFlag: "test" }).post(`/codeZero/form/perm/list`, data);
};
// 列表设计权限组查询 切换
export const getRightNewList = (appCode, formCode) => {
	return RCall.newIns().header().post(`/codeZero/form/perm/formal/list/${appCode}/${formCode}`);
};

// 列表设计权限组更新
export const updateRightList = (data) => {
	return RCall.newIns().header({ envFlag: "test" }).post(`/codeZero/form/perm/update`, data);
};

//列表设计权限组-删除
export const deleteRightList = (data) => {
	return RCall.newIns().header({ envFlag: "test" }).post(`/codeZero/form/perm/delete`, data);
};

// 列表设计结构新增接口
export const saveList = (data) => RCall.newIns().header({ envFlag: "test" }).post(`/codeZero/form/perm/save`, data);

//字段关联已有数据
export const getLinkExistingData = (appCode, formCode, fieldId, data) => {
	return RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/getLinkExistingData/field/${fieldId}`, data);
};

export const getCurrApp = (appCode) =>
	RCall.newIns().request({
		url: `/codeZero/app/info/${appCode}`,
		method: "post",
	});

//更新部门成员信息 /app/member/query
export const updateMemberInfo = (data) =>
	RCall.newIns().request({
		url: `/codeZero/app/member/query`,
		method: "post",
		data,
	});

//
export const querySourceData = (appCode, calendarCode, data) => RCall.newIns().post(`/codeZero/app/${appCode}/${calendarCode}/calendar/data/query`, data);

// 文件下载模板
export const exportExcelTemplate = (appCode, formCode) => RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/exportExcelTemplate`);

// 上传已录入数据的模板文件、
export const getUploadUrl = (formCode) => RCall.newIns().post(`/codeZero/oss/get-upload-url/${formCode}`);


// 导入数据
export const importFile = (data) => RCall.newIns().post(`/codeZero/app/${data.appCode}/form/${data.formCode}/importFormDataFromExcel/${data.objectName}/${data.isStartProcess}`);

// 查询redis中缓存的导入导出任务的详情
export const queryImportOrExportProgressInfo = (appCode, formCode, taskId) => RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/queryImportOrExportProgressInfo/${taskId}`);


// 导出数据
export const exportFormDataToExcel = (appCode, formCode) => RCall.newIns().post(`/codeZero/app/${appCode}/form/${formCode}/exportFormDataToExcel`);



