<template>
	<rvue-dialog :visible.sync="visibleSync" top="10vh" width="30%" title="添加辅助字段">
		<div>
			<rvue-input v-model="name" placeholder="请输入辅助字段名称"></rvue-input>
			<assist-formulas></assist-formulas>
			<div class="flex">
				<assist-left :formList="formConfig.configList" v-model="fieldJson"></assist-left>
				<assist-center v-model="formulaJson"></assist-center>
				<assist-right :key="key" :codeMirror.sync="codeMirror" :fieldJson="fieldJson" :formulaJson="formulaJson" ref="mirror"></assist-right>
			</div>
		</div>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
	import BaseAttr from "../../../core/BaseAttr";
	import AssistLeft from "./assistLeft.vue";
	import AssistCenter from "./assistCenter.vue";
	import AssistRight from "./assistRight.vue";
	import AssistFormulas from "./assistFormulas.vue";
	import NFormulaEdit from "./_types";
	@Component({
		components: {
			AssistLeft,
			AssistRight,
			AssistFormulas,
			AssistCenter,
		},
	})
	export default class CTdiAssistDialog extends BaseAttr {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		@Prop({ type: Array, default: () => [] }) formList!: any;
		private formulaJson = {};
		private fieldJson = {};
		private name = "";
		private key = 1;
		private codeMirror: NFormulaEdit.TCodeMirror | any = {};
		@Watch("visible", { immediate: true })
		private onChangeVisible(n: boolean) {
			if (n) {
				this.key++;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.flex {
		@include JustityAndFlexWrap(flex, space-between, null, null);
	}
</style>
