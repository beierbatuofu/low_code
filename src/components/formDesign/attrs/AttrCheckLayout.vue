<!--
* @FileDescription: CheckBox和Radio组件的[排列方式]属性: 横向排列， 纵向排列(默认)
* @Author: MaoJianghui
* @Date: 2021-03-15
* Copyright © 2021. All rights reserved.
-->
<template>
	<div class="widget-config-group el-form-item" v-if="!parentType">
		<div class="margin-bottom-10 font-size-14">{{ t("global.layoutTitle") }}</div>
		<!-- <el-select v-model="layoutValue" placeholder="t('global.pleaseChoose')">
            <el-option
            v-for="item in options"
            :key="item.layout"
            :label="t(item.label)"
            :value="item.layout">
            </el-option>
        </el-select> -->
		<!-- {{layoutValue}} -->

		<el-radio-group v-model="value" size="medium" @change="layoutChange">
			<el-radio-button v-for="item in options" :key="item.layout" :label="item.layout">{{ t(item.label) }}</el-radio-button>
		</el-radio-group>
	</div>
</template>

<script>
	import { create } from "../utils/create";

	const name = "AttrCheckLayout";

	const OPTIONS = [
		{
			label: "global.layoutHorizontal",
			layout: "horizontal",
		},
		{
			label: "global.layoutVertical",
			layout: "vertical",
		},
	];

	const computed = {
		// layoutValue : {
		//     get() {
		//         return this.data.checkLayout;
		//     },
		//     set(v) {
		//         this.data.checkLayout = v;
		//     }
		// }
	};

	const methods = {
		layoutChange(v) {
			// console.log("layoutChange>>>>>>>>" + v);
			this.data.checkLayout = v;
		},
	};

	/**
	 * @props "data" , "column"
	 * @see this.data.checkLayout
	 * checkLayout: "vertical" / "horizontal"
	 */
	export default create({
		name,
		computed,
		methods,
		data() {
			return {
				options: OPTIONS,
				value: "",
			};
		},
		created() {
			// Check data props from parent, if undefined, then use default : vertical
			if (!this.data.checkLayout) {
				this.data.checkLayout = "vertical";
			}
			this.value = this.data.checkLayout;
		},
		watch: {
			data: {
				handler: function (n) {
					this.value = n.checkLayout;
				},
				deep: true,
			},
		},
	});
</script>

<style></style>
