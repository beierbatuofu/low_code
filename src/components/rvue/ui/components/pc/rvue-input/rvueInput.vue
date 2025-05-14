<!--
 * @Author: ben
 * @LastEditTime: 2022-03-09 11:12:27
-->
<template>
	<div class="rvue-input">
		<el-input
			:type="type"
			:rows="rows"
			:show-password="showPassword"
			:clearable="clearable"
			:placeholder="placeholder"
			v-model="inputValue"
			:prefix-icon="prefixIcon"
			:suffix-icon="suffixIcon"
			:show-word-limit="showWordLimit"
			:autosize="autosize"
			:autocomplete="autocomplete"
			v-if="!readonly"
			:disabled="disabled"
			@select="handleSelect"
			@blur="handleBlur"
			:maxlength="Number(maxlength)"
			:minlength="Number(minlength)"
			:resize="resize"
			:autofocus="autofocus"
			:label="label"
		>
		</el-input>
		<div class="widget-readonly" v-else>
			{{ inputValue }}
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TAutocomplete = "on" | "off";
	declare type TResize = "none" | "both" | "horizontal" | "vertical";
	declare type TAutofocus = true | false;
	@Component({
		mixins: [Mixins],
	})
	class rvueInput extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-input";

		@Prop({ type: String, default: "text" }) type!: string;
		@Prop({ type: String }) prefixIcon!: string; //  input 组件首部增加图标
		@Prop({ type: String }) suffixIcon!: string; //  input 组件尾部增加图标
		@Prop({ type: [Number, String], default: 300 }) maxlength!: number | string; //  input 最大输入长度
		@Prop({ type: [Number, String], default: 0 }) minlength!: number | string; //  input 最小输入长度

		@Prop({ type: String }) startPlaceholder!: string; //范围选择时开始日期的占位内容
		@Prop({ type: String }) endPlaceholder!: string; //范围选择时结束日期的占位内容
		@Prop({ type: String }) rangeSeparator!: string; //选择范围时的分隔符
		@Prop({ type: Boolean, default: false }) editable!: boolean; // 文本框可输入
		@Prop({ type: Boolean, default: false }) showWordLimit!: boolean;
		@Prop({ type: Boolean, default: false }) clearable!: boolean;
		@Prop({ type: Boolean, default: false }) showPassword!: boolean;
		@Prop({ type: Number, default: 2 }) rows!: number;
		@Prop({ type: [Boolean, Object], default: false }) autosize!: boolean | object;
		@Prop({ type: String, default: "off" }) autocomplete!: TAutocomplete;
		@Prop({ type: Boolean, default: false }) readonly!: boolean;
		@Prop({ type: Boolean, default: false }) disabled!: boolean;

		@Prop({ type: String }) resize!: TResize;
		@Prop({ type: Boolean, default: false }) autofocus!: TAutofocus;
		@Prop({ type: String }) label!: string;

		@Model("change") value!: any;

		private get inputValue() {
			return this.value;
		}

		private set inputValue(n) {
			if (this.disabled) return;
			this.$emit("change", n);
			this.$emit("input", n);
		}

		private handleSelect(e: Event) {
			this.$emit("select", e);
		}
		private handleBlur(e: Event) {
			if (this.disabled) return;
			this.$emit("blur", e);
		}
	}

	rvueInput.install = function (Vue: any) {
		Vue.component(rvueInput.compName, rvueInput);
	};

	export default rvueInput;
</script>
5
<style lang="scss" scoped>
	.rvue-input {
		width: 100%;
	}
	::v-deep input {
		padding: 5px 30px;
		border-radius: 2px;
		border: 1px solid #e1e1e1;
	}
	::v-deep input[readonly]:focus,
	::v-deep input[readonly]:hover {
		border: 1px solid #dcdfe6;
	}
	::v-deep textarea {
		min-height: 40px !important;
		height: 40px !important;
		width: 100%;
		//line-height: 2;
		padding: 5px 30px;
		border-radius: 4px;
		border: 1px solid #e1e1e1;
	}
	::v-deep textarea[readonly]:focus,
	::v-deep textarea[readonly]:hover {
		border: 1px solid #dcdfe6;
		resize: none;
	}
	@media screen and (max-width: 768px) {
		input {
			width: 100%;
		}
	}
</style>
