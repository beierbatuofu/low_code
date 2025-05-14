import Vue from "vue";
import { getDtTempToken, login, getTenants, postGuest, postFreeLogin } from "@/api/login";
import { LoginModule } from "@/store/modules/login";
import { Message, Loading } from "element-ui";
import { setLocalStorage, getLocalStorage, removeLocalStorage } from "@/utils/storage";
import VueRouter, { Route } from "vue-router";
import * as dd from "dingtalk-jsapi";

type TLoginType = "dingtalk" | "guest" | "inDingTalk";

//报错统一处理
function Error(errCallBack: (ins: Logins, err: any) => any = () => {}) {
	return function (target: object, name: string, descriptor: PropertyDescriptor) {
		let oVal = descriptor.value;
		descriptor.value = () => {
			return oVal.call(Logins.ins(), Vue).catch((err: any) => errCallBack(Logins.ins(), err));
		};
	};
}

//TODO login封装
class Logins {
	public static instance: Logins = Object.create({});
	public static ins() {
		if (!(Logins.instance instanceof Logins)) {
			Logins.instance = new Logins();
		}

		return Logins.instance;
	}
	//Vue实例
	public static Vue: Vue;
	//路由对象
	private $route: Partial<Route> = {};
	//路由方法
	private $router: VueRouter = Object.create({});
	// el loading
	private $loading: (opts?: Record<string, any>) => any = (opts = {}) => {
		let options = Object.assign({ lock: true, text: "Loading", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)" }, opts);
		return Loading.service(options);
	};

	//初始化
	public init(vm: Vue, loginType: string) {
		this.$route = vm.$route;
		this.$router = vm.$router;
		Logins.Vue = vm;
		if (Reflect.has(this, loginType)) {
			setLocalStorage("loginType", loginType);
			this[<TLoginType>loginType](vm);
		}
	}

	//报错处理
	private loginFailed(err: string = "") {
		return Promise.resolve(
			Message({
				message: err,
				type: "error",
			})
		);
	}

	//dingtalk 登录
	@Error((ins: Logins, err: any) => {
		ins.loginFailed(err.msg).then(() => {
			ins.$router.push({
				path: "/login",
			});
		});
	})
	private dingtalk(vm: Vue) {
		if (Object.keys(vm).length == 0) return;
		let loading: Record<string, any> = Object.create({});
		let dingTalkCode = this.$route.query?.code;
		if (dingTalkCode) {
			return getDtTempToken(<string>dingTalkCode, LoginModule.getTenant.tenantId)
				.then(async (resp) => {
					let tempToken = resp.data;
					let tenantInfo = JSON.parse(getLocalStorage("tenant") || "{}");
					if (Object.keys(tenantInfo).length == 0)
						return this.$router.push({
							path: "/tenants",
							replace: true,
						});
					loading = this.$loading();

					let loginResp = await login(tempToken, tenantInfo.tenantId);
					const targetToken = loginResp.data;
					setLocalStorage("token", targetToken);
					this.$router.replace({ path: `/${tenantInfo.tenantId}/workbench` });
					loading.close();
				})
				.catch((err) => {
					this.$router.push({
						path: "/tenants",
						replace: true,
					});
				});
		} else {
			return Promise.reject();
		}
	}

	//匿名登录
	@Error((ins: Logins, err: any) => {
		ins.loginFailed(err.msg);
	})
	private guest(vm: Vue) {
		let { tenantId, appCode, formCode, dataId, assignCode } = this.$route?.params || {};
		let loading = this.$loading();
		return postGuest({ tenantId, appCode, formCode }).then(async (res) => {
			setLocalStorage("token", res.data);
			let tenantResp = await getTenants(tenantId);
			setLocalStorage("tenant", JSON.stringify(tenantResp.data[0]));
			loading.close();
			this.$router.push({
				path: `/${tenantId}/app/${appCode}/form/${assignCode}/dataInfo/${dataId}`,
			});
		});
	}

	//钉钉app 免密登录
	@Error((ins: Logins, err: any) => {
		ins.loginFailed(err.msg);
	})
	private inDingTalk(vm: Vue) {
		let { appCode, redirect, tenantId } = this.$route.query || {};
		if (dd.env.platform == "notInDingTalk" || !appCode || !tenantId) {
			return Promise.resolve(this.$router.back());
		}
		let loading = this.$loading();
		return <Promise<Record<string, any>>>getTenants(String(tenantId)).then((resp) => {
			let { corpId } = resp.data[0] || {};
			return new Promise((resolve, reject) => {
				dd.ready(() => {
					(dd as Record<string, any>).runtime.permission.requestAuthCode({
						corpId: corpId,
						onSuccess: (result: TJson) => {
							let authCode = result.code;
							postFreeLogin(<string>appCode, authCode, <string>tenantId)
								.then((res: TResponse) => {
									const targetToken = res.data.tempToken;
									setLocalStorage("tenant", JSON.stringify(res.data));
									login(targetToken, res.data.tenantId)
										.then((resp) => {
											const token = resp.data;
											setLocalStorage("token", token);
											this.$router.replace({ path: <string>redirect });
											loading.close();
											resolve(resp);
										})
										.catch((err) => {
											reject(err);
											loading.close();
										});
								})
								.catch((err: any) => {
									loading.close();
									reject(err);
								});
						},
						onFail: function (err: any) {
							reject(err);
						},
					});
				});
			});
		});
	}

	//登出
	public logout() {
		removeLocalStorage("token");
		let tenantId = this.$route.params?.tenantId;
		tenantId && (window.location.href = `/#/${tenantId}/login`);
	}
}

export default Logins.ins();
