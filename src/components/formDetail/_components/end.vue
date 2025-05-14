<template>
	<rvue-button type="danger" icon="el-icon-circle-close" @click="handleClick">
		{{ $t("global.end") }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Inject, Prop } from "vue-property-decorator";
	import { changeFlowState, postOverProcess } from "@/api/flowcenter";
	import FormDetailCore from "../_core/FormDetailCore";
	import { updateData } from "@/api/form";

	@Component
	export default class DetailEnd extends Vue {
		static readonly compName = "dbtn-end";
		@Inject() readonly conf!: TJson;
		@Prop() rvueForm!: any;
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;

		private handleClick() {
			this.$Rconfirm(<string>this.$t("formPrompt.endTitle"), "", {
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
					updateData(appCode, formCode, dataId, form).then((res: Record<string, any>) => {
						postOverProcess({
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
