//过滤数据小数
export const filterSumData = (configList: TJson, fieldId: string, showKey: string) => {
	let newKey: string = showKey;
	configList.map((item: TJson) => {
		if (fieldId === item.fieldId && item.type === "number" && item.numFormat && !item.numFormat.allowDecimalDigits) {
			console.log(showKey, 11);
			// newKey = showKey.substring(0, showKey.indexOf("."));
			newKey = showKey;
		}
	});
	return newKey;
};
