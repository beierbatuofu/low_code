<script lang="ts">
	import { Component, Watch, Vue, Prop, PropSync } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import CodeMirror from "codemirror";
	import "codemirror/lib/codemirror.css";
	import "codemirror/addon/hint/show-hint.css";
	import "codemirror/addon/hint/show-hint.js";
	import "codemirror/addon/hint/anyword-hint.js";
	import "codemirror/mode/apl/apl.js";
	import NFormulaEdit from "./_types";
	import { namespace, lang } from "./_store";
	import { FormulaList } from "./_core/config.ts";

	@Component
	export default class AssistFormulas extends Vue {
		@Prop({ default: {}, type: Object }) fieldJson!: NFormulaEdit.TField;
		@Prop({ default: {}, type: Object }) formulaJson!: TJson;
		@PropSync("codeMirror", { type: Object, default: null })
		syncCodeMirror!: NFormulaEdit.TCodeMirror;
		@Prop({ default: () => ({}), type: Object }) curField!: TJson;

		private ruleTxt = "";

		private options = {
			mode: "apl",
			matchBrackets: true,
			lineWrapping: true, //换行
			showCursorWhenSelecting: true,
			specialChars: /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,
			autoRefresh: true,
		};

		private cursor: NFormulaEdit.TCodeMirrorCurosor = { line: 0, ch: 0 };
		private insertContent: any;

		private get resetFormula() {
			let list: string[] = [];
			FormulaList.forEach((item: any) => {
				item.children &&
					item.children.forEach((ite: any) => {
						list.push(ite.label);
					});
			});
			return list;
		}

		private bindComplete() {
			const cm = this.syncCodeMirror;
			let cur = cm.getCursor();
			let curLine = cm.getTokenAt(cur);
			let str = curLine.string.toUpperCase();
			let list: string[] = [];

			try {
				let reg = new RegExp("^" + str);
				list = this.resetFormula.filter((key: string) => reg.test(key));
			} catch (err) {
				list = [];
			}

			return {
				list,
				from: CodeMirror.Pos(cur.line, cur.ch),
				to: CodeMirror.Pos(cur.line, curLine.start),
			};
		}

		private getFormula() {
			let formula = "";
			let content = (<any>this).codeMirror.display.lineDiv.getElementsByTagName("pre");
			content.forEach((el: Element, idx: number) => {
				let childSpans = el.getElementsByTagName("span")[0].childNodes;
				childSpans.forEach((tag: any) => {
					if (tag.nodeType == 3) {
						formula += tag.textContent;
					}
					if (tag.nodeType == 1) {
						let el = tag.getElementsByTagName("span")[0] || tag;
						let sClass = el.className;
						if (/undefined/g.test(sClass)) return;
						/cm-field/g.test(sClass) && (formula += `$field_${el.getAttribute("field-key")}$`);
						/(cm-function|cm-number|cm-formula|cm-m-null|cm-string|cm-keyword)/g.test(sClass) && (formula += el.textContent);
					}
				});
				idx != content.length - 1 && (formula += "↵");
			});
			return formula;
		}

		protected mounted() {
			// let { defaultData } = this.$store.state[namespace];

			this.syncCodeMirror = CodeMirror.fromTextArea(this.$refs.codeMirror, this.options);

			this.$nextTick(() => {
				//触发补全
				this.syncCodeMirror.on("keypress", (instance, changeObj) => {
					if (!changeObj.key.trim()) return;
					(<any>this.syncCodeMirror).showHint({
						completeSingle: false,
						hint: this.bindComplete,
					});
				});
				//补全公式
				this.syncCodeMirror.on("change", (instance, event) => {
					console.log(event, "event");
					if (event.origin == "complete") {
						let sValue = event.text[0] || "";

						let to = {
							line: event.to.line,
							ch: event.to.ch + sValue.length,
						};
						this.syncCodeMirror.markText(event.from, to, {
							className: "cm-formula",
						});
						this.addFormulaTags(`(,)`.split(","), 1);
					}
				});
				//公式回显

				// this.previewFomula(defaultData);
			});
		}

		private getField(prop: string) {
			let { fieldList } = this.$store.state[namespace];
			let result = fieldList.find((item: TJson) => prop == item.prop);
			if (!result) return {};
			return {
				...result,
				label: result.title[lang],
			};
		}

		private previewFomula(sData: string) {
			if (!sData || typeof sData != "string") return;
			let str = sData.replace(/↵/g, "\n");
			this.syncCodeMirror.setValue(str);
			sData.split("↵").forEach((str: string, idx: number) => {
				let line = idx;
				let reg = /\$field_([^#|^$]+)\$/g;
				let result;

				// this.resetFormula.forEach((ite: string) => {
				// 	let reg = new RegExp(ite, "g");
				// 	let res;
				// 	while ((res = reg.exec(str)) != null) {
				// 		let ch = res.index;
				// 		let to = CodeMirror.Pos(line, ch + ite.length);
				// 		this.syncCodeMirror.markText({ line, ch }, to, {
				// 			className: "cm-formula",
				// 		});
				// 	}
				// });

				while ((result = reg.exec(str)) != null) {
					console.log(result);
					let ch = result.index;
					let prop = result[1];
					let oldStr = result[0];
					let to = CodeMirror.Pos(line, ch + oldStr.length);
					let { label, type } = this.getField(prop);
					let opts = this.createFieldOpts(label || "", prop, type);
					this.syncCodeMirror.replaceRange(oldStr, { line, ch }, to);
					this.syncCodeMirror.markText({ line, ch }, to, opts);
				}
			});
		}

		protected render(h: CreateElement) {
			// let lang: any = localStorage.getItem("lang");
			// let title = this.curField.title[lang] || this.curField.title["zh"] || "";

			return h("div", { class: "code-mirror" }, [
				h("h4", { class: "code-flied" }, [`公式=`]),
				h("textarea", { ref: "codeMirror" }),
				h("div", {
					class: "code-mirror-rule",
					domProps: {
						innerHTML: this.ruleTxt,
					},
				}),
			]);
		}

		private insert(label: string, opts: NFormulaEdit.TMarkTextOpts) {
			let { line, ch } = this.syncCodeMirror.getCursor();
			this.syncCodeMirror.replaceRange(label, { line, ch });
			let to = CodeMirror.Pos(line, ch + label.length);
			this.syncCodeMirror.markText({ line, ch }, to, opts);
			return {
				line,
				ch,
			};
		}

		private addFormulaTags(arr: string[], curIndex: number) {
			arr.forEach((item: string, idx: number) => {
				let className = "cm-formula";
				let { line, ch } = this.insert(item, { atomic: false, className });
				if (idx == curIndex) {
					this.syncCodeMirror.setCursor(line, ch + item.length - 1);
					this.syncCodeMirror.focus();
				}
			});
		}

		private createFieldOpts(title: string, prop: string, type: any) {
			let span: Element = document.createElement("span");
			span.innerHTML = title;
			span.className = `tag-${type} cm-field`;
			span.setAttribute("field-key", prop);
			return {
				atomic: true,
				replacedWith: span,
				handleMouseEvents: true,
				attributes: {
					"field-key": prop,
				},
			};
		}

		@Watch("formulaJson")
		onChnageFormulaJson(n: TJson) {
			let { label, value, rule } = n;
			let arr = `${value},(,)`.split(",");
			this.addFormulaTags(arr, 2);
			this.ruleTxt = rule || "";
		}

		@Watch("fieldJson")
		onChangeFieldJson(n: NFormulaEdit.TField) {
			let { title, prop, type } = n;
			let opts = this.createFieldOpts(title[lang], prop, type);
			this.insert(title[lang], opts);
			this.syncCodeMirror.focus();
		}
	}
</script>
