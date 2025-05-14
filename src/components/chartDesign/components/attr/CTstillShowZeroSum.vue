<template>
	<div class="ct-container">
		<div>显示数据为零的值</div>
		<rvue-switch v-model="value"> </rvue-switch>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
	@Component({
		components: {},
	})
	export default class CTstillShowZeroSum extends BaseAttr {
		private get value() {
			return this.data.config.stillShowZeroSum;
		}
		private set value(n) {
			this.data.config.stillShowZeroSum = n;
		}
	}
</script>
<style lang="scss"></style>
