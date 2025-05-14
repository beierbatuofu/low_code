<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.YaxisSetting") }}</div>
		<div class="flex" style="margin-bottom: 8px">
			<span style="margin-right: 10px">{{ $t("chartDesign.isShow") }}</span>
			<rvue-switch v-model="show"> </rvue-switch>
		</div>

		<rvue-select class="input" style="margin-bottom: 8px" v-model="position" placeholder="请选择">
			<rvue-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value"> </rvue-option>
		</rvue-select>

		<div>
			<div style="margin-bottom: 8px">{{ $t("chartDesign.YName") }}</div>

			<rvue-input class="input" style="margin-bottom: 8px;border-rad" v-model="name" :placeholder="$t('chartDesign.plzYName')"></rvue-input>
		</div>
		<div>
			<div style="margin-bottom: 8px">{{ $t("chartDesign.max") }}</div>
			<rvue-input class="input" style="margin-bottom: 8px" v-model="max" :placeholder="$t('chartDesign.plzYMax')"></rvue-input>
		</div>
		<div>
			<div style="margin-bottom: 8px">{{ $t("chartDesign.min") }}</div>
			<rvue-input class="input" v-model="min" :placeholder="$t('chartDesign.plzYMin')"></rvue-input>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTyAxis extends BaseAttr {
		private positionOptions = [
			{
				value: "left",
				label: this.$t("chartDesign.left"),
			},
			{
				value: "right",
				label: this.$t("chartDesign.right"),
			},
		];
		private get show() {
			//如果没有
			return this.data.config.yAxis.show;
		}
		private set name(n: boolean) {
			this.data.config.yAxis.name = n;
		}
		private get name() {
			//如果没有
			return this.data.config.yAxis.name;
		}
		private set show(n: boolean) {
			this.data.config.yAxis.show = n;
		}
		private get position() {
			return this.data.config.yAxis.position;
		}
		private set position(n: string) {
			this.data.config.yAxis.position = n;
		}
		private get min() {
			return this.data.config.yAxis.min || "";
		}
		private set min(n: string) {
			// if (+n < 0) {
			// 	this.$set(this.data.config.yAxis, "min", "dataMin");
			// } else {
			this.$set(this.data.config.yAxis, "min", n);
			// }
		}
		private get max() {
			return this.data.config.yAxis.max;
		}
		private set max(n: string) {
			this.$set(this.data.config.yAxis, "max", n);
		}
	}
</script>
<style lang="scss" scoped>
	.input {
		width: 200px;

		border-radius: 2px;
		::v-deep.el-input__inner {
			border-radius: 2px;
			height: 36px;
			border: 1px solid #dcdfe6;
		}
	}
</style>
