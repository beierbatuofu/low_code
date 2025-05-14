<!--
 * @Author: ben
 * @LastEditTime: 2022-05-19 09:29:32
-->
<template>
	<div>
		<el-date-picker
			v-if="selectValue == 0"
			v-model="dateRange"
			type="datetimerange"
			:start-placeholder="$t('tableDesign.startTime')"
			:end-placeholder="$t('tableDesign.endTime')"
			style="width: 100%"
		>
		</el-date-picker>

		<el-select v-if="selectValue == 1" size="small" v-model="sDataValue" :placeholder="$t('global.pleaseChoose')" style="width: 100%">
			<el-option v-for="item in dateOptions" :key="item.value" :label="$t(item.label)" :value="item.value"> </el-option>
		</el-select>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop, Vue } from "vue-property-decorator";
	import dateTime from "@/core/Datetime";

	@Component
	export default class DTinput extends Vue {
		@Prop({ type: String, default: "design" }) mode!: string;
		@Prop({ type: String, default: "" }) prop!: string;
		@Prop({
			type: Object,
			default: () => ({}),
		})
		config!: TJson;
		@Prop({
			type: Object,
			default: () => ({}),
		})
		form!: TJson;
		private sDataValue = "";

		@Watch("sDataValue")
		onChangDataValue(n: any) {
			this.config.value.custom = n;
			this.$emit("updateValue", this.sDataValue);
		}

		@Watch("config", { deep: true, immediate: true })
		onChangeConfig() {
			this.sDataValue = this.config.value.custom;
		}

		private set dateRange(date: string[]) {
			// this.config.value.range = date;

			if (date && date.length > 0) {
				let startDate = dateTime.ins().convert(new Date(date[0]), "yyyy-MM-dd HH:mm:ss");
				let endDate = dateTime.ins().convert(new Date(date[1]), "yyyy-MM-dd HH:mm:ss");
				this.config.value.range = [startDate, endDate];
			} else {
				this.config.value.range = [];
			}
			this.$emit("updateRange", this.config.value.range);
		}

		private get dateRange() {
			if (this.mode == "query") {
				return this.form[this.prop];
			}

			return this.config.value.range;
		}

		private get selectValue() {
			return this.config.defaultStyle;
		}

		private get dateOptions() {
			return this.config.dateOptions;
		}
	}
</script>
