import { UserModule } from "@/store/modules/user";
import { getProviders } from "./ProviderInit";

const excuteProviders = (to: any, from: any, next: any) => {
	getProviders().forEach((item) => {
		if (item.support({ to, from, next })) {
			item.excute({ to, from, next });
		}
	});
};

export function beforeEachProcess(to: any, from: any, next: any) {
	const token = localStorage.getItem("token");
	// 存在token但不存在userId时触发loadUser
	if (token && !UserModule.userId) {
		UserModule.loadUser();
	}

	// 该部分代码续作整体优化
	if (token) {
		excuteProviders(to, from, next);
	}

	// TODO: 2020年11月6日 14点06分: 此处应该在路由跳转前检测token的有效性，防止使用假token
	if (to.matched.some((record: any) => record.meta.requireLogin)) {
		// 判断该路由是否需要登录权限
		if (token) {
			// 判断当前用户的登录信息loginInfo是否存在
			next();
		} else {
			next({
				path: "/login",
			});
		}
	} else if (to.path == "/login") {
		if (token) {
			// 判断当前用户的登录信息loginInfo是否存在
			next({
				path: "/",
			});
		} else {
			next();
		}
	} else {
		next();
	}
}
