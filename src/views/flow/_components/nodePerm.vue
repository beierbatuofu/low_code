<script lang="tsx">
	import { Component, Vue, Prop, Inject, Watch } from "vue-property-decorator";

	@Component({})
	export default class NodePerm extends Vue {
		@Inject() flowJSON!: Record<"configList", any>;
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;

		private allView = true;
		private allEdit = true;

		@Watch("flowJSON", { deep: true, immediate: true })
		private watchFlowJSON() {
			this.allView = this.nodeConf.data.permission.every((item: Record<string, any>) => item["isView"]);
			this.allEdit = this.nodeConf.data.permission.every((item: Record<string, any>) => item["isEdit"]);
		}

		private handleCheckEdit(idx: number, v: boolean) {
			this.nodeConf.data.permission[idx].isEdit = v;
			this.allEdit = this.nodeConf.data.permission.every((item: Record<string, any>) => item["isEdit"]);
			if (v) {
				this.handleCheckView(idx, v);
			}
		}

		private handleCheckView(idx: number, v: boolean) {
			this.nodeConf.data.permission[idx].isView = v;
			this.allView = this.nodeConf.data.permission.every((item: Record<string, any>) => item["isView"]);
			if (!v) {
				this.handleCheckEdit(idx, v);
			}
		}
		private handleAllCheckEdit(v: boolean) {
			this.allEdit = v;
			v && (this.allView = v);

			this.nodeConf.data.permission.forEach((item: Record<string, any>) => {
				item.isEdit = v;
				v && (item.isView = v);
			});
		}

		private handleAllCheckView(v: boolean) {
			this.allView = v;
			!v && (this.allEdit = v);
			this.nodeConf.data.permission.forEach((item: Record<string, any>) => {
				item.isView = v;
				!v && (item.isEdit = v);
			});
		}

		protected render() {
			let configList = this.flowJSON.configList;
			let lang = localStorage.getItem("lang") || "zh";
			if (configList.length == 0) return <div></div>;
			return (
				<div class="permission-box">
					<div class="permission">
						<ul class="thead">
							<li class="td">{this.$t("global.visible")}</li>
							<li class="td">{this.$t("global.edit")}</li>
						</ul>
						<ul class="tbody">
							<li>
								<span class="label">{this.$t("global.selectAll")}</span>
								<span class="view">
									<rvue-checkbox
										props={{
											value: this.allView,
										}}
										on={{
											change: this.handleAllCheckView,
										}}
									></rvue-checkbox>
								</span>
								<span class="edit">
									<rvue-checkbox
										props={{
											value: this.allEdit,
										}}
										on={{
											change: this.handleAllCheckEdit,
										}}
									></rvue-checkbox>
								</span>
							</li>
						</ul>
						<ul class="tbody">
							{configList.map((item: Record<string, any>, idx: number) => (
								<li>
									<span class="label">{item.title[lang]}</span>
									<span class="view">
										<rvue-checkbox
											on={{
												change: (v: boolean) => {
													this.handleCheckView(idx, v);
												},
											}}
											props={{
												value: this.nodeConf?.data.permission[idx]?.isView,
											}}
										></rvue-checkbox>
									</span>
									<span class="edit">
										{["separator", "sn"].includes(item.type) ? (
											""
										) : (
											<rvue-checkbox
												on={{
													change: (v: boolean) => {
														this.handleCheckEdit(idx, v);
													},
												}}
												props={{
													value: this.nodeConf?.data.permission[idx]?.isEdit,
												}}
											></rvue-checkbox>
										)}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.permission {
		.thead {
			display: flex;
			height: 30px;
			background: #fafafa;
			line-height: 30px;
			.td {
				margin-left: 20px;
			}
			padding-left: 80px;
		}
		.tbody {
			max-height: 300px;
			overflow: auto;
			li {
				position: relative;
				padding: 10px 160px 10px 5px;
				border-bottom: 1px solid #e9e9e9;
				min-height: 40px;
			}
			.label {
				width: 100px;
				overflow: hidden;
				display: block;
			}
			.view {
				@include PositionAbsoulte(50%, null, null, 105px);
				transform: translateY(-50%);
			}
			.edit {
				@include PositionAbsoulte(50%, null, null, 160px);
				transform: translateY(-50%);
			}
			.brief {
				@include PositionAbsoulte(50%, null, null, 215px);
				transform: translateY(-50%);
			}
		}
	}
</style>
