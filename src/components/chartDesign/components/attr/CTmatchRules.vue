<template>
	<div class="ct-container">
		<div class="ct-title">{{ $t("chartDesign.filter") }}</div>
		<rvue-button style="width: 100%" @click="visible = true">{{ $t("chartDesign.addFilter") }}</rvue-button>
		<CTfilterdialog :formConfig="formConfig" :visible.sync="visible" :data="data" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	import CTfilterdialog from "./CTfilter/CTfilterdialog.vue";
	@Component({
		components: {
			CTfilterdialog,
		},
	})
	export default class CTmatchRules extends BaseAttr {
		private visible: Boolean = false;
	}
</script>
<style lang="scss"></style>
