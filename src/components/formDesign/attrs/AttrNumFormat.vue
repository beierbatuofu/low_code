<!--
 * @Author: ben
 * @LastEditTime: 2021-11-09 13:24:05
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('widgetConf.numFormat.format')" :tip="t('widgetConfig.attrNumFormat')" />
		<el-select v-model="numFormat" class="margin-bottom-10">
			<el-option :label="t('widgetConf.numFormat.number')" value="number"></el-option>
			<!-- <el-option :label="t('widgetConf.numFormat.percent')" value="percent"></el-option> -->
		</el-select>
		<div class="attrconf-nowrap">
			<el-checkbox :label="t('widgetConf.numFormat.allowDecimalDigits')" v-model="allowDecimalDigits"></el-checkbox>
			<rvue-input-number
				v-if="allowDecimalDigits"
				:controls="true"
				size="small"
				v-model="decimalDigitsNum"
				:min="Number(0)"
				:max="6"
				style="width: 100px; margin-left: 5px; display: inline-block"
			></rvue-input-number>
		</div>
	</div>
</template>
<script>
	import { create } from "../utils/create";

	const decimaRange = {
		number: 6,
		percent: 4,
	};

	export default create({
		name: "AttrNumFormat",
		computed: {
			maxPlace: {
				get() {
					let max = decimaRange[this.numFormat];
					return max;
				},
			},
			numFormat: {
				get() {
					return this.data.numFormat.format;
				},
				set(v) {
					let max = decimaRange[v];
					if (this.decimalDigitsNum >= max) this.decimalDigitsNum = max;
					this.data.numFormat.format = v;
				},
			},
			allowDecimalDigits: {
				get() {
					return this.data.numFormat.allowDecimalDigits;
				},
				set(v) {
					this.data.numFormat.allowDecimalDigits = v;
					this.data.numFormat.decimalDigitsNum = 0;
				},
			},
			decimalDigitsNum: {
				get() {
					return this.data.numFormat.decimalDigitsNum;
				},
				set(v) {
					this.data.numFormat.decimalDigitsNum = Number(v) <= 0 || isNaN(Number(v)) ? 0 : Number(v);
				},
			},
		},
	});
</script>
