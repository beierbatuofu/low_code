<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.xtile") }}</div>

		<rvue-select class="input" v-model="type" placeholder="请选择">
			<rvue-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </rvue-option>
		</rvue-select>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTtilt extends BaseAttr {
		private typeOptions = [
			{
				value: "0",
				label: this.$t("chartDesign.transverse"),
			},
			{
				value: "90",
				label: this.$t("chartDesign.portrait"),
			},
			{
				value: "40",
				label: this.$t("chartDesign.leftTilt"),
			},
			{
				value: "-40",
				label: this.$t("chartDesign.rightTilt"),
			},
		];
		private get type() {
			return this.data.config.tilt;
		}
		private set type(n) {
			this.data.config.tilt = n;
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
