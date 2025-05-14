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
		@Prop({
			type: Array,
			default: () => [],
		})
		matchRules!: TRowData[][];
		@Watch("defineRules", { deep: true })
		private watchDefineRules() {
			this.$emit("change", this.defineRules);
		}

		private defineRules: TRowData[][] = [];
		private get options() {
			console.log(this.configlist, "this.configlist");
			let list: Record<string, any>[] = [];
			this.configlist.forEach((item: Record<string, any>) => {
				if (!["separator", "tab", "table", "address"].includes(item.type)) {
					list.push(item);
				}
				if (item.type == "table") {
					let { children, ...attr } = item;

					let child = children.map((ite: Record<string, any>) => ({
						...ite,
						title: {
							zh: item.title.zh + "." + ite.title.zh,
							en: item.title.en + "." + ite.title.en,
						},
						parent: attr,
					}));

					list.push(...child.filter((conf: Record<string, any>) => conf.type != "address"));
				}
			});
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

		protected created() {
			console.log(this.matchRules, "configList");

			//过滤已删除字段
			let allFieldIdList: any = [];
			this.configlist.map((item: TJson) => {
				allFieldIdList.push(item.fieldId);
				if (item.children) {
					item.children.map((item: TJson) => {
						allFieldIdList.push(item.fieldId);
					});
				}
			});
			let filmatchRules = this.matchRules.map((list: any) => {
				return list.filter((item: any) => {
					return allFieldIdList.includes(item.targetFieldCode);
				});
			});

			this.defineRules = filmatchRules.length == 0 ? RuleCore.ins().createDefRowData() : filmatchRules;
		}

		protected render() {
			return (
				<div class="match-rules-wrap">
					{this.defineRules.map((group: TRowData[], idx: number) => (
						<match-rules-group
							props={{
								options: this.options,
								group: group,
								rules: this.defineRules,
							}}
							on={{
								del: () => this.handleDel(idx),
							}}
						></match-rules-group>
					))}
					<rvue-button
						class="and-btn"
						on={{
							click: this.handleClick,
						}}
					>
						<i class="el-icon-circle-plus-outline"></i>
						{this.$t("linkDataDialog.orCondition")}
					</rvue-button>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	.match-rules-wrap {
		max-height: 350px;
		overflow: auto;
	}
	.and-btn {
		margin-top: 10px;
		color: #777;
		border: 1px #999 dotted;
		cursor: pointer;
		.el-icon-circle-plus {
			margin-right: 2px;
		}
	}
</style>
