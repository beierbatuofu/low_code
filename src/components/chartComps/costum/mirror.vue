<template>
	<div class="jscode-container">
		<div class="jsBtn">
			<rvue-button
				@click="
					() => {
						this.runCodeHandler();
						this.jsVisible = false;
					}
				"
				style="width: 80px; margin-bottom: 20px"
				>运行</rvue-button
			>
		</div>
		<textarea ref="mycodeJ" style="width: 400px"></textarea>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Prop, Watch, Inject, PropSync } from "vue-property-decorator";
	import CodeMirror from "codemirror";
	import "codemirror/theme/ambiance.css";
	import "codemirror/lib/codemirror.css";
	import "codemirror/addon/fold/foldgutter.css";
	import "codemirror/addon/fold/foldcode";
	import "codemirror/addon/fold/foldgutter";
	import "codemirror/addon/fold/brace-fold";
	import "codemirror/addon/fold/comment-fold";
	import "codemirror/addon/fold/markdown-fold";
	import "codemirror/addon/fold/xml-fold";
	import "codemirror/addon/fold/indent-fold";
	import "codemirror/addon/hint/show-hint.css";
	import "codemirror/addon/hint/show-hint.js";
	import "codemirror/addon/hint/javascript-hint.js";
	import "codemirror/mode/javascript/javascript.js";
	//校验
	// require("script-loader!jsonlint");
	(<any>window).JSHINT = require("jshint").JSHINT;

	import "codemirror/addon/lint/javascript-lint.js";
	import "codemirror/lib/codemirror.css";
	import "codemirror/mode/javascript/javascript.js";
	import "codemirror/addon/lint/lint.js";
	import "codemirror/addon/lint/lint.css";
	import "codemirror/addon/lint/json-lint.js";
	import "codemirror//addon/display/fullscreen.css";
	import "codemirror/addon/display/fullscreen.js";

	import { initCode } from "./initCode";

	@Component({
		components: {},
	})
	export default class Mirror extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) jsVisible!: Boolean;
		@Prop({ default: {}, type: Object }) data!: TJson;
		@Prop({ default: {}, type: Object }) formConfig!: TJson;
		private syncCodeMirrorJ: any;
		private uid: string = this.data.config.uid;
		private value: string = "";
		private initCodeJ = initCode(this.data.config.uid);

		private runCodeHandler() {
			if (this.value + " " == this.data.config.codeJ) {
				this.$set(this.data.config, "codeJ", this.data.config.codeJ + " ");
			} else {
				this.$set(this.data.config, "codeJ", this.value + " ");
			}
		}

		protected mounted() {
			this.syncCodeMirrorJ = CodeMirror.fromTextArea(this.$refs.mycodeJ, {
				mode: "javascript",
				lineNumbers: true,
				matchBrackets: true, //括号匹配
				lineWrapping: true, //代码折叠
				lint: true,
				extraKeys: {
					"Ctrl-Q": function (cm: any) {
						cm.foldCode(cm.getCursor());
					},
					F11: function (cm: any) {
						cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					Esc: function (cm: any) {
						if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					},
				},
				theme: "monokai",
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
			});
			console.log(this.data.config.codeJ || this.initCodeJ, "this.data.config.codeJ");
			this.syncCodeMirrorJ.setValue(this.data.config.codeJ || this.initCodeJ);
			this.value = this.data.config.codeJ || this.initCodeJ;
			this.syncCodeMirrorJ.on("keypress", (instance: any, changeObj: any) => {
				instance.showHint({
					completeSingle: false,
				});
			});
			this.syncCodeMirrorJ.on("change", () => {
				this.value = this.syncCodeMirrorJ.getValue();
			});

			this.$nextTick(() => {
				this.runCodeHandler();
			});
		}
	}
</script>
<style lang="scss" scoped>
	@import "./_style/mirror.scss";
</style>
