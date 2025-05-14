<template>
	<rvue-button type="primary" icon="el-icon-check" @click="handleClick">
		{{ $t("global.pass") }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Inject } from "vue-property-decorator";
	import { updateData } from "@/api/form";
	import { changeFlowState, postPassProcess } from "@/api/flowcenter";
	import FormDetailCore from "../_core/FormDetailCore";

	@Component
	export default class DetailPass extends Vue {
		static readonly compName = "dbtn-pass";
		@Prop({ type: Object, default: () => ({}) }) form!: TJson;
		@Inject() readonly conf!: TJson;
		@Prop() rvueForm!: any;

		private handleClick() {
			let { formCode, appCode, dataId, processId } = this.conf;
			let { taskId } = FormDetailCore.ins().resMap.formConfResp;

			this.rvueForm.submit().then(({ valid, form }: any) => {
				if (!valid) {
					return;
				}
				updateData(appCode, formCode, dataId, form).then((resp: TJson) => {
					postPassProcess({ formDataJson: form, processId }).then((res) => {
						this.$Rmessage({
							message: this.$t("formPrompt.pass"),
							type: "success",
						});
						this.$emit("close");
					});
				});
			});
		}
	}
</script>
