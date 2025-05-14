import { RCall } from "@/utils/RCall";

//仪表盘下所有报表
export const getChartList = (appCode: string, formCode: string) =>
	RCall.newIns().request({
		url: `/codeZero/${appCode}/${formCode}/report/query/all`,
		method: "post",
	});

//仪表盘中报表排序
export const setChartList = (appCode: string, formCode: string, data: any) =>
	RCall.newIns().request({
		url: `/codeZero/${appCode}/${formCode}/report/sort`,
		method: "post",
		data,
	});

//新建报表
export const saveChart = (appCode: string, formCode: string, data: any) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/${appCode}/${formCode}/report/save`,
			method: "post",
			data,
		});
//更新报表
export const updateChart = (appCode: string, formCode: string, data: any) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/${appCode}/${formCode}/report/update`,
			method: "post",
			data,
		});

//获取报表数据
export const getChartData = (appCode: string, formCode: string, reportCode: string, data: TJson) =>
	RCall.newIns().request({
		url: `/codeZero/${appCode}/${formCode}/report/data/query/${reportCode}`,
		method: "post",
		data,
	});
//获取报表数据 --数据集
export const getChartDataset = (appCode: string, data: TJson) =>
	RCall.newIns().request({
		url: `/codeZero/${appCode}/report/data/query`,
		method: "post",
		data,
	});
//获取报表结构
export const getChartStr = (appCode: string, formCode: string, reportCode: string) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/${appCode}/${formCode}/report/query/${reportCode}`,
			method: "post",
		});
//删除报表
export const deleteChart = (appCode: string, formCode: string, reportCode: string) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/${appCode}/${formCode}/report/delete/${reportCode}`,
			method: "post",
		});

export const updateNotice = (appCode: string, formCode: string, data: Record<string, any>[]) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/app/${appCode}/form/${formCode}/notice/update`,
			method: "post",
			data,
		});

export const getNotice = (appCode: string, formCode: string) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/app/${appCode}/form/${formCode}/notice/list`,
			method: "post",
		});

export const sendNotice = (appCode: string, formCode: string, data: Record<string, any>) =>
	RCall.newIns()
		.header({
			envFlag: "",
		})
		.request({
			url: `/codeZero/app/${appCode}/form/${formCode}/notice/send`,
			method: "post",
			data,
		});
