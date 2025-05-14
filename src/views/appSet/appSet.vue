<template>
	<div class="app-set">
		<div class="header">
			<div class="return-app el-icon-arrow-left" @click="handleReturn"></div>
			<div class="tabs">
				<rvue-tabs v-model="active" @tab-click="handleChange">
					<rvue-tab-pane v-if="curPerm.isAppDesign" name="basic">
						<span slot="label">{{ $t("appset.modifyform") }}</span>
					</rvue-tab-pane>
					<rvue-tab-pane v-if="curPerm.isAppDesign" name="designer">
						<span slot="label">{{ $t("appset.ApplicationDesigner") }}</span>
					</rvue-tab-pane>
					<rvue-tab-pane name="role">
						<span slot="label">{{ $t("global.role") }}</span>
					</rvue-tab-pane>
					<rvue-tab-pane v-if="curPerm.isAppDesign" name="dataset">
						<span slot="label">{{ $t("appset.dataSet") }}</span>
					</rvue-tab-pane>
				</rvue-tabs>
			</div>
		</div>
		<router-view :key="$route.params.appCode"></router-view>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue } from "vue-property-decorator";
	import { PermissionModule } from "@/store/modules/permission";

	@Component
	export default class AppSet extends Vue {
		private active = "basic";
		get curPerm() {
			return PermissionModule.curPerm;
		}

		private handleChange(val: any) {
			const { appCode, tenantId } = this.$route.params;
			const path = `/${tenantId}/appd/${appCode}/p/conf/${this.active}`;
			if (path == this.$route.path) return;
			this.$router.replace(path);
		}

		private handleReturn() {
			const { appCode, tenantId } = this.$route.params;
			const path = `/${tenantId}/appd/${appCode}/p/`;
			if (!PermissionModule.isCurPerm) {
				this.$router.replace(path);
			} else if (window.history.length <= 1) {
				this.$router.replace("/");
			} else {
				this.$router.back();
			}
		}

		@Watch("$route", { immediate: true })
		onChangeRoute(n: Record<string, any>, o: Record<string, any>) {
			let { datasetId } = this.$route.params;
			this.active = datasetId ? "dataset" : this.$route.path.split("/").pop() || "basic";
		}
	}
</script>
<style lang="scss" scoped>
	.app-set {
		min-height: 100vh;
	}

	::v-deep .title {
		margin: 20px 10px;
		font-size: 22px;
		.btn-save {
			float: right;
			margin-right: 40px;
		}
	}

	.return-app {
		line-height: 40px;
		@include PositionAbsoulte(0, null, null, 10px);
		font-size: 24px;
		color: $color;
		font-weight: bold;
		cursor: pointer;
	}

	.tabs {
		text-align: center;
		margin: 0 100px;
		.el-tabs {
			display: inline-block;
		}
	}
</style>
