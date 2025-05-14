<!--
 * @Author: ben
 * @LastEditTime: 2021-06-22 13:08:09
-->
<template>
	<div class="rvue-form-group">
		<TDdatetime :mode="mode" :config="config" @updateValue="handleUpdateValue" @updateRange="handleUpdateRange" :form="form" :prop="prop" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseField from "../../core/BaseField";

	@Component({})
	export default class TDfieldDatetime extends BaseField {
		private handleUpdateValue(val: any) {
			this.$emit("update", val);
		}

		private handleUpdateRange(date: any) {
			console.log(date, "date");

			this.$emit("update", date);
		}
	}
</script>
