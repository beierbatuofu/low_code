<template>
	<CTdi mode="dimensions" :data="data" :formConfig="formConfig" />
</template>
<script lang="ts">
	import CTdi from "./CTdi/CTdi.vue";
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: { CTdi },
	})
	export default class CTdimension extends BaseAttr {}
</script>
