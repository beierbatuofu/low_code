<!--
* @FileDescription: 日期类型(下拉)选择: 年月日时分秒
* @Author: MaoJianghui
* @Date: 2021-03-11
* Copyright © 2021. All rights reserved.
-->
<template>
	<el-form-item>
		<rvue-label :label="t('global.dateFormat')" style="margin-right: 10px" :tip="t('widgetConfig.attrTimeFormatTip')" />
		<br />

		<el-select :placeholder="t('global.pleaseChoose')" @change="selectChanged" v-model="value">
			<el-option v-for="item in options" :key="item.dateFormat" :label="t(item.label)" :value="item.dateFormat"> </el-option>
		</el-select>
		<!-- <p>{{getDateFormat}}</p> -->
	</el-form-item>
</template>

<script>
	import { create } from "../utils/create";
	import Datetime from "@/core/Datetime";

	const name = "AttrDateFormat";

	const OPTIONS = [
		{
			label: "global.dateFormatY",
			dateFormat: "yyyy",
		},
		{
			label: "global.dateFormatYm",
			dateFormat: "yyyy-MM",
		},
		{
			label: "global.dateFormatYmd",
			dateFormat: "yyyy-MM-dd",
		},
		{
			label: "global.dateFormatYmdhm",
			dateFormat: "yyyy-MM-dd HH:mm",
		},
		{
			label: "global.dateFormatYmdhms",
			dateFormat: "yyyy-MM-dd HH:mm:ss",
		},
	];

	const methods = {
		selectChanged(v) {
			this.data.dateFormat = v;
			this.data.value = "";
		},
	};

	const watch = {};

	/**
	 * @props "data" , "column"
	 * @see this.data.dateFormat
	 */
	export default create({
		name,
		methods,
		watch,
		data() {
			return {
				options: OPTIONS,
				value: "",
			};
		},
		created() {
			if (!this.data.dateFormat) {
				this.data.dateFormat = "yyyy-MM-dd HH:mm";
			}
			this.value = this.data.dateFormat;
		},
	});
</script>

<style lang="scss"></style>
