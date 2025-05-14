//过滤请求参数
export const filterQueryReportData = (that: TJson, data: TJson) => {
	let queryData = (<any>that).$utils.deepClone(data);
	delete queryData.config;
	delete queryData.updater;
	delete queryData.updateTime;
	delete queryData.versionState;
	delete queryData.isDeleted;
	delete queryData.orderIndex;
	delete queryData.title;
	delete queryData.id;
	delete queryData.creater;
	delete queryData.createTime;
	delete queryData.code;
	delete queryData.quotaList;
	delete queryData.formCode;
	delete queryData.data;
	delete queryData.w;
	return queryData;
};
