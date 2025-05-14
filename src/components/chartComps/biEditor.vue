<!--
 * @Author: your name
 * @Date: 2021-12-01 14:01:32
 * @LastEditTime: 2022-03-01 14:41:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \risen\src\views\bidesign\_components\biEditor.vue
-->
<template>
	<div class="rich-container" :style="{ height: height + 'px' }" :id="tinymceId">
		<rvue-tinymce :readyOnly="readyOnly" @blur="blurHanlder" :height="height" :id="tinymceId" :editorReadyonly="editorReadyonly" :content.sync="content"></rvue-tinymce>
	</div>
</template>

<script lang="ts">
	import RvueTinymce from "@/components/tinymce/index.vue";
	import { Component, Vue, Prop, Watch } from "vue-property-decorator";

	@Component({
		components: {
			RvueTinymce,
		},
	})
	export default class BiEditor extends Vue {
		@Prop({ type: Boolean, default: false }) readyOnly!: boolean;
		@Prop({ type: Boolean, default: false }) editorReadyonly!: boolean;
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Prop({ type: String, default: "pc" }) mode!: string; //访问还是编辑

		private timer: any = null;
		private height: number = 100;
		private content: string = "";

		private tinymceId: string = "vue-tinymce-" + +new Date();

		@Watch("content")
		onChangeContent(n: string) {
			this.$emit("update", n, this.item.code);
		}
		private resize(width: number, height: number) {
			this.height = Number(height) - 20;
		}
		protected mounted() {
			this.content = this.item.html;
		}

		private blurHanlder() {
			this.$emit("blur");
		}
	}
</script>
<style lang="less" scoped>
	.rich-container {
		word-break: break-all;
		// display: flex;
		// align-items: center;
	}
</style>
