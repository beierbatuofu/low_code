import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";
export module DefCustom {
	const defType: TEchartType = "costum";

	export class defaultDValueCostum extends baseDConfig {
		public type: TEchartType = defType;
		public dimensions = [];
		public indicators = [];
		protected constructor() {
			super(defType);
		}

		public static ins() {
			if (defaultDValueCostum.instance == null) {
				defaultDValueCostum.instance = new defaultDValueCostum();
			}

			return defaultDValueCostum.instance;
		}

		public static instance: null | defaultDValueCostum = null;
	}

	export class defaultSValueCostum extends baseSConfig {
		public type: TEchartType = defType;

		private data = {};
		public static ins() {
			if (defaultSValueCostum.instance == null) {
				defaultSValueCostum.instance = new defaultSValueCostum();
			}

			return defaultSValueCostum.instance;
		}

		public static instance: null | defaultSValueCostum = null;

		protected constructor() {
			super(defType);
		}
	}
}
