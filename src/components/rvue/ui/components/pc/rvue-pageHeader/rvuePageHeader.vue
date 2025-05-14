<template>
	<el-page-header :title="title" :content="content" @back="handleBack">
		<slot></slot>
	</el-page-header>
</template>
<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator";
	@Component({})
	class RvuePageHeader extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-page-header";
		@Prop({ type: String, default: "返回" }) title!: string;
		@Prop({ type: String }) content!: string;

		private handleBack(evt: any) {
			this.$emit("back", evt);
		}
	}
	RvuePageHeader.install = function (Vue: any) {
		Vue.component(RvuePageHeader.compName, RvuePageHeader);
	};
	export default RvuePageHeader;
</script>
