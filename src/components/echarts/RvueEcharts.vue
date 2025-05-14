<template>
	<div :id="`main-${this.data.config.uid}`" :style="{ height: '100%' }" style="width: 100%" ref="main"></div>
</template>

<script lang="ts">
	//TODO rvueCharts 应放入rvue ui custom中
	import { defaultAttr } from "@/core/defaultValue/tableDesign";
	import axios from "axios";
	type ResponeItem = {
		[key: string]: string | number | any;
	};
	type userItem = {
		name: string;
		[key: string]: string | number | any;
	};
	import toDatetime from "@/core/toDatetime";
	import { Dimensions, Indicators } from "@/components/chartDesign/components/attr/CTdi/_types/di";

	import { Component, Vue, Prop, Watch } from "vue-property-decorator";

	import { getChartData } from "@/api/bi";
	import { filterQueryReportData } from "@/components/chartComps/_config/filterQueryReportData";
	import * as echart from "echarts";
	// 引入折线线图
	import "echarts/lib/chart/line";
	//主题
	import "echarts/theme/dark.js";
	import "echarts/theme/cool.js";
	// import "echarts/theme/eduardo.js";
	// import "echarts/theme/blue.js";
	import "echarts/theme/bee-inspired.js";
	import "echarts/theme/roma.js";
	import "./westeros";
	// 引入柱状图
	import "echarts/lib/chart/bar";
	import { setTimeout } from "timers";
	import Echart from "./_core/extends.ts";
	var echarts = echart;

	const Babel = require("/public/script/babel.min.js");
	const $ = require("/public/script/jquery.min.js");
	//3d包
	require("/public/script/echarts-gl.min.js");

	//地图包
	require("echarts");
	require("echarts/extension/bmap/bmap");

	@Component
	export default class RisenEcharts extends Vue {
		@Prop({ type: [Object, String], default: () => {} }) dataChart!: any;
		@Prop({ type: String, default: "default" }) theme!: string;
		@Prop({ type: String, default: "pc" }) mode!: string;
		@Prop({ type: Object, default: () => {} }) parent!: any;
		@Prop({ type: Object, default: () => {} }) item!: any;
		@Prop({ type: Object, default: () => {} }) data!: any;
		@Prop({ type: String, default: "costum" }) type!: any;

		private echartInstance: any;
		private timer: any = null;
		private jsRun: Record<string, ($: () => any) => void> = {};
		private id: string = `main-` + this.$route.params.id;

		private resize(width: number, height: number) {
			this.timer = setTimeout(() => {
				this.echartInstance?.resize();
			}, 20);
		}
		//注入到自定义报表的请求
		private fetchHandler = (option: any) => {
			return new Promise(async (reslove, reject) => {
				let appCode = this.$route.params.appCode;
				let formCode = this.$route.params.formCode;
				let id = this.$route.params.id || this.item.code;

				let data = {
					...this.data,
					appCode,
					type: "raw_data",
					top: {
						enable: false,
						limit: "100",
					},
				};

				try {
					let respone = await getChartData(appCode, formCode, id, filterQueryReportData(this, data));
					//处理数据格式

					let formatData = respone.data;

					// let formatData = respone.data.map((item: ResponeItem | undefined[]) => {
					// 	item = item.map((innerItem: ResponeItem, index: number) => {
					// 		if (typeof innerItem == "string") {
					// 			try {
					// 				if (Array.isArray(JSON.parse(innerItem))) {
					// 					//复选框
					// 					if (typeof JSON.parse(innerItem)[0] == "string") {
					// 						console.log(JSON.parse(innerItem).join());
					// 						return JSON.parse(innerItem).join();
					// 					}
					// 					return innerItem;
					// 				}
					// 			} catch (error) {
					// 				return innerItem;
					// 			}

					// 			return innerItem;
					// 		}
					// 		return innerItem;
					// 	});

					// 	return item;
					// });
					console.log(formatData, "formatData");
					formatData = formatData.map((arr: string[]) =>
						arr.map((s: string) => {
							try {
								let val = JSON.parse(<string>s);
								if (typeof val == "object") {
									if (val.hasOwnProperty("city")) {
										return val.province + val.city + val.district + val.detail;
									}
								}
							} catch (err) {}
							return s;
						})
					);
					this.data.config.source = formatData;
					reslove(formatData);
				} catch (error) {
					reject(error);
				}
			});
		};

		//流程状态转化格式
		private transformProcessStatus(dataset: any) {
			let pIndex: number = -1;
			//console.log(this.data.dimensions,'this.data.dimensions');
			this.data.dimensions.map((item: any, index: number) => {
				if (item.dataTypeEnum == "process_status") {
					pIndex = index;
				}
			});
			let result = dataset;
			let vb: any = {};

			defaultAttr["defaultdicData"].map((item: any) => {
				vb[item.value] = item.label;
			});
			//在第一维度
			if (pIndex == -1) {
				//result[1][0] = vb[result[1][0]];//包
			} else {
				//第二维度
				// result[0][1] = vb[result[1][0]];//包
				result[1][0] = vb[result[1][0]]; //lk
				result[2][0] = vb[result[2][0]]; //lk
				result[3][0] = vb[result[3][0]]; //lk
			}
			return result;
		}

		@Watch("dataChart", { deep: true })
		onChangeData(n: any) {
			if (this.type === "costum" || this.type === "raw_data") {
				this.getCostumData();
				return;
			}

			let echartData = this.$utils.deepClone(this.dataChart);
			console.log(echartData, "echartData", this.data.config);

			this.echartInstance && this.echartInstance.dispose();
			this.echartInstance = echarts.init(this.$refs.main as HTMLElement, this.theme);

			echartData.tooltip.position = [10, 10];

			//TODO
			if (echartData.xAxis) {
				echartData.xAxis.axisLabel.interval = this.mode == "mobile" ? 3 : "auto";
			}

			// echartData.tooltip.confine = true;
			// echartData.tooltip.appendToBody = false;

			if (this.item && this.item.h <= 8) {
				//设置y轴显示 --类里面拿不到最大
				// if (!this.echartInstance.getModel()?.getComponent("yAxis")) return;
				// let interval = Math.ceil((this.echartInstance.getModel().getComponent("yAxis").axis.scale._extent[1] - this.echartInstance.getModel().getComponent("yAxis").axis.scale._extent[0]) / 3);
				// interval && (echartData.yAxis.interval = interval);
				//this.echartInstance.setOption(echartData as any);
			} else {
			}

			this.echartInstance.setOption(echartData as Record<string, any>);

			this.$nextTick(() => {
				window.onresize = () => {
					this.echartInstance.resize();
				};
			});
		}

		private getCostumData() {
			if (typeof this.dataChart != "string") return;

			const { code } = Babel.transform(this.dataChart, {
				presets: ["es2015"],
			});
			let that = this;

			const fn = new Function("echarts", "$", "that", "transformProcessStatus", "fetchHandler", "extend", code);
			fn(echarts, $, that, this.transformProcessStatus, this.fetchHandler, Echart.ins().init(this));
		}

		//监听主题
		// @Watch("theme")
		// onChangeTheme(n: string) {
		// 	//清除
		// 	this.echartInstance.dispose();
		// 	this.echartInstance = echarts.init(this.$refs.main as any, n);
		// 	this.echartInstance.setOption(this.dataChart as any);
		// 	this.echartInstance.resize();
		// }
		@Watch("mode")
		onChangeMode(n: string) {
			this.timer = setTimeout(() => {
				this.echartInstance.resize({ width: this.parent.$refs["echart-container"].offsetWidth });
			}, 100);
		}

		protected mounted() {
			// let echartData = this.$utils.deepClone(this.dataChart);
			// this.echartInstance = echarts.init(this.$refs.main as any, this.theme);
			// if (this.type === "costum" || this.type === "raw_data") {
			// 	try {
			// 		if (typeof this.dataChart != "string") return;
			// 		const { code } = Babel.transform(this.dataChart, {
			// 			presets: ["es2015"],
			// 		});
			// 		let that = this;
			// 		const fn = new Function("echarts", "$", "that", "fetchHandler", code);
			// 		fn(echarts, $, that, this.fetchHandler);
			// 	} catch (error) {
			// 		console.log(error);
			// 	}
			// 	return;
			// }
			// console.log("这是最终的数据", echartData);
			// this.echartInstance.resize();
		}

		protected beforeDestroy() {
			this.timer = null;
		}
	}
</script>
