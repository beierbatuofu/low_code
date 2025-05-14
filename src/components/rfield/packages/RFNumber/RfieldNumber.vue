<!--
 * @Author: ben
 * @LastEditTime: 2022-06-21 10:55:42
-->
<template>
	<div class="rvue-form-group">
		<rvue-input-number
			v-if="isRange == 'default'"
			style="width: 100%"
			:readonly="readonly"
			v-model="num"
			:placeholder="$t('global.placeholder')"
			:disabled="disabled"
			:precision="precision"
			:controls="false"
			@blur="handleInput"
		></rvue-input-number>

		<rvue-number-range
			v-if="isRange == 'range'"
			style="width: 100%"
			:readonly="readonly"
			v-model="rangeVal"
			:placeholder="$t('global.placeholder')"
			:disabled="disabled"
			:precision="6"
			:controls="false"
			@change="handleInput"
		></rvue-number-range>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfNumber.ts";

	/**
	 * @description: 字段样式 queryStyle
	 * eq 默认
	 * between 区间
	 **/

	@Component
	export default class RvueFieldNumber extends WidgetField {
		private get isRange() {
			if (Object.prototype.toString.call(this.value) == "[object Object]") return "range";

			return "default";
		}

		// private handleNumberBlur(event: Event) {
		// 	console.log(Event, 12312321312312);

		// 	this.handleBlur(this.config.fieldId, event);
		// 	this.handleUpdate(this.config.fieldId, event);
		// }

		private get rangeVal() {
			return this.value;
		}

		private set rangeVal(v: Record<string, string | number>) {
			this.value = v;
		}

		private get num() {
			let precision = (<any>this).precision;

			if (precision && this.value !== undefined && this.value?.length) {
				return Number(this.value);
			}
			return this.value;
		}
		private set num(n: any) {
			this.value = !isNaN(n) ? Number(n) : n;
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
</style>
<style lang="scss" scoped></style>
