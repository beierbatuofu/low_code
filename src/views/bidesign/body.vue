<!--
 * @Description: Do not edit
 * @Date: 2022-01-10 13:10:49
 * @LastEditTime: 2022-05-11 10:57:57
 * @FilePath: \risen\src\views\bidesign\body.vue
-->
<template>
	<div class="bi-body">
		<div class="wrap">
			<div class="bi-echarts-wrap">
				<component
					:type="$route.params.type"
					:filterForm="filterForm"
					:ref="$route.params.type"
					:pageSize="pageSize"
					:data="data"
					:formConfig="formConfig"
					:dataChart="dataChart"
					:is="getComponent($route.params.type)"
				>
				</component>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

	import BiTable from "@/components/chartComps/biTable.vue";
	import BiQuota from "@/components/chartComps/biQuota.vue";
	import BiCostum from "@/components/chartComps/biCostums.vue";
	import BiFilter from "@/components/chartComps/biFilter.vue";

	import toEchartsData from "@/utils/toEchartsData";

	@Component({
		components: {
			BiTable,
			BiQuota,
			BiCostum,
			BiFilter,
		},
	})
	export default class BiDesign extends Vue {
		@Prop({ type: Boolean, default: false }) drag!: Boolean;
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) formConfig!: any;
		@Prop({ type: Number, default: 10 }) pageSize!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;

		@Inject("echartType") echartType!: any;
		private dataChart: any = { ...(new toEchartsData(this.data, this) as any).geteChartsData(), series: [] };
		private getComponent(type: string) {
			if (!type) return;
			let chartList = ["pie", "bar", "line", "costum"];

			if (chartList.includes(type)) {
				return "rvue-echarts";
			}
			return `bi-${type}`;
		}
		@Watch("data", { deep: true, immediate: true })
		onChangDData(n: any) {
			let type = this.$route.params.type;
			let needToEchartsData = ["bar", "line", "pie"];
			if (needToEchartsData.includes(type)) {
				this.$set(this, "dataChart", (new toEchartsData(n, this) as any).geteChartsData());
			} else if (type == "costum") {
				//转化为方法 直接丢进去 加入js
				if (typeof this.data.config.codeJ == "undefined") return;
				let code = this.data.config.codeJ;

				this.$set(this, "dataChart", code);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.flex {
		@include JustityAndFlexWrap(flex, center, center, null);
		height: 100%;
	}
	.bi-echarts-wrap {
		padding: 20px;
	}
	.bi-quota-container {
		padding: 20px;
		height: 100%;
		overflow-y: scroll;
		.total {
			padding-bottom: 10px;
			display: flex;
			justify-content: space-between;
			font-size: 24px;
		}
		.row {
			display: flex;
			justify-content: space-between;
		}
		.view {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			font-size: 24px;
			.total {
				font-size: 64px;
			}
		}
		.content {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 80%;
		}
	}
</style>
