<script lang="tsx">
	import { Component, Provide, Vue, Watch, PropSync } from "vue-property-decorator";
	import organ from "@/components/rvue/custom/packages/organ/RvueOrgan.vue";
	import { getTitle } from "@/utils/global";
	import { DEPT_OPTS } from "@/core/defaultValue/conditionConf";
	import RvueClock from "@/components/rvue/custom/packages/clock/RvueClock.vue";
	import { updateNotice, getNotice, sendNotice } from "@/api/bi";

	interface TStruct {
		type: "DT_WORK" | "DT_GROUP";
		enable: boolean;
		common?: string | number;
		id?: string | number;
		scheduleType?: "COMMON" | "CUSTOMIZE";
		custom: { type: string; month: number[]; weekDay: number[]; date: number[]; time: string };
		msg: { type: "text" | "link" | "markdown" | "action_card" } & Record<"title" | "markdown" | "single_title", string> &
			Partial<Record<"userid_list" | "deptid_list", Record<string, any>[]>> &
			Partial<Record<"secret" | "key" | "url", string>>;
	}

	@Component({
		components: {
			"rvue-org": organ,
			"rvue-clock": RvueClock,
		},
	})
	export default class TimedPush extends Vue {
		@PropSync("visible", { type: Boolean, default: false }) syncVisible!: boolean;
		private noticeType: TStruct["type"] = "DT_WORK"; //通知方式
		private defStruct: TStruct[] = [
			{
				type: "DT_WORK",
				enable: false,
				custom: { type: "year", month: [1], weekDay: [1], date: [1], time: "00:00" },
				scheduleType: "CUSTOMIZE",
				msg: {
					type: "action_card",
					title: "",
					markdown: "",
					single_title: "",
					userid_list: [],
					deptid_list: [],
				},
			},
			{
				type: "DT_GROUP",
				enable: false,
				custom: { type: "year", month: [1], weekDay: [1], date: [1], time: "00:00" },
				scheduleType: "CUSTOMIZE",
				msg: {
					type: "action_card",
					title: "",
					markdown: "",
					single_title: "",
					secret: "",
					key: "",
				},
			},
		];
		private structure: TStruct[] = [];

		@Watch("structure", { deep: true })
		private watchStructure() {
			console.log(this.structure, "structure");
		}

		@Watch("syncVisible", { immediate: true })
		private watchyncVisible() {
			let { appCode, formCode } = this.$route.params;

			this.syncVisible &&
				getNotice(appCode, formCode).then((res: TResponse) => {
					this.structure = res.data.length ? res.data : this.defStruct;
				});
		}

		private commonComp(struct: TStruct) {
			return (
				<div>
					<div class="group">
						<div class="label">{this.$t("bi.openNotice")}</div>
						<div class="right">
							<rvue-switch props={{ value: struct.enable }} on={{ change: (v: boolean) => (struct.enable = v) }}></rvue-switch>
						</div>
					</div>
					{false && (
						<div class="group">
							<div class="label">{this.$t("bi.msgType")}</div>
							<div class="right">
								<rvue-radio-group on={{ change: (v: TStruct["msg"]["type"]) => (struct.msg.type = v) }} props={{ value: struct.msg.type, layout: "horizontal" }}>
									<rvue-radio label="text">text</rvue-radio>
									<rvue-radio label="link">link</rvue-radio>
									<rvue-radio label="markdown">markdown</rvue-radio>
									<rvue-radio label="action_card">action_card</rvue-radio>
								</rvue-radio-group>
							</div>
						</div>
					)}

					<div class="group">
						<div class="label required">{this.$t("bi.pushTitle")}</div>
						<div class="right ">
							<rvue-input maxlength="40" props={{ value: struct.msg.title }} placeholder="请输入" on={{ change: (v: string) => (struct.msg.title = v) }}></rvue-input>
						</div>
					</div>
					<div class="group">
						<div class="label required">{this.$t("bi.markdown")}</div>
						<div class="right">
							<rvue-input
								maxlength="512"
								type="textarea"
								props={{ value: struct.msg.markdown }}
								placeholder="请输入"
								on={{ change: (v: string) => (struct.msg.markdown = v) }}
							></rvue-input>
						</div>
					</div>
					<div class="group">
						<div class="label required">{this.$t("bi.singleTitle")}</div>
						<div class="right">
							<rvue-input maxlength="20" props={{ value: struct.msg.single_title }} placeholder="请输入" on={{ change: (v: string) => (struct.msg.single_title = v) }}></rvue-input>
						</div>
					</div>
				</div>
			);
		}

		private ddWorkComp(struct: TStruct) {
			return (
				<div>
					{this.commonComp(struct)}
					<div class="group">
						<div class="label ">{this.$t("bi.userNotice")}</div>
						<div class="right">
							{struct.msg.userid_list ? (
								<rvue-org
									props={{ hide: [0, 1], tags: struct.msg.userid_list }}
									on={{
										change: (v: Record<string, any>[]) => {
											struct.msg.userid_list = v;
										},
									}}
								></rvue-org>
							) : (
								<div></div>
							)}
						</div>
					</div>
					<div class="group">
						<div class="label ">{this.$t("bi.deptNotice")}</div>
						<div class="right">
							{struct.msg.deptid_list ? (
								<rvue-org
									props={{ hide: [1, 2], tags: struct.msg.deptid_list }}
									on={{
										change: (v: Record<string, any>[]) => {
											struct.msg.deptid_list = v;
										},
									}}
								></rvue-org>
							) : (
								<div></div>
							)}
						</div>
					</div>
					<div class="group" style={{ "align-items": "start" }}>
						<div class="label required" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
							{this.$t("bi.remind")}
						</div>
						<div class="right">
							<rvue-clock props={{ params: struct.custom }}></rvue-clock>
						</div>
					</div>
				</div>
			);
		}

		private ddGroupComp(struct: TStruct) {
			let noticeType = "DT_GROUP";
			return (
				<div>
					{this.commonComp(struct)}
					<div class="group">
						<div class="label required">WEB HOOK</div>
						<div class="right">
							<rvue-input props={{ value: struct.msg.key }} placeholder="请输入" on={{ change: (v: string) => (struct.msg.key = v) }}></rvue-input>
						</div>
					</div>
					<div class="group">
						<div class="label required">SECRET</div>
						<div class="right">
							<rvue-input props={{ value: struct.msg.secret }} placeholder="请输入" on={{ change: (v: string) => (struct.msg.secret = v) }}></rvue-input>
						</div>
					</div>
					<div class="group" style={{ "align-items": "start" }}>
						<div class="label required" style={{ paddingTop: "8px", paddingBottom: "8px" }}>
							{this.$t("bi.remind")}
						</div>
						<div class="right">
							<rvue-clock props={{ params: struct.custom }}></rvue-clock>
						</div>
					</div>
				</div>
			);
		}

		private checkCustomSchedule(schedule: TStruct["custom"]): boolean {
			let { type } = schedule;
			let b = true;
			switch (type) {
				case "year":
					!(b = !!schedule.month.length && !!schedule.date.length && !!schedule.time.length) &&
						this.$message({
							message: "请选择定时策略",
							type: "warning",
						});
					return b;
				case "month":
					!(b = !!schedule.date.length && !!schedule.time.length) &&
						this.$message({
							message: "请选择定时策略",
							type: "warning",
						});
					return b;
				case "date":
					!(b = !!schedule.time.length) &&
						this.$message({
							message: "请选择定时策略",
							type: "warning",
						});
					return b;
				case "week":
					!(b = !!schedule.time.length && !!schedule.weekDay.length) &&
						this.$message({
							message: "请选择定时策略",
							type: "warning",
						});
					return b;
			}
			return true;
		}

		private checkDDwork(s: TStruct, type: "test" | "save" = "save"): boolean {
			if (!s.msg.title) {
				this.$message({
					message: "请填写推送标题",
					type: "warning",
				});
				return false;
			}
			if (!s.msg.markdown) {
				this.$message({
					message: "请填写消息内容",
					type: "warning",
				});
				return false;
			}
			if (!s.msg.single_title) {
				this.$message({
					message: "请填写按钮文字",
					type: "warning",
				});
				return false;
			}
			if (s.msg.userid_list && !s.msg.userid_list.length && s.msg.deptid_list && !s.msg.deptid_list.length) {
				this.$message({
					message: "请选择成员或部门",
					type: "warning",
				});
				return false;
			}
			if (type == "test") return true;

			return this.checkCustomSchedule(s.custom);
		}

		private checkDDGroup(s: TStruct, type: "test" | "save" = "save"): boolean {
			if (!s.msg.title) {
				this.$message({
					message: "请填写推送标题",
					type: "warning",
				});
				return false;
			}
			if (!s.msg.markdown) {
				this.$message({
					message: "请填写消息内容",
					type: "warning",
				});
				return false;
			}
			if (!s.msg.single_title) {
				this.$message({
					message: "请填写按钮文字",
					type: "warning",
				});
				return false;
			}
			if (!s.msg.key) {
				this.$message({
					message: "请填写WEB HOOK",
					type: "warning",
				});
				return false;
			}

			if (!s.msg.secret) {
				this.$message({
					message: "请填写SECRET",
					type: "warning",
				});
				return false;
			}

			if (type == "test") return true;

			return this.checkCustomSchedule(s.custom);
		}

		private check(list: TStruct[]): boolean {
			if (list.length == 0) return true;
			let isCheck = true;

			list.forEach((s: TStruct) => {
				if (!isCheck) return;
				if (s.type == "DT_WORK") isCheck = this.checkDDwork(s);
				if (s.type == "DT_GROUP") isCheck = this.checkDDGroup(s);
			});
			return isCheck;
		}

		private handleSave(): Promise<Record<"appCode" | "formCode" | "structure", any> | null> {
			let checkList: TStruct[] = [];
			let { appCode, formCode, tenantId, flag } = this.$route.params;
			this.structure.forEach((s: TStruct) => {
				s.enable && checkList.push(s);
			});

			if (this.check(checkList)) {
				this.structure.forEach((item: TStruct) => {
					item.msg.url = `${window.location.origin}/#/${tenantId}/app/${appCode}/${flag}/bi_form/${formCode}`;
				});

				return Promise.resolve({
					appCode,
					formCode,
					structure: this.structure,
				});
			}

			return Promise.reject(null);
		}

		protected render() {
			if (this.structure.length == 0) return <div></div>;
			let props = {
				visible: this.syncVisible,
				width: "800px",
			};
			let struct: TStruct | undefined = this.structure.find((d: TStruct) => d.type == this.noticeType);
			if (!struct) return <div></div>;
			return (
				<rvue-dialog
					props={props}
					on={{
						close: () => (this.syncVisible = false),
					}}
				>
					<div slot="title" class="dialog-title">
						<div class="dialog-title-font">{this.$l("bi.ddNoticeSetting")}</div>
					</div>
					<div style={{ maxHeight: "530px", overflow: "auto" }}>
						<div class="group">
							<div class="label">{this.$t("bi.noticeType")}</div>
							<div class="right">
								<rvue-radio-group on={{ change: (v: TStruct["type"]) => (this.noticeType = v) }} props={{ value: this.noticeType, layout: "horizontal" }}>
									<rvue-radio label="DT_WORK">{this.$t("bi.workNotice")}</rvue-radio>
									<rvue-radio label="DT_GROUP">{this.$t("bi.groupNotice")}</rvue-radio>
								</rvue-radio-group>
							</div>
						</div>
						{this.noticeType == "DT_WORK" ? this.ddWorkComp(struct) : this.ddGroupComp(struct)}
					</div>
					<div slot="footer" class="dialog-footer">
						<rvue-button
							type="success"
							style="margin-right:10px"
							props={{ time: 2000 }}
							on={{
								click: () => {
									let group: Record<string, any> = this.structure.find((item: Record<string, any>) => item.type == this.noticeType) || {};
									let { appCode, formCode, tenantId, flag } = this.$route.params;
									let isCheck = true;
									if (this.noticeType == "DT_WORK") isCheck = this.checkDDwork(group as TStruct, "test");
									if (this.noticeType == "DT_GROUP") isCheck = this.checkDDGroup(group as TStruct, "test");

									if (isCheck) {
										sendNotice(appCode, formCode, group).then((res: TResponse) => {
											this.$message({
												type: "success",
												message: "发送成功",
											});
										});
									}
								},
							}}
						>
							{this.$t(`bi.send_${this.noticeType}`)}
						</rvue-button>
						<rvue-button style="margin-right:10px" on={{ click: () => (this.syncVisible = false) }}>
							{this.$t("bi.cancel")}
						</rvue-button>
						<rvue-button
							type="primary"
							on={{
								click: () =>
									this.handleSave()
										.then(({ appCode, formCode, structure }: any) => {
											updateNotice(appCode, formCode, structure).then((res: TResponse) => {
												this.syncVisible = false;
												this.$message({
													type: "success",
													message: "设置成功",
												});
											});
										})
										.catch(() => {}),
							}}
						>
							{this.$t("bi.comfirm")}
						</rvue-button>
					</div>
				</rvue-dialog>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.group {
		display: flex;
		align-items: center;
		padding: 5px 10px 5px 5px;
		margin-bottom: 10px;
		.label {
			font-size: 14px;
			text-align: right;
			width: 120px;
			padding-right: 15px;
		}
		.required {
			&::before {
				content: "*";
				color: red;
				padding: 1px;
				vertical-align: middle;
			}
		}
		.right {
			flex: 1;
		}
	}
</style>
