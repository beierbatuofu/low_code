import { baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

export module DefFilter {
	const defType: TEchartType = "filter";
	export class defaultDValueFilter {
		public type: TEchartType = "filter";
		public data = {};
		public static ins() {
			if (defaultDValueFilter.instance == null) {
				defaultDValueFilter.instance = new defaultDValueFilter();
			}
			return defaultDValueFilter.instance;
		}

		public static instance: null | defaultDValueFilter = null;
	}

	export class defaultSValueFilter extends baseSConfig {
		public static ins() {
			if (defaultSValueFilter.instance == null) {
				defaultSValueFilter.instance = new defaultSValueFilter();
			}
			return defaultSValueFilter.instance;
		}

		public static instance: null | defaultSValueFilter = null;
		public type: TEchartType = "filter";

		constructor() {
			super(defType);
		}
	}
}
