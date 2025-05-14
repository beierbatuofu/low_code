<template>
	<div class="ct-container">
		<div class="flex">
			<div class="ct-title" style="margin-bottom: 0">{{ $t("chartDesign.dataLabel") }}</div>
			<rvue-switch v-model="value"> </rvue-switch>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTshowDataLabel extends BaseAttr {
		private get value() {
			return this.data.config.showDataLabel;
		}
		private set value(n) {
			this.data.config.showDataLabel = n;
		}
	}
</script>
