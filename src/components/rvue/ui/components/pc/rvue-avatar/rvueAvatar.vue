<template>
	<el-avatar :icon="icon" @error="handleError" :shape="shape" :src="src" class="avatar" :alt="alt" :fit="fit" :size="size">
		<slot></slot>
	</el-avatar>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TShape = "circle" | "square";
	declare type TFit = "fill" | "contain" | "cover" | "none" | "scale-down";
	declare type TSize = "large" | "medium" | "small" | number;

	@Component({
		mixins: [Mixins],
		name: "rvueAvatar",
	})
	class RvueAvatar extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-avatar";
		@Prop({ type: String }) icon!: string;
		@Prop({ type: String, default: "circle" }) shape!: TShape;
		@Prop({ type: String }) src!: string;
		@Prop({ type: String }) alt!: string;
		@Prop({ type: String, default: "cover" }) fit!: TFit;
		@Prop({ type: [String, Number], default: "large" }) size!: TSize;

		private handleError(e: Event) {
			this.$emit("error", e);
		}
	}
	RvueAvatar.install = function (Vue: any) {
		Vue.component(RvueAvatar.compName, RvueAvatar);
	};
	export default RvueAvatar;
</script>
<style lang="scss">
	.el-avatar > img {
		width: 100%;
		height: 100%;
	}
</style>
