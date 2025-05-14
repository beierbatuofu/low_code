<!--
 * @Author: ben
 * @LastEditTime: 2022-05-07 10:26:02
-->
<template>
	<rvue-dialog :title="$t('formula.editFormula')" class="formulaedit-dialog" :visible.sync="dialogVisible" width="800">
		<div slot="title" class="dialog-title">
			<div class="dialog-title-font">{{ $t("formula.editFormula") }}</div>
		</div>
		<div class="formulaedit">
			<Left :fieldText="fieldText" v-model="fieldJson" :curField="curField" />

			<Mirror :rule="rule" :parentConf="parentConf" :key="key" :codeMirror.sync="codeMirror" :fieldJson="fieldJson" :formulaJson="formulaJson" ref="mirror" :curField="curField" />

			<Right v-model="formulaJson" @updateRule="updateRule" />
		</div>
		<div slot="footer">
			<el-button @click="bindCancel">{{ $t("linkDataDialog.cancel") }}</el-button>
			<el-button type="primary" @click="bindComfire">{{ $t("crud.filter.submitBtn") }}</el-button>
		</div>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Component, Watch, Vue, PropSync, Prop } from "vue-property-decorator";
	import Left from "./_packages/Left.vue";
	import Right from "./_packages/Right.vue";
	import Mirror from "./_packages/Mirror.vue";

	import storeModule, { namespace, lang } from "./_store";
	import WidgetConfDef from "@formDesign/commons/WidgetConfDef";

	const fieldsConfig = WidgetConfDef.widgetList;

	@Component({
		name: "FormualEdit",
		components: {
			Left,
			Right,
			Mirror,
		},
	})
	export default class FormulaEdit extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) dialogVisible!: boolean;
		@Prop({ type: Array, default: () => [] }) fieldList!: TJson[];
		@Prop({ type: [Object, String], default: () => ({ data: "" }) }) defaultFormula!: any;
		@Prop({ default: () => ({}), type: Object }) curField!: TJson;
		@Prop({ default: () => ({}), type: Object }) parentConf!: Record<string, any>;
		private fieldJson = {};
		private formulaJson = {};
		private formulaData = "";
		private codeMirror: NFormulaEdit.TCodeMirror | any = {};
		private key = 1;
		private rule = "";

		private get fieldText(): TJson {
			let fields: TJson = {};
			let list: NFormulaEdit.TFieldConfig[] = fieldsConfig;
			list.forEach((item: NFormulaEdit.TFieldConfig) => {
				item.list &&
					item.list.forEach((ite: NFormulaEdit.TField) => {
						fields[<string>ite.type] = <string>ite.description;
					});
			});
			return fields;
		}

		private updateRule(data: NFormulaEdit.TFormulaOpts) {
			this.rule = data["zh"] || "";
		}

		private unregisterStore() {
			//销毁store
			//storeModule.unregister(this);
		}
		private bindCancel() {
			this.dialogVisible = false;
			this.$emit("change", this.defaultFormula);
		}
		private bindComfire() {
			let formula = (<any>this).$refs.mirror.getFormula();
			this.$emit("change", formula);
		}

		@Watch("visible", { immediate: true })
		private onChangeVisible(n: boolean) {
			if (n) {
				storeModule.register(this);
				this.key++;
				let arrList: any[] = [];
				this.fn(this.fieldList, arrList);
				(<any>this.$store).dispatch(`${namespace}/setFieldList`, arrList);
				(<any>this.$store).dispatch(`${namespace}/setDefaultData`, this.defaultFormula);
			}
		}

		private fn(list: any[], newList: any[], parentTitle: Record<string, any> = {}): void {
			let cloneList = this.$utils.deepClone(list);
			cloneList.forEach((item: any) => {
				if (!["tab", "table"].includes(item.type)) {
					newList.push({
						...item,
						parentTitle: parentTitle,
					});
				} else {
					if (item.type == "table") {
						item.children.forEach((it: any) => {
							it.parentId = item.fieldId;
						});
						this.fn(item.children, newList, item.title);
					}

					if (item.type == "tab" && item.children.length) {
						item.children.forEach((it: Record<string, any>) => {
							if (it.configList.length && it.configList.length) {
								this.fn(it.configList, newList, item.title);
							}
						});
					}
				}
			});
		}
	}
</script>
<style lang="scss">
	@import "./_style/index.scss";
</style>
