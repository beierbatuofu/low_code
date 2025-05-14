/*
 * @Author: your name
 * @Date: 2021-12-01 14:01:32
 * @LastEditTime: 2022-04-13 16:25:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \risen\src\components\chartDesign\core\quotaFields.ts
 */
import { baseDConfig, baseSConfig } from "./defaultBase";
import { TEchartType } from "./type";

export module DefQuota {
	const defType: TEchartType = "quota";

	export class defaultDValueQuota extends baseDConfig {
		public type: TEchartType = defType;
		public tip = " 0个维度，1个指标或<br/> 1个维度，1个指标";
		public dimensions = [];
		public indicators = [];

		public static ins() {
			if (defaultDValueQuota.instance == null) {
				defaultDValueQuota.instance = new defaultDValueQuota();
			}

			return defaultDValueQuota.instance;
		}

		public static instance: null | defaultDValueQuota = null;

		constructor() {
			super(defType);
		}
	}

	export class defaultSValueQuota extends baseSConfig {
		public type: TEchartType = defType;
		constructor() {
			super(defType);
		}
		public static ins() {
			if (defaultSValueQuota.instance == null) {
				defaultSValueQuota.instance = new defaultSValueQuota();
			}

			return defaultSValueQuota.instance;
		}

		public static instance: null | defaultSValueQuota = null;
	}
}
