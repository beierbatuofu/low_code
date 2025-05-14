<template>
	<el-rate
		v-model="inputValue"
		:max="max"
		:disabled="disabled"
		:allow-half="allowHalf"
		:low-threshold="lowThreshold"
		:high-threshold="highThreshold"
		:colors="colors"
		:void-color="voidColor"
		:disabled-void-color="disabledVoidColor"
		:icon-classes="iconClasses"
		:void-icon-class="voidIconClass"
		:disabled-void-icon-class="disabledVoidIconClass"
		:show-text="showText"
		:show-score="showScore"
		:text-color="textColor"
		:texts="texts"
		:score-template="scoreTemplate"
		@change="handleChange"
	></el-rate>
</template>
<script lang="ts">
	import { Component, Model, Vue, Prop } from "vue-property-decorator";
	@Component({})
	class RvueRate extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-rate";
		@Prop({ type: Number, default: 5 }) max!: number;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Boolean, default: false }) allowHalf!: boolean;
		@Prop({ type: Number, default: 2 }) lowThreshold!: number;
		@Prop({ type: Number, default: 4 }) highThreshold!: number;
		@Prop({ type: [Array, Object], default: ["#F7BA2A", "#F7BA2A", "#F7BA2A"] }) colors!: any[] | object;
		@Prop({ type: String, default: "#C6D1DE" }) voidColor!: string;
		@Prop({ type: String, default: "#EFF2F7" }) disabledVoidColor!: string;
		@Prop({ type: [Array, Object], default: ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"] }) iconClasses!: any[] | object;
		@Prop({ type: String, default: "el-icon-star-off" }) voidIconClass!: string;
		@Prop({ type: String, default: "el-icon-star-on" }) disabledVoidIconClass!: string;
		@Prop({ type: Boolean, default: false }) showText!: boolean;
		@Prop({ type: Boolean, default: false }) showScore!: boolean;
		@Prop({ type: String, default: "#1F2D3D" }) textColor!: string;
		@Prop({ type: Array, default: ["极差", "失望", "一般", "满意", "惊喜"] }) texts!: any[];
		@Prop({ type: String, default: "{value}" }) scoreTemplate!: string;

		@Model("change", { type: Number, default: 0 }) value!: number;

		private get inputValue() {
			return (<any>this).value;
		}
		private set inputValue(n: number) {
			this.$emit("change", n);
		}

		private handleChange(n: any) {
			this.$emit("getchange", n);
		}
	}
	RvueRate.install = function (Vue: any) {
		Vue.component(RvueRate.compName, RvueRate);
	};
	export default RvueRate;
</script>
