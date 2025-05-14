/*
 * @Author: ben
 * @LastEditTime: 2022-03-04 16:31:30
 */

import { RCall, RespData } from "@/utils/RCall";

/**
 * 登录相关接口
 */

/**
 * 获取临时token
 * @param code 钉钉返回的code
 */
export function getDtTempToken(code: string, tenantId: string): Promise<RespData> {
	return RCall.newIns().post("/codeZero/login/pre/dt/qrCode", undefined, {
		code,
		tenantId,
	});
}
/**
 * 获取临时token
 * @param code 钉钉返回的code
 */
export function getDtTempToken2(corpId: any, code: string): Promise<RespData> {
	return RCall.newIns().post(`/codeZero/login/pre/dt/qrcode/v2`, undefined, {
		corpId,
		authCode: code,
	});
}

/**
 * 查询用户相关的租户列表
 * @param token 临时token
 */
export function getTenantsByToken(token: string): Promise<RespData> {
	return RCall.newIns().post(`/codeZero/login/pre/query/tenants/token/${token}`);
}

/**
 * 用户登录
 * @param token 临时token
 * @param tenantId 租户id
 */
export function login(token: string, tenantId: string): Promise<RespData> {
	return RCall.newIns().header({ token }).post("/codeZero/dt/login", { tenantId });
}

/**
 * 加载用户信息
 */
export function loadUserInfo() {
	return RCall.newIns().post("/codeZero/user/info");
}

/*
 * 钉钉根据表单code快捷登录
 */
export const postFreeLogin = (appCode: string, authCode: string, tenantId: string) =>
	RCall.newIns()
		.header({
			"Content-Type": "application/x-www-form-urlencoded",
		})
		.request({
			url: `/codeZero/login/pre/dt/password/free/${appCode}`,
			method: "post",
			data: `authCode=${authCode}`,
		});

/**
 * 用户同步模块->用户权限->查询用户角色列表
 * PLATFORM_ADMIN
 */
export function getAppPerm() {
	return RCall.newIns().post("/codeZero/user/perm/query");
}

export const getTenants = (tenantId?: string) => {
	if (tenantId) return RCall.newIns().post(`/codeZero/login/query/tenants?tenantId=${tenantId}`);
	return RCall.newIns().post(`/codeZero/login/query/tenants`);
};

//匿名用户临时token获取
export const postGuest = (data: any) =>
	RCall.newIns().request({
		url: `/codeZero/guest/login`,
		method: "post",
		data,
	});
