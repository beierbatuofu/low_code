<template>
	<rvue-button type="primary" :size="size" id="printQrCode">{{ $t("global.printQrCode") }}</rvue-button>
</template>
<script lang="ts">
	import { Component, Watch, Prop } from "vue-property-decorator";
	import TDButton from "../../core/BaseButton";

	@Component
	export default class TDprintQrCode extends TDButton {}
</script>
