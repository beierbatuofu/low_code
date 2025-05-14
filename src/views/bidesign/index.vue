<template>
	<div style="background: #f7f8fa">
		<bi-head :headTitle="headTitle" :data="data" @save="saveHandler" :isClickSave="isClickSave" :resCount="resCount" :formConfig="formConfig" :oldData="oldData" />
		<div class="bi-design" v-loading="loading">
			<div class="error" v-show="isError">{{ isError }}</div>
			<bi-body v-show="!isError" ref="body" :filterForm="filterForm" :pageSize="pageSize" :formConfig="formConfig" :data="data" />
			<rvue-button v-if="$route.params.type == 'costum'" @click="jsVisible = true" style="height: 40px; width: 60px; position: absolute; right: 440px; bottom: 60px"> JS </rvue-button>
			<rvue-button v-if="$route.params.type == 'costum'" @click="dataVisible = true" style="height: 40px; width: 60px; position: absolute; right: 360px; bottom: 60px">数据</rvue-button>
			<rvue-drawer size="80%" :modal-append-to-body="false" :visible.sync="jsVisible" direction="ltr">
				<bi-costum-mirror :visible.sync="jsVisible" :data="data" :formConfig="formConfig" v-if="$route.params.type == 'costum'" />
			</rvue-drawer>
			<report-data-drawer :reportData="data.config.source" :visible.sync="dataVisible"></report-data-drawer>
			<bi-config :data="data" :formConfig="formConfig" :filterForm="filterForm" />
		</div>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Vue, Provide } from "vue-property-decorator";
	import BiHead from "./head.vue";
	import MHeader from "@/components/m-header/m-header.vue";
	import BiConfig from "./config.vue";
	import BiBody from "./body.vue";
	import { saveChart, getChartData, updateChart, getChartStr, getChartDataset } from "@/api/bi";
	import { updateFormSingle, getFormSingle, getFormSingleTest } from "@/api/form";
	import { defaultEchartsData } from "./index.ts";
	import { filterQueryReportData } from "@/components/chartComps/_config/filterQueryReportData";
	import { getDataset } from "@/api/dataset";
	import BiCostumMirror from "@/components/chartComps/costum/mirror.vue";
	import ReportDataDrawer from "@/components/chartComps/costum/ReportDataDrawer.vue";
	import toDatetime from "@/core/toDatetime";
	import { Field } from "./_type/index";
	import { initCode } from "@/components/chartComps/costum/initCode";
	import { guid } from "@/utils/global";
	import { refreshJump, configListFlag } from "@/utils/global";
	import { dateAdd } from "@/components/chartDesign/components/attr/CTdi/_core/methods";
	import { CList, FList } from "@/components/chartDesign/components/attr/CTfilter/sys";

	@Component({
		components: {
			MHeader,
			BiConfig,
			BiBody,
			BiHead,
			BiCostumMirror,
			ReportDataDrawer,
		},
	})
	export default class Design extends Vue {
		@Provide("echartType")
		echartType: TJson = ["bar", "line", "pie", "costum", "quota", "raw_data"]; //echarts全部类型
		@Provide("processStatusList")
		processStatusList: TJson = {
			1: this.$t("flow.doing"),
			9: this.$t("flow.flowSuccess"),
			8: this.$t("flow.stopFlow"),
		}; //流程状态类型
		//获取的form配置
		private formConfig = {
			code: "",
			configList: [],
			sourceType: "form",
			formName: "",
			type: "C",
		};
		private jsVisible: boolean = false;
		private dataVisible: boolean = false;
		private data: any = {};
		private oldData: TJson = {};
		private resCount: number = 0;
		private isClickSave: boolean = false;
		private loading: boolean = true;
		private colNum: number = 12;
		private pageSize: number = 10;
		private sysList: TJson = ["process_status", "creater", "create_time", "submitter", "update_time"];
		private layoutMap: any = [];
		private layoutMMap: any = [];
		private isError: string = "";
		private filterForm: any = {};
		private headTitle = {};
		//监听右边需要更改数据的
		private get listenChange() {
			const { dimensions, indicators, top = {}, matchRules } = this.data;
			return { dimensions, indicators, top, matchRules };
		}

		private mounted() {
			// let fullPath = this.$route.path;
			// let supPath = fullPath.substr(0, fullPath.lastIndexOf("bi/"));
			// refreshJump(fullPath, this, supPath);
		}
		private destroyed() {
			window.onbeforeunload = null;
			window.onpopstate = null;
		}
		//监听数据改变请求数据
		@Watch("listenChange", { deep: true })
		onChangData(n: TJson, o: TJson) {
			let { type, formCode, appCode, id } = this.$route.params;
			this.isClickSave = false;
			this.resCount++;
			//是初始data不进入
			if (!this.echartType.includes(this.data.type) || JSON.stringify(this.data) == JSON.stringify(new defaultEchartsData(type))) return;
			//重新选择数据源清空是触发
			if (this.data.type === "quota" || type === "costum" || type === "raw_data") {
			} else {
				for (const key in n) {
					if (n[key] && n[key].length == 0 && key !== "matchRules" && this.resCount > 2) {
						this.data.data.series = [];

						this.data.data.xAxis && (this.data.data.xAxis[0].data = []);
						return;
					}
				}
			}

			let data = {
				...this.data, //放后面会导致切换数据源报错
				type: type,
				formCode: formCode,
				appCode: appCode,
				sourceCode: this.formConfig.code ? this.formConfig.code : this.data.sourceCode, //表单code
				sourceType: this.formConfig.sourceType,
				code: id,
				top: {
					enable: this.data.top?.enable ?? false,
					limit: this.data.top?.limit ? this.data.top?.limit : "100",
				},
			};

			//子表格对应子表格
			if (data.dimensions[0] && data.indicators[0] && data.dimensions[0].subCode && !data.indicators[0].subCode) {
				this.$set(this.data, "quotaList", []);
				this.$message("维度含子表格子字段时，指标仅支持子表格子字段");
				return;
			}

			//防止报错
			if (type == "quota") {
				if (data.indicators.length == 0) {
					this.loading = false;
					return;
				}
			} else if (type == "pie" || type == "bar" || type == "line" || type == "costum") {
				if (data.dimensions.length == 0 || data.indicators.length == 0) {
					if (type == "costum") {
						if (this.data.config.codeJ) {
							this.$set(this.data.config, "codeJ", this.data.config.codeJ + " ");
						} else {
							this.$set(this.data.config, "codeJ", initCode(this.data.config.uid));
						}
					}
					this.loading = false;
					return;
				}
				if (type == "costum") {
					data.type = "raw_data";
					this.$set(this.data, "sourceCode", this.formConfig.code ? this.formConfig.code : this.data.sourceCode);
					this.$set(this.data, "sourceType", this.formConfig.sourceType);
					if (this.data.config.codeJ) {
						this.$set(this.data.config, "codeJ", this.data.config.codeJ + " ");
					} else {
						this.$set(this.data.config, "codeJ", initCode(this.data.config.uid));
					}
					return;
				}
				this.daajug();
			}

			this.fetchData(id, data);
		}
		// @Watch("formConfig",{deep:true})
		// monitorData(val:any,oldval:any){
		// }
		//新增以后跳转
		@Watch("$route.params.id")
		onChangeRouter(n: string) {
			if (this.$route.params.type == "costum" || this.$route.params.type == "raw_data") return;
			let data = {
				...this.data,
				type: this.$route.params.type,
				appCode: this.$route.params.appCode,
				formCode: this.$route.params.formCode,
				id: this.$route.params.id,
				sourceCode: this.formConfig.code, //表单code
				sourceType: this.formConfig.sourceType,
			};
			this.echartType.includes(this.data.type) && this.fetchData(n, data);
		}

		//判断维度指标子表格的情况
		private daajug() {
			let subBool = false;
			let subCode = "";
			//表格子字段只能当前表格
			this.data.dimensions.forEach((item: any) => {
				if (item.subCode && !subCode) {
					subCode = item.subCode;
				} else if (item.subCode && subCode && subCode != item.subCode) {
					subBool = true;
				}
			});
			this.data.indicators.forEach((item: any) => {
				if (item.subCode && !subCode) {
					subCode = item.subCode;
				} else if (item.subCode && subCode && subCode != item.subCode) {
					subBool = true;
				}
			});
			if (subBool) {
				this.$message("维度指标含子表格子字段时，仅支持同一子表格子字段");
				throw new Error("exit");
			}
		}

		/**
		 * @description: 请求报表数据
		 * @param {*code:报表code，data：请求query（报表结构）}
		 * @return {*}
		 */
		private async fetchData(code: string, data: TJson) {
			let queryData = this.$utils.deepClone(data);
			delete queryData.code;
			delete queryData.data;
			delete queryData.tip;
			delete queryData.title;

			queryData.dimensions = queryData.dimensions.filter((item: TJson) => {
				return !item.isDelete;
			});
			queryData.indicators = queryData.indicators.filter((item: TJson) => {
				return !item.isDelete;
			});
			//测试数据集删除tagCode
			// queryData.dimensions = queryData.dimensions.map((item: TJson) => {
			// 	delete item.tagCode;
			// 	delete item.title;
			// 	return item;
			// });
			// queryData.indicators = queryData.indicators.map((item: TJson) => {
			// 	delete item.tagCode;
			// 	delete item.title;
			// 	return item;
			// });
			// queryData.type = "raw_data";
			// queryData.top = {
			// 	enable: false,
			// 	limit: "1",
			// };
			// let res = await getChartDataset(this.$route.params.appCode, filterQueryReportData(this, queryData));
			// if (res.data.data && res.data.data.length === 0) {
			// 	this.isError = "暂无数据";
			// 	return;
			// } else {
			// 	this.isError = "";
			// }
			// let headList: any = [];
			// let series: any = [];
			// this.data.dimensions.map((item: any) => {
			// 	headList.push(item.title[<any>localStorage.getItem("lang")]);
			// });
			// this.data.indicators.map((item: any) => {
			// 	headList.push(item.title[<any>localStorage.getItem("lang")]);
			// 	series.push({
			// 		label: {
			// 			show: true,
			// 		},
			// 		type: this.data.type,
			// 	});
			// });
			//填充数据
			// this.$set(this.data.data, "dataset", [headList, ...res.data]);
			// this.$set(this.data.data, "series", series);
			// this.loading = false;

			getChartData(this.$route.params.appCode, this.$route.params.formCode, code, filterQueryReportData(this, queryData))
				.then((res: TResponse) => {
					if (
						(res.data.data &&
							res.data.data.filter((item: any) => {
								return item.name != "null";
							}).length === 0) ||
						((this.$route.params.type == "bar" || this.$route.params.type == "line") && res.data.x[0].data.length === 0)
					) {
						this.isError = "暂无数据";
						this.$set(this.data.data, "series", []);
						return;
					} else {
						this.isError = "";
					}

					this.data.config.source = res.data;
					let xConfig: any;

					if (this.data.type == "line" || this.data.type == "bar") {
						//bar填充数据
						//维度第一位的配置
						xConfig = { type: this.data.dimensions[0].dataTypeEnum };

						xConfig = configListFlag(this.formConfig.configList).find((item: any) => {
							return this.data.dimensions[0].code == item.fieldId;
						})
							? configListFlag(this.formConfig.configList).find((item: any) => {
									return this.data.dimensions[0].code == item.fieldId;
							  })
							: xConfig;
						let yConfig: any = {};
						//维度第二位的配置
						if (this.data.dimensions[1]) {
							yConfig = configListFlag(this.formConfig.configList).find((item: any) => {
								return this.data.dimensions[1].code == item.fieldId;
							});

							//组合组件显示问题
							// if (yConfig && ["checkbox", "selectMulti"].includes(yConfig.type)) {
							// 	this.data.config = {
							// 		...this.data.config,
							// 		formatter: function (params: any) {
							// 			let options = params[0].axisValueLabel.split(",");
							// 			let str = params[0].axisValueLabel + "<br>";
							// 			params.map((item: any, index: number) => {
							// 				str = str + options[index] + "&nbsp;&nbsp;:&nbsp;&nbsp;" + item.data + "<br>";
							// 			});
							// 			return str;
							// 		},
							// 	};
							// }
						}

						//x轴格式转化
						try {
							let forMatX = res.data.x[0].data
								.filter((item: any, index: any) => {
									if (item == "null") {
										//删除y轴对应的值
										res.data.val = res.data.val.map((yItem: any) => {
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
									} else if ((<any>xConfig).type == "selectMulti" || (<any>xConfig).type == "checkbox") {
										return JSON.parse(item).join(",");
									} else if (["create_time", "datetime", "update_time"].includes((<any>xConfig).type)) {
										//加格式
										return item + (<any>dateAdd)[this.data.dimensions[0].dateTimeSummary];
									} else {
										return item;
									}
								});

							this.$set(this.data, "data", { ...this.data.data, xAxis: [{ data: forMatX }] });
						} catch (error) {
							console.log(error);
						}

						this.data.data.series = res.data.val.map((item: TJson, index: number) => {
							let yVal = res.data.val[index].y ? res.data.val[index].y[0] : "";
							//2维度数组显示问题
							try {
								yVal = JSON.parse(yVal).join(",");
							} catch (error) {
								yVal = yVal;
							}

							return {
								type: this.$route.params.type,
								name: res.data.val[index].y ? yVal : res.data.val[index].text[<string>localStorage.getItem("lang")],
								label: {
									show: true,
									position: "top",
								},
								data: res.data.val[index].data.map((item: any) => {
									if (item == "null") {
										return 0;
									}

									return item;
								}),
							};
						});

						//x轴
						if (!this.data.data.xAxis) {
							let dataX = res.data.x[0].data.filter((item: any) => {
								return item != "null";
							});

							this.data.data = {
								...this.data.data,
								xAxis: [{ data: dataX }],
							};
						}
					} else if (this.data.type == "pie") {
						xConfig = { type: this.data.dimensions[0].dataTypeEnum };

						xConfig = configListFlag(this.formConfig.configList).find((item: any) => {
							return this.data.dimensions[0].code == item.fieldId;
						})
							? configListFlag(this.formConfig.configList).find((item: any) => {
									return this.data.dimensions[0].code == item.fieldId;
							  })
							: xConfig;
						console.log(xConfig, "xConfig");

						//处理数据
						let data = res.data.data
							.filter((item: any) => {
								return item.name != "null";
							})
							.map((item: any) => {
								if (!xConfig) return item;
								if ((<any>xConfig).type == "datetime") {
									const dateMap = {
										YEAR: "yyyy",
									};
									// TODO

									if (this.data.dimensions[0].dateTimeSummary) {
										return item;
									} else {
										item.name = toDatetime.convert((<any>xConfig).dateFormat, item.name);
									}

									return item;
								} else if ((<any>xConfig).type == "selectMulti" || (<any>xConfig).type == "checkbox") {
									item.name = JSON.parse(item.name).join(",");

									return item;
								} else if (["create_time", "datetime", "update_time"].includes((<any>xConfig).type)) {
									//加格式

									item.name = item.name + (<any>dateAdd)[this.data.dimensions[0].dateTimeSummary];
									return item;
								} else {
									return item;
								}
							});

						//pie填充数据
						this.data.data.series = [];
						this.data.data.series.push({
							data: data,
							type: "pie",
							radius: "50%",
							label: {
								show: true,
								position: "top",
							},
						});
					} else if (this.$route.params.type == "costum") {
					} else if (this.data.type == "quota") {
						console.log(res.data.values);
						this.$set(this.data, "quotaList", res.data.values);
					}
					console.log(data, "data");

					this.loading = false;
				})
				.catch((error) => {
					this.isError = "暂无数据";
					//并且不是未选择筛选条件的
					if (Object.prototype.toString.call(error.data) === "[object Null]" && this.data.matchRules.length > 0) {
						this.loading = false;
						this.$message("暂无符合过滤条件的数据");
						return;
					}
					if (this.$route.params.type == "quota" && error.code === "REPORT-REPORT_DIMENSIONS_OR_INDICATORS_COUNT_ERROR") {
					} else if (error.code == "REPORT-REPORT_NO_DIMENSIONS_OR_INDICATORS") {
						this.$message(error.msg + ",请在右侧属性面板进行报表设置");
					}

					this.loading = false;
				});
		}

		private setData(data: TJson) {
			this.data = {
				...this.data,
				...data,
			};
		}
		// 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
		private regionalTest(x: any, y: any, w: any, h: any, m: string) {
			// 定义返回 x,y 偏移 及 是否有空位置
			let offsetX = 0,
				offsetY = 0,
				res = true;
			// 按区域循环检测 二维数组地图
			for (let r = 0; r < w; r++) {
				for (let c = 0; c <= h; c++) {
					let point;
					if (m == "pc") {
						point = this.layoutMap[y + r] ? this.layoutMap[y + r][x + c] : 0;
					} else {
						point = this.layoutMMap[y + r] ? this.layoutMMap[y + r][x + c] : 0;
					}

					// 如该点被占据 记录偏移值
					if (point === 1) {
						res = false;
						offsetX = offsetX > x + c ? offsetX : x + c;
						offsetY = offsetY > y + r ? offsetY : y + r;
					}
				}
			}

			return {
				result: res,
				offsetX: offsetX,
				x: x,
				y: y,
			};
		}
		// 生成二维数组地图
		private genereatePlaneArr(data: any) {
			var map = [];
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					var one = data[i];
					// 循环行
					for (var r = one.y; r < one.y + one.h; r++) {
						// 循环列
						for (var c = one.x; c < one.x + one.w; c++) {
							// 检修当前行是否存在
							if (!map[r]) {
								map[r] = new Array(this.colNum);

								for (let i = 0; i < this.colNum; i++) {
									map[r][i] = 0;
								}
							}
							// 占据为1
							map[r][c] = 1;
						}
					}
				}
			}
			return map;
		}
		private addItem(w: number, h: number, data: TJson, m: string) {
			var itemW = w;
			var itemH = h;
			var addItem = {
				x: 0,
				y: 0,
				w: itemW,
				h: itemH,
				...data,
			};
			let len = m == "pc" ? this.layoutMap.length : this.layoutMMap.length;
			if (len) {
				for (let r = 0, rLen = len; r < rLen; r++) {
					for (let c = 0; c <= this.colNum - itemW; c++) {
						let res = this.regionalTest(c, r, itemW, rLen > r + itemH ? itemH : rLen - r, m);
						if (res.result) {
							// 更新添加数据内容
							addItem = {
								x: res.x,
								y: res.y,
								w: itemW,
								h: itemH,
								...data,
							};

							c = this.colNum + 1;
							r = rLen + 1;
						} else {
							c = res.offsetX;
						}
					}
				}
			}
			// 更新二维数组地图
			for (let itemR = 0; itemR < itemH; itemR++) {
				for (let itemC = 0; itemC < itemW; itemC++) {
					if (m == "pc") {
						// 如果没有该行，初始化
						if (!this.layoutMap[addItem.y + itemR]) {
							this.layoutMap[addItem.y + itemR] = new Array(this.colNum);
							for (let i = 0; i < this.colNum; i++) {
								this.layoutMap[addItem.y + itemR][i] = 0;
							}
						}
						// 标记点
						this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1;
					} else {
						// 如果没有该行，初始化
						if (!this.layoutMMap[addItem.y + itemR]) {
							this.layoutMMap[addItem.y + itemR] = new Array(this.colNum);
							for (let i = 0; i < this.colNum; i++) {
								this.layoutMMap[addItem.y + itemR][i] = 0;
							}
						}
						// 标记点
						this.layoutMMap[addItem.y + itemR][addItem.x + itemC] = 1;
					}
				}
			}

			// 添加数据
			console.log(addItem.x, m);
			return addItem;
		}
		/**
		 * @description: 保存
		 * @param {*fn：回调函数（路由跳转）}
		 * @return {*}
		 */

		private async saveHandler(fn?: any) {
			let { type, appCode, formCode, id, tenantId } = this.$route.params;

			if (!this.formConfig.code && type != "filter") {
				this.$message("数据源为空");
				return;
			}

			if (["bar", "line", "raw_data", "costum", "pie"].includes(type)) {
				if (this.data.indicators.length == 0 || this.data.dimensions.length == 0) {
					this.$message("维度或指标为空");
					return;
				}
			}
			//子表格对应子表格
			if (type != "filter" && this.data.dimensions[0] && this.data.indicators[0] && this.data.dimensions[0].subCode && !this.data.indicators[0].subCode) {
				this.$set(this.data, "quotaList", []);
				this.$message("维度含子表格子字段时，指标仅支持子表格子字段");
				return;
			}

			type != "filter" && this.daajug();

			// this.data.dimensions = this.data.dimensions.map((item: Record<string, any>) => ({
			// 	...item,
			// 	fieldId: item.fieldIdAsName,
			// }));

			// this.data.indicators = this.data.indicators.map((item: Record<string, any>) => ({
			// 	...item,
			// 	fieldId: item.fieldIdAsName,
			// }));

			let data = {
				...this.$utils.deepClone(this.data),
				type: type == "costum" ? "raw_data" : type,
				appCode: appCode,
				formCode: formCode,
				id: id,
				sourceCode: this.formConfig.code || "1", //表单code
				sourceType: this.formConfig.sourceType,
			};

			//filter未添加条件校验
			if (type === "filter") {
				//每一个表单都得选中
				let bool = this.data.config.checkedReports.every((item: any) => {
					return item.selectField;
				});

				if (!bool || !this.data.config.selectDefaultMethod || this.data.config.checkedReports.length === 0) {
					this.$message({
						message: "配置错误，请重新配置",
					});
					return;
				}
				data.config.checkedReports = data.config.checkedReports.map((item: any) => {
					return { reportCode: item.reportCode, selectField: item.selectField, sourceCode: item.sourceCode, parentFieldId: item.parentFieldId };
				});

				delete data.config.reportLists;
				data.config.filterForm = this.filterForm;
			}

			this.isClickSave = true;
			//新增
			//判断是否是16位英文数字不是的话就进创建报表
			if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{32}$/.test(id)) {
				delete data.id; //新增id不用传
				//保存

				saveChart(appCode, formCode, data).then(async (res: TResponse) => {
					//新建成功跳转到对应的id 进行编辑
					this.$message({
						message: "保存成功",
					});

					//成功后拿仪表盘所有 添加新增
					let resL = await getFormSingleTest(appCode, formCode);
					let dataForm: TJson;
					let layout = [];
					let layoutM = [];
					let w: number = type === "table" ? this.colNum / 2 : type === "filter" ? this.colNum / 3 : this.colNum / 4;
					let h: number = type === "table" ? 12 : type === "filter" ? 6 : 10;
					if (resL.data.structure) {
						layout = resL.data.structure.layout;
						layoutM = resL.data.structure.layoutM;
					}

					this.layoutMap = this.genereatePlaneArr(layout);
					this.layoutMMap = this.genereatePlaneArr(layoutM);
					dataForm = {
						structure: {
							layout: [
								...layout,
								this.addItem(
									w,
									h,
									{
										formName: this.formConfig.formName,
										sourceCode: this.formConfig.code,
										sourceType: this.formConfig.sourceType,
										formType: this.formConfig.type,
										i: res.data.code,
										code: res.data.code,
										uid: data.config.uid,
										type: data.type,
										title: res.data.title,
										pageSize: type == "table" ? (<any>this.$refs).body.$refs.table.page.pageSize : 0,
									},
									"pc"
								),
							],
							layoutM: [
								...layoutM,
								{
									...this.addItem(
										this.colNum,
										h,
										{
											formName: this.formConfig.formName,
											sourceCode: this.formConfig.code,
											sourceType: this.formConfig.sourceType,
											formType: this.formConfig.type,
											i: res.data.code,
											code: res.data.code,
											uid: data.config.uid,
											type: data.type,
											title: res.data.title,
											pageSize: type == "table" ? (<any>this.$refs).body.$refs.table.page.pageSize : 0,
										},
										"m"
									),
								},
							],
							theme: resL.data.structure?.theme || "default",
						},
						appCode: appCode,
						code: formCode,
					};

					updateFormSingle(appCode, formCode, dataForm).then((resNull: TResponse) => {
						this.$router.push(`/${this.$route.params.tenantId}/appd/${this.$route.params.appCode}/p/bi/${this.$route.params.formCode}/chart/${type}/${res.data.code}`);
					});
				});
			} else {
				//更新
				delete data.id;
				delete data.appCode;
				data.code = id;

				updateChart(appCode, formCode, data).then((res: TResponse) => {});

				getFormSingle(appCode, formCode).then((resL: TResponse) => {
					let dataForm: TJson;
					let layout = [];
					let layoutM = [];
					if (resL.data.structure) {
						layout = resL.data.structure.layout;
						layoutM = resL.data.structure.layoutM;
					}
					this.layoutMap = this.genereatePlaneArr(layout);
					this.layoutMMap = this.genereatePlaneArr(layoutM);
					layout.map((item: TJson) => {
						if (item.code == id) {
							if (type === "table") {
								item.pageSize = (<any>this.$refs).body.$refs.table.page.pageSize;
							} else {
								item.formName = this.formConfig.formName;
								item.sourceCode = this.formConfig.code;
								item.sourceType = this.formConfig.sourceType;
								item.formType = this.formConfig.type;
							}
						}
					});
					layoutM.map((item: TJson) => {
						if (item.code == id) {
							if (type === "table") {
								item.pageSize = (<any>this.$refs).body.$refs.table.page.pageSize;
							} else {
								item.formName = this.formConfig.formName;
								item.sourceCode = this.formConfig.code;
								item.sourceType = this.formConfig.sourceType;
								item.formType = this.formConfig.type;
							}
						}
					});
					dataForm = {
						structure: {
							layout,
							layoutM,
							theme: resL.data.structure?.theme || "default",
						},
						appCode: appCode,
						code: formCode,
					};
					updateFormSingle(appCode, formCode, dataForm).then((res: TResponse) => {
						this.$message("保存成功");
						fn && fn.apply();
					});
				});
			}
		}
		/**
		 * @description: 获取仪表盘配置
		 * @param {*config：筛选器结构}
		 * @return {*}
		 */
		private getPConfig(config?: any) {
			let title = JSON.parse(JSON.stringify(config?.title || {}));
			getFormSingleTest(this.$route.params.appCode, this.$route.params.formCode).then((resL: TResponse) => {
				resL.data.structure.layout.map((item: TJson) => {
					if (item.code === this.$route.params.id) {
						this.pageSize = item.pageSize;
					}
				});

				//初始化能筛选的类型
				if (this.$route.params.type == "filter") {
					//所有报表
					let r = resL.data.structure.layout.filter((item: any) => {
						return ["bar", "line", "pie", "quota", "costum", "raw_data"].includes(item.type);
					});

					let allP: any = [];
					for (let i = 0; i < r.length; i++) {
						let rItem: any = { reportCode: r[i].code };
						let p: any;
						p = new Promise((resolve, reject) => {
							getChartStr(this.$route.params.appCode, this.$route.params.formCode, r[i].code).then((res: TResponse) => {
								if (res.data.sourceType == "form") {
									//表单
									let reportList: any = [];
									getFormSingleTest(this.$route.params.appCode, res.data.sourceCode).then((resF: any) => {
										rItem["title"] = res.data.title;
										rItem["sourceType"] = "form";
										rItem["sourceCode"] = res.data.sourceCode;
										rItem["sourceName"] = resF.data.multiLanguage;
										let configList: any[] = [];
										let sortList: any = [];
										resF.data.structure.configList.forEach((item: Field) => {
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
										if (resF.data.type == "C") {
											rItem["configList"] = [...rItem["configList"], ...CList];
										} else if (resF.data.type == "F") {
											rItem["configList"] = [...rItem["configList"], ...FList];
										}

										reportList.push(rItem);
										//是不是筛选器
										if (!config) {
											this.$set(this.data.config, "checkedReports", []);
										} else {
											//赋值
											this.data.config = config;
											this.filterForm = config.filterForm;
										}

										this.data.config.checkedReports.map((item: any) => {
											reportList.map((rItem: any) => {
												if (item.reportCode == rItem.reportCode) {
													let fieldIdList = rItem.configList.map((cItem: any) => {
														return cItem.fieldId;
													});
													console.log(rItem, item.selectField, 1111);
													//删除了字段
													if (!fieldIdList.includes(item.selectField)) {
														item.selectField = "字段被删除，请重新选择";
													}

													//删除parentid
													rItem.configList.map((configItem: any) => {
														if (configItem.fieldId == item.selectField) {
															if (configItem.parent) {
																item.parentFieldId = configItem.parent.fieldId;
															} else {
																item.parentFieldId = "";
															}
														}
													});
												}
											});
										});

										config?.title && (this.data.title = config.title);

										//排序
										r.map((newRItem: any, idx: number) => {
											reportList.map((newRRItem: any, iidx: number) => {
												if (newRItem.code == newRRItem.reportCode) {
													sortList.push(newRRItem);
												}
											});
										});

										resolve(sortList);
									});
								} else {
									let reportList: any = [];
									//数据集
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

												reportList.push(rItem);
												//执行完整个循环

												if (!config) {
													this.$set(this.data.config, "checkedReports", []);
												} else {
													//赋值
													this.data.config = { ...config };
													this.filterForm = config.filterForm;
												}
												//查询字段是否被删除
												this.data.config.checkedReports.map((item: any) => {
													reportList.map((rItem: any) => {
														if (item.reportCode == rItem.reportCode) {
															let fieldIdList = rItem.configList.map((cItem: any) => {
																if (cItem.fieldId == item.selectField) {
																	this.data.config.fieldType = cItem.type;
																}
																return cItem.fieldIdAsName;
															});
															//删除了字段
															if (!fieldIdList.includes(item.selectField)) {
																item.selectField = "字段被删除，请重新选择";
															}
														}
													});
												});
												resolve(reportList);
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
							//拿到所有请求结束后的操作
							let reportLists: any = [];
							values.map((item: any) => {
								reportLists = reportLists.concat(item);
							});

							this.$set(this.data.config, "reportLists", reportLists);
						},
						(reason) => {
							console.log(reason);
						}
					);
				}
			});
		}
		/**
		 * @description: 获取数据集
		 * @param {*appCode,str：报表结构，data：报表结构？}
		 * @return {*}
		 */
		private async getDataSet(appCode: string, str: any, data: any) {
			let res = await getDataset(appCode);

			let datasetConfig = res.data.filter((item: TJson) => {
				return item.datasetCode === str.data.sourceCode;
			});
			let allFieldIdList: TJson = [];
			//找到对应数据集

			let fidName = datasetConfig[0].type == "sql" ? "fieldIdAsName" : "fieldId";

			datasetConfig[0].structure.map((item: TJson) => {
				allFieldIdList.push(item[fidName]);
				//名字是否被修改
				data.dimensions.forEach((element: TJson) => {
					if (element.code == item.fieldId) {
						element.title = item.title;
						element.dataTypeEnum = item.type;

						element.fieldIdAsName = item.fieldIdAsName;
					}
				});
				data.indicators.forEach((element: TJson) => {
					if (element.code == item.fieldId) {
						element.title = item.title;
						element.dataTypeEnum = item.type;
						element.fieldIdAsName = item.fieldIdAsName;
					}
				});
			});

			//是否被删除
			str.data.dimensions.forEach((element: TJson) => {
				if (!allFieldIdList.includes(element.fieldIdAsName)) {
					element.isDelete = true;
				}
			});
			str.data.indicators.forEach((element: TJson) => {
				if (!allFieldIdList.includes(element.fieldIdAsName)) {
					element.isDelete = true;
				}
			});

			this.$set((<any>this).formConfig, "configList", datasetConfig[0].structure);
			this.$set((<any>this).formConfig, "type", "D");
			this.$set((<any>this).formConfig, "code", datasetConfig[0].datasetCode);
			this.$set((<any>this).formConfig, "id", datasetConfig[0].id);
			this.$set((<any>this).formConfig, "sourceType", "dataset");
			this.$set((<any>this).formConfig, "formName", datasetConfig[0].name);
			this.$set((<any>this).formConfig, "correspond", datasetConfig[0].correspond);
			this.$set((<any>this).formConfig, "datasetSql", datasetConfig[0].datasetSql);
			this.$set((<any>this).formConfig, "displaySql", datasetConfig[0].displaySql);
			this.setData(data);
		}
		/**
		 * @description: 编辑回显请求
		 * @param {*}
		 * @return {*}
		 */

		protected created() {
			//获取表格pagesize和仪表盘结构

			if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{32}$/.test(this.$route.params.id)) {
				let newData = this.$utils.deepClone(new defaultEchartsData(this.$route.params.type));
				newData.data = {
					series: [],
				};
				this.data = newData;
				//获取结构

				getChartStr(this.$route.params.appCode, this.$route.params.formCode, this.$route.params.id).then((res: TResponse) => {
					//和最新的表单结构对比
					this.oldData = this.$utils.deepClone(res.data);

					this.headTitle = res.data?.title || {};

					let filterData = res.data;

					//自定义错误类型
					if (!res.data) {
						this.loading = false;
						return;
					}
					res.data.config.title = res.data.title;
					//筛选器结构请求到以后
					if (res.data.type == "filter") {
						this.loading = false;

						this.getPConfig(res.data.config);

						return;
					}
					if (res.data.sourceType === "dataset") {
						this.loading = false;
						this.getDataSet(this.$route.params.appCode, res, filterData);
					} else {
						this.getPConfig();
						getFormSingleTest(this.$route.params.appCode, res.data.sourceCode)
							.then((resF: any) => {
								let allFieldIdList: TJson = [];
								(<any>this).formConfig && this.$set((<any>this).formConfig, "formName", resF.data.multiLanguage);
								(<any>this).formConfig && this.$set((<any>this).formConfig, "type", resF.data.type);
								(<any>this).formConfig && this.$set((<any>this).formConfig, "configList", resF.data.structure.configList);
								(<any>this).formConfig && this.$set((<any>this).formConfig, "code", resF.data.code);
								(<any>this).formConfig && this.$set((<any>this).formConfig, "id", resF.data.id);
								(<any>this).formConfig && this.$set((<any>this).formConfig, "appCode", resF.data.appCode);

								resF.data.structure.subFormCode && this.$set((<any>this).formConfig, "subFormCode", resF.data.structure.subFormCode);

								resF.data.structure.configList.map((item: TJson) => {
									allFieldIdList.push(item.fieldId);
									if (item.children) {
										item.children.map((item: TJson) => {
											allFieldIdList.push(item.fieldId);
										});
									}
								});

								//找出被删除的字段and对比字段名字是否被更改
								res.data.dimensions.forEach((element: TJson) => {
									if (!allFieldIdList.includes(element.code) && !this.sysList.includes(element.code)) {
										element.isDelete = true;
									}
									resF.data.structure.configList.map((field: Field) => {
										if (field.fieldId == element.code) {
											element.title = field.title;
										}
									});
								});
								res.data.indicators.forEach((element: TJson) => {
									if (!allFieldIdList.includes(element.code) && !this.sysList.includes(element.code)) {
										element.isDelete = true;
									}
									resF.data.structure.configList.map((field: Field) => {
										if (field.fieldId == element.code) {
											element.title = field.title;
										}
									});
								});

								this.setData(filterData);

								if (this.$route.params.type == "table") {
									this.loading = false;
								}
							})
							.catch((error: any) => {
								if (error.code === "FM-FORM_NOT_EXISTS") {
									//表单不存在清空配置

									this.data = this.$utils.deepClone(new defaultEchartsData(this.$route.params.type));
									this.$message(error.msg + ",请在右侧属性面板进行报表设置");
									this.loading = false;
								}
							});
					}
				});
			} else {
				this.getPConfig();
				this.data = this.$utils.deepClone(new defaultEchartsData(this.$route.params.type));
				this.$route.params.type == "costum" && (this.data.config.uid = guid()); //
				//指标卡默认值
				if (this.$route.params.type == "quota") {
					let initList = [
						{
							dimensionValue: "维度一",
							indicatorValue: "1",
						},
						{
							dimensionValue: "维度二",
							indicatorValue: "1",
						},
						{
							dimensionValue: "维度三",
							indicatorValue: "1",
						},
					];
					this.$set(this.data, "quotaList", initList);
				}
				this.loading = false;
			}
		}
		//强制去掉页面滚动
		protected beforeCreate() {
			document.querySelector("body")?.setAttribute("style", "overflow-y:hidden");
		}
		protected beforeDestroy() {
			document.body.removeAttribute("style");
		}
	}
</script>
<style lang="scss">
	#boxHeight {
		height: calc(100vh - 56px);
	}

	#tagStyle {
		background-color: #fff;
		display: inline-block;
		height: 24px;
		padding: 0 10px;
		line-height: 22px;
		font-size: 12px;
		color: #6087fd;
		border-width: 1px;
		border-style: solid;
		border-radius: 4px;
		box-sizing: border-box;
		white-space: nowrap;
		border: 1px dotted $color;
	}

	.bi {
		&-loading {
			height: 100%;
			width: 100%;
			position: relative;

			img {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		&-data {
			overflow: auto;
			height: calc(50vh - 22px);
			padding: 10px 0;
			box-sizing: border-box;
		}
		&-key {
			height: 22px;
			line-height: 22px;
			font-size: 13px;
			padding-left: 15px;
			margin: 0 1px 5px;
			position: relative;
			cursor: move;
			svg {
				display: inline;
				vertical-align: middle;
				margin-top: -3px;
				margin-right: 3px;
				width: 10px !important;
				height: 10px !important;
			}
			&:hover {
				color: $color;
				box-shadow: 1px 1px 5px 1px rgba(86, 114, 141, 0.3);
			}
		}
		&-h4 {
			color: #333;
			font-size: 13px;
			padding: 0px 5px;
			line-height: 1.3;
			border-left: 3px solid $color;
			margin: 10px 0;
		}
		&-design {
			// @extend #boxHeight;
			display: flex;
		}
		&-left {
			@extend #boxHeight;
			width: 230px;
			border-right: 1px solid #e8eaed;
			overflow: hidden;
			padding: 0px 5px;
			box-sizing: border-box;
			background: #fff;
		}
		&-body {
			width: calc(100vw - 330px);
			padding: 10px;
			padding-top: 0;
			.wrap {
				display: flex;
				flex-direction: column;
				height: calc(100vh - 70px);
			}
			.active {
				.group {
					border-color: #7eb2e6;
				}
			}
		}
		&-charts {
			overflow: auto;
			height: calc(50vh - 22px);
			border-bottom: 1px solid #e8eaed;
			padding: 10px 0;
			&-list {
				display: grid;
				grid-template-columns: repeat(5, 40px);
				grid-template-rows: repeat(auto-fill, 40px);
				grid-row-gap: 5px;
				grid-column-gap: 5px;

				.tooltip {
					height: 40px;
					width: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					border: 1px solid transparent;
					transition: all 0.2s linear 0s;
					border-radius: 2px;
					img {
						-webkit-user-drag: none;
						width: 30px;
						height: 30px;
						display: block;
					}
					&:hover {
						border-color: $color;
					}
				}
				.on {
					border-color: $color;
				}
			}
		}
		&-keys {
			font-size: 14px;
			.group {
				height: 36px;
				background: #fff;
				display: flex;
				align-items: center;
				border-radius: 3px;
				margin-bottom: 10px;
				border: 1px solid transparent;
				transition: border 0.3s linear 0s;
				& > span {
					display: flex;
					flex: 1;
					padding: 0 5px;
					height: 36px;
					align-items: center;
					& > * {
						display: inline-block;
						margin-right: 5px;
						cursor: move;
					}
					li {
						background-color: #fff;
						display: inline-block;
						height: 24px;
						padding: 0 10px;
						line-height: 22px;
						font-size: 12px;
						color: #6087fd;
						border-width: 1px;
						border-style: solid;
						border-radius: 4px;
						box-sizing: border-box;
						white-space: nowrap;
						border: 1px dotted $color;
					}
				}
			}
			.label {
				width: 90px;
				text-align: center;

				height: 36px;
				line-height: 36px;
				display: block;
			}
		}
		&-echarts {
			&-wrap {
				flex: 1;
				background: #fff;
			}
			&-btns {
				padding-bottom: 10px;
				text-align: right;
			}
		}
	}

	.fallbackClass {
		background-color: #fff;
		display: inline-block;
		height: 24px;
		padding: 0 10px;
		line-height: 22px;
		font-size: 12px;
		color: #6087fd;
		border-width: 1px;
		border-style: solid;
		border-radius: 4px;
		box-sizing: border-box;
		white-space: nowrap;
		border: 1px dotted $color;
		width: auto !important;
	}
	.ghostClass {
		color: $color;
	}
	.chosenClass {
		color: $color;
	}
	.bi-design {
		overflow: hidden;
		.error {
			width: calc(100vw - 330px);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
