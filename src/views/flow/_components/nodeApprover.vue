<script lang="tsx">
	import { Component, Vue, Prop, Watch } from "vue-property-decorator";

	@Component
	export default class NodeApprover extends Vue {
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		@Prop({ type: Boolean, default: true }) isEdit!: boolean;

		private tags: Record<string, any>[] = [];
		private dialogVisible: boolean = false;

		private handleClick() {
			if (!!this.isEdit) return;
			this.dialogVisible = true;
		}

		private handleClose(tags: Record<string, any>[]) {
			this.tags = tags;
			this.$set(this.nodeConf.data, "assigneeList", tags);
		}

		protected mounted() {
			(this.$refs.department as Record<"updateInfo", any> & Vue).updateInfo(this.nodeConf.data?.assigneeList || []).then((result: Record<string, any>[]) => (this.tags = result));
		}

		protected render() {
			let props = { dialogVisible: this.dialogVisible, defaultTags: this.tags, hide: -1 };

			return (
				<div class="node-approver">
					<div class="title">{this.$t("process.personInCharge")}</div>
					<div class={this.isEdit ? "disabled tags-list" : "tags-list"} on-click={this.handleClick}>
						{this.tags.length ? (
							<div>
								{this.tags.map((tag: Record<string, any>) => (
									<rvue-tag>{tag.name}</rvue-tag>
								))}
							</div>
						) : (
							<div class="empty">
								<i class="el-icon-plus"></i>
								<span class="msg">{this.$t("flow.setPrincipal")}</span>
							</div>
						)}
					</div>
					<rvue-department-members
						ref="department"
						props={props}
						on={{
							"update:dialogVisible": (val: boolean) => (this.dialogVisible = val),
							closeDialog: this.handleClose,
						}}
					></rvue-department-members>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.tags-list {
		min-height: 80px;
		border: 1px solid #e0e0e0;

		overflow: auto;
		.el-tag {
			margin: 5px;
		}
		max-height: 200px;
	}
	.empty {
		line-height: 80px;
		text-align: center;
	}
	.disabled {
		background: #f5f5f5;
	}
</style>
