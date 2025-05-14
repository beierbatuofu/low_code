<!--
 * @Author: ben
 * @LastEditTime: 2022-01-04 16:28:15
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('widgetConfig.attrNumRange')" :tip="t('widgetConfig.attrNumRangeTip')" />
		<br />
		<el-checkbox :label="t('widgetConf.numRange.limitNumRange')" v-model="isLimitNumRange"></el-checkbox>
		<div class="attrconf-nowrap margin-left-10" v-if="isLimitNumRange">
			<rvue-number-range
				@blur="timestamp++"
				:key="timestamp"
				class="attrconf-numinput"
				:precision="2"
				v-model="numValue"
				:controls="false"
				size="small"
				:placeholder="t('widgetConf.noLimit')"
			></rvue-number-range>
		</div>
	</div>
</template>
<script>
	import { create } from "../utils/create";

	export default create({
		name: "AttrNumRange",
		data() {
			return {
				timestamp: 1,
			};
		},
		computed: {
			numValue: {
				get() {
					return {
						0: this.data.numRange.min,
						1: this.data.numRange.max,
					};
				},
				set(n) {
					this.$set(this.data.numRange, "max", n[1]);
					this.$set(this.data.numRange, "min", n[0]);
					if (!this.data.defVal) return;
					if (this.data.defVal <= n[0] && n[0]) this.data.defVal = n[0];
					if (this.data.defVal >= n[1] && n[1]) this.data.defVal = n[1];
				},
			},
			precision() {
				return this.data.numFormat.decimalDigitsNum;
			},
			isLimitNumRange: {
				get() {
					return this.data.numRange.enable;
				},
				set(v) {
					if (!v) {
						this.data.numRange.min = undefined;
						this.data.numRange.max = undefined;
					}
					this.data.numRange.enable = v;
				},
			},
		},
	});
</script>

<style lang="scss">
	.attrconf-nowrap {
		white-space: nowrap;
	}
	.attrconf-numinput {
		margin-right: 5px;
		margin-left: 5px;
		input {
			text-align: center !important;
		}
	}
</style>
