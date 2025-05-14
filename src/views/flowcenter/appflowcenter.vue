<template>
	<div class="flowcenter">
		<div class="m-header">
			<div class="nav-bar">
				<div class="nav left">
					<div @click="handleReturn">
						<i class="el-icon-arrow-left" style="color: #ccc; font-size: 26px; cursor: pointer"></i>
					</div>
				</div>
				<div class="nav middle">
					<rvue-tabs :value="tabValue" @tab-click="handleClick">
						<rvue-tab-pane :label="$t('flow.mytodolist')" name="todo"> </rvue-tab-pane>
						<rvue-tab-pane :label="$t('flow.mylaunch')" name="create"> </rvue-tab-pane>
						<rvue-tab-pane :label="$t('flow.myhandle')" name="transactors"> </rvue-tab-pane>
						<rvue-tab-pane :label="$t('flow.carbonCopy')" name="ccUsers"> </rvue-tab-pane>
						<!-- <rvue-tab-pane label="抄送我的" name="ccUsers">
            </rvue-tab-pane> -->
					</rvue-tabs>
				</div>
			</div>
		</div>
		<router-view :key="$route.params.appCode"></router-view>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch } from "vue-property-decorator";
	import MHeader from "@/components/m-header/m-header.vue";

	@Component({
		name: "AppFlowCenter",
		components: {
			MHeader,
		},
	})
	export default class extends Vue {
		private handleReturn() {
			const { tenantId, appCode } = this.$route.params;
			this.$router.push(`/${tenantId}/app/${appCode}/p/`);
		}

		private get tabValue() {
			const type = this.$route.path.split("/").pop();
			return type;
		}
		private handleClick({ name }: TJson) {
			const { tenantId, appCode } = this.$route.params;
			this.$router.push(`/${tenantId}/app/${appCode}/p/flow/${name}`);
		}
	}
</script>
<style lang="scss" scoped>
	$mheaderHeight: 56px;
	.m-header {
		@include PositionRelative(null, $mheaderHeight);
		z-index: 100;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		.nav-bar {
			@include PositionAbsoulte(0, 0, 0, 0);
			padding: 0 10px;
		}
		.nav.left {
			@include PositionRelative(null, 100%);
			float: left;
			left: 0;
			display: flex;
			align-items: center;
			color: #333;
			font-weight: 700;
		}
		.nav.middle {
			font-size: 18px;
			line-height: $mheaderHeight;
			@include PositionAbsoulte(0, null, null, 50%);
			transform: translate(-50%, 0%);
			color: #333;
			height: $mheaderHeight;
			overflow: hidden;
			a {
				display: inline-block;
				line-height: $mheaderHeight;
			}
		}
	}
</style>
