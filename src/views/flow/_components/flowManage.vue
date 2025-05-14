<template>
	<rvue-dialog :title="$l('flow.versionManage')" :append-to-body="true" :visible.sync="syncDialogVisible" width="800px">
		<div class="flow-manage">
			<div style="padding-bottom: 10px">
				<el-button type="primary" size="small" @click="bindCreateFlow()"> <i class="el-icon-plus"></i> {{ $l("flow.addNewVersion") }} </el-button>
			</div>
			<div class="version" style="height: 500px; overflow: auto">
				<ul>
					<li class="version-item" v-for="(item, index) in flowList">
						<div class="version-head">
							{{ $l("flow.version") }}(V{{ item.definitionVersion }})
							<span class="current" v-if="item.inUse">{{ $l("flow.application") }}</span>
							<span class="old-apply" v-else-if="item.doStarted">({{ $l("flow.history") }})</span>
							<span class="old-apply" v-else>({{ $l("flow.unused") }})</span>
						</div>
						<div class="version-menu">
							<span v-if="!item.inUse" class="inuse" @click="bindMakeFlow(item)"><i class="el-icon-video-play"></i>{{ $l("global.apply") }}</span>
							<span @click="bindEdit(item)" class="edit">{{ $l("global.edit") }}</span>
							<span v-if="!item.inUse" class="del" @click="bindDel(item)">{{ $l("global.deletion") }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Component, Vue, PropSync, Prop, Emit } from "vue-property-decorator";
	import { FlowModule } from "@/store/modules/flow";
	import { postDeleteDefinition } from "@/api/flow";

	export interface TFlowStruct {
		definitionId: string;
		id: string;
		inUse: boolean;
		structure: string;
		settings: undefined | Record<string, any>;
		doStarted?: boolean;
	}

	@Component({})
	export default class extends Vue {
		@PropSync("dialogVisible", { type: Boolean, default: false }) syncDialogVisible!: boolean;
		@Prop({ type: Array, default: [] }) flowList!: Record<string, any>[];

		private bindDel(data: TFlowStruct) {
			this.$confirm("删除后，你将无法再编辑和启用此流程", "确定要删除流程吗？", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					let { definitionId } = data;

					postDeleteDefinition({ definitionIds: [definitionId] }).then((resp) => {
						this.$emit("updateDel", data);
					});
				})
				.catch(() => {});
		}

		private bindCreateFlow() {
			this.$emit("create");
		}

		private bindEdit(data: TFlowStruct) {
			this.$emit("updateEdit", data);
		}

		private bindMakeFlow(data: TFlowStruct) {
			this.$confirm("确定要启用流程吗？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.$emit("updateMake", data);
				})
				.catch(() => {});
		}
	}
</script>
<style lang="scss">
	.current {
		color: #0db3a6;
		border-color: #0db3a6;
		padding: 5px;
		display: inline-block;
		border-radius: 3px;
		font-size: 12px;
		line-height: 1;
	}
	.old-apply {
		color: #999;
		font-size: 12px;
	}
	.flow {
		&-manage {
			.version {
				&-item {
					background: #f4f6fc;
					padding: 12px;
					@include JustityAndFlexWrap(flex, space-between, center, null);
					margin-bottom: 10px;
					font-size: 14px;
				}
				&-menu {
					color: $color;
					.inuse {
						color: #0db3a6;
					}
					span {
						@include VertivalAlign(inline-block, top, null, null);
						padding: 0 10px;
						border-right: 1px solid #e0e0e0;
						&.del {
							// color: #fa1515;
						}
						&:last-child {
							border: none;
						}
					}
				}
			}
		}
	}
</style>
