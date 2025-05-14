<template>
	<div class="ct-container">
		<div class="flex">
			<div class="ct-title" style="margin-bottom: 0">{{ $t("chartDesign.grid") }}</div>
			<rvue-switch v-model="value"> </rvue-switch>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTgrid extends BaseAttr {
		private get value() {
			return this.data.config.grid.show;
		}
		private set value(n) {
			this.data.config.grid.show = n;
		}
	}
</script>
<style lang="scss"></style>
