<!--
 * @Author: ben
 * @LastEditTime: 2021-11-11 13:58:17
-->
<template>
	<div>
		<rvue-label :label="$t('tableDesign.defaultValue')" />
		<TDnumber :config="config" />
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";

	@Component
	export default class TDdefaultNumber extends BaseAttr {}
</script>
<style lang="scss">
	.TD-attr-style {
	}
</style>
