<template>
	<rvue-button class="back" type="primary" icon="el-icon-back" @click="handleClick">
		{{ $t("global.back") }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Inject, Prop } from "vue-property-decorator";
	import { changeFlowState, postBackProcess } from "@/api/flowcenter";
	import FormDetailCore from "../_core/FormDetailCore";
	import { updateData } from "@/api/form";

	@Component
	export default class DBtnBack extends Vue {
		static readonly compName = "dbtn-back";
		@Inject() readonly conf!: TJson;
		@Prop() rvueForm!: any;
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;

		private handleClick() {
			this.$Rconfirm(<string>this.$t("formPrompt.backTitle"), "", {
				confirmButtonText: this.$t("global.confirm"),
				cancelButtonText: this.$t("global.cancel"),
				type: "warning",
			}).then((res) => {
				let { dataId } = this.conf;
				let { formCode, appCode, processId } = this.conf;
				let { taskId } = FormDetailCore.ins().resMap.formConfResp;
				this.rvueForm.submit().then(({ valid, form }: any) => {
					if (!valid) {
						return;
					}
					updateData(appCode, formCode, dataId, form).then((resp: TJson) => {
						postBackProcess({
							formDataJson: form,
							processId,
						}).then((res) => {
							this.$emit("close");
						});
					});
				});
			});
		}
	}
</script>
<style lang="scss" scoped>
	.back {
		background-color: #f0aa00 !important;
		border-color: #f0aa00 !important;
	}
</style>
