<template>
	<rvue-dialog title="选择分组/应用" :visible.sync="syncDialogVisible" :append-to-body="true" :destroy-on-close="true" :close-on-press-escape="false">
		<div v-if="syncDialogVisible">
			<div class="department">
				<div class="department-top">
					<template v-for="tag in newTags">
						<el-tag :key="tag.name" closable @close="bindCloseTag(tag)" :type="tag.type" style="margin-bottom: 10px" v-if="tag.id !== '1'">
							{{ tag.name }}
						</el-tag>
					</template>
				</div>

				<department-body :tags.sync="newTags" :multiple="multiple" />
			</div>

			<span slot="footer" class="dialog-footer">
				<p style="padding: 20px 0 0; text-align: center">
					<el-button size="mini" @click="bindCancel">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="bindSave">{{ $t("crud.filter.submitBtn") }}</el-button>
				</p>
			</span>
		</div>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Component, Vue, Watch, PropSync, Provide, Prop } from "vue-property-decorator";
	import departmentBody from "./departmentBody.vue";

	@Component({
		name: "Tree",
		components: {
			departmentBody,
		},
	})
	export default class Tree extends Vue {
		@PropSync("dialogVisible", { type: Boolean, default: false }) syncDialogVisible!: boolean;
		@Prop({ type: [Array, String], default: () => [] }) defaultTags!: any;
		@Prop({ type: Boolean, default: true }) multiple!: boolean;
		@Provide("parent") parent = this;

		//存放回显部门人员数据
		private newTags: any[] = [];

		//删除tag标签方法
		private bindCloseTag(node: any) {
			let index = this.defaultTags.findIndex((d: any) => node.id == d.id);
			this.newTags.splice(index, 1);
		}

		//点击取消关闭dialog
		private bindCancel() {
			this.syncDialogVisible = false;
		}

		//点击确定关闭dialog
		private bindSave() {
			this.$emit("closeDialog", this.newTags);
			this.syncDialogVisible = false;
		}

		//监听人员回显数据
		@Watch("defaultTags")
		onChangeDfaultTagsValue(n: any, o: any) {
			this.newTags = n;
		}

		//dialogVisible true 拷贝部门人员回显数据
		@Watch("dialogVisible")
		onChangeDialogVisible(n: boolean) {
			n && (this.newTags = JSON.parse(JSON.stringify(this.defaultTags)));
		}
	}
</script>
<style lang="scss" scoped>
	.el-dialog {
		min-width: 320px !important;
	}
	.department {
		&-top {
			min-height: 80px;
			border: 1px solid #e0e0e0;
			margin-bottom: 10px;
			overflow: auto;
			padding: 5px 10px;
			box-sizing: border-box;
			overflow: auto;
			.el-tag {
				margin-right: 10px;
			}
		}
		&-body {
			border: 1px solid #e0e0e0;
			.el-tabs__item {
				padding: 0 10px;
			}
			.el-tabs__nav-scroll {
				padding: 0 10px;
			}
			.el-tabs__active-bar {
				background: $color;
			}
			.member {
				display: flex;
				.group {
					height: 300px;
					overflow: auto;
				}
				& > div {
					flex: 1;
					padding: 10px;

					&:first-child {
						border-right: 1px solid #e0e0e0;
						overflow-x: auto;
					}
				}
			}
		}
	}

	.el-dialog__body {
		padding: 0px 20px 20px;
	}
	.el-tabs__header {
		margin: 0 !important;
	}
</style>
