import { RCall } from "@/utils/RCall";

/**
 * 用户权限接口
 */

export const postPermission = () =>
	RCall.newIns().request({
		url: `/codeZero/perm/permission/list`,
		method: "post",
	});
