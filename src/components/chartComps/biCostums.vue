<template>
	<rvue-echarts :dataset="data.config.dataset" ref="echarts" :dataChart="dataChartE"></rvue-echarts>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";

	@Component({
		components: {},
	})
	export default class BiCustoms extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) dataChart!: any;

		private get dataChartE() {
			let code: string = `
		{"xAxis": {
			"type": "category"
			
		},
		"yAxis": {
			"type": "value"
		},
		"series": [
				{
				"label": {
					"show": true
				},
				"type": "bar"
				}
			],
			"dataset": "dataset1"
			}
`;
			if (this?.data?.config?.code) {
				return JSON.parse(
					this.data.config.code
						.replace(/[\t\n]/g, "")
						.replace(/\ +/g, "")
						.replace(/option/g, "")
						.replace(/=/g, "")
				);
			} else {
				return JSON.parse(
					code
						.replace(/[\t\n]/g, "")
						.replace(/\ +/g, "")
						.replace(/option/g, "")
						.replace(/=/g, "")
				);
			}
		}

		//重置宽度和高度
		private resize(width: number, height: number) {
			(<any>this).$refs["echarts"].resize(width, height);
		}
	}
</script>
