<template>
	<el-button
		@click="handleClick"
		:size="size"
		:disabled="disabled"
		:type="type"
		:plain="plain"
		:round="round"
		:circle="circle"
		:loading="loading"
		:icon="icon"
		:autofocus="autofocus"
		:native-type="nativeType"
		><slot></slot
	></el-button>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Model, PropSync } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TBtnSize = "primary" | "success" | "warning" | "danger" | "info" | "text";
	declare type TNativeType = "button" | "submit" | "reset";

	@Component({
		mixins: [Mixins],
	})
	class RvueButton extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-button";
		public static timeout: null | number = null;
		@Prop({ type: String }) type!: TBtnSize;
		@Prop({ type: Boolean, default: false }) plain!: boolean;
		@Prop({ type: Boolean, default: false }) round!: boolean; //是否圆角按钮
		@Prop({ type: Boolean, default: false }) circle!: boolean; //是否圆形按钮
		@Prop({ type: Boolean, default: false }) loading!: boolean; //是否加载中状态
		@Prop({ type: String }) icon!: string;
		@Prop({ type: Boolean, default: false }) autofocus!: boolean;
		@Prop({ type: String, default: "button" }) nativeType!: TNativeType;
		@Prop({ type: Boolean, default: true }) debounce!: boolean;
		@Prop({ type: Number, default: 600 }) time!: number;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		private handleClick(evt: Event) {
			if (RvueButton.timeout) return;
			this.debounce &&
				(RvueButton.timeout = window.setTimeout(() => {
					RvueButton.timeout = null;
				}, this.time));
			this.$emit("click", evt);
		}
	}
	RvueButton.install = function (Vue: any) {
		Vue.component(RvueButton.compName, RvueButton);
	};
	export default RvueButton;
</script>
<style lang="scss" scoped>
	.el-button--danger {
		border-color: transparent;
		color: #fff;
	}
</style>
