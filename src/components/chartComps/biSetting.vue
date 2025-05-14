// 右边config的容器

<template>
	<div class="config-container">
		<div v-for="(item, index) in dOptions" class="config-item" :key="index">
			<component :formConfig="formConfig" :is="getComponent(item)" :config="config" :data="data" />
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
	import { ChartConfigFilter, ChartSConfigFilter, ChartDynamicDefaultValues, ChartStaticDefaultValues } from "@/components/chartDesign/core/defaultChartsValue";

	@Component({
		components: {},
	})
	export default class BiSetting extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) formConfig!: any;
		@Prop({ type: String, default: "data" }) mode!: any;
		private config: any = {}; //获取的配置
		private get dOptions() {
			let aResult: any;
			let data: Record<string, any>[] = this.mode == "data" ? ChartDynamicDefaultValues : ChartStaticDefaultValues;

			data.forEach((item: any) => {
				if (item.type == this.$route.params.type) {
					aResult = (<any>this).$utils.deepClone(item);

					for (const key in data) {
						Object.keys(data[key]).forEach((itemKey: any) => {
							if (ChartConfigFilter.includes(itemKey)) {
								delete aResult[itemKey];
							}
							if (ChartSConfigFilter.includes(itemKey) && this.mode != "data") {
								delete aResult[itemKey];
								aResult["reportConfig"] = this.data.reportConfig;
							}
						});
					}
					console.log(aResult, "aresult");
					this.config = aResult;
				}
			});

			return Object.keys(aResult || {});
		}

		private getComponent(type: string) {
			console.log(`CT${type}`);
			return `CT${type}`;
		}
	}
</script>

<style lang="scss" scoped>
	@import "./_style/biSetting.scss";
</style>
