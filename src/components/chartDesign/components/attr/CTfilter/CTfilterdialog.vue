<template>
	<rvue-dialog title="筛选条件" top="10vh" :visible.sync="visibleSync" width="1000px" @open="handleOpen">
		<match-rules :isDataTypeComp="false" :key="timestamp" :configlist="configList" :matchRules="matchRulesProp" @change="this.handleChange"></match-rules>

		<span slot="footer" class="dialog-footer">
			<rvue-button size="mini" @click="visibleSync = false">取 消</rvue-button>
			<rvue-button size="mini" type="primary" @click="handleSure">确 定</rvue-button>
		</span>
	</rvue-dialog>
</template>

<script lang="ts">
	import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
	import BaseAttr from "../../../core/BaseAttr";
	import { CList, FList } from "./sys";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import MatchRules from "./_components/matchRules/matchRules.vue";
	import { TRowData } from "./_components/matchRules/RuleCore";
	@Component({
		components: {
			MatchRules,
		},
	})
	export default class CTfilterdialog extends BaseAttr {
		@PropSync("visible", { type: Boolean, default: false }) visibleSync!: Boolean;
		private matchRulesProp: TJson = [];
		private timestamp = 1;
		private configList: TJson = [];
		private newList: TJson = [];
		//去除tagetid没有的method 防止报错
		private filterEmpty(arr: TJson) {
			for (let i = arr.length - 1; i >= 0; i--) {
				for (let j = arr[i].length - 1; j >= 0; j--) {
					if (!arr[i][j].targetFieldCode || !arr[i][j].method) {
						arr[i].splice(j, 1);
					}
				}
				if (arr[i].length == 0) {
					arr.splice(i, 1);
				}
			}
		}

		private handleSure() {
			let bool: boolean = false;
			this.matchRulesProp = this.newList;

			let validateRules = (this.matchRulesProp[0] || [])
				.filter((item: Record<string, any>) => !["empty", "not_empty"].includes(item.method))
				.every((item: Record<string, any>) => {
					if (item.method == "between" && item.type == "number") {
						return !isNaN(item.judgeValues[0]["1"]) && !isNaN(item.judgeValues[0]["0"]);
					}
					if (item.type == "number") {
						return !isNaN(item.judgeValues[0]);
					}

					return item.judgeValues[0];
				});

			if (!validateRules && this.matchRulesProp.length) {
				return this.$message.error("请输入筛选条件内容");
			}
			this.matchRulesProp.forEach((ite1: TRowData[], idx1: number) => {
				ite1.forEach((ite2: TRowData, idx2: number) => {
					if (
						(!String(ite2.judgeValues[0]) || String(ite2.judgeValues[0]).length == 0 || Object.keys(String(ite2.judgeValues[0])).length == 0 || !ite2.method) &&
						ite2.method != "empty" &&
						ite2.method != "not_empty"
					) {
						bool = true;
					}
				});
			});
			if (bool) {
				this.$message.error("筛选条件输入有误");
				return;
			}
			this.$set(this.data, "matchRules", this.matchRulesProp);
			// this.filterEmpty(this.matchRulesProp);
			// this.matchRulesProp = (<any>this).$utils.deepClone(this.data.matchRules);
			this.visibleSync = false;
		}

		private handleDelete(prop: string, type: string) {
			(<any>this)[type].forEach((item: any, index: number) => {
				item.prop == prop && (<any>this)[type].splice(index, 1);
			});
		}

		private handleChange(rules: Record<string, any>[][]) {
			let list: Record<string, any>[][] = [];
			rules.forEach((group: Record<string, any>[]) => {
				let g: Record<string, any>[] = [];
				//没有判空 和不为空
				group.forEach((row: Record<string, any>) => {
					if ((row.method && row.targetFieldCode) || (["empty", "not_empty"].includes(row.method) && row.targetFieldCode)) {
						if (row.method == "between" && row.type == "number") {
							let b = Object.values(row.judgeValues[0]).every((key) => String(key) == "undefined");
							// if (!b) {

							// }
							g.push(row);
						} else {
							g.push(row);
						}
					}
				});
				g.length && list.push(g);
			});

			this.newList = list;
		}

		private handleOpen() {
			this.timestamp++;
			if (this.formConfig.configList) {
				let fieldList: any = [];
				//如果是数据集没有配置 需要添加
				if (this.formConfig.sourceType === "dataset") {
					//选项变成
					this.formConfig.configList = this.formConfig.configList.map((item: any) => {
						let obj = {
							...item,
							type: item.type == "selectMulti" || item.type == "select" ? "input" : item.type,
						};
						if (item.type == "selectMulti" || item.type == "select") {
							item = {
								...(<TJson>RfieldCore.ins().createField({ type: "input" })).config,
								...obj,
							};
						} else {
							if (item.type == "text") {
								item.type = "input";
							}
							item = { ...(<TJson>RfieldCore.ins().createField({ type: item.type })).config, ...obj };
						}

						return item;
					});
				}
				this.formConfig.configList.map((item: TJson) => {
					fieldList.push(item);
				});
				//系统字段
				if (this.formConfig.type === "C") {
					fieldList = [...fieldList, ...CList];
				} else if (this.formConfig.type === "F") {
					fieldList = [...fieldList, ...FList];
				}

				this.configList = fieldList.map((item: Record<string, any>) => {
					if (item.fieldIdAsName) {
						item.fieldId = item.fieldIdAsName;
					}
					if (item.type == "text") {
						item.type = "input";
					}
					return item;
				});
			}

			this.matchRulesProp = this.$utils.deepClone(this.data.matchRules).length > 0 ? this.$utils.deepClone(this.data.matchRules) : [];
		}
	}
</script>
