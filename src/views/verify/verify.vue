<script lang="jsx">
	import * as dd from "dingtalk-jsapi";
	import { getDtTempToken2, login } from "@/api/login";

	export default {
		name: "Verify",
		render() {
			return <div></div>;
		},
		created() {
			// 判断环境是否为钉钉
			if (dd.env.platform === "notInDingTalk") {
				const tenant = JSON.parse(localStorage.getItem("tenant") || "{}");

				if (Object.keys(tenant).length == 0) return this.$router.replace(`/tenants`);
				if (!localStorage.getItem("token")) return this.$router.replace(`${tenant.tenantId}/login`);
				return this.$router.replace(`/${tenant.tenantId}/workbench`);
			} else {
				// 钉钉免密登录
				const loading = this.$loading({
					lock: true,
					text: "Loading",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
				const corpId = process.env.VUE_APP_CORP_ID;
				const that = this;

				dd.ready(function () {
					dd.runtime.permission.requestAuthCode({
						// 这里的corpId应该写死
						// corpId: "ding9199149ef01d3bd524f2f5cc6abecb85", // 企业id
						corpId, // risen企业id
						onSuccess: function (info) {
							const code = info.code; // 通过该免登授权码可以获取用户身份
							getDtTempToken2(corpId, code)
								.then((res) => {
									//    let { tenantId } = that.$route.params;
									const { tempToken, tenantId } = res.data;
									localStorage.setItem("tenant", JSON.stringify(res.data));
									login(tempToken, tenantId)
										.then((resp) => {
											const targetToken = resp.data;
											localStorage.setItem("token", targetToken);

											that.$router.replace({ path: `/${tenantId}/workbench` });
											loading.close();
										})
										.catch((err) => {
											alert("登录失败", JSON.stringify(err));
											loading.close();
										});
								})
								.catch((err) => {
									alert("corpId:", corpId);
									alert("获取临时token失败", "err:" + JSON.stringify(err));
									loading.close();
								});
						},
						onFail: function (err) {
							alert(JSON.stringify(err));
						},
					});
				});
			}
		},
	};
</script>
