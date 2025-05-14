import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

export module DefLine {
	const defType: TEchartType = "line";
	export class defaultDValueLine extends baseDConfig {
		public type: TEchartType = defType;
		public tip = " 1个维度，1个指标或多个指标<br/> 2个维度，1个指标";
		public dimensions = [];
		public indicators = [];
		constructor() {
			super(defType);
		}

		public static ins() {
			if (defaultDValueLine.instance == null) {
				defaultDValueLine.instance = new defaultDValueLine();
			}
			return defaultDValueLine.instance;
		}

		public static instance: defaultDValueLine | null = null;
	}

	export class defaultSValueLine extends baseSConfig {
		public static ins() {
			if (defaultSValueLine.instance == null) {
				defaultSValueLine.instance = new defaultSValueLine();
			}
			return defaultSValueLine.instance;
		}

		public static instance: defaultSValueLine | null = null;
		public type: TEchartType = defType;
		public showDataLabel: boolean = true; //图标数据显示
		// public showSymbol: boolean = true; //点
		public legend: object = {
			show: true, //图例显示
			position: "bottom",
		};
		public yAxis = {
			show: true,
			position: "left",
			name: "",
			max: null,
			min: null,
			type: "category",
		};

		public xAxis = {
			show: true,
			name: "",
			type: "category",
			data: ["维度一", "维度二", "维度三", "维度四", "维度五"],
			axisLabel: {
				fontStyle: "normal",
			},
		};
		public grid = {
			show: false,
		};
		//倾斜
		public tilt = "0";

		public markLine = {
			// lineStyle: {
			// 	normal: {
			// 		color: "#01fef9", // 这儿设置安全基线颜色
			// 	},
			// },
			// data: [
			// 	{
			// 		yAxis: 1, //值
			// 	},
			// ],
			// label: {
			// 	normal: {
			// 		formatter: "基准线", // 这儿设置安全基线
			// 	},
			// 	show: false,
			// },
		};
		private data = {
			legend: {
				show: true,
			},
			xAxis: [
				{
					type: "category",
					data: ["维度一", "维度二", "维度三", "维度四", "维度五"],
					axisLabel: {
						fontStyle: "normal",
					},
				},
			],
			yAxis: {
				show: false,
				type: "category",
			},
			//默认数据
			series: [
				{
					type: "line",
					name: "示例",
					label: {
						show: true,
						position: "top",
					},
					data: [20, 25, 38, 14, 18],
				},
			],
		};
		constructor() {
			super(defType);
		}
	}
}
