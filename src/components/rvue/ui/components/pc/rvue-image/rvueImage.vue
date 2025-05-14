<template>
	<el-image :src="src" :fit="fit" :alt="alt" :lazy="lazy" :preview-src-list="previewSrcList" :z-index="zIndex" @load="load" @error="error">
		<slot></slot>
	</el-image>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";

	declare type TFit = "fill" | "contain" | "cover" | "none" | "scale-down";

	@Component({})
	class RvueImage extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-image";
		@Prop({ type: String }) src!: string; //图片源，同原生
		@Prop({ type: String }) fit!: TFit; //确定图片如何适应容器框
		@Prop({ type: String }) alt!: string; //原生 alt
		@Prop({ type: Boolean, default: false }) lazy!: boolean; //是否开启懒加载
		@Prop({ type: Array }) previewSrcList!: any[]; //开启图片预览功能
		@Prop({ type: Number, default: 2000 }) zIndex!: number;

		private load(e: Event) {
			this.$emit("load", e);
		}

		private error(e: Event) {
			this.$emit("error", e);
		}
	}
	RvueImage.install = function (Vue: any) {
		Vue.component(RvueImage.compName, RvueImage);
	};
	export default RvueImage;
</script>
