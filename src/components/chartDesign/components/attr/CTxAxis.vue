<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.xSetting") }}</div>
		<div class="flex" style="margin-bottom: 20px">
			<span style="margin-right: 8px">{{ $t("chartDesign.isShow") }}</span>
			<rvue-switch v-model="show"> </rvue-switch>
		</div>
		<div>
			<div style="margin-bottom: 8px">{{ $t("chartDesign.xName") }}</div>
			<rvue-input class="input" v-model="name" :placeholder="$t('chartDesign.plzxName')"></rvue-input>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTxAxis extends BaseAttr {
		private get show() {
			//如果没有
			return this.data.config.xAxis.show;
		}
		private set name(n: boolean) {
			this.data.config.xAxis.name = n;
		}
		private get name() {
			//如果没有
			return this.data.config.xAxis.name;
		}
		private set show(n: boolean) {
			this.data.config.xAxis.show = n;
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
