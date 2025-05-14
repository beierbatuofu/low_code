<!--
 * @Author: ben
 * @LastEditTime: 2022-06-20 14:46:37
-->
<!--
 表单设计模式 列表设计模式 详情 流程设计权限
 -->
<template>
	<div class="rvue-form-group">
		<div v-if="ruleMethod == 'between'">
			<rvue-datetime
				:align="align"
				v-if="getFieldStyle == 'default'"
				v-model="datetime"
				value-format="yyyy-MM-dd HH:mm:ss"
				:format="getFormat"
				:disabled="disabled"
				@update="handledateTimeChange"
				@change="handleChange"
				:readonly="readonly"
			></rvue-datetime>

			<rvue-date-select v-if="getFieldStyle == 'select'" :disabled="disabled" v-model="datetime" @change="handleSelect" :readonly="readonly"></rvue-date-select>
		</div>
		<div v-else>
			<el-date-picker style="width: 100%" :align="align" v-model="judeValue" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="handledateTimeChange"></el-date-picker>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import Datetime from "./_core/Datetime.ts";
	import "./_core/RfDatetime.ts";
	import extDatetime from "@/core/Datetime";

	// fieldStyle:组件样式参数 default:默认 ，select:日期选择

	@Component
	export default class RvueFieldDatetime extends WidgetField {
		@Prop({ type: String, default: "between" }) ruleMethod!: string;
		//  @Watch('config.queryStyle',{
		//    immediate:true,
		//    deep:true
		//  })
		//  onchangeQueryStyle(val:any){
		//    console.log(val,33333);

		//  }

		private get judeValue() {
			return this.value[0];
		}

		private set judeValue(val: string) {
			this.$set(this.value, "0", val);
		}

		private valFormat = "";

		private setNowTime() {
			let format = this.getFormat;

			let date = Datetime.convert("yyyy-MM-dd HH:mm:ss", new Date());
			return date;
		}

		private get getFormat() {
			if (this.mode == "query") {
				let format: string = (<Record<"dateFormat", string>>this.config).dateFormat;
				if (["yyyy", "yyyy-MM", "yyyy-MM-dd"].some((f: string) => f === format)) {
					return "yyyy-MM-dd";
				}
				return "yyyy-MM-dd HH:mm:ss";
			}
			try {
				return this.config.dateFormat || "yyyy-MM-dd HH:mm:ss";
			} catch (err) {
				return "yyyy-MM-dd HH:mm:ss";
			}
		}

		private created() {
			this.valFormat = typeof (<any>this).value == "string" ? "datetime" : "datetimerange";
			if (this.config.rely?.type == "now" && this.mode != "design" && !this.value && this.formType == "add") {
				this.value = this.setNowTime();
			}
		}

		private get getFieldStyle() {
			if (this.config.queryStyle == "select") {
				return "select";
			} else {
				return "default";
			}
		}

		private get datetime() {
			return this.value == null || this.value == "null" ? "" : this.value;
		}

		private set datetime(n: any) {
			this.value = this.valFormat == "datetimerange" && !n ? [] : n;
		}
		private handleSelect(n: string) {
			let val = n || "";
			this.datetime = val;
			(<any>this).handleUpdate(val);
		}

		private handledateTimeChange(n: any) {
			let val = n || "";
			this.datetime = val;
			if (typeof val == "string") return;

			(<any>this).handleUpdate(val);
		}

		public handleChange(val: string) {
			(<any>this).handleUpdate(val);
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
</style>
