<template>
	<div class="chart-list" @mouseenter="hover(item.code)" @mouseleave="hover(-1)">
		<div class="title" v-if="item.type !== 'editor'" v-bind="{ type: item.type }">
			<div>{{ item.title | getTitle }}</div>
		</div>
		<div class="option-list" :class="{ 'show-options': showIndex === item.i }">
			<img class="pointer" @click="editHandler(item.type, item.code)" v-if="!readyOnly && editorReadyonly && item.type != 'error'" :src="`${publicPath}img/bi_icon/edit.png`" alt="edit" />
			<img class="pointer" @click="fetchChartData" v-if="item.type !== 'editor' && item.type != 'error' && item.type != 'filter'" :src="`${publicPath}img/bi_icon/update.png`" alt="refresh" />
			<el-popover v-if="this.item.reportConfig != null" placement="bottom" width="200" trigger="click">
				<div v-html="item.reportConfig.desc"></div>
				<img class="pointer" slot="reference" v-if="item.type !== 'editor' && item.type != 'error' && item.type != 'filter'" :src="`${publicPath}img/bi_icon/help.png`" alt="" />
			</el-popover>
			<img
				class="pointer"
				v-if="!readyOnly && editorReadyonly && item.type != 'error' && item.type != 'filter'"
				@click="handleCopy(dataQuery, item)"
				:src="`${publicPath}img/bi_icon/copy.png`"
				alt="copy"
			/>
			<img class="pointer" v-if="!readyOnly && editorReadyonly" @click="handleDelete(item)" :src="`${publicPath}img/bi_icon/delete.png`" alt="delete" />
			<!-- <img class="pointer" v-if="item.type == 'raw_data'" @click="reportDataVisible = true" :src="`${publicPath}img/bi_icon/showdata.png`" alt="showdata" /> -->
		</div>

		<div
			ref="echart-container"
			v-loading="loading"
			:style="{
				height: '100%',
				width: ' 100%',
				padding: item.type !== 'editor' && item.type !== 'table' ? '0' : '0',
				'padding-top': item.type !== 'editor' ? '30px' : '0',
			}"
		>
			<div v-if="isError && item.type !== 'table'" class="flex">{{ isError }}</div>

			<component
				v-show="!hide"
				v-else-if="!isError"
				:pageSize="item.pageSize"
				:data="dataQuery"
				:dataChart="dataChart"
				:ref="'chart_' + item.code"
				:formConfig="formConfig"
				@blur="blurHandler"
				:editorReadyonly="editorReadyonly"
				@update="updateHandler"
				:item="item"
				:readyOnly="readyOnly"
				:mode="mode"
				:parent="this"
				:theme="theme"
				:is="getComponent(item.type)"
				:type="item.type"
				:filterForm="filterForm"
			>
			</component>
		</div>
		<!-- <report-data-drawer v-if="item.type == 'raw_data'" :reportData="dataQuery.config.source" :visible.sync="reportDataVisible"></report-data-drawer> -->
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Emit, Prop, Inject, Watch, Provide } from "vue-property-decorator";
	import { deleteChart, getChartStr, getChartData } from "@/api/bi";
	import { getFormSingleTest, queryRecursiveTree } from "@/api/form";
	import { getFormSingle } from "@/api/form";
	import { dateAdd } from "@/components/chartDesign/components/attr/CTdi/_core/methods";
	import toEchartsData from "@/utils/toEchartsData";
	import BiTable from "@/components/chartComps/biTable.vue";
	import BiQuota from "@/components/chartComps/biQuota.vue";
	import BiCostum from "@/components/chartComps/biCostums.vue";
	import BiEditor from "@/components/chartComps/biEditor.vue";
	import BiFilter from "@/components/chartComps/biFilter.vue";
	import { filterQueryReportData } from "@/components/chartComps/_config/filterQueryReportData";
	import ReportDataDrawer from "@/components/chartComps/costum/ReportDataDrawer.vue";
	import { Rules, FilterListItem, Field } from "@/components/chartComps/_filterComponent/_configComponent/_type/index";
	import { getDataset } from "@/api/dataset";
	import { ChartModule } from "@/store/modules/chart";
	import { registerCoordinateSystem } from "echarts";
	import { FormModule } from "@/store/modules/form";

	import { configListFlag } from "@/utils/global";
	@Component({
		components: {
			BiTable,
			BiQuota,
			BiEditor,
			BiCostum,
			BiFilter,
			ReportDataDrawer,
		},
	})
	export default class BiSetting extends Vue {
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Prop({ type: String, default: "default" }) theme!: string;
		@Prop({ type: Boolean, default: false }) readyOnly!: boolean;
		@Prop({ type: String, default: "pc" }) mode!: string;
		@Prop({ type: String, default: "view" }) modeE!: string; //访问还是编辑

		@Provide("processStatusList")
		processStatusList: TJson = {
			1: this.$t("flow.doing"),
			9: this.$t("flow.flowSuccess"),
			8: this.$t("flow.stopFlow"),
		}; //流程状态类型
		private dataQuery: TJson = {
			config: { source: [] },
		}; //请求数据携带参数--结构
		private dataChart: any = {}; //图表配置
		private showIndex: number = -1; //浮动显示按钮
		private formConfig: TJson = {
			configList: [],
		};
		private isError: string = "";
		private filterForm: any = {};
		private loading: boolean = true;
		private editorReadyonly: boolean = true;
		private reportDataVisible: boolean = false;
		//private helpDocumentation:any="";
		private hide: boolean = false; //echarts tooltip快速切换路由会不消失
		//拿store的state
		get filterList() {
			return ChartModule.filterList;
		}
		//yhw写的静态报表配置
		private getMinflag(x: number, y: number, sX: number) {
			if (!this.dataQuery.type || !this.dataChart.xAxis) return;
			// this.dataChart.dataZoom[0].start = 0;

			let dataLength = this.dataChart.xAxis?.data.length;
			if (y < 250) {
				this.dataChart.yAxis.splitNumber = 2;
			} else {
				this.dataChart.yAxis.splitNumber = 5;
			}
			if (sX == 3) {
				this.dataChart.xAxis.axisLabel.interval = Math.floor(dataLength / 4);
				return;
			}

			if (x < 500) {
				this.dataChart.series?.forEach((item: any) => {
					if (item.label.formatter) {
						// item.label.formatter = item.label.formatter.split(": ")[1];
					}
				});
				this.dataChart.xAxis.axisLabel.width = 40;
				// this.dataChart.dataZoom[0].end = dataLength > 7 ? 25 : 100;
				// this.dataChart.xAxis.axisLabel.interval = 0;
			} else {
				this.dataChart.series?.forEach((item: any) => {
					if (item.label.formatter) {
						let str = item.label.formatter;
						// item.label.formatter = str.indexOf("{b}") > -1 ? str : "{b} : " + str;
						item.label.width = Math.floor(x / dataLength) * 1.5;
					}
				});
				this.dataChart.dataZoom[0].end = 100;
				this.dataChart.xAxis.axisLabel.width = Math.floor(x / dataLength) * 1.5;
				this.dataChart.xAxis.axisLabel.interval = dataLength > 10 ? 1 : 0;
			}
		}
		//强制echarts tooltip消失防止在其他页面无法关闭
		public destroyed() {
			if (["bar", "line", "raw_data", "pie"].includes(this.item.type)) {
				this.hide = true;
			}
		}
		//给报表请求接口合成dashboardFilters 然后请求
		@Watch("filterList", { deep: true })
		async onChangeFilter(n: FilterListItem[], o: FilterListItem[]) {
			if (["editor", "filter", "table"].includes(this.item.type)) return;
			let newList =
				n &&
				n.find((item: FilterListItem) => {
					return item.formCode == this.item.code;
				});
			let oldList =
				o &&
				o.find((item: FilterListItem) => {
					return item.formCode == this.item.code;
				});
			//第一次不渲染 所有报表循环一次后拿到所有的filter后请求
			// if (!oldList) return;

			if (newList) {
				if (
					!oldList ||
					newList.matchRules.length == 0 ||
					JSON.stringify(newList.matchRules) != JSON.stringify(oldList.matchRules) ||
					JSON.stringify(newList.matchRules) == JSON.stringify(oldList.matchRules)
				) {
					let dashboardFilters = newList.matchRules.filter((item: Rules) => {
						let bool: boolean = (item.method != "not_empty" && item.method != "empty" && item.judgeValues[0] != null) || item.method == "not_empty" || item.method == "empty";

						return item.method && item.targetFieldCode && bool && this.item.sourceCode == item.sourceCode;
					});

					this.$set(this.dataQuery, "dashboardFilters", dashboardFilters);
					this.validateQueryData(this.fetchChartData);
				}
				if (oldList) {
					//除了第一次 都请求
					// this.fetchChartData();
				}
			}
		}

		// @Watch("item.reportConfig.desc",{ deep: true, immediate: true })
		// change(v:any){
		// 	console.log(v,7878);
		// 	console.log(typeof v,'类型');

		// 	if(v!=undefined){
		// 		this.helpDocumentation=v.replace(/<\/?.+?>/g,"").replace(/ /g,"")
		// 	}
		// }

		private get formsTree() {
			return FormModule.formsTree;
		}
		/**
		 * @description: 请求报表数据
		 * @param {*}
		 * @return {*}
		 */

		private async fetchChartData() {
			this.loading = true;
			if (this.item.type == "raw_data") {
				(<any>this).$refs["chart_" + this.item.code].getCostumData();
			}

			if (this.dataQuery.sourceType === "form") {
				//	let res = await queryRecursiveTree(this.$route.params.appCode);
				//console.log(this.formsTree.formMap, "formsTreeformsTree");
				let sourceData: TJson = Object.values(this.formsTree.formMap).filter((element: any) => {
					return element.code == this.dataQuery.sourceCode;
				});
				//表单暂无数据-表单被删除
				if (sourceData.length === 0) {
					//清空配置
					this.isError = "暂无数据";
					this.loading = false;
					return;
				}

				let resF = await getFormSingle(sourceData[0].appCode, sourceData[0].code);

				if (resF.data.structure) {
					this.formConfig = {
						configList: resF.data.structure.configList,
						code: resF.data.code,
						appCode: resF.data.appCode,
						sourceType: "form",
						type: resF.data.type,
					};
				}
			} else {
				//数据集

				let res = await getDataset(this.$route.params.appCode);
				let list = res.data.filter((item: TJson) => {
					return item.datasetCode === this.dataQuery.sourceCode;
				});

				this.formConfig = {
					configList: list[0]?.structure,
					code: list[0]?.datasetCode,
					appCode: list[0]?.appCode,
					sourceType: "dataset",
					correspond: list[0]?.correspond,
					datasetSql: list[0]?.datasetSql,
					displaySql: list[0]?.displaySql,
				};
			}

			this.loading = false;
			if (this.item.type == "table") {
			} else if (this.item.type == "raw_data") {
				if (typeof this.dataQuery.config.codeJ == "undefined") return;
				let code = this.dataQuery.config.codeJ;

				this.dataChart = code;
			} else {
				console.log(this.dataQuery.dashboardFilters, "dataQuerydataQuery==================>");
				getChartData(this.$route.params.appCode, this.$route.params.formCode, this.item.code, filterQueryReportData(this, this.dataQuery))
					.then((resD: TResponse) => {
						if (
							(resD.data.data &&
								resD.data.data.filter((item: any) => {
									return item.name != "null";
								}).length === 0) ||
							((this.item.type == "bar" || this.item.type == "line") && resD.data.x[0].data.length == 0)
						) {
							this.isError = "暂无数据";
							this.loading = false;
							this.$set(this, "dataChart", {});
							return;
						}
						this.isError = "";
						if (this.item.type == "bar" || this.item.type == "line") {
							let yConfig: any = {};
							//维度第二位的配置

							if (this.dataQuery.dimensions[1]) {
								console.log(this.dataQuery, "dataQuerydataQuery");

								yConfig = configListFlag(this.formConfig.configList).find((item: any) => {
									return this.dataQuery.dimensions[1].code == item.fieldId;
								});
								//组合组件显示问题
								if (yConfig && ["checkbox", "selectMulti"].includes(yConfig.type)) {
									// this.dataQuery.config = {
									// 	...this.dataQuery.config,
									// 	formatter: function (params: any) {
									// 		let options = params[0].axisValueLabel.split(",");
									// 		let str = params[0].axisValueLabel + "<br>";
									// 		params.map((item: any, index: number) => {
									// 			str = str + options[index] + "&nbsp;&nbsp;:&nbsp;&nbsp;" + item.data + "<br>";
									// 		});
									// 		return str;
									// 	},
									// };
								}
							}

							let option = {
								xAxis: [
									{
										type: "category",
										axisLabel: {
											fontStyle: "normal",
										},
										data: [],
									},
								],
								series: {},
							};
							//数据
							option.series =
								resD.data &&
								resD.data.val.map((itemSeries: TJson, index: number) => {
									let name = resD.data.val[index].y ? resD.data.val[index].y[0] : resD.data.val[index].text[<string>localStorage.getItem("lang")];
									try {
										name = JSON.parse(name).join(",");
									} catch (error) {}
									return {
										type: this.dataQuery.type,
										name: name,
										label: {
											show: true,
											position: "top",
										},
										data: resD.data.val[index].data,
									};
								});
							let xConfig: any;
							xConfig = { type: this.dataQuery.dimensions[0].dataTypeEnum };

							xConfig = configListFlag(this.formConfig.configList).find((item: any) => {
								return this.dataQuery.dimensions[0].code == item.fieldId;
							})
								? configListFlag(this.formConfig.configList).find((item: any) => {
										return this.dataQuery.dimensions[0].code == item.fieldId;
								  })
								: xConfig;

							//x轴

							option.xAxis[0].data =
								resD.data &&
								resD.data.x[0].data
									.filter((item: any, index: number) => {
										if (item == "null") {
											//删除y轴对应的值
											resD.data.val = resD.data.val.map((yItem: any) => {
												yItem.data.splice(index, 1);
												return yItem;
											});
										}
										return item !== "null";
									})
									.map((item: any) => {
										if (!xConfig) return item;
										if ((<any>xConfig).type == "number") {
											if (xConfig?.numFormat?.allowDecimalDigits) {
												return parseFloat(item).toFixed(xConfig.numFormat.decimalDigitsNum);
											}
											return item;
										} else if (["create_time", "datetime", "update_time"].includes((<any>xConfig).type)) {
											//加格式

											return item + (<any>dateAdd)[this.dataQuery.dimensions[0].dateTimeSummary];
										} else if ((<any>xConfig).type == "selectMulti" || (<any>xConfig).type == "checkbox") {
											return JSON.parse(item).join(",");
										} else {
											return item;
										}
									});

							this.dataQuery = {
								...this.dataQuery,
								data: { series: option.series, xAxis: option.xAxis },
							};

							this.dataQuery.w = this.item.w;
							this.loading = false;
							setTimeout(() => {
								this.$set(this, "dataChart", { ...(new toEchartsData(this.dataQuery, this) as any).geteChartsData() });
							});
							if (this.item.w == 3) {
								// this.dataChart.xAxis.axisLabel.interval = Math.floor(this.dataChart.xAxis.data.length / 4);
							}
						} else if (this.item.type == "pie") {
							let xConfig: any;
							xConfig = { type: this.dataQuery.dimensions[0].dataTypeEnum };

							xConfig = configListFlag(this.formConfig.configList).find((item: any) => {
								return this.dataQuery.dimensions[0].code == item.fieldId;
							})
								? configListFlag(this.formConfig.configList).find((item: any) => {
										return this.dataQuery.dimensions[0].code == item.fieldId;
								  })
								: xConfig;
							this.dataQuery = {
								...this.dataQuery,
								data: {
									series: [
										{
											data: resD.data.data
												.filter((item: any) => {
													return item.name != "null";
												})
												.map((item: any) => {
													if (!xConfig) return item;
													if (["create_time", "datetime", "update_time"].includes((<any>xConfig).type)) {
														//加格式
														item.name = item.name + (<any>dateAdd)[this.dataQuery.dimensions[0].dateTimeSummary];
														return item;
													} else {
														return item;
													}
												}),
											type: "pie",
											radius: "50%",
											label: {
												show: true,
												position: "top",
											},
										},
									],
								},
							};
							this.loading = false;
							this.dataQuery.w = this.item.w;
							setTimeout(() => {
								this.dataChart = (new toEchartsData(this.dataQuery, this) as any).geteChartsData();
							});
						} else if (this.item.type == "quota") {
							this.$set(this.dataQuery, "quotaList", resD.data.values);
						}
					})
					.catch((err: any) => {
						console.log(err, "err");
						this.isError = "暂无数据";
					});
			}
		}

		/**
		 * @description: 请求报表数据前验证参数是否被修改 分form和dataset
		 * @param {* fn 回调函数}
		 * @return {*boolean}
		 */
		private async validateQueryData(fn: any) {
			if (this.dataQuery.sourceType == "form") {
				//form指标维度是否被删除
				let resF = await getFormSingleTest(this.$route.params.appCode, this.dataQuery.sourceCode);
				let allFieldIdList: TJson = [];

				resF.data.structure.configList.map((item: TJson) => {
					allFieldIdList.push(item.fieldId);
					if (item.children) {
						item.children.map((item: TJson) => {
							allFieldIdList.push(item.fieldId);
						});
					}
				});
				this.dataQuery.dimensions = this.dataQuery.dimensions.filter((item: any) => {
					return allFieldIdList.includes(item.code) || ["creater", "create_time", "update_time", "process_status"].includes(item.code);
				});
				this.dataQuery.indicators = this.dataQuery.indicators.filter((item: any) => {
					return allFieldIdList.includes(item.code) || ["creater", "create_time", "update_time", "process_status"].includes(item.code);
				});
				fn.call();
			}
			if (this.dataQuery.sourceType == "dataset") {
				let res = await getDataset(this.$route.params.appCode);

				let datasetItem =
					res.data.filter((item: TJson) => {
						//找对应的数据集
						return item.datasetCode === this.dataQuery.sourceCode;
					})[0] || {};
				let fieldIdList = datasetItem.structure.map((item: any) => {
					return item.fieldIdAsName;
				});

				let add = (function (dimensionsList: Record<string, any>[] = [], indicatorsList: Record<string, any>[] = []) {
					return function (...args: any) {
						if (!args.length)
							return {
								dimensionsList: dimensionsList.filter((item: Record<string, any> | undefined) => item),
								indicatorsList: indicatorsList.filter((item: Record<string, any> | undefined) => item),
							};

						let [type, list, obj] = args;
						let idx: number = list.findIndex((ite: Record<string, any>) => ite.fieldIdAsName == obj.fieldIdAsName);
						let arr: Record<string, any>[] = type == "d" ? dimensionsList : indicatorsList;
						if (idx >= 0 && fieldIdList.includes(obj.fieldIdAsName)) {
							arr[idx] = {
								...list[idx],
								title: obj.title,
								dataTypeEnum: obj.type,
								fieldIdAsName: obj.fieldIdAsName,
							};
						}
					};
				})();

				datasetItem.structure.map((item: any) => {
					[
						{
							t: "d",
							list: this.dataQuery.dimensions,
						},
						{
							t: "i",
							list: this.dataQuery.indicators,
						},
					].map(({ t, list }: Record<string, any>) => add(t, list, item));
				});

				let { dimensionsList, indicatorsList } = <Record<string, any>>add();
				this.dataQuery.dimensions = dimensionsList;
				this.dataQuery.indicators = indicatorsList;
				fn.call();
			}
		}

		//按钮浮现
		private hover(showIndex: number) {
			this.showIndex = showIndex;
		}
		//点击编辑
		private editHandler(type: string, code: string) {
			if (type == "raw_data") {
				this.$emit("save");
				this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/chart/costum/${code}`);
			} else if (type != "editor") {
				this.$emit("save");
				this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/chart/${type}/${code}`);
			} else {
				this.item.type === "editor" && (this.editorReadyonly = false);
				this.$message("当前已变为编辑");
				this.$emit("ismove", false);
			}
		}
		//重置宽度和高度
		private resize(width: number, height: number) {
			(<any>this).$refs["chart_" + this.item.code]?.resize && (<any>this).$refs["chart_" + this.item.code].resize(width, height);
			this.dataQuery.w = this.item.w;
			this.dataChart = (new toEchartsData(this.dataQuery, this) as any).geteChartsData();
		}
		private getComponent(type: string) {
			if (!type) return;
			let chartList = ["pie", "bar", "line", "raw_data"];
			if (chartList.includes(type)) {
				return "rvue-echarts";
			}

			return `bi-${type}`;
		}
		//点击复制
		public handleCopy(dataQuery: TJson, item: TJson) {
			let data = dataQuery;
			if (item.type === "editor") {
				data = {
					type: "editor",
				};
			}
			this.$emit("copy", dataQuery, item);
		}
		//接受回调
		private updateHandler(n: string, code: string) {
			this.$emit("update", n, code);
		}
		//富文本失焦
		private blurHandler() {
			if (this.item.type === "editor") {
				this.editorReadyonly = true;
				this.$emit("ismove", true);
			}
		}
		//点击删除
		@Emit("delete")
		public handleDelete() {
			this.$refs[`chart_${this.item.code}`] && (<any>this).$refs[`chart_${this.item.code}`].deleteHandler && (<any>this).$refs[`chart_${this.item.code}`].deleteHandler(this.item.code);
		}
		//报表回显
		protected async mounted() {
			//结构请求一次
			if (this.item.type == "editor") {
				// if (this.item.type == "filter") {
				// this.filterForm = this.$utils.deepClone(this.item.form);
				// //检测表单组件的配置是否被更改--取数据源第一个
				// try {
				// 	if (this.item.reportLists[0].sourceType == "dataset") {
				// 	} else {
				// 		let res = await getFormSingleTest(this.$route.params.appCode, this.item.reportLists[0].sourceCode);
				// 		let list: Record<string, any>[] = [];
				// 		let newReportLists: Record<string, any>[] = [];
				// 		res.data.structure.configList.forEach((item: Record<string, any>) => {
				// 			if (!["separator", "tab", "table"].includes(item.type)) {
				// 				list.push(item);
				// 			}
				// 			if (item.type == "table") {
				// 				let { children, ...attr } = item;
				// 				let child = children.map((ite: Record<string, any>) => ({
				// 					...ite,
				// 					title: {
				// 						zh: item.title.zh + "." + ite.title.zh,
				// 						en: item.title.en + "." + ite.title.en,
				// 					},
				// 					parent: attr,
				// 				}));
				// 				list.push(...child);
				// 			}
				// 		});

				// 		this.item.reportLists[0].configList = list;
				// 	}

				// 	this.$set(this.dataQuery, "config", {
				// 		filterId: this.item.code,
				// 		reportLists: this.item.reportLists,
				// 		fieldName: this.item.fieldName,
				// 		fieldType: this.item.fieldType,
				// 		selectDefaultMethod: this.item.selectDefaultMethod,
				// 		form: { ...this.item.form },
				// 	});
				// } catch (error) {
				// 	console.log(error);
				// 	//报表选择了数据集表单被删除
				// 	if (error.code == "FM-FORM_NOT_EXISTS") {
				// 		this.loading = false;
				// 	}
				// }

				//调首次
				// (<any>this).$refs["chart_" + this.item.code].$refs["filterValue"].onceupdate();
				// }
				this.loading = false;
			} else {
				this.editorReadyonly = true;

				getChartStr(this.$route.params.appCode, this.$route.params.formCode, this.item.code)
					.then(async (resS: TResponse) => {
						this.item.title = resS.data.title;
						console.log(resS.data.reportConfig, "resS.data.reportConfig");
						// if(resS.data.reportConfig!=null){
						// 	this.item.reportConfig=resS.data.reportConfig;
						// }
						this.item.reportConfig = resS.data.reportConfig;
						console.log(this.item.reportConfig, "itemConfig");

						//筛选器
						if (resS.data.type == "filter") {
							this.dataQuery.config = {
								...resS.data.config,
							};
							this.filterForm = this.$utils.deepClone(resS.data.config.filterForm);
							let r = this.dataQuery.config.checkedReports;

							let allP: any = [];

							for (let i = 0; i < r.length; i++) {
								let p;
								let rItem: any = { reportCode: r[i].reportCode };
								p = new Promise((resolve, reject) => {
									getChartStr(this.$route.params.appCode, this.$route.params.formCode, r[i].reportCode).then((res: TResponse) => {
										if (res.data.sourceType == "form") {
											//表单
											let reportLists: any = [];
											getFormSingleTest(this.$route.params.appCode, res.data.sourceCode).then((resF: any) => {
												rItem["title"] = res.data.title;
												rItem["sourceType"] = "form";
												rItem["sourceCode"] = res.data.sourceCode;
												rItem["sourceName"] = resF.data.multiLanguage;
												rItem["configList"] = resF.data.structure.configList;
												reportLists.push(rItem);
												resolve(reportLists);
											});
										} else {
											//数据集
											let reportLists: any = [];
											getDataset(this.$route.params.appCode).then((dRes: any) => {
												dRes.data.map((item: any) => {
													if (res.data.sourceCode == item.datasetCode) {
														rItem["title"] = res.data.title;
														rItem["sourceType"] = "dataset";
														rItem["sourceCode"] = res.data.sourceCode;
														rItem["sourceName"] = item.name;
														let configList: any[] = [];
														item.structure.forEach((item: Field) => {
															if (!["separator", "tab", "table"].includes(item.type)) {
																configList.push(item);
															}
															if (item.type == "table") {
																let { children, ...attr } = item;
																let child =
																	children?.map((ite: Field) => ({
																		...ite,
																		title: {
																			zh: item.title.zh + "." + ite.title.zh,
																			en: item.title.en + "." + ite.title.en,
																		},
																		parent: attr,
																	})) || [];
																configList.push(...child);
															}
														});
														rItem["configList"] = configList;
														reportLists.push(rItem);
														resolve(reportLists);
													}
												});
											});
										}
									});
								});
								allP.push(p);
							}
							Promise.all(allP).then(
								(values) => {
									console.log(values, "reportListsreportListsreportLists");
									//拿到所有请求结束后的操作
									let reportLists: any = [];
									values.map((item: any) => {
										reportLists = reportLists.concat(item);
									});

									this.$set(this.dataQuery.config, "reportLists", reportLists);
									//切换mode 重新请求
									(<any>this).$refs["chart_" + this.item.code].$children[0].handleUpdate();
								},
								(reason) => {
									console.log(reason);
								}
							);
							this.loading = false;
							return;
						}

						console.log(resS, "resS");

						this.dataQuery = {
							dashboardFilters: this.dataQuery.dashboardFilters,
							matchRules: [],
							code: this.$route.params.id,
							...resS.data,
							appCode: this.$route.params.appCode,
							formCode: this.$route.params.formCode,
						};

						//暂时
						this.dataQuery.top = {
							enable: false,
						};
						//筛一遍指标维度是不是被删除了
						this.validateQueryData(this.fetchChartData);
					})
					.catch((res) => {
						this.isError = "暂无数据";
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./_style/bichart.scss";
</style>
