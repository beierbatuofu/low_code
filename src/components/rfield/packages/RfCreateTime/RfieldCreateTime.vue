<!--
 表单设计模式 列表设计模式 详情 流程设计权限
 -->
<template>
	<div class="rvue-form-group">
		<rvue-datetime
			value-format="yyyy-MM-dd HH:mm:ss"
			:align="align"
			v-if="getFieldStyle == 'default'"
			v-model="datetime"
			:format="getFormat"
			:disabled="disabled"
			@change="handledateTimeChange"
		></rvue-datetime>
		<rvue-date-select v-if="getFieldStyle == 'select'" :disabled="disabled" v-model="datetime" @change="handledateTimeChange"></rvue-date-select>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import Datetime from "../RFDatetime/_core/Datetime.ts";
	import "./_core/RfCreateTime";

	// fieldStyle:组件样式参数 default:默认 ，select:日期选择

	@Component
	export default class RvueFieldDatetime extends WidgetField {
		private valFormat = "";

		private setNowTime() {
			let format = this.getFormat;
			let date = Datetime.ins().convert(new Date(), format);
			return Datetime.ins().completion(date, format);
		}

		private get getFormat() {
			try {
				return this.config.dateFormat || "yyyy-MM-dd HH:mm:ss";
			} catch (err) {
				return "yyyy-MM-dd HH:mm:ss";
			}
		}
		private created() {
			this.valFormat = typeof (<any>this).value == "string" ? "datetime" : "datetimerange";
		}

		// private mounted() {
		// 	window.onbeforeunload=function(){
		// 		return '离开此页面将无法保存当前内容';
		// 	}
		// }

		private get getFieldStyle() {
			if (this.config.queryStyle == "select") {
				return "select";
			} else {
				return "default";
			}
		}

		private get datetime() {
			// if (this.config.value.type == "now" && this.mode != "design") {
			// 	(<any>this).value = this.setNowTime();
			// }

			return this.value;
		}

		private set datetime(n: any) {
			this.value = this.valFormat == "datetimerange" && !n ? [] : n;
		}

		private handledateTimeChange(n: any) {
			this.datetime = n;
			(<any>this).handleUpdate(n);
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
</style>
