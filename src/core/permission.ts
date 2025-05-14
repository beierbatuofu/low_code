/*
 * @Author: ben
 * @LastEditTime: 2022-04-26 12:08:03
 */
import router from "@/router";
import { Route } from "vue-router";
import { UserModule } from "@/store/modules/user";
import { SettingsModule } from "@/store/modules/settings";
import { FormModule } from "@/store/modules/form";
import { PermissionModule } from "@/store/modules/permission";
import { getProviders } from "@/router/ProviderInit";
import * as dd from "dingtalk-jsapi";

const isAdmin = ["/corp_log"];
if (dd.env.platform !== "notInDingTalk") {
	localStorage.clear();
	sessionStorage.clear();
}

const excuteProviders = (to: any, from: any, next: any) => {
	getProviders().forEach((item: any) => {
		if (item.support({ to, from, next })) {
			item.excute({ to, from, next });
		}
		// item.addFlag(to, from, next )
	});
};

const documentTitle = (to: Route) => {
	const { name } = FormModule.curApp;

	document.title = to.path.includes("workbench") || !name ? "聆风" : name;
};

router.beforeEach(async (to: Route, from: Route, next: any) => {
	//let theme = window.localStorage.getItem('theme') || '#5ca0e2';
	SettingsModule.SET_THEMECOLOR("#5ca0e2");
	// console.log(to.path);
	// console.log("from=" + from.path);
	const token = localStorage.getItem("token");

	if (token) {
		// 缓存all app

		// await FormModule.getAllApps();
		// 该部分代码续作整体优化
		excuteProviders(to, from, next);
		//documentTitle(to);

		const tenant: TJson = JSON.parse(localStorage.getItem("tenant") || "{}");

		if (!to.params?.tenantId && !/(not_permission|ddfreelogin|ext_ddlink)/g.test(to.path)) {
			if (tenant?.tenantId) {
				return next(`/${tenant.tenantId}/workbench`);
			}

			localStorage.clear();
			return next("/tenants");
		}

		if (tenant.tenantId && to.params?.tenantId && tenant.tenantId != to.params.tenantId && dd.env.platform == "notInDingTalk") {
			const path: string = to.path.replace(/^\/.+\//, `/${tenant?.tenantId}/`);

			return next({ path, replace: true });
		}

		if (!UserModule.userId) {
			// 存在token但不存在userId时触发loadUser
			UserModule.loadUser();
		}
		if (to.path.includes("/login")) {
			next({ path: "/" });
		} else {
			//TODO 流程中心无需请求权限接口,暂时简单过滤
			if (!["create", "todo", "transactors", "ccUsers"].some((url: string) => to.path == "/" + to.params.tenantId + "/flow/" + url)) {
				//缓存app 访问权限
				await UserModule.getAppPerm();

				/**
				 * @description: 应用权限 isAdmin 访问权限，   canVisitApps 能访问app数组
				 */

				/**
				 * TODO 需改善
				 * @description: 处理除应用以外平台管理员权限路由权限
				 */
				//

				//平台管理员路由
				if (isAdmin.includes(to.path)) {
					UserModule.appPerm.isAdmin ? next() : next({ path: "/not_permission" });
				}
				const perm = (<any>to).meta.perm || "";

				if (!UserModule.appPerm.isAdmin && UserModule.appPerm.hasOwnProperty(perm) && to.params.appCode) {
					const group = UserModule.appPerm[perm];
					if (group.includes(to.params.appCode)) {
						next();
					}
				}
				if (localStorage.loginType == "guest" && !to.meta?.isGuest) {
					next({ path: "/not_permission" });
				}
				// if(!to.meta?.isGuest){
				// 	next({ path: "/not_permission" });
				// }
			}

			next();

			// if (process.env.VUE_APP_ENV == "production") {
			// 	if (UserModule.routesCode.length == 0 && UserModule.routeNotEmpty) {
			// 		try {
			// 			await UserModule.getPermission();
			// 			//匹配路由
			// 			PermissionModule.GenerateRoute({
			// 				routesCode: UserModule.routesCode,
			// 				handleCode: UserModule.handleCode,
			// 			});
			// 			//动态加载路由
			// 			router.addRoutes(PermissionModule.routes);
			// 			//history不添加记录
			// 			next({
			// 				...to,
			// 				replace: true,
			// 			});
			// 		} catch (err) {
			// 			//删除token 重新登录
			// 			UserModule.ResetToken();
			// 			next({
			// 				path: "/login",
			// 			});
			// 		}
			// 	} else {
			// 		next();
			// 	}
			// } else {
			// 	next();
			// }
		}
	} else {
		const { appCode, tenantId } = to.params;

		//tenant

		if (dd.env.platform !== "notInDingTalk" && appCode) {
			next({
				path: `/ddfreelogin?appCode=${appCode}&tenantId=${tenantId}&redirect=${to.path + "?source=dd_post"}`,
				replace: true,
			});
		} else if (to.meta?.noLogin) {
			//whiteList.some((url: string) => to.path.indexOf(url) !== -1)

			next();
		} else {
			dd.env.platform !== "notInDingTalk"
				? next({
						path: `/no_password`,
						replace: true,
				  })
				: next(`/${tenantId}/login`);
		}
	}
});
