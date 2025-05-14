<template>
	<div class="bi-right">
		<rvue-tabs v-model="activeName" v-if="$route.params.type !== 'filter'">
			<rvue-tab-pane :label="$t('chartDesign.dataSetting')" name="1">
				<div>
					<BiSetting :data="data" mode="data" :formConfig="formConfig" :key="activeName" />
				</div>
			</rvue-tab-pane>
			<rvue-tab-pane :label="$t('chartDesign.chartSetting')" name="2">
				<div>
					<BiSetting :data="data" mode="chart" :key="activeName" />
				</div>
			</rvue-tab-pane>
		</rvue-tabs>
		<bi-filter-config :filterForm="filterForm" v-else :data="data"></bi-filter-config>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, PropSync, Prop } from "vue-property-decorator";

	import BiSetting from "@/components/chartComps/biSetting.vue";
	import BiFilterConfig from "@/components/chartComps/_filterComponent/config.vue";
	@Component({
		components: {
			BiSetting,
			BiFilterConfig,
		},
	})
	export default class BiConfig extends Vue {
		@PropSync("drag", { type: Boolean, default: false }) syncDrag!: boolean;
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) formConfig!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;

		private activeName: string = "1";
		private getDrag(v: boolean) {
			this.syncDrag = v;
		}
	}

</script>

<style lang="scss" scoped>
	@import "./_style/config.scss";
</style>
