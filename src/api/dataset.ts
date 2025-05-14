import { RCall } from "@/utils/RCall";
/**
 * 数据集相关接口
 */
export const runSql = (params: TJson = {}, pageSize: number = 5, page: number = 1) => {
	let { datasetCode, appCode, ...data } = params;
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/executeDatasetSQL/${datasetCode}/page/${page}/pageSize/${pageSize}`,
		method: "post",
		data,
	});
};

export const displaySql = (appCode: string, datasetCode: string) => {
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/queryDataSet/${datasetCode}`,
		method: "post",
	});
};

export const updateSql = (params: TJson) => {
	let { appCode, datasetCode, ...data } = params;

	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/update/${datasetCode}`,
		method: "post",
		data,
	});
};

//添加数据集
export const addDataset = (appCode: string, name: any) => {
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/save`,
		method: "post",
		data: {
			name,
		},
	});
};

//获取所有数据集
export const getDataset = (appCode: string) => {
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/queryAppDataSet`,
		method: "post",
	});
};

//查询单个数据集
export const queryDataset = (appCode: string, datasetCode: string) => {
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/queryDataSet/${datasetCode}`,
		method: "post",
	});
};

//删除数据集
export const delDataset = (appCode: string, datasetCode: string) => {
	return RCall.newIns().request({
		url: `/codeZero/app/${appCode}/dataset/delete/${datasetCode}`,
		method: "post",
	});
};

export const getFormList = (appCode: string, data: { containDeleted?: boolean; formCodes?: string[]; formTypes?: string[] } = {}) =>
	RCall.newIns().request({
		url: `/codeZero/app/${appCode}/form/list`,
		method: "post",
		data,
	});
