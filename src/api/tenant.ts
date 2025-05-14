import { RCall } from "@/utils/RCall";

/**
 * 租户和权限相关接口
 */
export const getAppRole = (appCode: string) => RCall.newIns().request({ method: "post", url: `/codeZero/appRole/app/${appCode}/listAll` });

// -------------- 平台设置->权限管理->平台管理员 -----------
// 查询平台所有管理员
export const getTenantAdminList = () =>
	RCall.newIns().request({
		url: "/codeZero/tenant/admin/list",
		method: "post",
	});

// 添加平台管理员
export const addTenantAdmin = (id: any) =>
	RCall.newIns().request({
		url: `/codeZero/tenant/admin/save/${id}`,
		method: "post",
	});

// 删除平台管理员
export const delTenantAdmin = (id: any) =>
	RCall.newIns().request({
		url: `/codeZero/tenant/admin/delete/${id}`,
		method: "post",
	});

// ----------------- 平台设置->权限管理->应用开发组 -----------
// 获取开发组列表
export const getDevGroupList = () =>
	RCall.newIns().request({
		url: "/codeZero/form/app-dev-group/list",
		method: "post",
	});

// 添加应用开发组
export const addDevGroup = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/form/app-dev-group/add",
		method: "post",
		data,
	});

// 更新应用开发组
export const updateDevGroup = (data: any) =>
	RCall.newIns().request({
		url: "/codeZero/form/app-dev-group/update",
		method: "post",
		data,
	});

// 删除应用开发组
export const delDevGroup = (groupCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/form/app-dev-group/delete/${groupCode}`,
		method: "post",
	});

// -------------- 应用->应用设置->用户组 -------------
// 获取用户组列表
export const getAppUserGroup = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/perm/userGroup/get/${appCode}`,
		method: "post",
	});

// 添加-保存用户组
export const saveAppUserGroup = (appCode: any, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/perm/userGroup/save/${appCode}`,
		method: "post",
		data,
	});

// 获取用户组列表
export const delAppUserGroup = (appCode: any, groupId: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/perm/userGroup/delete/${appCode}/${groupId}`,
		method: "post",
	});

// -------------- 应用->应用设置->应用管理员 -------------
// 查询应用管理员列表
export const getAppAdminList = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app-admin/list?appCode=${appCode}`,
		method: "post",
	});

// 新增管理员
export const saveAppAdmin = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app-admin/add`,
		method: "post",
		data,
	});

// 删除管理员
export const delAppAdmin = (appCode: any, userId: any) =>
	RCall.newIns().request({
		url: `/codeZero/app-admin/remove/${appCode}/${userId}`,
		method: "post",
	});

// 更新管理员添加数据权限
export const updateAppAdmin = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app-admin/update`,
		method: "post",
		data,
	});

// -------------- 应用->应用设置->应用访问者 -------------
// 查询app访问权限
export const queryAppVisit = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/app-visit/query?appCode=${appCode}`,
		method: "post",
	});

// 保存应用访问者
export const saveAppVisit = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/app-visit/save`,
		method: "post",
		data,
	});

// 创建应用访问权限
export const createAppVisit = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/app-visit/create?appCode=${appCode}`,
		method: "post",
	});

// -------------- 应用->应用设置->应用设计者 -------------
// 查询角色组或者应用设计者
// type角色类型 0:应用设计者, 1:普通组
export const queryAppDesignerList = (appCode: any, type: any) =>
	RCall.newIns().request({
		url: `/codeZero/appRole/app/${appCode}/queryRoleGroupList/${type}`,
		method: "post",
		data: {},
	});

// 添加应用角色
export const addAppRole = (appCode: any, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/appRole/app/${appCode}/save`,
		method: "post",
		data,
	});

// 更新应用设计者与角色组
export const updateAppDesigner = (appCode: any, code: any, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/appRole/app/${appCode}/updateAppRole/${code}`,
		method: "post",
		data,
	});

// 删除角色组
export const delAppRole = (appCode: any, code: any) =>
	RCall.newIns().request({
		url: `/codeZero/appRole/app/${appCode}/deleteByCode/${code}`,
		method: "post",
	});

//在应用下创建一个App token
export const createAppToken = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/createAppToken`,
		method: "post",
    data:{appCode}
	});


  //查询获取应用下的App token
  export const getTokens = (appCode: any) =>
	RCall.newIns().request({
		url: `/codeZero/app/getTokens`,
		method: "post",
    data:{appCode}
	});


   //在应用下删除一个App token
   export const removeAppToken = (appCode: any) =>
   RCall.newIns().request({
     url: `/codeZero/app/removeAppToken`,
     method: "post",
     data:{appCode}
   });

   
   //启用-禁用 App token
   export const disableAppToken = (appCode: any,appToken:any,isDisabled:boolean) =>
   RCall.newIns().request({
     url: `/codeZero/app/disableAppToken`,
     method: "post",
     data:{appCode,appToken,isDisabled}
   });