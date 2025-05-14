<!--
 * @Author: ben
 * @LastEditTime: 2022-06-21 10:56:01
-->
<template>
	<div class="flow">
		<flow-top
			ref="flowTop"
			@updateDefineFlow="updateDefineFlow"
			@updateFlowData="updateFlowData"
			:data="data"
			:defineFlow="defineFlow"
			:flowList="flowList"
			@updateList="updateProcessList"
		></flow-top>

		<div class="flow-wrapper">
			<div class="flow-setting el-icon-setting" @click="isGlobalSetting = true"></div>
			<rvue-flow class="rvue-flow" ref="flow" :readonly="readonly" :defaultData="defaultData" @select="handleFlowSelect" @change="handleFlowChange">
				<div slot="cond" slot-scope="scope">
					<div v-for="(group, gIdx) in scope.data.matchRules" class="cond-group">
						<div v-for="(row, rIdx) in group" class="cond-row">
							<div>{{ fieldName(row) }}</div>
							<div class="m">{{ $t(`formDesign.${row.method}`) }}</div>
							<div class="v">{{ judgeValues(row) }}</div>
						</div>

						<div v-if="gIdx != scope.data.matchRules.length - 1" style="padding: 3px 10px; font-weight: 500">或</div>
					</div>
				</div>
			</rvue-flow>
		</div>
		<rvue-drawer :visible.sync="drawer" size="400px">
			<node-attr :data="data" :defineFlow="defineFlow" v-if="nodeConf.type == 'node'" :nodeConf="nodeConf" :key="timestamp"></node-attr>
		</rvue-drawer>
		<rvue-dialog :title="$t('newflow.datafilter')" :visible.sync="dialog" width="1000px">
			<flow-cond :nodeConf="nodeConf" :defineFlow="defineFlow" :key="timestamp" v-if="nodeConf.type == 'condition'" @close="dialog = false"></flow-cond>
		</rvue-dialog>
		<rvue-drawer :visible.sync="isGlobalSetting" size="400px">
			<flow-settings :settings="defineFlow.settings" v-if="isGlobalSetting" @change="updateSetting"></flow-settings>
		</rvue-drawer>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, Prop, Provide } from "vue-property-decorator";
	import rvueFlow from "@/components/rvue/custom/packages/flow/flow.vue";
	import NodeAttr from "./attr.vue";
	import FlowTop from "./top.vue";
	import FlowCond from "./cond.vue";
	import FlowSettings from "./settings.vue";
	import { saveOrUpdate, getProcessList } from "@/api/flow";
	import { getFormSingle } from "@/api/form";
	import { clearTimeout, setTimeout } from "timers";
	import { refreshJump } from "@/utils/global";
	import { FormModule } from "@/store/modules/form";

	@Component({
		components: {
			"rvue-flow": rvueFlow,
			"flow-top": FlowTop,
			"node-attr": NodeAttr,
			"flow-cond": FlowCond,
			"flow-settings": FlowSettings,
		},
	})
	export default class Flow extends Vue {
		@Prop({ type: Object, default: () => ({}) }) callbacks!: Record<string, any>;

		@Provide("flowJSON") flowJSON: Record<string, any> = {
			configList: [],
			copyMatchRules: [],
		};
		private defineFlow: Record<string, any> = {};

		private data: Record<string, any>[] = [];
		private flowList: Record<string, any>[] = [];
		private drawer: boolean = false;
		private nodeConf: Record<string, any> = {};
		private dialog = false;
		private timestamp = 1;
		private readonly = false;
		private oldFlowId = "";
		private newFlowId = "";
		private oldSettings: Record<string, any> = Object.create(null);
		private notifyTimeout: any = null;
		private isGlobalSetting: boolean = false;

		private updateDefineFlow(data: Record<string, any>) {
			this.defineFlow = data;
		}

		private updateSetting(data: Record<string, any>) {
			this.defineFlow.settings = data;
		}

		private get defaultData() {
			return this.defineFlow?.structure ? JSON.parse(this.defineFlow.structure) : [];
		}

		private updateFlowData(flowData: Record<string, any>) {
			//TODO 当前没判断
			const loading = this.$loading({
				lock: true,
				text: "Loading",
				spinner: "el-icon-loading",
				background: "rgba(0, 0, 0, 0.7)",
			});
			console.log(flowData, "flowData");
			setTimeout(() => {
				loading.close();
				this.oldSettings = JSON.parse(JSON.stringify(flowData?.settings));
				this.defineFlow = flowData;
				this.newFlowId = flowData?.id;
				!flowData.add && (this.oldFlowId = flowData.id);
				this.readonly = flowData.doStarted ?? flowData.inUse;
			}, 300);
		}

		private fieldName(row: Record<string, any>) {
			let lang = localStorage.getItem("lang") || "zh";
			let configList = this.flowJSON.configList;

			if (row.parentSubFormTargetFieldCode) {
				let tableConf = this.flowJSON.configList.find((item: Record<string, any>) => item.fieldId == row.parentSubFormTargetFieldCode);
				configList = tableConf?.children || [];
			}

			let widgetConf = configList.find((item: Record<string, any>) => item.fieldId == row.targetFieldCode);
			if (!widgetConf) return "已删除";
			return widgetConf?.title[lang] || "";
		}

		private judgeValues(row: Record<string, any>) {
			let value = row.judgeValues;

			if (row.type == "datetime") {
				return value.join("~");
			}

			if (typeof value[0] == "string" || typeof value[0] == "number") return String(value);

			if (row.type == "number" && row.method == "between") {
				const precision = ".00";
				let min = String(value[0][0]).includes(".") ? String(value[0][0]) : value[0][0] + precision;
				let max = String(value[0][1]).includes(".") ? String(value[0][1]) : value[0][1] + precision;

				if ((value[0][0] != 0 && !value[0][0]) || value[0][0] == "undefined") {
					return "≤" + max;
				}
				if ((value[0][1] != 0 && !value[0][1]) || value[0][1] == "undefined") {
					return "≥" + min;
				}

				return min + "~" + max;
			}

			if (Array.isArray(value)) {
				let names: string[] = [];
				value.forEach((item: Record<string, any>) => names.push(item.name));
				return String(names);
			}
		}

		private handleFlowSelect(nodeConf: Record<string, any>) {
			this.nodeConf = nodeConf;
			this.timestamp++;
			if (nodeConf.type == "node") {
				this.handelAddNew(nodeConf);
				return (this.drawer = true);
			}
			if ((nodeConf.type = "condition")) {
				let timeout = 2000;
				if (!!this.defineFlow.doStarted) {
					if (!!this.notifyTimeout) return;
					this.$notify({
						title: "警告",
						message: "启用中或者启用过的流程无法修改分支条件",
						type: "warning",
						duration: timeout,
					});
					this.notifyTimeout = setTimeout(() => {
						clearTimeout(this.notifyTimeout);
						this.notifyTimeout = null;
					}, timeout);

					return;
				}

				return (this.dialog = true);
			}
		}

		private handleFlowChange(data: Record<string, any>[]) {
			this.data = data;
		}

		private handelAddNew(nodeConf: Record<string, any>) {
			!nodeConf.data.hasOwnProperty("permission") && this.$set(nodeConf.data, "permission", []);
			let perm = nodeConf.data.permission;
			let list: TJson[] = [];

			this.flowJSON.configList.forEach((item: Record<string, any>, idx: number) => {
				let nodePerm = nodeConf.data.permission.find((ite: Record<string, any>) => ite.fieldId == item.fieldId) || {
					isView: true,
					isEdit: true,
					fieldId: item.fieldId,
					type: item.type,
				};
				list.push(nodePerm);

				// this.$set(nodeConf.data.permission, idx, {
				// 	isView: perm[idx]?.isView ?? true,
				// 	isEdit: perm[idx]?.isEdit ?? true,
				// 	fieldId: item.fieldId,
				// 	type: item.type,
				// });
			});

			nodeConf.data.permission = list;
		}

		private updateProcessList(isUpdateinUser: boolean = false): Promise<Record<"list" | "define", any>> {
			let { id: formCode, appCode } = this.$route.params;
			return new Promise((resolve, reject) => {
				getProcessList(appCode, formCode).then((resp: TResponse) => {
					let list = resp.data;
					let define = list.find((f: Record<"inUse", boolean>) => f.inUse);
					this.flowList = list;

					if (isUpdateinUser && define) {
						this.oldSettings = JSON.parse(JSON.stringify(define.settings));
						this.defineFlow = define;
						this.readonly = define.inUse;
						this.newFlowId = this.oldFlowId = define.id;
					}
					resolve({
						list,
						define,
					});
				});
			});
		}

		private checkSame(newlist: Record<string, any>[], oldlist: Record<string, any>[]): boolean {
			if (this.oldSettings != this.defineFlow.settings) {
				try {
					if (!Object.keys(this.oldSettings).some((key: string) => this.oldSettings[key] == this.defineFlow.settings[key])) return true;
				} catch (err) {
					return true;
				}
			}

			if (newlist.length != oldlist.length) return true;

			return newlist.some((node: Record<string, any>) => {
				let { id } = node;
				let old = oldlist.find((item: Record<string, any>) => item.id == id);
				if (!old) return true;
				return JSON.stringify(node) != JSON.stringify(old);
			});
		}

		protected mounted() {
			let { id: formCode, appCode } = this.$route.params;
			this.updateProcessList(true);
			getFormSingle(appCode, formCode).then((resp: TResponse) => {
				// const { structure, name, type } = resp.data;

				// FormModule.setForm({
				// 	options: structure,
				// 	name,
				// 	type,
				// 	curFormType: type,
				// });
				let configlist = resp.data?.structure?.configList.filter((item: Record<string, any>) => !["tab"].includes(item.type)) || [];

				configlist.forEach((item: Record<string, any>) => {
					console.log(item.type, "item.type");
					if (item.type == "table") {
						item.children.forEach((ite: Record<string, any>) => {
							Object.keys(ite.title).forEach((key: string) => {
								ite.title[key] = item.title[key] + "-" + ite.title[key];
							});
						});
					}
				});

				this.flowJSON.configList = configlist;
			});

			this.callbacks["tab"] = (success: () => any = () => {}) => {
				if (!this.defineFlow) return success();

				let checkSame = this.checkSame(this.data, JSON.parse(this.defineFlow.structure || "{}"));
				if (checkSame) {
					let fullPath = this.$route.fullPath;
					let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd/"));
					let jumpPath = supPath + "appd/" + this.$route.params.appCode + "/p/";
					refreshJump(fullPath, this, jumpPath);
				}

				if (!checkSame && this.newFlowId == this.oldFlowId) {
					return success();
				}
				this.$Rconfirm("是否保存当前流程设计", "", {
					confirmButtonText: this.$t("global.save"),
					cancelButtonText: this.$t("global.notSave"),
					type: "warning",
					closeOnClickModal: false,
				})
					.then(() => {
						(<Vue & { handleSave: (opt: boolean) => Promise<any> }>this.$refs.flowTop).handleSave(false).then(() => {
							success();
						});
					})
					.catch(() => {
						success();
					});
			};
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-drawer__header {
			padding: 0px;
			margin-bottom: 0px;
		}
	}
	.flow-setting {
		position: fixed;
		z-index: 11;
		right: 20px;
		top: 110px;
		font-size: 20px;
		border-radius: 4px;
		background: #fff;
		border-radius: 3px;
		text-align: center;
		color: #acb3bd;
		box-shadow: 1px 1px 5px 0px rgb(182 182 182 / 60%);
		width: 32px;
		height: 32px;
		line-height: 32px;
		text-align: center;
	}
	.cond-group {
		padding: 5px;
		color: #333;
		font-weight: bold;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.cond-row {
		padding: 2px 5px;
		background: #f4f6f9;
		text-align: justify;
		word-break: break-all;
		& > div {
			display: inline;
			font-size: 13px;
		}
		.m {
			padding: 0 5px;
			color: #a9a9a9;
		}
	}
	.rvue-flow {
		flex: 1;
	}
	.flow {
		width: 100%;

		font-size: 14px;
		position: relative;
		overflow: auto;
		&-wrapper {
			position: relative;
			min-width: min-content;
			margin-top: 0px;
			width: 100%;
			height: calc(100vh - 57px);
			padding-top: 40px;
		}
		.show-table {
			border: 1px solid #ececec;

			&-col {
				background: #ececec;

				padding: 5px;
				span {
					padding: 0 3px;
					&:nth-child(2) {
						color: #999;
					}
				}
			}
			&-row {
				&:after {
					content: "或";
					display: block;
					padding: 5px;
				}
				&:last-child {
					margin-bottom: 0;
					&:after {
						content: "";
						display: none;
					}
				}
			}
		}

		&-name {
			position: fixed;
			top: 0;
			left: 60px;
			width: 120px;
			border-bottom: 1px dotted #333;
			z-index: 99;
			input {
				border: none;
			}
		}

		&-canvas {
			flex: 1;
			height: calc(100vh - 125px) !important;
			margin-top: 81px;

			position: relative;
			// background: url('../../assets/bk-parttern.png');
		}
	}

	.node-action {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
		background: #fff;
		padding: 10px;
		overflow: auto;

		.title {
			font-weight: bold;
			position: relative;
		}

		.switch {
			position: absolute;
			top: 0;
			right: 0;
		}
		.item {
			margin-bottom: 10px;
		}
	}
	.flow-condition-body {
		.tags-list {
			min-height: 45px;
			line-height: 45px;
			margin: 0;
		}
	}

	.filter-col {
		.flow-condition-head {
			vertical-align: top;
		}
	}
</style>
