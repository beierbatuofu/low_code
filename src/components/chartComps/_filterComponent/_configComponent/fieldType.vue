<template>
	<div class="field-type-container">
		<rvue-label required :label="$t('chartDesign.ft')" />
		<rvue-select :disabled="getDisableHandler" v-model="fieldType" clearable @change="handleChange">
			<rvue-option :label="getName(item.title)" :value="item.type" v-for="item in configList" :key="item.type"></rvue-option>
		</rvue-select>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import configList from "./_core/configList";
	@Component({
		components: {},
	})
	export default class FilterField extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: Object, default: () => {} }) filterForm!: any;
		private configList = configList;

		private get fieldType() {
			return this.data.config.fieldType;
		}
		private set fieldType(n: string) {
			this.data.config.checkedReports.map((item: any) => {
				item.selectField = "";
			});
			this.$set(this.data.config, "fieldType", n);
		}
		//是否不能选
		private get getDisableHandler() {
			return this.data.config?.checkedReports && this.data.config?.checkedReports.length == 0;
		}
		//切换类型改变名字
		private handleChange() {
			this.configList.map((item: any) => {
				if (item.type == this.fieldType) {
					this.$set(this.data.config, "fieldName", item.title[<string>localStorage.getItem("lang")]);
				}
			});
			//清空默认值
			this.data.config.selectDefaultMethod = "";
			for (const key in this.filterForm) {
				this.$delete(this.filterForm, key);
			}
		}
		//每个option的label
		private getName(name: Record<string, any>) {
			return name[<string>localStorage.getItem("lang")];
		}
	}
</script>

<style lang="scss" scoped>
	.field-type-container {
		margin-bottom: 30px;
	}
</style>
