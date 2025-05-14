//中文文档 http://tinymce.ax-z.cn/

<template>
	<editor ref="editor" :id="eId" :api-key="apiKey" :init="editConfig" v-model="visibleContent" />
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
	// 引入组件
	import tinymce from "tinymce/tinymce";
	import Editor from "@tinymce/tinymce-vue";
	import "tinymce/icons/default/icons";
	// 引入富文本编辑器主题的js和css
	import "tinymce/skins/ui/oxide/skin.min.css";
	// 扩展插件
	import "tinymce/plugins/image";
	import "tinymce/plugins/link";
	import "tinymce/plugins/code";
	import "tinymce/plugins/table";
	import "tinymce/plugins/lists";
	import "tinymce/plugins/wordcount"; // 字数统计插件
	import "tinymce/plugins/media"; // 插入视频插件
	import "tinymce/plugins/template"; // 模板插件
	import "tinymce/plugins/fullscreen";
	import "tinymce/plugins/paste";
	import "tinymce/plugins/preview";
	import "tinymce/plugins/contextmenu";
	import "tinymce/plugins/textcolor";
	import "tinymce/plugins/autoresize";
	import "tinymce/themes/silver/theme.min";
	@Component({
		components: {
			Editor,
		},
	})
	export default class Vtinymce extends Vue {
		@PropSync("content", { type: String, default: "" }) visibleContent!: string;

		@Prop({ type: String, default: "" }) id!: string;
		@Prop({ type: Boolean, default: false }) readyOnly!: boolean; //访问还是仪表盘
		@Prop({ type: Number, default: 200 }) height!: number;
		@Prop({ type: Boolean, default: false }) editorReadyonly!: boolean;
		private timer: any = null;
		private apiKey: string = "fmpe10wgtn5cy4tq0quwhxd21a2mb6z7pwuf0zsut09xk039";
		private eId: string = "e_" + new Date().getTime();
		private editConfig: TJson = {
			elements: "aaa",
			// height: 300,
			inline: true,
			skin_url: `${process.env.BASE_URL}tinymce/skins/ui/oxide`,
			language_url: `${process.env.BASE_URL}tinymce/langs/zh_CN.js`, //中文包
			content_css: `${process.env.BASE_URL}tinymce/skins/content/default/content.css`,
			language: "zh_CN", //中文
			browser_spellcheck: true, // 拼写检查
			branding: false, // 去水印
			elementpath: false, //禁用编辑器底部的状态栏
			statusbar: false, // 隐藏编辑器底部的状态栏
			paste_data_images: true, // 是否允许粘贴图像
			menubar: false, // 隐藏最上方menu
			fontsize_formats: "14px 16px 18px 20px 24px 26px 28px 30px 32px 36px", //字体大小
			font_formats:
				"Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times", //字体
			file_picker_types: "image",
			images_upload_credentials: true,
			plugins: [
				// "advlist autolink lists link image charmap print preview anchor",
				// "searchreplace visualblocks code fullscreen",
				// "insertdatetime media table paste code help wordcount",
				// "autoresize",
			],
			toolbar: "fontselect fontsizeselect forecolor backcolor bold italic alignleft aligncenter alignright",
			// 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
			resize: false, //禁止缩放
			setup: (editor: any) => {
				let that = this;
				editor.on("blur", function () {
					that.$emit("blur");
				});
			},
		};
		@Watch("editorReadyonly", { immediate: true })
		onchange(n: boolean) {
			if (this.readyOnly) {
				this.editConfig.toolbar = "";
			}

			if (n) {
				this.$nextTick(() => {
					tinymce.editors[(<any>this).eId] && tinymce.editors[(<any>this).eId].setMode("design");
					setTimeout(() => {
						tinymce.editors[(<any>this).eId] && tinymce.editors[(<any>this).eId].setMode("readonly");
					}, 300);
				});
			} else {
				tinymce.editors[(<any>this).eId] && tinymce.editors[(<any>this).eId].setMode("design");
			}
		}
		protected mounted() {
			this.timer = setTimeout(() => {
				(<any>document.querySelector(`#${this.id}`)).style.overflow = "auto";
				// (<any>document.querySelector(`#${this.eId}_ifr`)).contentWindow.document.querySelector(`.mce-content-body`).style.wordBreak = "break-all";
			}, 180);

			tinymce.init({});
			this.$nextTick(() => {
				this.readyOnly && tinymce.editors[(<any>this).eId].setMode("readonly");
			});
		}

		protected beforeDestroy() {
			this.timer = null;
		}
	}
</script>

<style scoped lang="scss">
	textarea {
		visibility: hidden !important;
	}
</style>
<style lang="scss">
	.tox-editor-header {
		border: 0 !important;

		border-radius: 4px !important;
		font-size: 12px !important;
	}

	.tox-tinymce-inline {
		box-shadow: 0 2px 8px 0 rgb(0 0 0 / 15%) !important;
	}
	.chart-list {
		padding: 10px;
		h2 {
			font-weight: 400 !important;
		}
	}
</style>
