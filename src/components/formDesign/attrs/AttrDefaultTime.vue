<!--
 * @Author: ben
 * @LastEditTime: 2021-11-02 16:53:36
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-datetime v-model="value" :type="dateType" placeholder="选择日期时间" :value-format="format" :format="format" style="width: 100%"> </rvue-datetime>
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import Datetime from "@/core/Datetime";

	const props = {
		dateType: {
			default: "datetime",
			type: String,
		},
	};
	const name = "AttrDefaultTime";
	const computed = {
		format() {
			try {
				return this.data.dateFormat;
			} catch (err) {
				return "";
			}
		},
		value: {
			get() {
				return this.data.defVal;
				// let datetime = Datetime.ins().convert(this.data.defVal, this.data.dateFormat);

				// return Datetime.ins().completion(datetime, this.data.dateFormat);
			},
			set(n) {
				this.data.defVal = Datetime.ins().completion(n, this.data.dateFormat);
			},
		},
	};

	export default create({
		name,
		computed,
		props,
		data() {
			return {
				time: "",
			};
		},
		created() {},
	});
</script>
