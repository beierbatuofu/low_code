<!--
 * @Author: ben
 * @LastEditTime: 2021-06-18 12:56:35
-->
<template>
	<div>
		<rvue-label :label="$t('tableDesign.defaultValue')" />
		<TDnumber :config="config" @min="handleMin" @max="handleMax" />
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	@Component
	export default class TDdefaultNumber extends BaseAttr {
		private handleMin(num: number) {
			this.config.value.custom.min = num;
		}

		private handleMax(num: number) {
			this.config.value.custom.max = num;
		}
	}
</script>
<style lang="scss">
	.TD-attr-style {
	}
</style>
