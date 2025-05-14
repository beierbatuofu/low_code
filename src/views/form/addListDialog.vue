<!--
 * @Author: ben
 * @LastEditTime: 2022-05-27 11:34:57
-->
<template>
	<div class="addListDialog">
		<rvue-dialog :title="formName" class="flow-dialog" :visible.sync="addDialogVisible" :destroy-on-close="true" :fullscreen="true">
			<div class="add-form-box">
				<rvue-form-box formType="add" :option="columnConfig" ref="rvueForm" :form="addForm" :key="reloadFormKey" mode="normal">
					<template v-slot:menu>
						<div class="footer">
							<rvue-button size="small" class="bottomBtn" type="primary" @click="addSubmit(1)">{{ $t("flow.submit") }}</rvue-button>
						</div>
					</template>
				</rvue-form-box>
			</div>
		</rvue-dialog>
	</div>
</template>

<script lang="ts">
	import { Component, Emit, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
	import { postAddTabelList, changeFlowState, getMyDraft } from "@/api/flowcenter";
	import RuleConfig from "@/components/rvue/custom/packages/form/RuleConfig.ts";

	@Component({})
	export default class addDialog extends Vue {
		@PropSync("addDialog", { type: Boolean, default: false }) addDialogVisible!: boolean;
		@Prop({ type: Object, default: {} }) columnConfig!: any;
		@Prop({ type: String, default: "" }) formCode!: string;
		@Prop({ type: String, default: "" }) dataId!: string;
		@Prop({ type: String, default: "" }) appCode!: string;
		@Prop({ type: String, default: "" }) flowType!: string;
		@Prop({ type: String, default: "" }) formName!: string;

		private mockData = [];
		private addForm = {};
		private reloadFormKey = 1;
		private timeout: any = null;

		private sameEles: TJson = {};
		//添加不允许重复值样式

		private addSubmit(num: number, success: () => void = () => {}) {
			if (this.timeout != null) return;
			//提交表单
			(<any>this).$refs.rvueForm?.submit().then(({ valid, form }: any) => {
				if (!valid) {
					return;
				}
				/**
				 * 流水号字新增提交的时候 需要传rules
				 */
				if (form.hasOwnProperty("sn")) {
					let snConfig = this.columnConfig.configList.find((item: Record<string, any>) => item.type == "sn");
					let { rules } = snConfig;
					rules && (form["sn"] = JSON.stringify(rules));
				}

				postAddTabelList(this.appCode, this.formCode, form)
					.then((resp: TResponse) => {
						if (resp.code == 0) {
							this.nextStep(resp.data, num);
							success();
						}
					})
					.catch((err) => {
						if (err.code == "FM-FORM_ADD_NO_SAME_VAL") {
							let rules = new RuleConfig();
							rules.notSame(err, this);
						} else {
							// this.$message({
							// 	message: err.msg,
							// 	type: "warning",
							// });
						}
					})
					.finally(() => {
						this.timeout = setTimeout(() => {
							this.timeout = null;
						}, 1000);
					});
			});
		}

		private nextStep(dataId: string, num: number) {
			//提交--暂存
			changeFlowState({
				dataId: dataId,
				formCode: this.formCode,
				status: -1,
				startStatus: num,
				message: "",
			}).then((res) => {
				//保存成功后，流转节点
				this.$message({
					message: <string>this.$t("global.success"),
					type: "success",
				});
				this.updateTable();

				this.addDialogVisible = false;
			});
		}

		@Emit("updateTable")
		updateTable() {
			return true;
		}

		// private saveMoment() {
		// 	//暂存--新增
		// 	getMyDraft(this.appCode, this.formCode, {
		// 		appCode: this.appCode,
		// 		formCode: this.formCode,
		// 		map: deelTableData(this.addForm),
		// 		type: 0,
		// 	}).then((resp: any) => {
		// 		// console.log(resp);
		// 		if (resp.msg == "ok") {
		// 			this.addDialogVisible = false;
		// 			this.$message.success(<string>this.$t("global.success"));
		// 			this.updateTable();
		// 		}
		// 	});
		// }

		@Watch("addDialogVisible")
		onChanged() {
			this.addForm = {};
			if (this.addDialogVisible) {
				this.reloadFormKey = new Date().getTime();
				this.$nextTick(() => {
					(<any>this).$refs.rvueForm.resetForm();
					(<any>this).$refs.rvueForm.resetAllReadonly();
					(<any>this).$refs.rvueForm.load();
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-form-box {
		max-height: none !important;
		height: calc(100vh - 130px);
		padding: 0 0px 10px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	::v-deep .el-dialog__header {
		background-color: #4c81ff;
		.el-dialog__title,
		.el-dialog__headerbtn .el-dialog__close {
			color: #fff;
		}
	}
	::v-deep .el-dialog__body {
		.rvue-form {
			.el-form {
				.el-form-item__content {
					.form-item {
						font-weight: 700;
						color: #000;
					}
				}
			}
		}
	}
	::v-deep .el-dialog__body::-webkit-scrollbar {
		display: none;
	}

	.footer {
		text-align: center;
		position: fixed;
		bottom: 2px;
		left: 1px;
		right: 20px;
		background-color: rgba(255, 255, 255, 0.8);
		padding-left: 24px;
		padding-bottom: 10px;
		overflow: hidden;
		z-index: 1999;
		button {
			min-width: 92px;
			height: 40px;
		}
		.bottomBtn {
			margin-right: 2rem;
			margin-top: 10px;
		}
	}
</style>
<style lang="scss">
	.addListDialog {
		.el-dialog.is-fullscreen {
			overflow: hidden !important;
		}
	}
</style>
