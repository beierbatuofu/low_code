<template>
	<rvue-button type="primary" icon="el-icon-circle-check" @click="handleClick">
		{{ $t("global.submitted", []) }}
	</rvue-button>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Inject } from "vue-property-decorator";
	import { updateData } from "@/api/form";
	import { changeFlowState } from "@/api/flowcenter";
	import FormDetailCore from "../_core/FormDetailCore";

	@Component
	export default class DetailSubmit extends Vue {
		@Prop({ default: () => ({}) }) form!: TJson;
		@Prop() rvueForm!: any;
		@Inject() readonly conf!: TJson;
		static readonly compName = "dbtn-submit";

		private handleClick() {
			let { formCode, appCode, dataId, formType } = this.conf;
			let { taskId } = FormDetailCore.ins().resMap.formConfResp;
			// /appCode, formCode, id, data
			this.rvueForm.submit().then(({ valid, form }: any) => {
				if (!valid) {
					return;
				}

				updateData(appCode, formCode, this.conf.dataId, form)
					.then((res: TJson) => {
						this.$emit("close");
						if (formType == "C") {
							return this.$Rmessage({
								message: this.$t("formPrompt.submit"),
								type: "success",
							});
						}

						// changeFlowState({
						// 	dataId,
						// 	formCode,
						// 	message: this.$t("global.submitted", []),
						// 	status: 0,
						// 	taskId,
						// }).then((res) => {
						// 	this.$Rmessage({
						// 		message: this.$t("formPrompt.submit"),
						// 		type: "success",
						// 	});
						// 	this.$emit("close");
						// });
					})
					.catch((err: TJson) => {
						console.log(err);
						this.$emit("error", err);
					});
			});

			//
		}
	}
</script>
