import { ProviderParam } from "../ProviderInit";
import { PermissionModule, TAppPerm } from "@/store/modules/permission";

interface TRoleMethds {
	canVisitApps: (roles: string[], isAppDesign: boolean) => void;
	canDevApps: (roles: string[], isAppDesign: boolean) => void;
}

abstract class Role {
	protected appCode = "";
	protected route: ProviderParam | TJson = {};
	protected userRole(type: string, { userRole, isAppDesign }: TJson) {
		if (type == "canVisitApps") {
			if (!userRole.includes("R")) {
				return this.route.next({ path: "/not_permission", replace: true });
			}
		}

		if (type == "canDevApps") {
			const isRole = ["R", "U"].every((role: string) => userRole.includes(role));
			if (isRole && userRole.length) {
				//
				// `32979c1791cb4d5b9dbf36f7ef5401f9/p/conf/role`
				const path = `/${this.route.to.params.tenantId}/appd/${this.appCode}/p/conf/role`;
				return this.route.to.path != path && this.route.next({ path, replace: true });
			}
			return this.route.next({ path: "/not_permission", replace: true });
		}
	}
}

export class AppPermProvider extends Role {
	public support(param: ProviderParam): boolean {
		return true;
	}

	public excute(route: ProviderParam): void {
		if (process.env.NODE_ENV == "development") return;
		if ((this.appCode = route.to.params.appCode || "")) {
			this.route = route;
			PermissionModule.appRole.length == 0 ? this.postAppRole() : this.getCache();
		}
	}

	private getCurRole() {
		const cur = PermissionModule.appRole.find((p: TAppPerm) => p.appCode == this.appCode) || {};
		PermissionModule.SET_CURAPPROLE(cur);
		return cur;
	}

	private canVisitApps(roles: TJson, isAppDesign: boolean) {
		const userRole = roles?.userRole || [];
		this.userRole("canVisitApps", { userRole: Array.from(userRole), isAppDesign });
	}

	private canDevApps(roles: TJson, isAppDesign: boolean) {
		const userRole = roles?.userRole || [];
		this.userRole("canDevApps", { userRole: Array.from(userRole), isAppDesign });
	}

	private dispatch<T extends keyof TRoleMethds>(key: T, roles: string[], isAppDesign: boolean) {}

	// canDevApps 设置 canVisitApps 访问
	private routePerm(this: any) {
		const { isAppDesign, roles } = PermissionModule.curPerm;
		const perm: keyof TRoleMethds = this.route.to.meta.perm;
		if (isAppDesign) return this.route.next();
		if (!isAppDesign && !Object.keys(roles).length) {
			return this.route.next({ path: "/not_permission", replace: true });
		}

		this[perm]?.apply(this, [roles, isAppDesign]);
		// this.dsipatch(perm);
	}

	private postAppRole() {
		PermissionModule.getAppRole(this.appCode).then(() => {
			this.routePerm.call(this);
		});
	}

	private getCache() {
		const now = new Date().getTime();
		const maxTime = 60 * 0 * 1000;
		const cur: TJson = this.getCurRole();
		cur.timestamp ? (now - Number(cur.timestamp) >= maxTime ? this.updateRole() : this.routePerm()) : this.postAppRole();
	}

	private updateRole() {
		PermissionModule.DEL_APPROLE(this.appCode);
		this.postAppRole();
	}

	public static instance: null | AppPermProvider = null;

	public static ins() {
		if (!AppPermProvider.instance) {
			AppPermProvider.instance = new AppPermProvider();
		}
		return AppPermProvider.instance;
	}
}
