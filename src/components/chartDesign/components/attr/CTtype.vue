<template>
	<div class="ct-container">类型：{{ config.type }}</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTtype extends BaseAttr {}
</script>
<style lang="scss"></style>
