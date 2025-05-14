<!--
 * @Author: ben
 * @LastEditTime: 2021-11-11 13:10:35
-->
<template>
	<div class="TD-field-number">
		<TDnumber :config="config" @update="handlerUpdate" :form="form" :prop="prop" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseField from "../../core/BaseField";

	@Component
	export default class TDfieldNumber extends BaseField {
		private handlerUpdate(aList: any[]) {
			this.$emit("update", {
				min: aList[0] || "undefined",
				max: aList[1] || "undefined",
			});
			//this.$emit("change", aList);
		}
	}
</script>
<style lang="scss">
	.TD-field-number {
		.el-input-number,
		.el-input {
			// display: inline-block;
			// width: 45% !important;

			.el-input__inner {
				text-align: center !important;
			}
		}
		.el-input {
			width: 100% !important;
		}
	}
</style>
