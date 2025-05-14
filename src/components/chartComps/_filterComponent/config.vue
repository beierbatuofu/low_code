<template>
	<div class="filter-config-container">
		<rvue-label required :label="$t('global.title')" />
		<RvueLangInput class="el-form-item" :field="data.title" @change="handleChange" />
		<select-report :data="data"></select-report>
		<field-type :data="data" :filterForm="filterForm"></field-type>
		<filter-field :data="data" :filterForm="filterForm"></filter-field>
		<default-value :data="data" :filterForm="filterForm"></default-value>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, PropSync, Prop } from "vue-property-decorator";
	import SelectReport from "./_configComponent/selectReport.vue";
	import FilterField from "./_configComponent/filterField.vue";
	import FieldType from "./_configComponent/fieldType.vue";
	import DefaultValue from "./_configComponent/defaultValue.vue";
	@Component({
		components: { SelectReport, FilterField, DefaultValue, FieldType },
	})
	export default class Config extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;
		private handleChange(title: Title) {
			this.data.title = title;
		}
	}
</script>

<style lang="scss" socped>
	.filter-config-container {
		height: 88vh;
		overflow: scroll;
		padding-right: 15px;
	}
	.widget-config-label {
		color: #565d2d;
		font-weight: bold;
		margin-bottom: 8px;
	}
</style>
