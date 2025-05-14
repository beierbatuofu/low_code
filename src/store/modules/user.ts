import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";

import { getLocalStorage, removeLocalStorage } from "@/utils/storage";
import { loadUserInfo, getAppPerm } from "@/api/login";
import { postPermission } from "@/api/user";

export interface UserState {
	userInfo: TUser;
	token: string;
	routesCode: any[];
	handleCode: any[];
	routeNotEmpty: boolean;
	appPerm: TJson;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements UserState {
	public userInfo: TUser = {};
	public formList = [];
	public form = {};
	public token = getLocalStorage("token") || "";
	public enc = getLocalStorage("enc") || "";
	public routesCode = [];
	public handleCode = [];
	public routeNotEmpty = true;
	public appPerm: TJson = {};

	@Mutation SET_APPPERM(o: TJson) {
		this.appPerm = o;
	}

	@Mutation SET_ROUTENOTEMPTY(v: boolean) {
		this.routeNotEmpty = v;
	}

	@Mutation
	private SET_TOKEN(token: string) {
		this.token = token;
	}

	@Mutation
	private SET_USER_INFO(userInfo: any) {
		this.userInfo = userInfo;
	}

	@Mutation
	public SET_ENC_MODE(mode = "") {
		this.enc = mode;
		mode ? window.localStorage.setItem("enc", mode) : removeLocalStorage("enc");
	}

	@Mutation
	public REMOVE_ENC_MODE() {
		this.enc = "";
		removeLocalStorage("enc");
	}

	@Mutation
	private SET_CODE(data: any) {
		//mock
		this.routesCode = data.routeCodes;
		this.handleCode = data.hanldeCodes;
	}

	@Action
	public async getAppPerm() {
		let res = await getAppPerm();
		this.SET_APPPERM(res.data);
	}

	@Action
	public ResetToken() {
		removeLocalStorage("token");
		this.SET_TOKEN("");
		this.SET_ENC_MODE();
	}

	/**
	 * add by yincg @2020年11月18日 15点47分
	 */
	@Action
	public loadUser() {
		loadUserInfo().then((resp: TResponse) => {
			this.SET_USER_INFO(resp.data);
		});
	}

	@Action
	public async getPermission() {
		let res = await postPermission();
		let list = [...res.data.tenantMenu, ...res.data.userMenu];

		if (res.data.tenantMenu.length == 0) {
			this.SET_ROUTENOTEMPTY(false);
		} else {
			this.SET_ROUTENOTEMPTY(true);
		}
		let routeCodes: any[] = [];
		let hanldeCodes: any[] = [];
		list.forEach((item: any) => {
			if (item.type == "R") {
				routeCodes.push(item);
			} else {
				hanldeCodes.push(item);
			}
		});

		this.SET_CODE({ routeCodes, hanldeCodes });
	}

	/**
	 * 获取用户头像
	 */
	get userAvatar() {
		return this.userInfo.avatar;
	}

	/**
	 * 获取用户名字
	 */

	get userName() {
		return this.userInfo.userName;
	}

	/**
	 * 获取userId
	 */
	get userId() {
		return this.userInfo.userId;
	}
}

export const UserModule = getModule(User);
