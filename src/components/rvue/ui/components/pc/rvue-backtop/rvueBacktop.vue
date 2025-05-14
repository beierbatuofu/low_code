<template>
	<el-backtop :target="target" :visibility-height="visibilityHeight" :right="right" :bottom="bottom" @click="handleClick">
		<slot></slot>
	</el-backtop>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	@Component({})
	class RvueBacktop extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-backtop";
		@Prop({ type: String }) target!: string;
		@Prop({ type: Number, default: 200 }) visibilityHeight!: number;
		@Prop({ type: Number, default: 40 }) right!: number;
		@Prop({ type: Number, default: 200 }) bottom!: number;

		private handleClick(evt: any) {
			this.$emit("click", evt);
		}
	}
	RvueBacktop.install = function (Vue: any) {
		Vue.component(RvueBacktop.compName, RvueBacktop);
	};
	export default RvueBacktop;
</script>
