<script lang="tsx">
	import { Component, Watch, Vue, Prop, PropSync } from "vue-property-decorator";
	import CodeMirror from "codemirror";
	import "codemirror/lib/codemirror.css";
	import "codemirror/addon/hint/show-hint.css";
	import "codemirror/addon/hint/show-hint.js";
	import "codemirror/addon/hint/javascript-hint.js";
	import "codemirror/mode/javascript/javascript.js";
	import "codemirror/addon/lint/lint.js";
	import "codemirror/addon/lint/lint.css";
	import "codemirror/addon/lint/javascript-lint.js";
	import { JSHINT } from "jshint";

	let win: Record<string, any> & Window = window;
	// console.log(JSHINT);
	win.JSHINT = JSHINT;

	@Component
	export default class JsEditor extends Vue {
		@PropSync("value", { type: String, default: "" }) syncValue!: string;

		@Prop({
			type: String,
			default: `// export function didMount 包含上下文this
	// this.setValue(fieldId:string,value:any)
	// this.setAttr(fieldId;string,attr:string,value:any)
	// didMount 参数$(jquery 3.6.0)
	export function didMount($){

	}
	                `,
		})
		placeholder!: string;
		private codeMirror!: NFormulaEdit.TCodeMirror;

		private options = {
			mode: "javascript",
			matchBrackets: true,
			lineWrapping: true, //换行
			showCursorWhenSelecting: true,
			specialChars: /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,
			autoRefresh: true,
			extraKeys: {
				Ctrl: "autocomplete",
			},
			lineNumbers: true,
			tabSize: 2,
			theme: "monokai",
			gutters: ["CodeMirror-lint-markers"],
			lint: true,
		};

		protected render() {
			return (
				<div class="code-mirror">
					<textarea ref="codeMirror"></textarea>
				</div>
			);
		}

		protected created() {
			this.$nextTick(() => {
				this.codeMirror = CodeMirror.fromTextArea(this.$refs.codeMirror, this.options);
				this.codeMirror.on("keypress", (instance: any, changeObj: any) => {
					instance.showHint({
						completeSingle: false,
					});
				});
				this.codeMirror.on("change", () => {
					this.syncValue = this.codeMirror.getValue();
				});
				console.log(this.syncValue, "this.syncValuethis.syncValue");
				this.codeMirror.setValue(this.syncValue || this.placeholder);
			});
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		//删除警告样式
		.CodeMirror-lint-mark-warning,
		.CodeMirror-lint-marker-warning,
		.CodeMirror-lint-message-warning {
			background: none !important;
		}
		.CodeMirror {
			height: calc(100vh - 32px) !important;
			border: 1px solid #f2f2f2;
			margin: 0 2px 0px;
		}
		.cm-s-monokai.CodeMirror {
			background: #1d1d1d;
			color: #f8f8f2;
			font-size: 18px;
		}
		.cm-s-monokai div.CodeMirror-selected {
			background: #49483e;
		}
		.cm-s-monokai .CodeMirror-line::selection,
		.cm-s-monokai .CodeMirror-line > span::selection,
		.cm-s-monokai .CodeMirror-line > span > span::selection {
			background: rgba(73, 72, 62, 0.99);
		}
		.cm-s-monokai .CodeMirror-line::-moz-selection,
		.cm-s-monokai .CodeMirror-line > span::-moz-selection,
		.cm-s-monokai .CodeMirror-line > span > span::-moz-selection {
			background: rgba(73, 72, 62, 0.99);
		}
		.cm-s-monokai .CodeMirror-gutters {
			background: #3f413a;
			border-right: 0px;
		}
		.cm-s-monokai .CodeMirror-guttermarker {
			color: white;
		}
		.cm-s-monokai .CodeMirror-guttermarker-subtle {
			color: #d0d0d0;
		}
		.cm-s-monokai .CodeMirror-linenumber {
			color: #d0d0d0;
		}
		.cm-s-monokai .CodeMirror-cursor {
			border-left: 1px solid #f8f8f0;
		}

		.cm-s-monokai span.cm-comment {
			color: #75715e;
		}
		.cm-s-monokai span.cm-atom {
			color: #ae81ff;
		}
		.cm-s-monokai span.cm-number {
			color: #ae81ff;
		}

		.cm-s-monokai span.cm-comment.cm-attribute {
			color: #97b757;
		}
		.cm-s-monokai span.cm-comment.cm-def {
			color: #bc9262;
		}
		.cm-s-monokai span.cm-comment.cm-tag {
			color: #bc6283;
		}
		.cm-s-monokai span.cm-comment.cm-type {
			color: #5998a6;
		}

		.cm-s-monokai span.cm-property,
		.cm-s-monokai span.cm-attribute {
			color: #a6e22e;
		}
		.cm-s-monokai span.cm-keyword {
			color: #f92672;
		}
		.cm-s-monokai span.cm-builtin {
			color: #66d9ef;
		}
		.cm-s-monokai span.cm-string {
			color: #e6db74;
		}

		.cm-s-monokai span.cm-variable {
			color: #f8f8f2;
		}
		.cm-s-monokai span.cm-variable-2 {
			color: #9effff;
		}
		.cm-s-monokai span.cm-variable-3,
		.cm-s-monokai span.cm-type {
			color: #66d9ef;
		}
		.cm-s-monokai span.cm-def {
			color: #fd971f;
		}
		.cm-s-monokai span.cm-bracket {
			color: #f8f8f2;
		}
		.cm-s-monokai span.cm-tag {
			color: #f92672;
		}
		.cm-s-monokai span.cm-header {
			color: #ae81ff;
		}
		.cm-s-monokai span.cm-link {
			color: #ae81ff;
		}
		.cm-s-monokai span.cm-error {
			background: #f92672;
			color: #f8f8f0;
		}

		.cm-s-monokai .CodeMirror-activeline-background {
			background: #373831;
		}
		.cm-s-monokai .CodeMirror-matchingbracket {
			text-decoration: underline;
			color: white !important;
		}
	}
</style>
