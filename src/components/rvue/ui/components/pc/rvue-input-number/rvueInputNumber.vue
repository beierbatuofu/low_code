<!--
 * @Author: ben
 * @LastEditTime: 2022-06-08 17:55:06
-->
<template>
	<div>
		<el-input-number
			:key="key"
			:placeholder="placeholder"
			v-if="!readonly"
			v-model="num"
			:controls-position="controlsPosition"
			:controls="controls"
			:disabled="disabled"
			:step="step"
			:min="minRange * 1"
			:max="maxRange * 1"
			:label="label"
			@change="handleBlur"
		>
		</el-input-number>
		<div v-else class="widget-readonly">{{ num && Number(num).toFixed(precision) }}</div>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TSize = "small" | "large";

	@Component({
		mixins: [Mixins],
	})
	class rvueInputNumber extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-input-number";
		@Prop({ default: Number("9".repeat(15) + "8") * -1 }) min!: any;
		@Prop({ default: Number("9".repeat(15) + "8") * 1 }) max!: any;
		@Prop({ type: String, default: "small" }) size!: TSize;
		@Prop({ type: Number, default: 1 }) step!: number;
		@Prop({ type: Number, default: 0 }) precision!: any;
		@Prop({ type: Boolean, default: false }) controls!: boolean;
		@Prop({ type: String, default: "right" }) controlsPosition!: string;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: String, default: "" }) label!: string;
		@Prop({ type: String, default: "" }) placeholder!: string;

		@Model("change")
		nValue!: any;

		private key = 1;
		private timeout: any = null;

		private handleBlur(num: number) {
			console.log(num, "num");
			this.$emit("blur", num);
		}

		private get minRange() {
			if (!isNaN(this.min) && String(this.min).length != 0) {
				return Number(this.min);
			}

			return Number("9".repeat(15) + "8") * -1;
		}

		private get maxRange() {
			if (!isNaN(this.max) && String(this.max).length != 0) {
				return Number(this.max);
			}
			return Number("9".repeat(15) + "8") * 1;
		}

		private toDecimal(val: number) {
			let sValue = String(val);

			this.key = val;
			if (sValue.split(".").length < 2) return val;
			let integer = sValue.split(".")[0];
			let decimal = sValue.split(".")[1]?.substr(0, this.precision);

			return Number(integer + "." + decimal);
		}

		private get num() {
			if (this.nValue == undefined || this.nValue == "undefined" || isNaN(this.nValue)) return undefined;

			return this.nValue;
		}

		private set num(n) {
			if (this.disabled) return;

			this.$emit("change", this.toDecimal(n));
		}

		@Watch("precision")
		private watchPrecision(n: number, o: number) {
			this.$emit("change", this.toDecimal(this.num));
		}
	}

	rvueInputNumber.install = function (Vue: any) {
		Vue.component(rvueInputNumber.compName, rvueInputNumber);
	};

	export default rvueInputNumber;
</script>
