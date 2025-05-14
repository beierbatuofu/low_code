<script lang="tsx">
	import { Component, Watch, Vue, Prop, Provide } from "vue-property-decorator";
	import Group from "./group.vue";
	import RuleCore, { TRowData } from "./RuleCore";
	/*
	       dataType  0-自定义 直接取judgeValues的值  1-匹配字段 直接judgeValues当作key从输入参数中取value
	       method : 条件
	       targetFieldCode:目标字段fieldId
	       judgeValues:[value],
	       parentSubFormTargetFieldCode:父层fieldId(子表格)
	   */

	@Component({
		components: {
			"match-rules-group": Group,
		},
	})
	export default class MatchRules extends Vue {
		@Prop({ type: Array, default: () => [] }) configlist!: Record<string, any>[];
		@Prop({ type: Array, default: () => [] }) currentList!: Record<string, any>[];
		@Prop({ type: Boolean, default: true }) modeFlag!: boolean;
		@Prop({ type: Boolean, default: true }) isDataTypeComp!: boolean;
		@Prop({ type: String, default: "form" }) dataType!: "form" | "echarts";
		@Prop({ type: Array, default: () => ["separator", "tab", "table", "uploadFile", "address"] }) filters!: string[];

		@Prop({
			type: Array,
			default: () => [],
		})
		matchRules!: TRowData[][];
		@Provide("conf")
		conf = { isDataTypeComp: true, methodsType: "form" };

		@Watch("defineRules", { deep: true })
		private watchDefineRules() {
			// console.log(this.defineRules);
			this.$emit("change", this.defineRules);
		}

		private defineRules: TRowData[][] = [];
		private get options() {
			let list: Record<string, any>[] = [];
			this.configlist.forEach((item: Record<string, any>) => {
				if (!this.filters.includes(item.type)) {
					list.push(item);
				}
				if (item.type == "table") {
					let { children, ...attr } = item;

					let child = children
						.map((ite: Record<string, any>) => ({
							...ite,
							parent: attr,
						}))
						.filter((ite: Record<string, any>) => !this.filters.includes(ite.type));
					list.push(...child);
				}
			});
			console.log(list, "list");
			return list;
		}

		private handleClick() {
			this.defineRules.push([RuleCore.ins().createRowData()]);
		}

		private handleDel(idx: number) {
			if (this.defineRules[idx].length == 0) {
				this.defineRules.splice(idx, 1);
			}
		}

		public changModeList() {
			if (!this.modeFlag) {
				this.defineRules.length > 0 && this.defineRules.splice(1);
			}
		}

		protected created() {
			this.conf.isDataTypeComp = this.isDataTypeComp;
			this.conf.methodsType = this.dataType;
			this.defineRules = this.matchRules.length == 0 ? RuleCore.ins().createDefRowData() : this.matchRules;
		}

		protected render() {
			return (
				<div class="match-rules-wrap">
					{this.defineRules.length > 0 ? (
						this.defineRules.map((group: TRowData[], idx: number) => (
							<match-rules-group
								ref="group"
								props={{
									options: this.options,
									group: group,
									rules: this.defineRules,
									currentList: this.currentList,
								}}
								on={{
									del: () => this.handleDel(idx),
								}}
							></match-rules-group>
						))
					) : (
						<rvue-button
							class="and-btn"
							on={{
								click: this.handleClick,
							}}
						>
							<i class="el-icon-circle-plus"></i>
							{this.$t("linkDataDialog.andCondition")}
						</rvue-button>
					)}
					{!this.modeFlag ? (
						<rvue-button
							class="and-btn"
							on={{
								click: this.handleClick,
							}}
						>
							<i class="el-icon-circle-plus-outline"></i>
							{this.$t("linkDataDialog.orCondition")}
						</rvue-button>
					) : (
						<div></div>
					)}
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.match-rules-wrap {
		min-height: 200px;
		overflow: auto;
		margin-bottom: 20px;
	}
	.and-btn {
		margin-top: 10px;
		color: #409eff;
		border: 0;
		cursor: pointer;
		display: block;
		.el-icon-circle-plus {
			margin-right: 2px;
		}
	}
</style>
