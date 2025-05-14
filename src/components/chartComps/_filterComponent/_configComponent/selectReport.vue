<template>
	<div class="marginb30">
		<rvue-label required :label="$t('chartDesign.plzac')" />
		<div class="show flex" @click="showHandler">{{ $t("chartDesign.cc") }}</div>
		<rvue-dialog :visible.sync="visibleSync" top="10vh" width="30%" :title="$t('chartDesign.plzac')">
			<div class="titleLine"></div>
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			<div style="margin: 15px 0"></div>
			<el-checkbox-group v-model="checkedReports" @change="handleChecked">
				<el-checkbox v-for="report in reportList" :label="report.reportCode" :key="report.reportCode">{{ getReportName(report.title) }}</el-checkbox>
			</el-checkbox-group>
			<span slot="footer" class="dialog-footer">
				<rvue-button size="mini" @click="visibleSync = false">取 消</rvue-button>
				<rvue-button size="mini" type="primary" @click="handleSave">确 定</rvue-button>
			</span>
		</rvue-dialog>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	// import { getFormSingleTest } from "@/api/form";
	// import { getDataset } from "@/api/dataset";
	import { ReportListItem, Title, FilterListItem, Rules } from "./_type/index";
	// import { CList, FList } from "@/components/chartDesign/components/attr/CTfilter/sys";
	import { ChartModule } from "@/store/modules/chart";

	@Component({
		components: {},
	})
	export default class SelectReportDialog extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: any;
		private visibleSync: boolean = false;
		private checkAll: boolean = false;
		private checkedReports: any = []; //选中的
		private reportList: any = []; //所有的报表
		private isIndeterminate: boolean = true;

		private get lang() {
			return localStorage.getItem("lang") || "zh";
		}

		get filterList() {
			return ChartModule.filterList;
		}
		private handleCheckAllChange(val: boolean) {
			let list = val
				? this.reportList.map((item: ReportListItem) => {
						return item.reportCode;
				  })
				: [];

			this.$set(this, "checkedReports", list);

			this.isIndeterminate = false;
		}
		handleChecked(value: string[]) {
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.reportList.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.reportList.length;
		}
		private showHandler() {
			this.visibleSync = true;
			if (!this.data.config.checkedReports) return [];
			// this.checkedReports = this.data.config.checkedReports.map((item: any) => {
			// 	return item.reportCode;
			// });
			this.visibleSync = true;
		}
		//请求所有的报表
		// private getAllReports() {
		// 	return new Promise((res, rej) => {
		// 		this.data.config.reportLists.map((item: any) => {});

		// 		//getFormSingleTest(this.$route.params.appCode, this.$route.params.formCode).then((resL: TResponse) => {
		// 		// let newReportLists = resL.data.structure.layout.filter((item: any) => {
		// 		// 	if (item.code === this.$route.params.id) {
		// 		// 		//处理filter类型
		// 		// 		if (this.$route.params.type == "filter") {
		// 		// 			//初始化
		// 		// 			this.$set(this.data.config, "reportLists", []);

		// 		// 			this.$set(this.data, "config", {
		// 		// 				...this.data.config,
		// 		// 				selectDefaultMethod: item.selectDefaultMethod,
		// 		// 				form: item.form,
		// 		// 				fieldName: item.fieldName,
		// 		// 				fieldType: item.fieldType,
		// 		// 			});

		// 		// 			// 1、多次渲染问题
		// 		// 			// 仪表盘列表循环请求会导致 报表-筛选器-报表

		// 		// 			// 解决方案：所有报表先循环一次 拿到所有的筛选器把filter搭建好 再循环一次构建报表

		// 		// 			// 2、筛选器configList太多问题 导致请求慢
		// 		// 			// 解决方案：reportLists数据结构改为 循环请求form结构 拿到configList以及其他
		// 		// 			// [{
		// 		// 			// 	sourceCode: "3370c08ecbf847da8d866e39085adef1",
		// 		// 			//
		// 		// 			// },
		// 		// 			// ]

		// 		// 			//请求form结构拿到configList

		// 		// 			// {
		// 		// 			// 	code: "5f14327582084f5abbcffd1612f43836", //筛选器code
		// 		// 			// 	title:{
		// 		// 			// 		"en": "bar1",
		// 		// 			// 		"zh": "未命名筛选器"
		// 		// 			// 	},
		// 		// 			// 	type: "filter",
		// 		// 			// 	reportLists:[ //选中的报表列表
		// 		// 			// 		{
		// 		// 			// 			code: "5f14327582084f5abbcffd1612f43836",//报表code
		// 		// 			// 			selectField:""//报表选中的字段
		// 		// 			// 		}
		// 		// 			// 	],
		// 		// 			// 	filterType:'input'//筛选字段
		// 		// 			// 	filterDefaultValue:""//筛选值默认值
		// 		// 			// 	filterDefaultMethod:""//筛选方法
		// 		// 			// 	filterDefaultName:""//筛选名字

		// 		// 			// }

		// 		// 			//item.reportLists
		// 		// 			// getFormSingleTest(this.$route.params.appCode, res.data.sourceCode).then(()=>{

		// 		// 			// })
		// 		// 		}
		// 		// 	}
		// 		// 	return !["filter", "editor", "table"].includes(item.type);
		// 		// });

		// 		//赋值拿到全新的所有的
		// 		// this.reportList = newReportLists;

		// 		// if (this.data.config.reportLists) {
		// 		// 	//如果修改了名字
		// 		// 	this.data.config.reportLists =
		// 		// 		this.data.config?.reportLists &&
		// 		// 		this.data.config?.reportLists.map((item: any, index: number) => {
		// 		// 			if (newReportLists[index] && item.code == newReportLists[index].code) {
		// 		// 				if (newReportLists[index].sourceCode != item.sourceCode) {
		// 		// 					this.$message.error("数据源更改，请重新配置");
		// 		// 				}

		// 		// 				return { ...item, title: newReportLists[index].title, sourceType: newReportLists[index].sourceType, sourceCode: newReportLists[index].sourceCode };
		// 		// 			}
		// 		// 			return item;
		// 		// 		});
		// 		// }

		// 		//res(this.reportList);
		// 		//});
		// 	});
		// }
		//报表名字
		private getReportName(title: Title) {
			if (!title) return;
			return title[<string>localStorage.getItem("lang")];
		}
		//配置表单名字或者删除
		// private async setReports() {
		// 	//拿到勾选的
		// 	let reportList = this.reportList.filter((item: ReportListItem) => {
		// 		return this.checkedReports.includes(item.code);
		// 	});

		// 	for (let item of reportList) {
		// 		//给新配置的赋值选中组件
		// 		this.data.config.reportLists.map((item: any, index: number) => {
		// 			if (reportList[index]) {
		// 				this.$set(reportList[index], "selectField", item.selectField);
		// 			}
		// 			//赋值第二个的报表
		// 			if (item.configFilterList && reportList[index]) {
		// 				this.$set(reportList[index], "configFilterList", item.configFilterList);
		// 			}
		// 		});

		// 		if (item.sourceType == "form") {
		// 			try {
		// 				let res = await getFormSingleTest(this.$route.params.appCode, item.sourceCode);
		// 				let list: Record<string, any>[] = [];
		// 				res.data.structure.configList.forEach((item: Record<string, any>) => {
		// 					if (!["separator", "tab", "table"].includes(item.type)) {
		// 						list.push(item);
		// 					}
		// 					if (item.type == "table") {
		// 						let { children, ...attr } = item;

		// 						let child = children.map((ite: Record<string, any>) => ({
		// 							...ite,
		// 							title: {
		// 								zh: item.title.zh + "." + ite.title.zh,
		// 								en: item.title.en + "." + ite.title.en,
		// 							},
		// 							parent: attr,
		// 						}));
		// 						list.push(...child);
		// 					}
		// 				});
		// 				let sysList: any = [];
		// 				if (item.formType == "C") {
		// 					sysList = CList;
		// 				} else if (item.formType == "F") {
		// 					sysList = this.$utils.deepClone(FList);
		// 					//删除流程状态
		// 					// sysList.splice(0, 1);
		// 				}

		// 				//给全新的配置
		// 				item.configList = [...list, ...sysList];

		// 				//如果选择组件被删除--清空
		// 				if (
		// 					item.selectField &&
		// 					!item.configList
		// 						.map((item: any) => {
		// 							return item.fieldId;
		// 						})
		// 						.includes(item.selectField)
		// 				) {
		// 					item.selectField = "";
		// 				}
		// 			} catch (error) {
		// 				if ((error.code = "FM-FORM_NOT_EXISTS")) {
		// 					item.selectField = "";
		// 					item.configList = [];
		// 				}
		// 			}
		// 		} else {
		// 			//请求数据集
		// 			let res = await getDataset(this.$route.params.appCode);
		// 			let datasetConfig = res.data.filter((itx: TJson) => {
		// 				return item.sourceCode === itx.datasetCode;
		// 			});

		// 			item.configList = datasetConfig[0].structure;
		// 		}
		// 	}
		// 	console.log(reportList, "reportList");
		// 	this.$set(this.data.config, "reportLists", reportList);
		// }
		//保存
		private handleSave() {
			//删除该过滤器的之前的全部在重新设置
			let filterList = this.filterList.map((filterListItem: FilterListItem) => {
				let matchRules = filterListItem.matchRules.filter((rule: Rules) => {
					return rule.id != this.$route.params.id;
				});
				return {
					...filterListItem,
					matchRules,
				};
			});
			ChartModule.SET_List(filterList);

			this.data.config.reportLists.map((item: any) => {
				item.selectField = "";
			});
			let checkedReports = this.checkedReports.map((item: any) => {
				let obj: any = {
					reportCode: item,
					selectField: "",
					parentFieldId: "",
				};
				this.data.config.reportLists.map((rItem: any) => {
					if (rItem.reportCode == item) {
						obj.sourceCode = rItem.sourceCode;
					}
				});
				return obj;
			});
			console.log("看看", checkedReports);
			this.$set(this.data.config, "checkedReports", checkedReports);
			this.$set(this.data.config, "selectDefaultMethod", "");
			this.$set(this.data.config, "fieldType", "");
			this.$set(this.data.config, "fieldName", "");
			this.$set(
				this.data.config,
				"checkedReports",
				this.$utils.deepClone(
					this.data.config.reportLists.filter((item: any) => {
						return this.checkedReports.includes(item.reportCode);
					})
				)
			);
			// this.setReports();
			this.visibleSync = false;
		}
		private mounted() {
			// this.getAllReports().then((reportList: any) => {
			// 	//回显选中的
			// 	this.checkedReports = this.data.config.reportLists
			// 		? this.data.config.reportLists.map((item: ReportListItem) => {
			// 				return item.code;
			// 		  })
			// 		: [];
			// 	// this.setReports();
			// });
		}
		//拿到所有的报表
		@Watch("data.config.reportLists", { deep: true, immediate: true })
		onChangeReports(n: any) {
			if (n) {
				this.reportList = n;
				//防止切换数据源无法响应 重新赋值sourceCode

				this.checkedReports = this.data.config.checkedReports.map((item: any) => {
					return item.reportCode;
				});
				let newCheckedReports = this.data.config.checkedReports.map((item: any) => {
					let obj: any = {
						reportCode: item.reportCode,
						selectField: item.selectField,
						parentFieldId: item.parentFieldId,
					};
					this.data.config.reportLists.map((rItem: any) => {
						if (rItem.reportCode == item.reportCode) {
							obj.sourceCode = rItem.sourceCode;
						}
					});
					return obj;
				});

				this.$set(this.data.config, "checkedReports", newCheckedReports);
			}
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body{
	padding:30px !important;
}
	.show {
		border: 1px solid rgba(209, 209, 209, 1);
		background: rgba(241, 241, 241, 1);
		color: #888888;
		height: 30px;
		cursor: pointer;
	}
	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.marginb30 {
		margin-bottom: 30px;
	}
	::v-deep.el-checkbox-group {
		display: flex;
		flex-direction: column;

		.el-checkbox {
			display: flex;
			align-items: center;
		}
		.el-checkbox__label {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			width: 400px;
		}
	}
	.titleLine{
		height: 29px;
		width: 5px;
		background: #6087fd;
		position: absolute;
		top: 11%;
		left: 5%;
		transform: translateY(-50%);
	}
</style>
