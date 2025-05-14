/*
 * @Author: ben
 * @LastEditTime: 2021-12-09 16:58:16
 */
import { VuexModule, Module, getModule, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { RCall } from "@/utils/RCall";
import { getTenants } from "@/api/login";

export interface LoginState {
	tenantInfo: Record<"tenantId" | "tenantName" | "corpId" | "loginAppKey", string>;
}

@Module({ dynamic: true, store, name: "login" })
class Login extends VuexModule implements LoginState {
	public tenantInfo = {
		tenantId: "",
		tenantName: "",
		corpId: "",
		loginAppKey: "",
	};

	public get getTenant() {
		const tenant = localStorage.getItem("tenant") || "{}";
		return JSON.parse(tenant);
	}

	@Mutation
	public SET_TENANT(data: TJson) {
		const result = { tenantId: data.tenantId, tenantName: data.tenantName, corpId: data.corpId, loginAppKey: data.loginAppKey };
		this.tenantInfo = result;
		localStorage.setItem("tenant", JSON.stringify(result));
	}

	@Action
	public postTenants(tenantId: string | undefined) {
		return getTenants(tenantId).then((resp: TResponse) => {
			if (resp.code == "0") {
				this.SET_TENANT(resp.data[0]);
			}
		});
	}
}

export const LoginModule = getModule(Login);
