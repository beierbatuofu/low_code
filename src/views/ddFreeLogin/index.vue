<script lang="ts">
	import { Component, Watch, Vue } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import * as dd from "dingtalk-jsapi";
	import { postFreeLogin, login } from "@/api/login";
	import Logins from "@/core/Logins";

	@Component
	export default class DDFreeLogin extends Vue {
		private appCode: string = "";
		private redirect: string = "";
		private tenantId: string = "";
		// private corpId = 'ding9199149ef01d3bd524f2f5cc6abecb85';
		// risen
		private corpId = process.env.VUE_APP_CORP_ID;
		private fullscreenLoading = true;
		protected render(h: CreateElement) {
			return h("div");
		}
		protected created() {
			Logins.init(this, "inDingTalk");

			// ({ appCode: this.appCode, redirect: this.redirect, tenantId: this.tenantId } = this.$route.query as any);

			// if (dd.env.platform == "notInDingTalk" || !this.appCode) {
			// 	return this.$router.back();
			// }

			// const loading = this.$loading({
			// 	lock: true,
			// 	spinner: "el-icon-loading",
			// 	background: "rgba(0, 0, 0, 0.7)",
			// });

			// this.ddReady().then((result: TJson) => {
			// 	let authCode = result.code;
			// 	console.log(authCode, "authCode", this.corpId, this.tenantId);

			// 	postFreeLogin(this.appCode, authCode, this.tenantId)
			// 		.then((res: TResponse) => {
			// 			const targetToken = res.data.tempToken;

			// 			localStorage.setItem("tenant", JSON.stringify(res.data));

			// 			login(targetToken, res.data.tenantId)
			// 				.then((resp) => {
			// 					const token = resp.data;
			// 					localStorage.setItem("token", token);
			// 					this.$router.replace({ path: this.redirect });
			// 					loading.close();
			// 				})
			// 				.catch((err) => {
			// 					alert("登录失败" + JSON.stringify(err));
			// 					loading.close();
			// 				});
			// 		})
			// 		.catch((err: any) => {
			// 			loading.close();
			// 			this.$message({
			// 				message: err.msg,
			// 				type: "warning",
			// 			});
			// 		});
			// });
		}

		private ddReady(): any {
			// return new Promise((resolve: any, reject: () => void) => {
			// 	dd.ready(() => {
			// 		(dd as any).runtime.permission.requestAuthCode({
			// 			corpId: this.corpId,
			// 			onSuccess: (result: TJson) => {
			// 				resolve(result);
			// 			},
			// 			onFail: function (err: any) {
			// 				alert(JSON.stringify(err));
			// 			},
			// 		});
			// 	});
			// });
		}
	}
</script>
