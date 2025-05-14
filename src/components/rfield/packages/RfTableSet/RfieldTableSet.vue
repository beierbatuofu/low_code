<template>
	<div class="rvue-form-group">
		<rvue-select-group :options="config.dicData" @change="handleChanges" :readonly="readonly" v-model="select" :disabled="config.readonly"></rvue-select-group>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfTableSet.ts";

	@Component
	export default class RvueFieldSelect extends WidgetField {
		private get select() {
			return (<any>this).value;
		}

		private set select(n: any) {
			(<any>this).value = n;
		}

		private handleChanges(val: any) {
			(<any>this).select = val;
		}
	}
</script>
<style lang="scss">
	// .sel-options {
	//   min-width: 30% !important;
	// }
</style>
