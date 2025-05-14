import toDatetime from "../views/formData/_core/toDatetime";
declare interface TGrid {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

const positionMap: TJson = {
	top: {
		x: "center",
		y: "top",
	},
	bottom: {
		x: "center",
		y: "bottom",
	},
	left: {
		x: "left",
		y: "center",
	},
	right: {
		x: "right",
		y: "center",
	},
};

function classToJson(_class: any): any {
	return _class;
	// return JSON.parse(JSON.stringify(_class));
}

class Axis {
	public offset: number = 0;
	public type: string = "";
	public show: boolean = true;
	public position = "";
	public name: string | number = "";
	public axisLine: any = {
		onZero: true,
		show: true,
	};
	public nameTextStyle: object = {};
	public setSpliteLine(conf: any) {
		let defaultConfig = {
			show: true,
			lineStyle: {
				color: "#ddd",
			},
		};
		return {
			...defaultConfig,
			...conf,
		};
	}
}
class XAxis extends Axis {
	private data: string | string | number[] = [];
	private axisLabel: object = {};

	constructor(data: any, config: any, options: any, vue: any) {
		super();
		this.type = "category";
		this.data = data; //普通模式
		this.show = config?.show;
		this.name = config?.name.length > 7 ? config?.name.substring(0, 6) + ".." : config?.name;
		let interval;

		Array.isArray(this.data) &&
			(this.data = this.data.map((s: string | number) => {
				try {
					let val = JSON.parse(<string>s);
					if (typeof val == "object") {
						if (val.hasOwnProperty("city")) {
							return val.province + val.city + val.district + val.detail;
						}
					}
				} catch (err) {}
				return s;
			}));
		// //外面的拉伸宽度
		// if (options.w > 6 || !options.w) {
		// 	interval = 0;
		// } else {
		// 	interval = 1;
		// }
		// //数据量大小
		if (options.w && options.data) {
			interval = Math.floor(options.data.xAxis[0].data.length / (options.w * 2));
		}

		this.axisLabel = {
			width: 70,
			overflow: "truncate",
			ellipsis: "...",
			interval,
			rotate: options.config.tilt,
		};

		this.axisLine = {
			onZero: false,
			show: true,
			lineStyle: {
				color: "#666",
			},
		};
		this.nameTextStyle = {
			align: "left",
			verticalAlign: "bottom",
			padding: [11, 0, -40, -89],
		};
		if (vue.$route.name === "BiReport") {
			(<any>this.nameTextStyle).padding = [0, 0, 0, 0];
		}
	}
}

class YAxis extends Axis {
	public nameGap = 30;
	public min: any;
	public max: any;
	// public interval: any;
	private axisLabel: object = {};
	constructor(data: any, options: any) {
		super();
		this.type = "value";
		this.position = data?.position;
		this.name = data?.name.length > 7 ? data?.name.substring(0, 6) + ".." : data?.name;
		this.show = data?.show;
		this.axisLine = {
			lineStyle: {
				color: "#666",
			},
		};

		this.axisLabel = {
			formatter: function (value: any, index: number) {
				if (value >= 10000 && value < 10000000) {
					value = value / 10000 + "万";
				} else if (value >= 10000000) {
					value = value / 10000000 + "千万";
				}
				return value;
			},
		};
		this.nameTextStyle = {
			align: "left",
			verticalAlign: "bottom",
			padding: [0, 0, 0, -16],
		};
		let that = this;
		if (data?.max === "dataMax") {
			this.max = function (value: any) {
				return value.max + Math.ceil(value.max / 4); //90%
			};
		} else {
			this.max = data?.max;
		}

		if (data?.min === "dataMin") {
			if (options.type === "line") {
				this.min = function (value: any) {
					return 0 - Math.ceil(value.max / 4);
				};
			} else {
				this.min = 0;
			}
		} else {
			this.min = data?.min;
		}

		if (options.type !== "line" && data?.min < 0) {
			this.min = 0;
		}
	}
}
class Series {
	private name: string = "";
	private data: number | string[] = [];
	private type: string = "";
	constructor(opts: { name: string; data: number | string[]; type: "bar" }) {
		({ name: this.name, data: this.data, type: this.type } = opts);
	}
}

class EchartsData {
	private legend: any;
	private grid: any;
	private tooltip: any;
	private xAxis: any;
	private yAxis: any;
	private series: any;
	private dataZoom: any;
	private dataset: any;

	constructor(opts: any) {
		({ legend: this.legend, grid: this.grid, tooltip: this.tooltip, xAxis: this.xAxis, yAxis: this.yAxis, series: this.series, dataZoom: this.dataZoom, dataset: this.dataset } = opts);
	}
}

export default class ToEchartsData {
	private legend = {};
	private tooltipShow = false;
	public options: any = {};
	public vue: any = {};

	private setLegend() {
		let position: TJson = positionMap[<string>this.options.config?.legend?.position];
		let orient: string = this.options.config?.legend?.position == "left" || this.options.config?.legend?.position == "right" ? "vertical" : "horizontal";
		let formatter = (name: any) => {
			if (!name) return "";
			if (name.length > 10) {
				name = name.slice(0, 10) + "...";
			}
			return name;
		};
		let obj: any = {
			legend: {
				type: "scroll",
				...this.options.data?.legend,
				...this.options.config?.legend,
				...position,
				// top: 10,
				itemWidth: 14,
				textStyle: {
					fontSize: 10,
				},
				pageIconSize: [10, 10],
				pageIconColor: "#685353",
				orient,
				formatter: formatter,
				// width: "30%",
			},
		};

		if (this.options.config?.legend?.position == "left" || this.options.config?.legend?.position == "right") {
			// obj.legend.top = 20;
		} else if (this.options.config?.legend?.position == "bottom") {
			delete obj.legend.top;
		}
		if (this.vue.$route.name == "BiReport" && this.options.config?.legend?.position != "top") {
			delete obj.legend.top;
		}

		return obj;
	}

	private setGrid() {
		// let grid: { [key: string]: number } = {};
		// (Reflect.ownKeys(d) as string[]).forEach((k: string) => {
		// 	if ((<any>d)[k]) {
		// 		grid[k] = (<any>d)[k];
		// 	}
		// });
		let left: any = "12%";
		let right: any = "7%";

		if (this.options.config?.legend?.position == "left") {
			left = "35%";
			right = "7%";
		} else if (this.options.config?.legend?.position == "right") {
			right = "35%";
			left = "7%";
		}

		let obj: any = {
			grid: {
				...this.options.config?.grid,
				left,
				right,
				bottom: "20%",
				borderColor: "#eee",
			},
		};
		if (this.options.config?.legend?.position == "top") {
			obj.grid.bottom = "10%";
		}
		if (this.vue.$route.name == "BiReport") {
			delete obj.grid.left;
			delete obj.grid.right;
		}

		return obj;
	}

	private setXYAxis() {
		let xAxisD = this.options.data?.xAxis || [{ data: {} }];
		let yAxis = this.options.config?.yAxis;
		let xAxis = this.options.config?.xAxis;

		return this.options.type == "pie"
			? {}
			: {
					xAxis: new XAxis(xAxisD[0].data, xAxis, this.options, this.vue),
					yAxis: new YAxis(yAxis, this.options),
			  };
	}
	//test
	private setSeries(): any {
		let series = this.options.data?.series;

		return {
			series: this.SeriesData(series, this.options.config),
		};
	}
	//设置数据标签
	private SeriesData(series: Array<TJson>, config: TJson) {
		let linevalue = 200;

		if (series && series.length !== 0) series[0].markLine = config.markLine;

		let arr = series?.map((item: any, index: number) => {
			// if (this.options.data.dataset.length > 10) {
			// 	let interval = Math.floor(this.options.data.dataset.length / 4);

			// 	if (config.showDataLabel && index % interval === 1) {
			// 		item.label.show = true;
			// 	} else {
			// 		item.label.show = false;
			// 	}
			// } else {

			let data = item.data.map((item: Record<string, any>) => {
				try {
					let o = JSON.parse(item.name);

					if (o.hasOwnProperty("city")) {
						return {
							value: item.value,
							name: o.province + o.city + o.district + o.detail,
						};
					}
					return item;
				} catch (err) {
					return item || "";
				}
			});

			if (this.vue.$route.name !== "BiReport" && this.options.type == "pie") {
				//	item.label.show = false;
			} else {
				item.label.show = config.showDataLabel;
			}
			// }

			item.showSymbol = true;
			item.minShowLabelAngle = config.stillShowZeroSum ? 0 : 1;
			//数据集模式
			// item.label.formatter = function (params: any) {
			// 	return params.value[params.encode.y[0]];
			// };
			item.label.formatter = config.showPercentage ? "{c} ({d}%)" : "{c}"; //普通模式
			item.label.overflow = "truncate";
			item.label.ellipsis = "...";
			item.label.align = "center";
			item.data = data;

			this.options.type == "pie" && delete item.label.position;
			// item.label.width = vue.$route.name === "BiReport" ? 120 : 40;
			item.symbol = "circle";

			return item;
		});
		// this.options.type == "pie" &&
		// 	arr.length > 0 &&
		// 	(arr[0].label.formatter = function (val: any) {
		// 		if (val.value !== 0) {
		// 			return val.value + "%";
		// 		} else {
		// 			return "";
		// 		}
		// 	});
		return arr;
	}

	private setToolTip() {
		let fm;
		let trigger: string = "axis";
		let tooltip;
		if (this.options.type === "pie") {
			fm = function (params: any, ticket: any, callback: any) {
				return params.name + "：" + params.value + "</br>" + "占比" + "：" + params.percent + "%";
			};
			trigger = "item";
		}
		tooltip = {
			formatter: fm,
			trigger: trigger,
			// axisPointer: {
			// 	type: "cross",
			// 	label: {
			// 		backgroundColor: "#6a7985",
			// 	},
			// },
			extraCssText: "z-index: 10000000",

			//鼠标放右下
			// position: function (point: any, params: any, dom: any, rect: any, size: any) {
			// 	return [point[1], 0];
			// },
		};

		// if (this.options.type === "bar" || this.options.type === "line") {
		// 	// delete tooltip.formatter;
		// 	// if (this.options.config?.formatter) {
		// 	// 	tooltip.formatter = this.options.config.formatter;
		// 	// }
		// }

		return {
			tooltip,
		};
	}

	//缩放
	private setDataZoom() {
		return {
			dataZoom: {
				type: "inside",
			},
		};
	}

	private setDataSet() {
		return {
			dataset: {
				source: this.options.data?.dataset,
			},
		};
	}
	public geteChartsData(opts: EchartsData): any {
		return classToJson(
			new EchartsData({
				...this.setSeries(),
				...this.setXYAxis(),
				...this.setLegend(),
				...this.setToolTip(),
				...this.setDataZoom(),
				...this.setGrid(),
				...this.setDataSet(),
			})
		);
	}

	constructor(opts: any, vue: Vue) {
		this.options = vue.$utils.deepClone(opts);
		this.vue = vue;
	}
}
