<template>
	<el-form
		ref="elForm"
		:model="model"
		:label-width="labelWidth"
		:inline="inline"
		:label-position="lebelPosition"
		:label-suffix="labelSuffix"
		:hide-required-asterisk="hideRequiredAsterisk"
		:show-message="showMessage"
		:inline-message="inlineMessage"
		:status-icon="statusIcon"
		:validate-on-rule-change="validateChange"
		:disabled="disabled"
		:size="size"
		@validate="handleValidate"
	>
		<!-- <rvue-forms-item></rvue-forms-item> -->
		<slot></slot>
	</el-form>
</template>
<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";
	import RvueFormsItem from "./rvueFormsItem.vue";
	declare type TLabelPosition = "right" | "left" | "top";

	export interface TRvueForm extends Vue {
		validate: (rule: any, value: any, callback: (cal1: boolean, cal2: object) => {}) => any;
		validateField: (props: any[] | string, callback: (errorMessage: string) => {}) => any;
		resetFields: () => void;
		clearValidate: (props: any[] | string) => void;
	}

	@Component({
		mixins: [Mixins],
		name: "rvueForm",
		components: {
			"rvue-forms-item": RvueFormsItem,
		},
	})
	class RvueForms extends Vue implements TRvueForm {
		public static install: (param: Vue) => any;
		public static compName = "rvue-forms";
		@Prop({ type: Object, default: {} }) model!: object; //表单数据对象
		@Prop({ type: Object, default: {} }) rules!: object; //表单验证规则
		@Prop({ type: String, default: "right" }) lebelPosition!: TLabelPosition; //表单验证规则
		@Prop({ type: String }) labelWidth!: string; //表单域标签的宽度
		@Prop({ type: String }) labelSuffix!: string; //表单域标签的后缀
		@Prop({ type: Boolean, default: false }) hideRequiredAsterisk!: boolean; //是否显示必填字段的标签旁边的红色星号
		@Prop({ type: Boolean, default: true }) showMessage!: boolean; //是否显示校验错误信息
		@Prop({ type: Boolean, default: false }) inlineMessage!: boolean; //是否以行内形式展示校验信息
		@Prop({ type: Boolean, default: false }) statusIcon!: boolean; //是否在输入框中显示校验结果反馈图标
		@Prop({ type: Boolean, default: true }) validateChange!: boolean; //是否在 rules 属性改变后立即触发一次验证
		@Prop({ type: Boolean, default: false }) disabled!: boolean; //是否禁用该表单内的所有组件。

		public validate(rule: any, value: any, callback: (cal1: boolean, cal2: object) => {}) {
			return (<TRvueForm>this.$refs.elForm).validate(rule, value, callback);
		}
		public validateField(props: any[] | string, callback: (errorMessage: string) => {}) {
			return (<TRvueForm>this.$refs.elForm).validateField(props, callback);
		}
		public resetFields() {
			return (<TRvueForm>this.$refs.elForm).resetFields();
		}
		public clearValidate(props: any[] | string) {
			return (<TRvueForm>this.$refs.elForm).clearValidate(props);
		}
		private handleValidate(prop: any) {
			this.$emit("validate", prop);
		}
	}
	RvueForms.install = function (Vue: any) {
		Vue.component(RvueForms.compName, RvueForms);
	};
	export default RvueForms;
</script>
