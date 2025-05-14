/*
 * @Author: ben
 * @LastEditTime: 2021-06-03 15:51:21
 */
import * as global from "./global";
import RLog from "./RLog";
import * as path from "./path";
import * as storage from "./storage";
import theme from "./theme";
import * as transform from "./transform";
import toEchartsData from "./toEchartsData";

export default {
	RLog,
	theme,
	toEchartsData,
	...global,
	...path,
	...storage,
	...transform,
};
