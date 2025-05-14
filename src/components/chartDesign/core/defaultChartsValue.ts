import { DefBar } from "./barFields";
import { DefLine } from "./lineFields";
import { DefPie } from "./pieFields";
import { DefTable } from "./tableFields";
import { DefQuota } from "./quotaFields";
import { DefCustom } from "./costumFields";
import { DefFilter } from "./filterFields";
import { TEchartType } from "./type";
//bilist只需要type
export const createChartList: TEchartType[] = ["bar", "line", "pie", "table", "quota", "editor", "costum", "filter"];

//动态配置
export const ChartDynamicDefaultValues = [
	DefBar.defaultDValueBar.ins(),
	DefLine.defaultDValueLine.ins(),
	DefPie.defaultDValuePie.ins(),
	DefTable.defaultDValueTable.ins(),
	DefQuota.defaultDValueQuota.ins(),
	DefCustom.defaultDValueCostum.ins(), //默认值
	DefFilter.defaultDValueFilter.ins(), //默认值
];

//静态配置
export const ChartStaticDefaultValues = [
	DefBar.defaultSValueBar.ins(),
	DefLine.defaultSValueLine.ins(),
	DefPie.defaultSValuePie.ins(),
	DefTable.defaultSValueTable.ins(),
	DefQuota.defaultSValueQuota.ins(),
	DefCustom.defaultSValueCostum.ins(),
	DefFilter.defaultSValueFilter.ins(),
];

//不需要的配置
export const ChartConfigFilter = ["type"];
//不需要静态的配置
export const ChartSConfigFilter = ["data"];

//未添加静态配置
