<template>
	<div class="choose-btn ct-container">
		<el-dropdown trigger="click" placement="bottom-start" @visible-change="handleVisible">
			<span class="el-dropdown-link">
				<i class="el-icon-plus"></i>
				{{ mode === "dimensions" ? $t("chartDesign.dimension") : $t("chartDesign.indicator") }}
			</span>

			<el-dropdown-menu slot="dropdown">
				<div v-if="formConfig.code" class="dimension-list">
					<el-checkbox-group v-model="checkList" :min="0" :max="max">
						<el-checkbox :disabled="filterOtherTable(item)" v-for="(item, index) in formCList" :key="index" :label="item.code">{{ setTitleName(item) }}</el-checkbox>
					</el-checkbox-group>

					<!-- <div class="add-assist" @click="visible = true">
						<i class="el-icon-plus"></i>
						添加辅助字段
					</div> -->
				</div>
				<div v-else class="di-empty">暂无数据</div>
			</el-dropdown-menu>
		</el-dropdown>

		<draggable v-model="draggableList" handle=".mover" :move="onMove" animation="300">
			<transition-group>
				<CTsetting :mode="mode" :data="data" v-for="item in data[this.mode]" :key="item.code" :item="item" />
			</transition-group>
		</draggable>
		<CTdiAssistDialog :data="data" :formConfig="formConfig" :formList="formCList" :visible.sync="visible" />
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch, Provide } from "vue-property-decorator";
	import BaseAttr from "../../../core/BaseAttr";
	import CTsetting from "../../../common/CTsetting.vue";
	import draggable from "vuedraggable";
	import { FList, CList } from "./_core/di";
	import { Dimensions, Indicators } from "@/components/chartDesign/components/attr/CTdi/_types/di";
	import { Field } from "@/components/chartComps/_filterComponent/_configComponent/_type";

	@Component({
		components: { CTsetting, draggable },
	})
	export default class CTdi extends BaseAttr {
		@Prop({ type: String, default: () => "" }) mode!: string;
		private visible: Boolean = false;
		@Provide("checkMethodsField")
		checkMethodsField: TJson = ["checkbox", "selectMulti", "dept", "user"];

		private setTitleName(item: Record<string, any>) {
			try {
				return item.title[(<Record<string, any>>this).lang];
			} catch (err) {
				return item.fieldIdAsName;
			}
		}

		private get draggableList() {
			return this.data[this.mode];
		}
		private set draggableList(n: TJson) {
			this.$set(this.data, this.mode, n);
		}
		//控制可选的最大
		private get max() {
			if (this.mode === "dimensions") {
				switch (this.$route.params.type) {
					case "line":
					case "costum":
					case "bar":
						if (this.data.indicators.length > 1) {
							return 1;
						}
						return 2;
					default:
						return 1;
				}
			} else {
				switch (this.$route.params.type) {
					case "bar":
					case "line":
					case "costum":
						if (this.data.dimensions.length === 2) {
							return 1;
						}
						return 99;

					case "pie":
					case "quota":
						return 1;
					default:
						return 99;
				}
			}
		}
		//只能选单一子表格
		private filterOtherTable(item: Dimensions | Indicators) {
			let tableItem: (string | undefined)[];
			function getTableItem(that: any, mode: string) {
				return that.data[mode]
					.map((arrItem: Dimensions) => {
						return arrItem.subCode;
					})
					.filter((arrItem: Dimensions) => {
						return typeof arrItem !== "undefined";
					}).length > 0
					? that.data[mode]
							.map((arrItem: Dimensions) => {
								return arrItem.subCode;
							})
							.filter((arrItem: Dimensions) => {
								return typeof arrItem !== "undefined";
							})
					: tableItem;
			}
			//找到被勾选的子表格
			tableItem = getTableItem(this, "dimensions");
			tableItem = getTableItem(this, "indicators");
			//不能选不同子表格的 或者维度是子表格 指标不是
			if (("subCode" in item && tableItem && tableItem[0] && tableItem[0] != item.subCode) || (this.mode == "indicators" && !("subCode" in item) && tableItem && tableItem[0])) {
				return true;
			}

			return false;
		}

		//过滤不需要的字段
		private get formCList() {
			let tempArr: Array<Dimensions | Indicators> = [];
			//直接赋值会有缓存问题
			if (this?.formConfig?.type === "C") {
				tempArr = this.$utils.deepClone(CList);
			} else if (this?.formConfig?.type === "F") {
				tempArr = this.$utils.deepClone(FList);
			}

			if (this.mode !== "dimensions") {
				tempArr = tempArr.map((item: Indicators | Dimensions) => {
					(<Indicators>item).method = "COUNT";
					item.tagCode = new Date().getTime() + `_${Math.random().toString().slice(2)}`;
					return item;
				});
			}
			//因为需要表格子字段
			let newBlackList = this.blackList.filter((item) => item != "table");
			//表格内部子字段的筛选
			let newTableBlackList = [...newBlackList, "selectMulti", "checkbox", "user", "dept"];

			this.formConfig.configList
				.filter((item: Field) => {
					//指标过滤
					if (this.mode != "dimensions") {
						return !newTableBlackList.includes(item.type);
					}
					return !newBlackList.includes(item.type);
				})
				.map((item: any, index: number) => {
					let data: Indicators | Dimensions = {
						code: "",
						dataTypeEnum: "",
						tagCode: "",
						fieldIdAsName: "",
						sort: "none",
						title: { zh: "", en: "" },
						subCode: "",
					};
					//表格子字段
					if (item.type == "table" || item.type == "tab") {
						//找sub
						let subCode = "";
						for (const key in this.formConfig.subFormCode) {
							if (key == item.fieldId) {
								subCode = this.formConfig.subFormCode[key];
							}
						}
						item.children.map((tableItem: TJson, index: number) => {
							if (newTableBlackList.includes(tableItem.type)) {
								return;
							}

							data = {
								title: {
									zh: item.title["zh"] + "." + tableItem.title["zh"],
									en: item.title["en"] + "." + tableItem.title["en"],
								},
								code: tableItem.fieldId,
								sort: "none",
								tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
								subCode,
								dataTypeEnum: tableItem.type || tableItem.oldType,
								tableFieldId: item.fieldId,
								fieldIdAsName: item.fieldIdAsName ? item.fieldIdAsName : "",
							};

							if (this.mode != "dimensions") {
								(data as Indicators).method = "COUNT";
							} else {
								//时间日期加汇总方式默认值
								if (data.dataTypeEnum.indexOf("time") > 0) {
									data.dateTimeSummary = "DATE";
								}
								//复选类型加汇总方式默认值 4种
								if (this.checkMethodsField.includes(data.dataTypeEnum)) {
									data.method = "mut";
								}
							}

							tempArr.push(data);
							// }
						});
					} else {
						data = {
							title: item.title,
							dataTypeEnum: item.type || item.oldType,
							code: item.fieldId,
							sort: "none",
							tagCode: new Date().getTime() + `_${Math.random().toString().slice(2)}`,
							fieldIdAsName: item.fieldIdAsName ? item.fieldIdAsName : "",
						};
						if (this.mode != "dimensions") {
							//TODO 写在rfield define中
							(data as Indicators).method = "COUNT";
							data.dataTypeEnum == "number" && ((data as Indicators).method = "SUM");
						} else {
							//时间日期加汇总方式默认值

							if (data.dataTypeEnum && data.dataTypeEnum.indexOf("time") > 0) {
								data.dateTimeSummary = "DATE";
							}
							//复选类型加汇总方式默认值 4种
							if (this.checkMethodsField.includes(data.dataTypeEnum)) {
								data.method = "mut";
							}
						}
						tempArr.push(data);
					}
				});

			return tempArr;
		}
		//拖拽后清楚复选的汇总方式
		private onMove() {
			this.data.dimensions.map((item: any) => {
				if (item.method == "one") {
					item.method = "mut";
				}
			});
			console.log(this.data.dimensions);
		}

		//当前报表保存的
		private get checkList() {
			console.log(this.data[this.mode], "this.data[this.mode]");
			return (
				this.data[this.mode].map((item: Dimensions | Indicators) => {
					return item.code;
				}) || []
			);
		}
		private set checkList(n: string[]) {
			let arr = this.getCurrentList(this.formCList, n);
			this.$set(this.data, this.mode, arr);
		}
		//选中的转化
		private getCurrentList(pre: Array<Dimensions | Indicators>, next: Array<string>) {
			let arr: Array<Dimensions | Indicators> = [];
			//当前报表的,当前表单
			next.forEach((item: string) => {
				pre.map((ele: Dimensions | Indicators) => {
					if (ele.code == item) {
						arr.push(ele);
					}
				});
			});
			//如果已经有汇总方式
			this.data[this.mode].map((item: Dimensions | Indicators) => {
				arr = arr.map((arrItem: Dimensions | Indicators) => {
					if (item.code == arrItem.code) {
						arrItem = item;
					}
					return arrItem;
				});
			});
			return arr;
		}
		//未选择数据源报错
		private handleVisible(e: boolean) {
			e && !this.formConfig.code && this.$message.error("请选择数据源");
		}
		//对类型和模式数量进行限制
		private limitDi(n: any) {
			if (this.mode === "dimensions") {
				switch (this.$route.params.type) {
					case "line":
					case "bar":
						if (this.data.dimensions.length > 2) {
							this.$message.error("超出数量限制");
							return;
						}
						break;
					case "pie":
						console.log(this.data.dimensions.length);
						if (this.data.dimensions.length > 1) {
							this.$message.error("超出数量限制");
							return;
						}
						break;

					default:
						break;
				}
			} else {
				switch (this.$route.params.type) {
					case "bar":
						break;

					default:
						break;
				}
			}
		}
		@Watch("data.dimensions")
		onchangge(n: TJson) {
			this.$forceUpdate();
		}
	}
</script>
<style lang="scss" scoped>
	.choose-btn {
		cursor: pointer;
	}
	.add-assist {
		cursor: pointer;
	}
	::v-deep .el-checkbox__label {
		@include ExtraNotDisplayed();
		width: 200px;
	}
	::v-deep.choose-btn {
		.el-dropdown {
			width: 100%;
			color: #525d6d;
			font-weight: 600;
		}
	}
	::v-deep.dimension-list {
		max-height: 500px;
		overflow-y: scroll;
		.el-checkbox {
			display: flex;
		}
	}
	.di-empty {
		padding: 0 10px;
	}
</style>
