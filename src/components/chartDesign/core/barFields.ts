import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

/**
 * @description: 封装bar的静态配置和动态配置
 */
export module DefBar {
	// 默认类型
	const defType: TEchartType = "bar";
	//动态配置
	export class defaultDValueBar extends baseDConfig {
		public static instance: defaultDValueBar | null = null;
		public static ins() {
			if (defaultDValueBar.instance == null) {
				defaultDValueBar.instance = new defaultDValueBar();
			}

			return defaultDValueBar.instance;
		}

		public type: TEchartType = defType;
		public tip = " 1个维度，1个指标或多个指标<br/> 2个维度，1个指标";
		public dimensions = [];
		public indicators = [];
		protected constructor() {
			super(defType);
		}
	}
	//静态配置
	export class defaultSValueBar extends baseSConfig {
		public type: TEchartType = defType;
		public showDataLabel: boolean = true; //图标数据显示
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
					name: "维度",
					type: "bar",
					label: {
						show: true,
						position: "top",
					},
					data: [20, 25, 38, 14, 18],
				},
			],
		};
		protected constructor() {
			super(defType);
		}

		public static ins() {
			if (defaultSValueBar.instance == null) {
				defaultSValueBar.instance = new defaultSValueBar();
			}
			return defaultSValueBar.instance;
		}

		public static instance: defaultSValueBar | null = null;
	}
}
