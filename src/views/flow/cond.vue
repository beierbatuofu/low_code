<script lang="tsx">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import MatchRules from "@/components/matchRules";

	@Component({
		components: {
			"match-rules": MatchRules,
		},
	})
	export default class Cond extends Vue {
		@Prop({ type: Object, default: () => ({}) }) nodeConf!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) defineFlow!: Record<string, any>;
		@Inject() flowJSON!: Record<string, any>;

		private newRules: Record<string, any>[] = [];
		private timestamp = 1;
		private matchRules: Record<string, any>[][] = [];

		private handleChange(rules: Record<string, any>[][]) {
			let list: Record<string, any>[][] = [];
			rules.forEach((group: Record<string, any>[]) => {
				let g: Record<string, any>[] = [];
				//没有判空 和不为空
				group.forEach((row: Record<string, any>) => {
					if ((row.method && row.targetFieldCode && row.judgeValues.length) || (["empty", "not_empty"].includes(row.method) && row.targetFieldCode)) {
						if (row.method == "between" && row.type == "number") {
							let b = Object.values(row.judgeValues[0]).every((key) => String(key) == "undefined");
							if (!b) {
								g.push(row);
							}
						} else {
							g.push(row);
						}
					}
				});
				g.length && list.push(g);
			});

			this.newRules = list;
		}
		private handleSave() {
			//this.nodeConf.data["matchRules"] = this.newRules;

			this.$set(this.nodeConf.data, "matchRules", this.newRules);
			this.$emit("close");
		}

		private handleCopy() {
			this.flowJSON.copyMatchRules = JSON.parse(JSON.stringify(this.newRules));
		}

		protected created() {
			this.matchRules = JSON.parse(JSON.stringify(this.nodeConf.data?.matchRules || []));
		}

		protected render() {
			return (
				<div class="filter">
					<match-rules
						key={this.timestamp}
						props={{ modeFlag: false, configlist: this.flowJSON.configList, matchRules: this.matchRules, isDataTypeComp: false }}
						on={{
							change: this.handleChange,
						}}
					></match-rules>
					<div class="btn-group">
						<div class="left">
							<span
								class="btn"
								on={{
									click: this.handleCopy,
								}}
							>
								{this.$t("linkDataDialog.copy")}
							</span>

							{this.flowJSON.copyMatchRules.length ? (
								<span
									class="btn"
									on={{
										click: () => {
											this.matchRules = JSON.parse(JSON.stringify(this.flowJSON.copyMatchRules));
											this.timestamp++;
										},
									}}
								>
									{this.$t("linkDataDialog.paste")}
								</span>
							) : (
								<span></span>
							)}
						</div>
						<rvue-button
							on={{
								click: () => {
									this.$emit("close");
								},
							}}
						>
							{this.$t("linkDataDialog.cancel")}
						</rvue-button>
						<rvue-button
							type="primary"
							on={{
								click: this.handleSave,
							}}
						>
							{this.$t("linkDataDialog.save")}
						</rvue-button>
					</div>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.btn-group {
		text-align: center;
		padding: 20px 0 0;
		position: relative;
		.left {
			position: absolute;
			bottom: 0;
			left: 0;
			span {
				cursor: pointer;
				padding: 0 5px;
				color: $color;
				font-size: 13px;
			}
		}
	}
	::v-deep {
		.el-button {
		}
	}
</style>
