import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

export module DefPie {
	const defType: TEchartType = "pie";
	export class defaultDValuePie extends baseDConfig {
		public type: TEchartType = defType;
		public tip = " 1个维度，1个指标";
		public dimensions = [];
		public indicators = [];
		// public top = {
		// 	enable: false,
		// 	limit: 1,
		// }; //展示前几条数据
		protected constructor() {
			super(defType);
		}

		public static ins() {
			if (defaultDValuePie.instance == null) {
				defaultDValuePie.instance = new defaultDValuePie();
			}
			return defaultDValuePie.instance;
		}

		public static instance: defaultDValuePie | null = null;
	}

	export class defaultSValuePie extends baseSConfig {
		public static ins() {
			if (defaultSValuePie.instance == null) {
				defaultSValuePie.instance = new defaultSValuePie();
			}
			return defaultSValuePie.instance;
		}

		public static instance: defaultSValuePie | null = null;
		public type: TEchartType = defType;
		public showDataLabel: boolean = true; //图标数据显示
		public showPercentage: boolean = true; //百分比
		public stillShowZeroSum: boolean = true; //数据为零是否显示
		public legend: object = {
			show: true, //图例显示
			position: "bottom",
		};
		private data = {
			series: [
				{
					name: "访问来源",
					type: "pie",
					radius: "50%",
					data: [
						{ value: 20, name: "维度一" },
						{ value: 25, name: "维度二" },
						{ value: 38, name: "维度三" },
						{ value: 14, name: "维度四" },
						{ value: 18, name: "维度五" },
					],
					label: {
						show: true,
						position: "top",
					},
				},
			],
		};
		constructor() {
			super(defType);
		}
	}
}
