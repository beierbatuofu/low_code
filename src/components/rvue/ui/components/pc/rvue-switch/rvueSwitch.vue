<!--
 * @Author: ben
 * @LastEditTime: 2021-08-31 11:16:19
-->
<template>
	<el-switch
		v-model="select"
		:disabled="disabled"
		:width="width"
		:active-text="activeText"
		:inactive-text="inactiveText"
		:active-value="activeValue"
		:inactive-value="inactiveValue"
		:active-color="activeColor"
		:inactive-color="inactiveColor"
		:name="name"
		:validate-event="validateEvent"
	>
	</el-switch>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
		name: "rvueSwitch",
	})
	class RvueSwitch extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-switch";
		@Model("change", { type: Boolean }) value!: Boolean;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;
		@Prop({ type: Number, default: 40 }) width!: number;
		@Prop({ type: String }) activeText!: string;
		@Prop({ type: String }) inactiveText!: string;
		@Prop({ type: [String, Boolean, Number], default: true }) activeValue!: string | boolean | number;
		@Prop({ type: [String, Boolean, Number], default: false }) inactiveValue!: string | boolean | number;
		@Prop({ type: String, default: "#6087FD" }) activeColor!: string;
		@Prop({ type: String, default: "#C0CCDA" }) inactiveColor!: string;
		@Prop({ type: String }) name!: string;
		@Prop({ type: Boolean, default: true }) validateEvent!: boolean;

		private get select() {
			return (<any>this).value;
		}

		private set select(n: any) {
			this.$emit("change", n);
		}
	}

	RvueSwitch.install = function (Vue: any) {
		Vue.component(RvueSwitch.compName, RvueSwitch);
	};

	export default RvueSwitch;
</script>
<style lang="scss"></style>
