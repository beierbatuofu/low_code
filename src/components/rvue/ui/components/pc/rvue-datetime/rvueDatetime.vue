<!--
 * @Author: ben
 * @LastEditTime: 2022-06-08 16:50:06
-->
<template>
	<div style="height: 36px">
		<el-date-picker
			v-if="!readonly"
			style="width: 100%"
			:disabled="disabled"
			:readonly="readonly"
			v-model="datetimeValue"
			:editable="editable"
			:type="getType"
			:format="getFormat"
			:value-format="valueFormat"
			:range-separator="rangeSeparator"
			:start-placeholder="getStartPlaceholder"
			:end-placeholder="getEndPlaceholder"
			:clearable="clearable"
			:align="align"
			:default-time="defaultTime"
			:unlink-panels="unlinkPanels"
			@change="handleChange"
		>
		</el-date-picker>
		<div class="widget-readonly" v-if="readonly">
			{{ datetimeValue.slice(0, getFormat.length) }}
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	declare type TAlign = "left" | "center" | "right";
	// format只支持 yyyy-MM-dd hh:mm和yyyy-MM-dd hh:mm:ss 两种格式
	const defaultFormat = ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm"];
	// type类型 yyyy-MM-dd hh:mm和yyyy-MM-dd hh:mm:ss 两种格式
	const defaultType = ["datetime", "datetimerange"];

	enum Ttype {
		"yyyy" = "year",
		"yyyy-MM" = "month",
		"yyyy-MM-dd" = "date",
		"yyyy-MM-dd HH:mm" = "datetime",
		"yyyy-MM-dd HH:mm:ss" = "datetime",
	}

	enum TQuerytype {
		"yyyy" = "daterange",
		"yyyy-MM" = "daterange",
		"yyyy-MM-dd" = "daterange",
		"yyyy-MM-dd HH:mm" = "datetime",
		"yyyy-MM-dd HH:mm:ss" = "datetime",
	}

	@Component({
		mixins: [Mixins],
		name: "rvueDatetime",
	})
	class rvueDatetime extends Vue {
		public static install: (param: Vue) => any;
		public static compName = "rvue-datetime";
		@Prop({ type: String, default: "datetime" }) type!: string; // type类型 目前只支持datetime和datetimerange
		@Prop({ type: String, default: "" }) startPlaceholder!: string; //范围选择时开始日期的占位内容
		@Prop({ type: String, default: "" }) endPlaceholder!: string; //范围选择时结束日期的占位内容
		@Prop({ type: String, default: "-" }) rangeSeparator!: string; //选择范围时的分隔符
		@Prop({ type: Boolean, default: false }) editable!: boolean; // 文本框可输入
		@Prop({ type: Boolean, default: true }) clearable!: boolean; //是否显示清除按钮
		@Prop({ type: String, default: "left" }) align!: TAlign; //对齐方式
		@Prop({ type: Boolean, default: false }) unlinkPanels!: boolean; //在范围选择器里取消两个日期面板之间的联动
		@Prop({ type: String, default: "" }) valueFormat!: string;

		@Model("update") value!: any;

		private get defaultTime() {
			return /HH/g.test(<string>this.format) || !/range/.test(this.getType) ? "" : ["00:00:00", "23:59:59"];
		}

		private get getFormat() {
			let format = this.format;
			//	if (defaultFormat.includes(<string>format)) return format;

			return format;
		}

		private handleChange(val: string) {
			this.$emit("change", val);
		}

		private get getValueFormat() {
			if (this.valueFormat) return this.valueFormat;
			return this.getFormat;
		}

		private get getType() {
			let value = this.datetimeValue;

			if (Array.isArray(value)) {
				return /HH/g.test(<string>this.format) ? "datetimerange" : "daterange";
			}

			return Ttype[<keyof typeof Ttype>this.format];
		}

		private get datetimeValue() {
			return this.value;
		}

		private set datetimeValue(n) {
			this.$emit("update", n);
		}

		private get getStartPlaceholder() {
			if (this.startPlaceholder) return this.startPlaceholder;
			return this.t("dateTime.startPlaceholder");
		}

		private get getEndPlaceholder() {
			if (this.endPlaceholder) return this.endPlaceholder;
			return this.t("dateTime.endPlaceholder");
		}
	}

	rvueDatetime.install = function (Vue: any) {
		Vue.component(rvueDatetime.compName, rvueDatetime);
	};

	export default rvueDatetime;
</script>
