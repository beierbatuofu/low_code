<template>
	<!-- <rvue-button class="ts" type="primary" icon="el-icon-folder-checked" @click="handleClick">
		{{ $t("global.TS") }}
	</rvue-button> -->
	<div></div>
</template>
<script lang="ts">
	import { Vue, Component, Inject, Prop } from "vue-property-decorator";
	import { updateData } from "@/api/form";
	import { changeFlowState } from "@/api/flowcenter";
	import FormDetailCore from "../_core/FormDetailCore";

	@Component
	export default class DetailTs extends Vue {
		static readonly compName = "dbtn-ts";
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;
		@Inject() readonly conf!: TJson;
		@Prop() rvueForm!: any;

		private handleClick() {
			let { dataId } = this.conf;
			let { formCode, appCode } = this.conf;
			let { taskId } = FormDetailCore.ins().resMap.formConfResp;
			this.rvueForm.submit().then(({ valid, form }: any) => {
				if (!valid) {
					return;
				}
				updateData(appCode, formCode, dataId, form).then((resp: TJson) => {
					changeFlowState({
						dataId,
						formCode,
						message: "暂存",
						status: 4,
						taskId,
					}).then((res) => {
						this.$emit("close");
						this.$Rmessage({
							message: this.$t("formPrompt.ts"),
							type: "success",
						});
					});
				});
			});
		}
	}
</script>
<style lang="scss" scoped>
	.ts {
		color: #6087fd !important;
		border-color: #6087fd !important;
		background-color: #fff !important;
	}
</style>
