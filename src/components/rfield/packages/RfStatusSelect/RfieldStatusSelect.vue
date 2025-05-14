<template>
	<div class="rvue-form-group">
		<rvue-select-group :options="dicData" @change="handleChanges" v-model="select" :props="'value'" :disabled="disabled" :config="config"></rvue-select-group>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import { queryConf } from "./_core/RfStatusSelect.ts";

	@Component
	export default class RvueFieldSelect extends WidgetField {
		private get dicData() {
			let query = new queryConf();

			return query.fieldConf.dicData;
		}

		private get select() {
			return this.value;
		}

		private set select(n: any) {
			(<any>this).value = n;
		}

		private handleChanges(val: any) {
			(<any>this).select = val;

			this.handleUpdate(val);
			this.handleChange(val);
		}
	}
</script>
<style lang="scss">
	// .sel-options {
	//   min-width: 30% !important;
	// }
</style>
