<template>
	<rvue-dialog :fullscreen="sMobile" :title="getTitle" :visible.sync="syncDialogVisible" :append-to-body="true" :destroy-on-close="true" :close-on-press-escape="false">
		<!-- <div slot="title" class="dialog-title">
      <div class="dialog-title-line"></div>
      <div class="dialog-title-font">{{ getTitle }}</div>
    </div> -->
		<div class="lineOnly"></div>
		<div v-if="syncDialogVisible">
			<div class="department">
				<div class="department-top">
					<el-tag v-for="tag in newTags" :key="tag.name" closable @close="bindCloseTag(tag)" :type="String(tag.type)" style="margin-bottom: 10px"> {{ tag.name }} </el-tag>
				</div>
				<department-body :hide="hide" :tags.sync="newTags" :multiple="multiple" />
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<p class="D-foot">
				<el-button size="mini" class="firstBtn" @click="bindCancel">{{ $t("linkDataDialog.cancel") }}</el-button>
				<el-button size="mini" type="primary" @click="bindSave">{{ $t("crud.filter.submitBtn") }}</el-button>
			</p>
		</span>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Component, Vue, Watch, PropSync, Provide, Prop } from "vue-property-decorator";
	import departmentBody from "./_components/departmentBody.vue";
	import { updateMemberInfo } from "@/api/form.js";
	import { dataTool } from "echarts";

	@Component({
		name: "departmentMembers",
		components: {
			departmentBody,
		},
	})
	export default class DepartmentMembers extends Vue {
		/**
        syncDialogVisible dialog 显隐
        defaultTags 回显部门人员数据
        multiple 是否多选
        hide 不需要渲染的tab项
        parent 下发当前组件
    **/
		@PropSync("dialogVisible", {
			type: Boolean,
			default: false,
		})
		syncDialogVisible!: boolean;
		@Prop({
			type: [Array, String],
			default: () => [],
		})
		defaultTags!: any;
		@Prop({
			type: Boolean,
			default: true,
		})
		multiple!: boolean;
		@Prop({
			type: [String, Array, Number],
			default: -1,
		})
		hide!: any;
		@Provide("parent") parent = this;

		//存放回显部门人员数据
		private newTags: any[] = [];
		private sMobile: boolean = false;
		private isUpdate = true;

		public updateInfo(list: Record<string, any>[] | undefined = undefined): Promise<Record<string, any>[]> {
			if (!list || list.length == 0) return Promise.resolve([]);
			this.isUpdate = false;
			let params: { id: string; type: string }[] = list.map((item: Record<string, any>) => ({ id: item.id, type: item.type }));
			return new Promise(async (resolve, reject) => {
				let result = [];
				let newTags: Record<"id" | "type" | "avatar" | "name", string>[] = [];
				this.isUpdate = true;
				try {
					let { data } = await updateMemberInfo(params);
					list.forEach((item: Record<string, any>) => {
						let result = data.find((ite: Record<string, any>) => ite.id == item.id);
						if (result) {
							newTags.push({
								id: result.id,
								type: result.type,
								avatar: result.avatar,
								name: result.name,
							});
						}
					});
					this.newTags = newTags;
					resolve(this.newTags);
				} catch (err) {}
			});
		}

		//删除tag标签方法
		private bindCloseTag(node: any) {
			let index = this.newTags.findIndex((d: any) => node.id == d.id);
			console.log(index);
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

		//设置dialog title
		private get getTitle() {
			let bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
			if (bMobile) {
				this.sMobile = true;
			} else {
				this.sMobile = false;
			}
			let hides = Array.isArray(this.hide) ? this.hide : [this.hide];
			if (hides.includes(0)) return this.$t("global.chooseUser");
			if (hides.includes(-1)) return this.$t("global.chooseDepartmentUser");
			return this.$t("global.chooseDepartment");
		}

		//监听人员回显数据
		@Watch("defaultTags")
		onChangeDfaultTagsValue(n: any, o: any) {
			this.newTags = n;
		}

		//dialogVisible true 拷贝部门人员回显数据
		@Watch("dialogVisible")
		onChangeDialogVisible(n: boolean) {
			let defaultTags = this.defaultTags || [];
			n && (this.newTags = JSON.parse(JSON.stringify(defaultTags)));
			//this.isUpdate && this.updateInfo(JSON.parse(JSON.stringify(defaultTags)));
		}
	}
</script>
<style lang="scss">
	@import "./_static/scss/index.scss";
	.lineOnly {
		position: absolute;
		top: 6px;
		width: 5px;
		height: 32px;
		background-color: rgb(77, 129, 255);
	}
	@media screen and (max-width: 480px) {
		.lineOnly {
			height: 25px;
			left: 15px;
		}
	}
	.el-dialog__header {
		border-bottom: 1px solid #f1f1f1;
		padding-bottom: 20px;
	}
	.el-dialog__title {
		margin-left: 20px;
		font-size: 16px;
		font-weight: 800;
		color: #000;
	}
	.el-dialog {
		min-width: 320px !important;
	}
	.D-foot {
		padding: 6px 0 0;
		text-align: center;
	}
	@media screen and (max-width: 768px) {
		.firstBtn {
			margin-right: 20px;
		}
	}
</style>
