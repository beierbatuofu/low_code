<template>
	<el-row id="selectTenant" type="flex" align="middle" justify="center">
		<el-col :span="12" class="business-box" style="max-width: 500px">
			<el-row v-for="item in tenantList" :key="item.tenantId" type="flex" justify="space-around" :gutter="12">
				<el-col :span="12">
					<el-button style="width: 100%; height: 40px; text-align: left; margin: 10px 0; text-align: center" icon="el-icon-folder-opened" @click="selectedTenant(item)">
						{{ item.tenantName }}
					</el-button>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>

<script lang="ts">
	import { getDtTempToken, getTenantsByToken, login } from "@/api/login";
	import { RespData } from "@/utils/RCall";
	import { Vue, Component } from "vue-property-decorator";
	import { getTenants } from "@/api/login";

	@Component
	export default class LoginRollback extends Vue {
		tenantList = [];

		tempToken = "";

		mounted() {
			localStorage.clear();
			getTenants().then((resp: TResponse) => {
				this.tenantList = resp.data;
			});
		}

		/**
		 * 登录失败处理
		 * @param msg 失败信息
		 */
		loginFailed(msg: string) {
			// this.$message.error({
			// 	message: msg,
			// });
			// this.$router.push({
			// 	path: "/login",
			// });
		}

		selectedTenant(tenantInfo: any) {
			let { tenantId } = tenantInfo;
			this.$router.push({
				path: `/${tenantId}/login`,
			});
		}
	}
</script>
<style lang="scss" scoped>


	#card:hover {
		cursor: pointer;
	}

	.loginStyle {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: cover;
		position: relative;
		background-image: url("/img/loginbg.jpg");
	}

	.login-group {
		.el-tabs__content {
			overflow: inherit;
		}
		.el-tabs__nav {
			margin-bottom: 20px;
		}
		.el-tabs__nav.is-stretch > * {
			background: rgba(0, 0, 0, 0.2);
		}
		.el-tabs__active-bar {
			opacity: 0;
			display: none;
		}
		.el-tabs__nav-wrap:after {
			display: none;
			opacity: 0;
		}
		.el-tabs__item.is-active {
			// color: #fff;
			// background:rgba(255,255,255,0.2);
		}
		.el-tabs__item:hover {
			color: #fff !important;
		}
		.el-tabs__item {
			padding: 0;
		}
	}

	.business-box {
		max-height: 400px;
		overflow-y: scroll;
		overflow-x: hidden;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
		font-size: 16px;
		.el-button {
			background: transparent;
			color: #fff;
			font-size: 16px;
			border-color: transparent;
			padding: 0;
			&:hover {
				background-color: rgba(255, 255, 255, 0.2);
				color: #fff;
				border-color: transparent;
			}
		}
	}
</style>
