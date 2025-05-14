<!--
 * @Author: ben
 * @LastEditTime: 2022-01-13 11:17:32
-->
<template>
	<div style="display: flex; align-items: center">
		<rvue-input-number
			v-model="MinValue"
			:placeholder="placeholder"
			:readonly="readonly"
			:controls-position="controlsPosition"
			:controls="controls"
			:disabled="disabled"
			:precision="precision"
			:step="step"
			:min="min"
			:max="max"
			@blur="$emit('blur', MinValue, MaxValue)"
		>
		</rvue-input-number>
		<div style="padding: 0 10px">~</div>
		<rvue-input-number
			v-model="MaxValue"
			:placeholder="placeholder"
			:readonly="readonly"
			:controls-position="controlsPosition"
			:controls="controls"
			:disabled="disabled"
			:precision="precision"
			:step="step"
			:min="min"
			:max="max"
			@blur="$emit('blur', MinValue, MaxValue)"
		>
		</rvue-input-number>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import rvueInputNumber from "./rvueInputNumber.vue";
	import { clearTimeout, setTimeout } from "timers";

	@Component({
		mixins: [Mixins],
		components: {
			"rvue-input-number": rvueInputNumber,
		},
	})
	class rvueNumberRange extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-number-range";
		@Prop({ default: undefined }) min!: any;
		@Prop({ default: undefined }) max!: any;
		@Prop({ type: Number, default: 1 }) step!: number;
		@Prop({ type: Boolean, default: false }) controls!: boolean;
		@Prop({ type: String, default: "right" }) controlsPosition!: string;
		@Prop({ type: Number, default: 0 }) precision!: number;
		@Prop({ type: Boolean, default: true }) exchange!: boolean;
		@Model("change")
		value!: any;

		private rangeVal: Record<string, any> = {
			"0": "undefined",
			"1": "undefined",
		};

		private handleBlurNumberRange() {
			this.$emit("blurRangeNumber", this.MinValue, this.MaxValue);
		}

		// private handleSelect(e: Event) {
		// 	this.$emit("select", e);
		// }

		private get MinValue() {
			if (!isNaN(this.value[0]) && this.value[0] !== undefined && this.value[0] !== null) {
				return Number(this.value[0]);
			}

			// @ts-ignore
			return undefined;
		}

		private set MinValue(n: number) {
			let value = isNaN(n) ? undefined : n;
			this.value[0] = value;
			let range = this.resetRange(this.value);

			if (Object.keys(range).length) {
				return;
			}

			this.$emit("change", JSON.parse(JSON.stringify(this.value)));
		}

		private resetRange(value: Record<string, any>) {
			let bool = !isNaN(value[0]) && !isNaN(value[1]) && value[0] != null && value[1] != null && value[0] != value[1];
			let val = {};

			if (!this.exchange) {
				return val;
			}

			if (bool) {
				val = {
					0: Math.min(value[0], value[1]),
					1: Math.max(value[0], value[1]),
				};

				window.setTimeout(() => this.$emit("change", JSON.parse(JSON.stringify(val))), 30);
			}

			return val;
		}

		private get MaxValue() {
			if (!isNaN(this.value[1]) && this.value[1] !== undefined && this.value[1] !== null) {
				return Number(this.value[1]);
			}
			// @ts-ignore
			return undefined;
		}

		private set MaxValue(n: number) {
			let value = isNaN(n) ? undefined : n;
			this.value[1] = value;
			let range = this.resetRange(this.value);

			if (Object.keys(range).length) {
				return;
			}
			this.$emit("change", JSON.parse(JSON.stringify(this.value)));
		}
	}

	rvueNumberRange.install = function (Vue: any) {
		Vue.component(rvueNumberRange.compName, rvueNumberRange);
	};

	export default rvueNumberRange;
</script>
