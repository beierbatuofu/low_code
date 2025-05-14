<script lang="tsx">
	import { Component, Watch, Vue, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import CodeMirror from "codemirror";
	import { runSql, displaySql, updateSql } from "@/api/dataset.ts";
	import "codemirror/lib/codemirror.css";
	import "codemirror/addon/hint/show-hint.css";
	import "codemirror/addon/hint/show-hint.js";
	import "codemirror/addon/hint/sql-hint.js";
	import "codemirror/mode/sql/sql.js";
	import sqlTable from "./newSqlTable.vue";
	import { TreeParentData, TreeChildData } from "./SqlCore.ts";
	import { getFormFields } from "@/api/form.js";
	import { getFormList } from "@/api/dataset";
	import { refreshJump } from "@/utils/global";
	@Component({
		components: {
			"sql-table": sqlTable,
		},
	})
	export default class SqlEdit extends Vue {
		@Prop({ type: Object, default: () => ({}) }) selectField!: TJson;
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: String, default: "" }) datasetCode!: string;
		@Prop({ type: Array, default: () => [] }) childlist!: TJson[];
		@Prop({ type: Object, default: () => ({}) }) subFormCodes!: TJson;

		private options = {
			mode: "sql",
			matchBrackets: true,
			lineWrapping: true, //换行
			showCursorWhenSelecting: true,
			specialChars: /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,
			autoRefresh: true,
			theme: "monokai",
			lineNumbers: true,
			tabSize: 2,
			gutters: ["CodeMirror-lint-markers"],
			extraKeys: {
				Ctrl: "autocomplete",
			},
		};

		private codeMirror!: NFormulaEdit.TCodeMirror;
		private sqlResult: TJson = {};
		private params: TJson = {};
		private structure: TJson | undefined | null = undefined;
		private loading = false;
		private isRun = false;
		private runKey = 0;
		private isSuccess = false;
		private defSubFormCodes: TJson = {};
		private newSubFormCodes: TJson = {};
		private timeout: number | undefined;
    private newMapObj:any = {}
    private oldMapObj:any = {}

		private get lang() {
			return localStorage.getItem("lang") || "zh";
		}

		protected created() {
			this.$nextTick(() => {
				this.codeMirror = CodeMirror.fromTextArea(this.$refs.codeMirror, this.options);
				this.codeMirror.on("keypress", (instance: any, changeObj: any) => {
					instance.showHint({
						completeSingle: false,
					});
				});
				this.preview();
			});
		}

		private preview() {
			displaySql(this.$route.params.appCode, this.datasetCode).then(async (resp: TResponse) => {
				const { datasetSql, displaySql, type, appCode, datasetCode, correspond, structure } = resp.data;
				// datasetSql.length && runSql({ datasetSql, displaySql, type, appCode, datasetCode, correspond });

				if (datasetSql) {
					this.codeMirror.setValue(datasetSql);
				}
				this.$emit("old", datasetSql);
				let CodeMirroEl: HTMLElement | null = document.querySelector(".CodeMirror-vscrollbar");
				clearTimeout(this.timeout);
				CodeMirroEl && CodeMirroEl.scrollTo(0, 9999999999);
				this.timeout = window.setTimeout(() => {
					CodeMirroEl && CodeMirroEl.scrollTo(0, 0);
				}, 30);
			});
		}

		private getParams(callback: (params: TJson) => void) {
			let displaySql = this.codeMirror.getValue();
			if (displaySql.length == 0)
				return this.$Rmessage({
					duration: 1000,
					type: "warning",
					offset: 30,
					message: `请输入sql`,
				});
			callback({
				datasetSql: displaySql,
				displaySql,
				type: "sql",
				appCode: this.$route.params.appCode,
				datasetCode: this.datasetCode,
				structure: this.params.structure,
			});
		}

		private handleRunSql() {
      if(Object.keys(this.newMapObj).length>0){
         this.newAssignOld()
      }

			this.getParams((params: TJson) => {
				const result = params.datasetSql.split(/from/i)[0] || "";

				if (!/\b[^\s]+\*[^\s]+\b/g.test(result) && result.indexOf("*") !== -1)
					return this.$Rmessage({
						duration: 1000,
						type: "warning",
						offset: 30,
						message: `'${result}${this.$t("sql.checked", ["*"])}`,
					});

				if (/\bas\b/i.test(result)) {
					return this.$Rmessage({
						duration: 2000,
						type: "warning",
						offset: 30,
						message: `'${result}${this.$t("sql.checked", ["AS"])}`,
					});
				}

				runSql(params)
					.then((resp: TResponse) => {
						this.sqlResult = resp.data;
						this.loading = true;
						this.isSuccess = true;
						this.$Rmessage({
							duration: 1000,
							message: this.$t("sql.sqlRunSuccess"),
							type: "success",
							offset: 30,
						});

					})
					.catch((err: TJson) => {
						this.isSuccess = false;
						this.sqlResult = {};
					})
					.finally(() => {
						this.params = params;
						this.isRun = true;
						this.runKey = new Date().getTime();
					});
			});
		}

		private handleSave(params: TJson) {
			if (!this.isRun)
				return this.$Rmessage({
					duration: 1000,
					type: "warning",
					message: this.$t("sql.pleaseRunSql"),
					offset: 30,
				});
			window.onbeforeunload = null;
			window.onpopstate = null;
     
    

			let filterStructure = this.structure?.filter((item: any) => {
				return item.type == "" || item.type == undefined || item.type == null;
			});

			if (filterStructure.length > 0) {
				this.$set(this.params, "flag", true);
				this.$Rmessage({
					duration: 1000,
					type: "warning",
					message: `字段类型未填写完整`,
					offset: 30,
				});
				return;
			}
       this.$set(this.params, "flag", false);

        let mapObj:any = {}

      this.structure?.forEach((item:any)=>{
        if(mapObj.hasOwnProperty(item.fieldIdAsName) ){
          mapObj[item.fieldIdAsName]++
        }else{
          mapObj[item.fieldIdAsName]= 1
        }
      })


      let sameStructure = Object.keys(mapObj).filter((key:string)=> mapObj[key] >=2  )
      if(sameStructure.length>0){
        	this.$set(this.params, "sameArr", sameStructure);
        	this.$set(this.params, "same", true);
          this.$Rmessage({
            duration: 1000,
            type: "warning",
            message: `字段名称不能相同`,
            offset: 30,
          });
				return;
      }

     
     this.$set(this.params, "same", false);

		
			const structure = this.structure;
			this.getParams((params: TJson) => {
				const { type, appCode, datasetCode, correspond, datasetSql: dataset_sql, displaySql: display_sql } = params;
				//TODO
				let formCodeList = Array.from(new Set(dataset_sql.match(/data_[0-9a-zA-Z]*/g)));
				console.log(formCodeList, "formCodeList");

				updateSql({ type, appCode, datasetCode, dataset_sql, display_sql, structure, isSuccess: this.isSuccess }).then((resp: TResponse) => {
					this.$emit("close");
					this.$Rmessage({
						duration: 1000,
						message: this.$t("sql.sqlSaveSuccess"),
						type: "success",
						offset: 30,
						onClose: () => {},
					});
					this.handleCancel();
				});
			});
		}

		private handleCancel() {
			const { appCode } = this.$route.params;
			this.$router.back();
		}

		private handleStructure(structure: TJson[]) {
			this.structure = structure.length == 0 ? null : structure;
		}

		private insert(label: string) {
			const { line, ch } = this.codeMirror.getCursor();
			this.codeMirror.replaceRange(label, { line, ch });
			const to = CodeMirror.Pos(line, ch + label.length);
			return {
				line,
				ch,
			};
		}

		private createFieldHTML(skey: string) {
			return {
				atomic: true,
				replacedWith: skey,
				handleMouseEvents: true,
			};
		}

    private assignNewMap(val:any){
      this.newMapObj = val
    }

    private newAssignOld(){
      this.oldMapObj = this.$utils.deepClone(this.newMapObj)
    }

		@Watch("timestamp", { deep: true })
		onChangeSelectField(n: TJson) {
			const lang = window.localStorage.getItem("lang") || "zh";
			const { type, skey, title } = this.selectField;

			let newSkey = skey + " " + title[lang];
			const opts = this.createFieldHTML(newSkey);

			this.insert(newSkey);
			this.codeMirror.focus();
		}

		protected render(h: CreateElement) {
			return (
				<div class="code-mirror">
					<textarea ref="codeMirror"></textarea>

					<div class="btns">
						<rvue-button on-click={this.handleRunSql} props={{ size: "mini" }}>
							{this.$t("sql.run")}
						</rvue-button>
						<rvue-button type="primary" on-click={this.handleSave} props={{ size: "mini" }}>
							{this.$t("sql.save")}
						</rvue-button>
					</div>
					<sql-table key={this.runKey} props={{ data: this.sqlResult, params: this.params,parOldMapObj:this.oldMapObj }} on={{change:this.handleStructure,newMapObj:this.assignNewMap}} ></sql-table>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.btns {
		padding: 5px 20px;
		text-align: right;
		background: #ebebeb;
		margin: 1px 0 10px 2px;
	}
	::v-deep .CodeMirror {
		background: #f2f2f2;
		height: 50vh;
		font-size: 14px;

		// color: rgb(255, 46, 46);

		.cm-error {
			background: transparent;
			text-decoration: line-through;
			color: red;

			&::before {
				color: red;
			}
		}
	}

	::v-deep {
		//删除警告样式
		.CodeMirror-lint-mark-warning,
		.CodeMirror-lint-marker-warning,
		.CodeMirror-lint-message-warning {
			background: none !important;
		}
		.CodeMirror {
			border: 1px solid #f2f2f2;
			margin: 0 2px 0px;
		}
		.cm-s-monokai.CodeMirror {
			background: #1e1e1e;
			color: #6a9955;
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
<style lang="scss">
	.sql-msg-error {
		word-break: break-word;
	}
</style>
