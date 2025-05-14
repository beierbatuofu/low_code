/**
 * 前后端交互统一封装
 * @param remote: 服务端协议加域名，可根据实际需要对该参数进行修改，但要注意修改值会覆盖之前的值
 * @method get: get方法
 * @method post: post方法，用于application/json格式的数据交互
 * @method download: 文件下载
 */
import { env } from "./path";
import axios, { AxiosInstance } from "axios";
import ErrorCode from "./ErrorCode";
import { Message } from "element-ui";
import i18n from "@/lang";
import * as dd from "dingtalk-jsapi";

interface RespData {
	code: string;
	data?: any;
	extra?: any;
	msg: string;
	path?: string;
	timestamp?: number;
}

/**
 * 使用axios请求
 */
export class AxiosRequest {
	private static APPLICATION_JSON = "application/json";
	private static SERVICE_SUCCESS_CODE = "0";

	private instance: AxiosInstance;
	private ownerHeader: any;

	// 默认是false
	private serviceHandleFlag: boolean = false;
	constructor() {
		//创建axios实例
		this.instance = axios.create({
			baseURL: env(),
		});

		//请求拦截
		this.instance.interceptors.request.use(
			(config): any => {
				config.headers = {
					...config.headers,
					...this.headers(),
				};
				return config;
			},
			(error): Promise<RespData> => {
				const resp = {
					code: "-1",
					msg: "请求错误",
				};
				// 由业务层处理
				return this.serviceHandleFlag ? Promise.resolve(resp) : Promise.reject(resp);
			}
		);
		//响应拦截
		// 这个方法就很废柴，主要是返回类型，被限制死了，必须和response一个类型或者Promis<response 类型>，缺乏灵活性
		this.instance.interceptors.response.use(
			(response) => {
				return response;
			},
			(error): Promise<RespData> => {
				let errResp = error.response.data;

				try {
					if (error.toJSON().message === "Network Error") {
						return Promise.reject({
							code: "-5",
							msg: "网络错误，请重试",
						});
					}
				} catch (err) {
					return Promise.reject(errResp);
				}
				return Promise.reject(errResp);
			}
		);
	}

	/**
	 * 设置是否由具体业务自行处理标识
	 * @param flag true or false
	 */
	serviceHandle(flag: boolean): AxiosRequest {
		this.serviceHandleFlag = flag;
		return this;
	}

	/**
	 * 发送请求
	 * @param param 请求参数
	 */
	request(param: { url: string; method: "post" | "get" | "put"; data?: any }): Promise<RespData> {
		let method = param.method.toLowerCase();
		if (!Reflect.has(this, method)) {
			return Promise.reject({
				code: "-4",
				msg: `不支持的请求方式${param.method}`,
			});
		}

		return (<any>this)[method].apply(this, [param.url, param.data]);
	}

	/**
	 * @description:fulfilled状态处理errorcode
	 */
	private requestSuccess(resp: { data: RespData }) {
		return new Promise<any>((resolve, reject) => {
			const data: RespData = resp.data;
			let err: any;

			if ((err = ErrorCode.RespErr(data)) === AxiosRequest.SERVICE_SUCCESS_CODE) {
				resolve(data);
			} else {
				let resp = data;

				err(() => {
					if (!resp.hasOwnProperty("code")) {
						resp = {
							code: "-3",
							msg: "global.requestError",
						};
						Message({
							type: "warning",
							message: (<any>i18n).t("global.requestError", [""]),
						});
					}
				});

				this.serviceHandleFlag ? resolve(resp) : reject(resp);
			}
		});
	}

	/**
	 * @description:rejected 状态处理errorCode
	 */
	private requestFail(error: Record<string, any>) {
		const whilelist = [
			"FM-ILLEGAL_SQL_TYPE",
			"FM-FORM_ADD_NO_SAME_VAL",
			"FM-ILLEGAL_SQL_EXECUTE_ERROR",
			"REPORT-REPORT_DATA_FIELD_NOT_EXISTS",
			"REPORT-REPORT_NO_DIMENSIONS_OR_INDICATORS",
			"REPORT-REPORT_DIMENSIONS_OR_INDICATORS_COUNT_ERROR",
			"REPORT-REPORT_FIELD_INFO_ERROR", //维度指标删除
		];
		//不提示的code
		const notNoticeList = ["FM-FORM_NOT_EXISTS", "REPORT-REPORT_SOURCE_NOT_EXISTS"];

		if (notNoticeList.includes(error.code)) {
			return Promise.reject(error);
		}
		if (!whilelist.includes(error.code)) {
			let err = ErrorCode.RespErr(error);
			err(() => {
				Message({
					type: "warning",
					message: (<any>i18n).t("global.requestError", [""]),
				});
			});
			// ErrorCode.debounce(() =>
			// 	Message({
			// 		type: "warning",
			// 		message: (<any>error).code == -5 ? (<any>i18n).t("global.netWorkError", [""]) : error.msg || (<any>i18n).t("global.requestError", [""]),
			// 	})
			// );
		} else {
			ErrorCode.RespErr(error)();
		}

		return Promise.reject(error);
	}

	/**
	 *
	 * @param url api path
	 * @param bodyParam 请求体参数
	 * @param queryParam 请求路径参数
	 */
	public get(url: string, bodyParam?: { [key: string]: any }, queryParam?: { [key: string]: any }): Promise<RespData> {
		url = url + AxiosRequest.convertParams(queryParam);
		return this.instance
			.get(url, bodyParam || {})
			.then((resp) => {
				return this.requestSuccess(resp);
			})
			.catch((error: TJson) => {
				return this.requestFail(error);
			});
	}

	/**
	 *
	 * @param url api path
	 * @param bodyParam 请求体参数
	 * @param queryParam 请求路径参数
	 */
	public post(url: string, bodyParam?: { [key: string]: any }, queryParam?: { [key: string]: any }): Promise<RespData> {
		url = url + AxiosRequest.convertParams(queryParam);
		return this.instance
			.post(url, bodyParam || {})
			.then((resp) => {
				return this.requestSuccess(resp);
			})
			.catch((error: TJson) => {
				return this.requestFail(error);
			});
	}

	/**
	 *
	 * @param url api path
	 * @param bodyParam 请求体参数
	 * @param queryParam 请求路径参数
	 */
	public put(url: string, bodyParam?: { [key: string]: any }, queryParam?: { [key: string]: any }): Promise<RespData> {
		url = url + AxiosRequest.convertParams(queryParam);
		return this.instance
			.put(url, bodyParam)
			.then((resp) => {
				return this.requestSuccess(resp);
			})
			.catch((error) => {
				Message({
					type: "warning",
					message: (<any>i18n).t("global.requestError", [""]),
				});

				return Promise.reject(error);
			});
	}

	/**
	 * 设置请求头参数
	 * @param ownerHeader 请求头参数
	 */
	header = (ownerHeader: { [key: string]: any }): AxiosRequest => {
		this.ownerHeader = ownerHeader;
		return this;
	};

	/**
	 * 文件下载
	 * @param downloadUrl 下载链接
	 * @param fileName 文件名
	 */
	saveAs = (downloadUrl: string, fileName: string) => {
		if (dd.env.platform !== "notInDingTalk") {
			(<Record<string, any>>dd.biz.util).openLink({
				url: downloadUrl,
			});
			return;
		}
		let iframe: any = document.createElement("iframe");
		iframe.setAttribute("id", "iframeDown");
		let ififrame: any = document.querySelector("#iframeDown");
		if (ififrame) {
			ififrame.style.display = "none";
			ififrame.src = downloadUrl;
		} else {
			document.body.appendChild(iframe);
			iframe.style.display = "none";
			iframe.onload = function () {
				iframe.src = downloadUrl;
			};
			iframe.src = downloadUrl;
		}
	};

	/**
	 * 判断数据是否json类型
	 * @param obj 需要判断的数据
	 */
	private static isJson = (obj: any) => {
		return typeof obj == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	};

	/**
	 * 头部信息
	 * @param contetnType http的contentType
	 */
	private headers = () => {
		let isAppd = window.location.hash.split("/")[2];
		let envFlag = isAppd == "appd" ? { envFlag: "test" } : {};
		return {
			token: window.localStorage.getItem("token") ?? undefined,
			"Content-Type": AxiosRequest.APPLICATION_JSON,
			Accept: "application/json;charset=UTF-8",
			...envFlag,
			...(this.ownerHeader ?? {}),
		};
	};

	/**
	 * 将json处理成?key1=val1&key2&val2格式
	 * @param params 参数
	 */
	private static convertParams = (params: any) => {
		// 参数为空则直接返回空字符串
		if (!params) {
			return "";
		}

		let param = "";
		for (const k in params) {
			if (params[k] instanceof Array) {
				param = k + "=" + params[k].join(",") + "&" + param;
			} else if (AxiosRequest.isJson(params[k])) {
				param = k + "=" + encodeURIComponent(JSON.stringify(params[k])) + "&" + param;
			} else {
				param = k + "=" + encodeURIComponent(params[k] ?? "") + "&" + param;
			}
		}
		return param ? "?" + param.substring(0, param.length - 1) : "";
	};
}

/**
 * 请求入口类
 */
class RCall {
	/**
	 * 获取实例
	 */
	static newIns() {
		return new AxiosRequest();
	}

	/**
	 * 获取由业务层处理返回码的实例
	 */
	static serviceIns() {
		return new AxiosRequest().serviceHandle(true);
	}
}

export { RCall, RespData };
