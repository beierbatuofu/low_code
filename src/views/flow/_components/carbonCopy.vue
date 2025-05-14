<script lang="tsx">
	import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";

	@Component
	export default class CarbonCopy extends Vue {
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
			this.$set(this.nodeConf.data, "ccList", tags);
		}

		private value = true;

		protected mounted() {
			(this.$refs.department as Record<"updateInfo", any> & Vue).updateInfo(this.nodeConf.data?.ccList || []).then((result: Record<string, any>[]) => {
				this.tags = result;
				this.value = !!this.tags.length;
			});
		}

		private handleCheckBox(v: boolean) {
			this.value = v;

			if (!v) {
				this.tags = [];
				this.$set(this.nodeConf.data, "ccList", []);
			}
		}

		protected render() {
			let props = { dialogVisible: this.dialogVisible, defaultTags: this.tags, hide: -1 };
			return (
				<div>
					<div class="title">
						<rvue-checkbox
							props={{ value: this.value, disabled: this.isEdit }}
							on={{
								change: this.handleCheckBox,
							}}
						></rvue-checkbox>
						{this.$t("newflow.openCarbonCopy")}
					</div>
					{this.value && (
						<div>
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
										<span class="msg">{this.$t("flow.setCarbonCopy")}</span>
									</div>
								)}
							</div>

							<rvue-department-members
								props={props}
								ref="department"
								on={{
									"update:dialogVisible": (val: boolean) => (this.dialogVisible = val),
									closeDialog: this.handleClose,
								}}
							></rvue-department-members>
						</div>
					)}
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
