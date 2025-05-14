<template>
	<rvue-drawer size="40%" @open="openHandler" :title="'数据'" :append-to-body="true" :modal-append-to-body="false" :visible.sync="dataVisible" direction="ltr">
		<textarea ref="reportData"></textarea>
	</rvue-drawer>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
	import CodeMirror from "codemirror";
	import "codemirror/lib/codemirror.css";
	import "codemirror/addon/fold/foldgutter.css";
	import "codemirror/addon/fold/foldcode";
	import "codemirror/addon/fold/foldgutter";
	import "codemirror/addon/fold/brace-fold";
	import "codemirror/addon/fold/comment-fold";
	import "codemirror/addon/fold/indent-fold";
	// require("script-loader!jsonlint");
	(<any>window).JSHINT = require("jshint").JSHINT;
	@Component
	export default class ReportDataDrawer extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) dataVisible!: Boolean;
		@Prop({ type: [Array, Object], default: () => {} }) reportData!: any;
		private code: any;

		private openHandler() {
			this.$nextTick(() => {
				this.code = this.code
					? this.code
					: CodeMirror.fromTextArea(this.$refs.reportData, {
							mode: "javascript",
							lineNumbers: true,
							matchBrackets: true, //括号匹配
							lineWrapping: true, //代码折叠
							extraKeys: {
								"Ctrl-Q": function (cm: any) {
									cm.foldCode(cm.getCursor());
								},
							},
							foldGutter: true,
							gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
					  });
				this.code.setValue(JSON.stringify(this.reportData, null, 2));
				this.code.setSize("100%", "100%");
				this.code.setOption("readOnly", true);
			});
		}
	}
</script>
