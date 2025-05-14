import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

export module DefTable {
	const defType: TEchartType = "table";
	export class defaultDValueTable extends baseDConfig {
		public static instance: null | defaultDValueTable = null;

		public static ins() {
			if (defaultDValueTable.instance == null) {
				defaultDValueTable.instance = new defaultDValueTable();
			}
			return defaultDValueTable.instance;
		}

		public readonly type: TEchartType = defType;

		// public top = {
		// 	enable: false,
		// 	limit: 1,
		// }; //展示前几条数据
		protected constructor() {
			super(defType);
		}
	}

	export class defaultSValueTable extends baseSConfig {
		public readonly type: TEchartType = defType;
		public static instance: null | defaultSValueTable = null;

		public static ins() {
			if (defaultSValueTable.instance == null) {
				defaultSValueTable.instance = new defaultSValueTable();
			}
			return defaultSValueTable.instance;
		}

		constructor() {
			super(defType);
		}
	}
}
