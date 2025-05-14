/*
 * @Author: ben
 * @LastEditTime: 2022-04-21 15:27:09
 */
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import { RouteConfig } from "vue-router";
import { asyncRoutes } from "@/router/index.ts";
import store from "@/store";
import { getAppRole } from "@/api/tenant.ts";

const hasPermission = (routesCode: string[], route: RouteConfig) => {
	if (route.meta && route.meta.permissionCode) {
		return routesCode.find((code: any) => code.perms == (<any>route).meta.permissionCode);
	} else {
		return true;
	}
};

export const filterAsyncRoutes = (routes: RouteConfig[], routesCode: string[], handleCode: string[]) => {
	const res: RouteConfig[] = [];
	routes.forEach((route) => {
		const r: any = { ...route };
		const hasCode: any = hasPermission(routesCode, r);
		if (hasCode) {
			if (r.children) {
				r.children = filterAsyncRoutes(r.children, routesCode, handleCode);
			}
			const permissionCode = r.meta ? r.meta.permissionCode || "" : "";
			const handles = handleCode.filter((code: any) => code.perms.indexOf(permissionCode) !== -1);
			if (handles.length > 0 && r.meta) {
				r.meta["handleCode"] = handles;
			}
			res.push(r);
		}
	});

	return res;
};

export interface TAppPerm {
	appCode?: string;
	role?: TJson[];
	timestamp?: string | number;
	isAppDesign?: boolean;
}

export interface PermissionState {
	routes: RouteConfig[];
	appRole: TAppPerm[];
	curAppRole: TAppPerm;
}

@Module({ dynamic: true, store, name: "permission" })
class Permission extends VuexModule implements PermissionState {
	public routes: RouteConfig[] = [];
	public appRole: TAppPerm[] = [];
	public curAppRole: TAppPerm = {};

	public get isCurPerm(): boolean {
		const { roles, isAppDesign } = this.curPerm;
		const userRole: any[] = roles?.userRole ? Array.from(roles?.userRole) : [];
		const isRole: boolean = ["R", "U"].every((role: string) => userRole.includes(role));
		return isAppDesign || isRole;
	}

	public get curPerm(): TJson {
		const roles: TJson = {};
		if (Object.keys(this.curAppRole).length) {
			this.curAppRole?.role &&
				this.curAppRole.role.forEach((r: TJson) => {
					Object.keys(r).forEach((key: string) => {
						roles.hasOwnProperty(key) ? (roles[key] = new Set([...r[key], ...roles[key]])) : (roles[key] = new Set(r[key]));
					});
				});
		}
		return {
			roles,
			isAppDesign: this.curAppRole.isAppDesign,
			timestamp: this.curAppRole.timestamp,
		};
	}

	@Mutation
	public DEL_APPROLE(appCode: string) {
		this.appRole = this.appRole.filter((p: TAppPerm) => p.appCode != appCode);
	}

	@Mutation
	public SET_CURAPPROLE(perm: TAppPerm) {
		this.curAppRole = perm;
	}

	@Mutation
	public SET_APPROLE(perm: TAppPerm) {
		this.appRole.push(perm);
	}

	@Mutation
	private SET_ROUTES(routes: RouteConfig[]) {
		this.routes = routes;
	}

	@Action
	public getAppRole(appCode: string) {
		return Promise.resolve(
			getAppRole(appCode).then((resp: TResponse) => {
				console.log(resp);
				const { timestamp } = resp;
				this.SET_APPROLE({ ...resp.data, timestamp });
				this.SET_CURAPPROLE({ ...resp.data, timestamp });
			})
		);
	}

	@Action
	public GenerateRoute(data: { [key: string]: string[] }) {
		const routes = filterAsyncRoutes(asyncRoutes, data.routesCode, data.handleCode);
		this.SET_ROUTES(routes);
	}
}

export const PermissionModule = getModule(Permission);
