<template>
	<div class="ct-container ct-title">
		<div class="flex" style="margin-bottom: 8px">
			<div class="ct-title">{{ $t("chartDesign.showLegend") }}</div>
			<rvue-switch v-model="value"> </rvue-switch>
		</div>

		<div style="margin-bottom: 8px">{{ $t("chartDesign.legendLocation") }}</div>
		<rvue-select-group class="input" :config="{ type: 'chart' }" :options="positionOptions" v-model="position"></rvue-select-group>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTlegend extends BaseAttr {
		private positionOptions = [
			{
				value: "top",
				label: this.$t("chartDesign.top"),
			},
			{
				value: "bottom",
				label: this.$t("chartDesign.bottom"),
			},
			{
				value: "left",
				label: this.$t("chartDesign.left"),
			},
			{
				value: "right",
				label: this.$t("chartDesign.right"),
			},
		];
		private get value() {
			return this.data.config.legend.show;
		}
		private set value(n) {
			this.data.config.legend.show = n;
		}

		private get position() {
			return this.data.config.legend.position;
		}
		private set position(n: boolean) {
			this.data.config.legend.position = n;
		}
	}
</script>
<style lang="scss" scoped>
	.input {
		width: 200px;
		height: 36px;
		border-radius: 2px;
		::v-deep.el-input__inner {
			border-radius: 2px;
			border: 1px solid #dcdfe6;
		}
	}
</style>
