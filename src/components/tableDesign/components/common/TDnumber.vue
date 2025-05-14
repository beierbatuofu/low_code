<!--
 * @Author: ben
 * @LastEditTime: 2022-01-13 11:15:08
-->
<template>
	<div>
		<div class="TD-field-number">
			<rvue-number-range :precision="6" v-model="value" :placeholder="$t('global.placeholder')" :controls="false" />
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class TDdeNumber extends Vue {
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;
		@Prop({ type: String, default: "" }) prop!: string;
		@Prop({
			type: Object,
			default: () => ({}),
		})
		config!: TJson;

		private get value() {
			return this.config.defVal;
		}

		private set value(n: Record<string, number>) {
			console.log(n);
			this.config.defVal = n;
		}

		// private get maxValue() {
		// 	let oValue = this.form[this.prop]?.max || this.config.numRange.max;

		// 	if (oValue == "undefined") {
		// 		return <any>undefined;
		// 	}
		// 	return oValue;
		// }

		// private set maxValue(max: string | number) {
		// 	let oMax = this.form[this.prop] || this.config.numRange;
		// 	max && (oMax.max = max);
		// 	this.$emit("update", [this.minValue, max]);
		// }

		// private get minValue() {
		// 	let oValue = this.form[this.prop]?.min || this.config.numRange.min;
		// 	//console.log(this.form[this.prop]?.min, oValue, this.config.value.custom.min, "oValuemin");
		// 	if (oValue == "undefined") {
		// 		return <any>undefined;
		// 	}

		// 	return oValue;
		// }

		// private set minValue(min: string | number) {
		// 	let oMin = this.form[this.prop] || this.config.numRange;
		// 	min && (oMin.min = min);

		// 	this.$emit("update", [min, this.maxValue]);
		// }

		private handleBlur(e: string | number, type: number) {
			// if (type === 1) {
			// 	this.config.value.custom.max = e;
			// } else {
			// 	this.config.value.custom.min = e;
			// }
			// if (this.config.value.custom.min && this.config.value.custom.max) {
			// 	this.$emit("change", [this.config.value.custom.min, this.config.value.custom.max]);
			// } else {
			// 	this.$emit("change", []);
			// }
		}
	}
</script>
