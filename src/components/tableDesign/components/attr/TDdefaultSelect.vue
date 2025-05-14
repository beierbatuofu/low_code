<!--
 * @Author: ben
 * @LastEditTime: 2022-03-25 17:13:36
-->
<template>
	<div>
		<rvue-label :label="$t('tableDesign.defaultValue')" />

		<el-select v-model="defaultSelect" :size="size" clearable :multiple="multiple" :placeholder="$t('global.pleaseChoose')" style="width: 100%">
			<el-option v-for="item in dicData" :key="item.value" :label="item.label" :value="isStatus(item)"> </el-option>
		</el-select>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	const types: TJson = {
		input: "text",
		textarea: "textarea",
	};

	@Component
	export default class TDdefaultSelect extends BaseAttr {
		private get defaultSelect() {
			return (<any>this).config.defVal;
		}

		private set defaultSelect(val: any) {
			(<any>this).config.defVal = val;
		}

		private get multiple() {
			return Array.isArray((<any>this).config.defVal);
		}

		private isStatus(item: any) {
			if ((<any>this).config.type == "process_status") {
				return item.value;
			} else {
				return item.label;
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-select__tags {
		max-width: 94%;
		overflow: hidden;
		// text-overflow: ellipsis;
		display: inline-block;
		white-space: nowrap;
	}
	::v-deep .el-select {
		.el-el-input,
		.el-input--small,
		.el-input--suffix {
			.el-input__inner {
				height: 40px !important;
			}
		}
	}
</style>
