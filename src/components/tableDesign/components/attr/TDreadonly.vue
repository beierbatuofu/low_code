<template>
	<div>
		<rvue-label inline :label="$t('tableDesign.readOnly')" />
		<el-switch v-model="value" active-color="#13ce66" inactive-color="#dcdfe6"> </el-switch>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	@Component
	export default class TDreadOnly extends BaseAttr {
		private handleAdd() {
			this.$emit("add");
		}

		private get value() {
			return !this.config.edit;
		}

		private set value(bool: boolean) {
			this.config.edit = !bool;
		}
	}
</script>
<style lang="scss">
	.TD-attr-style {
	}
</style>
