<template>
	<div class="rvue-form-group">
		<rvue-select-group
			:placeholder="tableProp && mode == 'design' ? '请选择' : '请选择'"
			:options="selectOptions"
			@change="handleChanges"
			:readonly="readonly"
			v-model="select"
			:disabled="disabled"
			:config="config"
			:filterable="filterable"
		></rvue-select-group>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfSelect.ts";
	import { getLinkExistingData } from "@/api/form";
	import { clearTimeout } from "timers";

	@Component
	export default class RvueFieldSelect extends WidgetField {
		private filterable = false;
		public static timeout: null | number = null;

		private get select() {
			if (this.config.type == "uploadFile") {
				return this.config.linkVal;
			} else {
				return this.value;
			}
		}

		private get selectOptions() {
			if (this.config.type == "relation") {
				return [];
			}

			return this.config.dicData;
		}

		private set selectOptions(list: Record<string, any>[]) {
			this.config.dicData = list;
		}

		protected created() {
			if (this.config.type == "uploadFile") {
				this.selectOptions = this.config.link;
			} else if (this.config?.rely?.type == "otherFormData") {
				//TODO 少接口 formCode appCode fieldId 查询字段数据--4.21更新接口完善
				let { appCode, formCode, fieldId, matchRules } = this.config.rely.relation;

				if (!formCode || !fieldId) return;

				let data = { appCode, formCode, fieldId, matchRules };

				if (!RvueFieldSelect.timeout) {
					this.selectOptions = [];
					getLinkExistingData(appCode, formCode, fieldId, data).then((resp: Record<string, any>) => {
						resp.data.forEach((v: string) => {
							this.selectOptions.push({ label: v, value: v });
						});
					});
					RvueFieldSelect.timeout = window.setTimeout(() => (RvueFieldSelect.timeout = null));
				}

				this.filterable = true;
			} else {
				this.selectOptions = this.config.dicData;
			}
		}

		private set select(n: any) {
			if (this.config.type == "uploadFile") {
				this.config.linkVal = n;
			} else {
				this.value = n;
			}
		}

		private handleChanges(val: any) {
			(<any>this).select = val;
			this.value = val;
			this.handleUpdate(val);
		}
	}
</script>
<style lang="scss" scoped>
	// .sel-options {
	//   min-width: 30% !important;
	// }
</style>
