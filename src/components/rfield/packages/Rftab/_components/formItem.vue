<template>
	<el-col
		v-bind="{ fieldId: config.fieldId }"
		v-if="config.visible"
		:span="setWidth(config) - 1"
		:md="setWidth(config)"
		style="position: relative; vertical-align: top"
		:style="{
			display: config.width != '100%' ? 'inline-block' : 'block',
			width: bMobile ? '100%' : config.width,
		}"
	>
		<el-form-item :prop="config.fieldId" :error="customError[config.fieldId]" :key="customError[config.fieldId]" :rules="tabRules">
			<div v-if="config.titleShow" class="form-item" :class="{ 'form-required': config.required }" style="font-size: 14px; color: #606266">
				{{ config | getLang }}
			</div>

			<div class="widget-config-desc" v-html="config.desc" />
			<component
				:is="`rfield-${config.type}`"
				:config="config"
				ref="temp"
				:timestamp="timestamp"
				:form="form"
				@input="handleUpdate"
				@update="handleUpdate"
				@change="handleUpdate" 
				@blur="handleBlur"
				@delfile="handleDelfile"
				:fieldId="fieldId"
				:mode="mode"
				:rules="rules"
				:tableConfig="tableConfig"
				:allReadonly="allReadonly"
				:closeForm="closeForm"
				:customError="customError"
				:formType="formType"
			></component>
		</el-form-item>
	</el-col>
</template>

<script lang="ts">
	import { Vue, Component, Prop, PropSync, Watch } from "vue-property-decorator";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import RuleConfig from "@/components/rvue/custom/packages/form/RuleConfig.ts";
 
	@Component
	export default class FormItem extends Vue {
		@Prop({ type: Object, default: () => ({}) }) config!: Record<string, any>;
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Object, default: () => ({}) }) form!: Record<string, any>;
		@Prop({ type: String, default: "" }) fieldId!: string;
		@Prop({ type: String, default: "" }) mode!: string;
		@Prop({ type: Array, default: () => [] }) rules!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) tableConfig!: Record<string, any>;
		@Prop({ type: Boolean, default: false }) allReadonly!: boolean;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;
		@Prop({ type: Object, default: () => ({}) }) customError!: Record<string, string>;
		@Prop({ type: String, default: "normal" }) formType!: string;

		private tabRules: any = null;

		private get bMobile() {
			return /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
		}

		private setWidth(column: TJson) {
			return column.width ? (column.width.replace("%", "") / 100) * 24 : 24;
		}
		private handleUpdate(event: Event, value: any, fieldId: string, type: string = "") {
			this.$emit("validB", value, fieldId);
			this.$emit("change", value, fieldId, type);
			this.$emit("update", value, fieldId, type);
		}

		private handleBlur(event: Event, fieldId: string, value: any) {
			//this.$emit("validB", prop);
			// console.log(value, fieldId);
			//	this.$emit("change", value, fieldId);
			this.$emit("blur", fieldId);
		}

		private handleDelfile(file: object) {
			this.$emit("delfile", file);
		}

		protected created() {
			this.$nextTick(() => {
				let rules: any = null;
				if (this.config.visible && this.config.edit && this.config.type != "table") {
					let ruleConfig: Record<string, any> = new RuleConfig();

					ruleConfig.rules = this.config;

					ruleConfig.rules.length && (rules = ruleConfig.rules);
					this.tabRules = rules;
				}

				if (this.config.visible && this.config.required && this.config.type === "table") {
					this.tabRules = new RuleConfig().formIsEmpty(this.form[this.config.fieldId].data);
				}
			});
		}
	}
</script>
<style lang="scss" scoped></style>
