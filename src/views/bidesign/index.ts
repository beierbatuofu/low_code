import { ChartDynamicDefaultValues, ChartStaticDefaultValues } from "@/components/chartDesign/core/defaultChartsValue";
//默认值赋值

//过滤值
const blackList = ["filter"];
export class defaultEchartsData {
	[x: string]: {};
	private data: TJson = {};
	private constructor(type: string) {
		ChartDynamicDefaultValues.forEach((item: TJson) => {
			if (item.type == type) {
				for (const key in item) {
					if (!blackList.includes(key)) {
						this[key] = item[key];
					}
				}
			}
		});
		ChartStaticDefaultValues.forEach((item: TJson) => {
			if (item.type == type) {
				this.data = item.data;
				this.config = item;
				this.title = item.title;
			}
		});
	}
}
