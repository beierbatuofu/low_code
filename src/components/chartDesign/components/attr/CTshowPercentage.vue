<template>
	<div class="ct-container">
		<div>显示百分比</div>
		<rvue-switch v-model="value"> </rvue-switch>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTshowPercentage extends BaseAttr {
		private get value() {
			return this.data.config.showPercentage;
		}
		private set value(n) {
			this.data.config.showPercentage = n;
		}
	}
</script>
<style lang="scss"></style>
