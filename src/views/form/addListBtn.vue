<template>
	<div>
		<div class="addListTitle">{{ formName }}</div>
		<div v-if="Object.keys(option).length" id="form" style="overflow: auto; height: calc(100vh - 59px)">
			<rvue-form-box formType="add" :option="option" ref="rvueForm" :form="addForm" :key="reloadFormKey" mode="normal">
				<input type="hidden" :value="reloadFormKey" id="formTimeStamp" />
				<template v-slot:menu>
					<div class="footer">
						<el-button size="small" class="bottomBtn" type="primary" @click="addSubmit(1)">{{ $t("flow.submit") }}</el-button>
						<!-- <el-button size="small" @click="addSubmit(0)" v-if="flowType == 'F'">{{ $t("global.TS") }}</el-button> -->
					</div>
				</template>
			</rvue-form-box>
		</div>
		<!-- <js-code
			:key="reloadFormKey"
			:option="{
				...jsOptions,
				selects,
			}"
			source="query"
			v-if="Object.keys(jsOptions).length"
			ref="jscode"
		></js-code> -->
	</div>
</template>
<script lang="ts">
	import { Component, Emit, Vue, Watch, Prop, PropSync, Provide } from "vue-property-decorator";
	import { getQueryConf, postAddTabelList, changeFlowState, getMyDraft } from "@/api/flowcenter";
	import { getFormSingle, getData, saveData, updateData, getFormSingleTest } from "@/api/form";
	import dataFilter from "@/core/dataFilter";
	import RuleConfig from "@/components/rvue/custom/packages/form/RuleConfig.ts";
	import Jscode from "@/components/jscode/jscode";

	let queryData: any;
	@Component({
		components: {
			"js-code": Jscode,
		},
	})
	export default class addListB extends Vue {
		@Provide() formCode = this.$route.params.formCode;
		@Provide() appCode = this.$route.params.appCode;
		private option: any = {};
		private addDialogVisible: boolean = false;
		private formName: string = "";
		private flowType: string = "";
		private loading: boolean = true;
		private jsOptions: Record<string, any> = {};
		private selects: Record<string, any>[] = [];
		private tableList: any = {};
		private addForm = {};
		private reloadFormKey = 1;
		private timeout: any = null;
		private filterRule: any = { isDeleted: false, matchRules: [[]], createTimeBegin: "", createTimeEnd: "", creater: "", sorts: [{ asc: false, column: "create_time" }] };
		protected async load() {
			let formCode = this.$route.params.formCode;
			let appCode = this.$route.params.appCode;
			//getFormSingle换

			getFormSingle(appCode, formCode).then((resp: Record<string, any>) => {
				//仪表盘
				let { name, type, structure, dstructure } = resp.data;
				this.formName = name;
				this.flowType = type;

				this.option = {
					...structure,
					configList: structure && this.$utils.deepClone(dstructure.configList),
				};

				this.jsOptions = structure || {};

				this.filterRule["sorts"] = [
					{
						column: this.tableList.sortCondition,
						asc: this.tableList.sortOrder === "asc",
					},
				];
				this.reloadFormKey++;
			});
		}

		private addSubmit(num: number, success: () => void) {
			if (this.timeout != null) return;
			//提交表单
			(<any>this).$refs.rvueForm?.submit().then(({ valid, form }: any) => {
				if (!valid) {
					return;
				}
				let formCode = this.$route.params.formCode;
				let appCode = this.$route.params.appCode;
				postAddTabelList(appCode, formCode, form)
					.then((resp: TResponse) => {
						if (resp.code == 0) {
							this.nextStep(resp.data, num);
						}
					})
					.catch((err) => {
						if (err.code == "FM-FORM_ADD_NO_SAME_VAL") {
							let rules = new RuleConfig();
							rules.notSame(err, this);
						} else {
							this.$message({
								message: err.msg,
								type: "warning",
							});
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
				// this.addDialogVisible = false;
			});
		}
		private updateTable() {
			return true;
		}

		@Watch("option", { immediate: true })
		private watchOption() {
			this.$nextTick(() => {
				this.$refs.rvueForm && (<any>this).$refs.rvueForm.resetAllReadonly();
			});
		}

		@Watch("$route", { immediate: true })
		private watchRoute() {
			console.log("watch router");
			this.load();
		}
	}
</script>

<style lang="scss" scoped>
	.addListTitle {
		color: #fff;
		background-color: #4c81ff;
		font-size: 26px;
		text-align: center;
		padding: 10px;
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
