<template>
	<el-badge :value="value" :max="max" :is-dot="isDot" :type="type" :hidden="hidden">
		<slot></slot>
	</el-badge>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	declare type TType = "primary" | "success" | "warning" | "danger" | "info";

	@Component({})
	class RvueBadge extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-badge";
		@Prop({ type: [String, Number] }) value!: string | number;
		@Prop({ type: Number }) max!: number;
		@Prop({ type: Boolean, default: false }) isDot!: boolean;
		@Prop({ type: Boolean, default: false }) icon!: boolean;
		@Prop({ type: String }) type!: TType;
		@Prop({ type: Boolean, default: false }) hidden!: boolean;
	}

	RvueBadge.install = function (Vue: any) {
		Vue.component(RvueBadge.compName, RvueBadge);
	};
	export default RvueBadge;
</script>
