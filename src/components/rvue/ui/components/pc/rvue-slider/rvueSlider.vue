<template>
	<el-slider
		v-model="inputValue"
		:step="step"
		:min="min"
		:max="max"
		:disabled="disabled"
		:show-input="showInput"
		:show-input-controls="showInputControls"
		:input-size="inputSize"
		:show-stops="showStops"
		:show-tooltip="showTooltip"
		:format-tooltip="formatTooltip"
		:range="range"
		:vertical="vertical"
		:height="height"
		:label="label"
		:debounce="debounce"
		:tooltip-class="tooltipClass"
		:marks="marks"
		@change="handleChange"
		@input="handelInput"
	>
	</el-slider>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";
declare type TInputSize = "large" | "medium" | "small" | "mini";
@Component({})
class RvueSlider extends Vue {
	public static install: (param: Vue) => any;
	public static compName = "rvue-slider";
	@Prop({ type: Number, default: 0 }) min!: number;
	@Prop({ type: Number, default: 100 }) max!: number;
	@Prop({ type: Boolean, default: false }) disabled!: boolean;
	@Prop({ type: Boolean, default: false }) showInput!: boolean;
	@Prop({ type: Number, default: 1 }) step!: number;
	@Prop({ type: Boolean, default: true }) showInputControls!: boolean;
	@Prop({ type: String, default: 0 }) inputSize!: TInputSize;
	@Prop({ type: Boolean, default: false }) showStops!: boolean;
	@Prop({ type: Boolean, default: true }) showTooltip!: boolean;
	@Prop({ type: Function, default: () => {} }) formatTooltip!: () => {};
	@Prop({ type: Boolean, default: false }) range!: boolean;
	@Prop({ type: Boolean, default: false }) vertical!: boolean;
	@Prop({ type: String }) height!: string;
	@Prop({ type: String }) label!: string;
	@Prop({ type: Number, default: 300 }) debounce!: number;
	@Prop({ type: String }) tooltipClass!: string;
	@Prop({ type: Object }) marks!: object;

	@Model("change", { type: Number, default: 0 }) value!: number;

	private get inputValue() {
		return this.value;
	}

	private set inputValue(n: number) {
		this.$emit("change", n);
	}

	private handleChange(val: number) {
		this.$emit("change", val);
	}
	private handelInput(val: number) {
		this.$emit("input", val);
	}
}

RvueSlider.install = function (Vue: any) {
	Vue.component(RvueSlider.compName, RvueSlider);
};
export default RvueSlider;
</script>