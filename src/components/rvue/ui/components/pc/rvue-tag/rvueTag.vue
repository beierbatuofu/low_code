<template>
	<el-tag :type="type" :closable="closable" :disable-transitions="disableTransitions" :hit="hit" :color="color" :effect="effect" @click="handleClick" @close="handleClose"><slot></slot></el-tag>
</template>
<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TType = "success" | "info" | "warning" | "danger";
	declare type TEffect = "dark " | "light" | "plain";
	@Component({
		mixins: [Mixins],
		name: "rvueTag",
	})
	class RvueTag extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-tag";
		@Prop({ type: String }) type!: TType;
		@Prop({ type: Boolean, default: false }) closable!: boolean;
		@Prop({ type: Boolean, default: false }) disableTransitions!: boolean;
		@Prop({ type: Boolean, default: false }) hit!: boolean;
		@Prop({ type: String }) color!: string;
		@Prop({ type: String, default: "light" }) effect!: TEffect;

		private handleClick(evt: any) {
			this.$emit("click", evt);
		}

		private handleClose(evt: any) {
			this.$emit("close", evt);
		}
	}
	RvueTag.install = function (Vue: any) {
		Vue.component(RvueTag.compName, RvueTag);
	};
	export default RvueTag;
</script>
