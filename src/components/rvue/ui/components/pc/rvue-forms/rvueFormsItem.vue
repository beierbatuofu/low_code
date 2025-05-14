<template>
	<el-form-item
		ref="elFormItem"
		:prop="prop"
		:label="label"
		:label-width="labelWidth"
		:required="required"
		:rules="rules"
		:error="error"
		:show-message="showMessage"
		:inline-message="inlineMessage"
		:size="size"
		@validate="handleValidate"
	>
		<slot :label="label"></slot>
		<slot></slot>
	</el-form-item>
</template>
<script lang="ts">
	import { Component, Vue, Prop } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	export interface TRvueFormsItem extends Vue {
		resetField: () => void;
		clearValidate: () => void;
	}

	@Component({
		mixins: [Mixins],
		name: "rvueFormsItem",
	})
	class RvueFormsItem extends Vue implements TRvueFormsItem {
		public static install: (param: Vue) => any;
		public static compName = "rvue-forms-item";
		@Prop({ type: String }) prop!: string;
		@Prop({ type: String }) label!: string; //标签文本
		@Prop({ type: String }) labelWidth!: string; //表单域标签的的宽度
		@Prop({ type: Boolean, default: false }) required!: boolean; //是否必填
		@Prop({ type: Object }) rules!: object; //表单验证规则
		@Prop({ type: String }) error!: string; //表单域验证错误信息
		@Prop({ type: Boolean, default: true }) showMessage!: boolean; //是否显示校验错误信息
		@Prop({ type: Boolean, default: false }) inlineMessage!: boolean; //以行内形式展示校验信息

		public resetField() {
			//对该表单项进行重置，将其值重置为初始值并移除校验结果
			return (<TRvueFormsItem>this.$refs.elFormItem).resetField();
		}

		public clearValidate() {
			//移除该表单项的校验结果
			return (<TRvueFormsItem>this.$refs.elFormItem).clearValidate();
		}
	}
	RvueFormsItem.install = function (Vue: any) {
		Vue.component(RvueFormsItem.compName, RvueFormsItem);
	};
	export default RvueFormsItem;
</script>
