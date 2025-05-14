<template>
	<div class="form" style="width: 100%" v-if="isLoading">
		<form-detail :formCode="formCode" :dataId="dataId" :key="dataId" @close="handleClose"></form-detail>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
	import * as dd from "dingtalk-jsapi";
	import { getDtTempToken2, login } from "@/api/login";
	import FormDetail from "@/components/formDetail/formDetail.vue";

	@Component({
		components: {
			FormDetail,
			// FlowDialogCon,
		},
	})
	export default class extends Vue {
		private formCode: string = this.$route.params.formCode;
		private dataId: string = this.$route.params.dataId;
		private tenantId: string = "";
		private isLoading = false;

		private handleClose() {
			this.$router.push(`/${this.tenantId}/flow/todo`);
		}

		protected created() {
			const loading = this.$loading({
				lock: true,
				text: "Loading",
				spinner: "el-icon-loading",
				background: "rgba(0, 0, 0, 0.7)",
			});
			//let corpId = process.env.VUE_APP_CORP_ID;
			this.isLoading = false;
			let { corpId } = this.$route.query; // 从路由中获取企业id
			let that = this;
			dd.ready(function () {
				(dd as any).runtime.permission.requestAuthCode({
					corpId, // 企业id
					onSuccess: function (info: any) {
						let code = info.code; // 通过该免登授权码可以获取用户身份

						getDtTempToken2(corpId, code)
							.then((res) => {
								let { tempToken, tenantId } = res.data;
								that.tenantId = tenantId;
								localStorage.setItem("tenant", JSON.stringify(res.data));

								login(tempToken, tenantId)
									.then((resp) => {
										const targetToken = resp.data;
										localStorage.setItem("token", targetToken);
										that.isLoading = true;
										loading.close();
									})
									.catch((err) => {
										loading.close();
									});
							})
							.catch((err) => {
								that.isLoading = true;
								alert("获取临时token失败" + "err:" + JSON.stringify(err));
								loading.close();
							});
					},
					onFail: function (err: any) {
						alert(JSON.stringify(err));
						loading.close();
					},
				});
			});
		}
	}
</script>
