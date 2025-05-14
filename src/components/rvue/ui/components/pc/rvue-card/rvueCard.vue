<template>
	<el-card :shadow="shadow" :body-style="bodyStyle">
		<template slot="header">
			<slot name="header"> </slot>
		</template>
		<slot></slot>
	</el-card>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	declare type TShadow = "always" | "hover" | "never";

	@Component({})
	class RvueCard extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-card";
		@Prop({ type: String }) header!: string;
		@Prop({ type: String, default: "always" }) shadow!: TShadow; //设置阴影显示时机
		@Prop({ type: Object, default: () => ({}) }) bodyStyle!: TJson; // 设置 body 的样式
	}
	RvueCard.install = function (Vue: any) {
		Vue.component(RvueCard.compName, RvueCard);
	};
	export default RvueCard;
</script>
<style lang="scss"></style>
