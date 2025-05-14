<template>
	<el-steps :active="active" :direction="direction" :space="space" :finish-status="finishStatus" :process-status="processStatus" :align-center="alignCenter" :simple="simple">
		<rvue-step></rvue-step>
	</el-steps>
</template>
<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator";
	import RvueStep from "./rvueStep.vue";
	declare type TDirection = "horizontal " | " vertical ";
	declare type TStatus = "wait" | "process" | "finish" | "error" | "success";

	@Component({
		components: {
			"rvue-step": RvueStep,
		},
	})
	class RvueSteps extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-steps";
		@Prop({ type: String, default: "horizontal" }) direction!: TDirection;
		@Prop({ type: [Number, String] }) space!: number | string;
		@Prop({ type: Number, default: 0 }) active!: number;
		@Prop({ type: String, default: "process" }) processStatus!: TStatus;
		@Prop({ type: String, default: "finish" }) finishStatus!: TStatus;
		@Prop({ type: Boolean, default: false }) alignCenter!: boolean;
		@Prop({ type: Boolean, default: false }) simple!: boolean;
	}

	RvueSteps.install = function (Vue: any) {
		Vue.component(RvueSteps.compName, RvueSteps);
	};
	export default RvueSteps;
</script>
