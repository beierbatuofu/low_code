<template>
	<div>
		<div class="flow-tip">
			<div class="edition">
				<rvue-dropdown @command="handleCommand">
					<span class="el-dropdown-link">
						<div v-if="flowList.length > 0">
							<span style="color: #333">{{ $l("flow.version") }}</span>
							<span style="color: #f0ad4e; font-size: 12px" v-if="defineFlow.definitionVersion">(V{{ defineFlow.definitionVersion }})</span>
							<span v-if="defineFlow.inUse" class="current">{{ $l("flow.application") }}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</div>
					</span>

					<rvue-dropdown-menu slot="dropdown">
						<div style="max-height: 300px; overflow: auto">
							<rvue-dropdown-item :command="item" v-for="(item, index) in flowList" :key="index">
								{{ $l("flow.version") }}
								<span style="color: #f0ad4e; font-size: 12px">(V{{ item.definitionVersion }})</span>
								<span class="current" v-if="item.inUse">{{ $l("flow.application") }}</span>
								<span class="old-apply" v-else-if="item.doStarted">({{ $l("flow.history") }})</span>
								<span class="old-apply" v-else>({{ $l("flow.unused") }})</span>
							</rvue-dropdown-item>
							<rvue-dropdown-item command="null"> <i class="el-icon-setting"></i>{{ $l("flow.versionManage") }} </rvue-dropdown-item>
						</div>
					</rvue-dropdown-menu>
				</rvue-dropdown>
			</div>
			<div class="menu">
				<rvue-button class="newflow" plain @click="handleCreateFlow">{{ $l("global.addNewFlow") }}</rvue-button>
				<rvue-button class="save" @click="handleSave">{{ $l("global.save") }}</rvue-button>
				<rvue-button class="apply" type="primary" @click="bindMakeFlow" v-if="!defineFlow.inUse">{{ $l("global.apply") }}</rvue-button>
			</div>
		</div>
		<flow-manage
			ref="flowManage"
			@updateDel="handleAfterDel"
			@updateMake="handleAfterMake"
			@create="handleAfterCreate"
			@updateEdit="handleAfterEdit"
			:dialogVisible.sync="dialogVisible"
			:flowList="flowList"
		></flow-manage>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Prop, Watch, Emit, PropSync } from "vue-property-decorator";
	import { saveOrUpdate, changeFlowStatus, postUseProcess, getProcessList, postEnableDefinition } from "@/api/flow";
	import FlowManage, { TFlowStruct } from "./_components/flowManage.vue";
	import FlowJsonConverter from "./FlowJsonConverter";

	@Component({
		components: {
			"flow-manage": FlowManage,
		},
	})
	export default class FlowTip extends Vue {
		@Prop({ type: Array, default: () => [] }) data!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) defineFlow!: TFlowStruct;
		@Prop({ type: Array, default: () => [] }) flowList!: Record<string, any>[];

		private dialogVisible: boolean = false;
		private checkResult: Record<string, any> = {};

		// dialog 创建新流程
		private handleAfterCreate() {
			this.handleCreateFlow();
		}

		//dialog 删除流程
		private handleAfterDel(data: TFlowStruct) {
			this.$emit("updateList", data.definitionId == this.defineFlow.definitionId);
		}

		//创建新流程
		private handleCreateFlow() {
			this.changeFlowBefore()
				.then(() => {
					this.postSaveFlow().then((res: any) => {
						if (res) {
							this.createFlow();
						}
					});
				})
				.catch(() => {
					this.createFlow();
				})
				.finally(() => {
					this.dialogVisible = false;
				});
		}
		/**
		 * @description:创建新流程
		 */
		public createFlow() {
			postUseProcess(this.$route.params.appCode, this.$route.params.id).then((res: TResponse) => {
				this.$emit("updateFlowData", { structure: res.data.structure, inUse: false, add: true, settings: null });
			});
		}
		/**
		 * @description:流程改变
		 */
		private changeFlowBefore() {
			return <Promise<void>>new Promise((resolve, reject) => {
				let check = (<Record<"checkSame", (n: any[], o: any[]) => boolean> & Vue>this.$parent).checkSame(this.data, JSON.parse(this.defineFlow.structure || "{}"));
				if (!check) {
					reject();
					return;
				}

				this.$confirm("是否保存当前流程", "提示", {
					confirmButtonText: "保存并继续",
					cancelButtonText: "不保存",
					type: "warning",
					distinguishCancelAndClose: true,
				})
					.then(() => {
						resolve();
					})
					.catch((action: string) => {
						if (action == "cancel") {
							reject();
						}
					});
			});
		}

		//删除报错节点
		private removeCheck() {
			this.checkResult = {};
		}

		//检查流程节点自定义属性
		private checkFlowData(list: Record<string, any>[]): boolean {
			return list.some((node: Record<string, any>) => {
				if (node.id == "end" || node.id == "start") {
					return false;
				}
				if (node.type == "node") {
					if ((!node.data.assigneeList || node.data.assigneeList.length == 0) && (!node.data.dynamic || node.data.dynamic.length == 0)) {
						this.checkResult = node;

						return true;
					}
					return false;
				}
				if (node.type == "condition") {
					// if (Object.keys(node.data).length == 0) {
					// 	this.checkResult = node;
					// 	return true;
					// }
					// return false;
					return this.checkFlowData(node.children);
				}

				if (node.type == "branch") {
					return this.checkFlowData(node.children);
				}

				return false;
			});
		}

		private handleSave() {
			this.postSaveFlow().then((data) => {
				if (data) {
					this.$emit("updateFlowData", data);
					//this.$emit("updateList");
				}
			});
		}

		/**
		 * @description: 保存流程请求
		 */
		private postSaveFlow(): Promise<undefined | TFlowStruct> {
			let { inUse, id, doStarted, settings } = this.defineFlow;

			let { id: formCode, appCode } = this.$route.params;
			let lang = window.localStorage.getItem("lang") || "zh";
			let definitionId = this.defineFlow.definitionId || this.defineFlow.id;
			this.removeCheck();
			this.checkFlowData(this.data);

			if (Object.keys(this.checkResult).length) {
				let msg = "";
				if (this.checkResult.type == "node") {
					msg = `无法保存,${this.checkResult.title[lang]}没有设置负责人`;
				}
				if (this.checkResult.type == "condition") {
					msg = `无法保存,分支条件没有设置`;
				}
				this.$notify.error({
					title: "",
					message: msg,
				});
				return Promise.resolve(undefined);
			}

			let result = FlowJsonConverter.convert(this.data);

			return saveOrUpdate({
				appCode,
				formCode,
				inUse,
				definitionId,
				jsonNodeList: this.data,
				settings,
				...result,
			}).then((resp) => {
				this.$Rmessage({
					message: "保存成功",
					type: "success",
				});
				this.$emit("updateList");
				return Promise.resolve({
					...resp.data,
					doStarted,
				});
			});
		}

		//启用流程请求
		private postDefinition(data: TFlowStruct) {
			let definitionId = data.definitionId || data.id;
			let { id: formCode, appCode } = this.$route.params;
			postEnableDefinition(appCode, formCode, definitionId).then((resp) => {
				this.$emit("updateList", true);
			});
		}

		//dialog 启用流程
		private handleAfterMake(data: TFlowStruct) {
			this.postSaveFlow().then((res) => {
				this.dialogVisible = false;
				this.postDefinition(data);
			});
		}

		//启用流程
		private bindMakeFlow() {
			this.postSaveFlow().then((data) => {
				data && this.postDefinition(data);
			});
		}

		//选择流程
		private handleCommand(command: TFlowStruct | "null") {
			if (command == "null") {
				return (this.dialogVisible = true);
			}
			this.changeFlowBefore()
				.then(() => {
					this.postSaveFlow();
				})
				.catch(() => {})
				.finally(() => {
					this.$emit("updateFlowData", command);
				});
		}

		//dialog 编辑流程
		private handleAfterEdit(data: TFlowStruct) {
			this.changeFlowBefore()
				.then(() => {
					this.postSaveFlow().then((res) => {
						res && this.$emit("updateFlowData", data);
					});
				})
				.catch(() => {
					this.$emit("updateFlowData", data);
				})
				.finally(() => {
					this.dialogVisible = false;
				});
		}
	}
</script>

<style lang="scss" scoped>
	.flow {
		&-tip {
			height: 40px;
			box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
			z-index: 2;
			position: fixed;
			top: 57px;
			left: 0;
			right: 0;
			background: #fff;
			padding: 0 10px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.newflow {
				background: transparent;
				height: 30px;
				line-height: 30px;
				padding: 0 20px;
			}
			i {
				color: $color;
				margin-right: 5px;
			}

			.tip {
				line-height: 40px;
				font-size: 14px;
				float: left;
			}
			.menu {
				float: right;
				padding: 5px 0;
			}
			.apply {
				height: 30px;
				line-height: 30px;
				padding: 0 20px;
				color: #fff;
			}
			.save {
				height: 30px;
				line-height: 30px;
				padding: 0 20px;
			}
			.edition {
				display: inline-block;
				font-size: 14px;
				margin-right: 20px;
			}
		}
	}
	.current {
		color: #0db3a6;
		border-color: #0db3a6;
		background: rgba(13, 179, 166, 0.1);
		padding: 5px;
		display: inline-block;
		border-radius: 3px;
		font-size: 12px;
		line-height: 1;
		margin-left: 5px;
	}
	.old-apply {
		color: #999;
		font-size: 12px;
	}
</style>
