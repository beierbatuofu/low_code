<template>
	<div v-html="config.tip" class="ct-container"></div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTtip extends BaseAttr {}
</script>
<style lang="scss"></style>
