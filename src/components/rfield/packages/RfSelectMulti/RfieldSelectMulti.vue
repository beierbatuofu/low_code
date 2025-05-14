<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:02:12
-->
<template>
	<div class="rvue-form-group">
		<rvue-selectMulti
			:placeholder="tableProp && mode == 'design' ? '请选择' : '请选择'"
			:readonly="readonly"
			:options="selectOptions"
			@change="handleChanges"
			v-model="select"
			:disabled="disabled"
			:allowCreate="allowCreate"
		></rvue-selectMulti>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfSelectMulti.ts";
	import { getLinkExistingData } from "@/api/form";

	@Component
	export default class RvueFieldSelectMulti extends WidgetField {
		public static timeout: null | number = null;
		private oldCustom = [];
		private get allowCreate() {
			let allowCreate = this.config.allowCreate || false;
			return allowCreate;
		}

		private get select() {
			let value = this.value || [];
			if (typeof value == "string") {
				value = JSON.parse(value);
			}
			return value;
		}

		private set select(val: any) {
			(<any>this).value = val;
		}

		private handleChanges(val: any) {
			(<any>this).select = val;
			this.handleUpdate(val);
		}

		private get selectOptions() {
			//TODO relation 清除dicData
			if (this.config?.rely?.type == "relation") {
				return [];
			}
			return this.config.dicData;
		}

		private set selectOptions(list: Record<string, any>[]) {
			this.config.dicData = list;
		}

		protected created() {
			//this.selectOptions=this.config.dicData;
			//this.oldCustom=this.$utils.deepClone(this.config.dicData)
			console.log(this.config.dicData, "开始时显示");

			if (this.config?.rely?.type == "otherFormData") {
				//TODO 少接口 formCode appCode fieldId 查询字段数据--4.21更新接口完善
				let { appCode, formCode, fieldId, matchRules } = this.config.rely.relation;

				let data = { appCode, formCode, fieldId, matchRules };
				if (!formCode || !fieldId) return;
				if (!RvueFieldSelectMulti.timeout) {
					this.selectOptions = [];
					getLinkExistingData(appCode, formCode, fieldId, data).then((resp: Record<string, any>) => {
						resp.data.forEach((v: string) => {
							this.selectOptions.push({ label: v, value: v });
						});
					});
					RvueFieldSelectMulti.timeout = window.setTimeout(() => (RvueFieldSelectMulti.timeout = null));
				}
			}
		}
	}
</script>
<style lang="scss">
	@import "../../styles/index.scss";
	// .sel-options {
	//   min-width: 30% !important;
	// }
</style>
