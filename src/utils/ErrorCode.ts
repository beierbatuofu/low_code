/*
 * @Author: ben
 * @LastEditTime: 2022-06-23 15:11:52
 */
import { setEnum } from "./global";
import i18n from "@/lang";
import { Message } from "element-ui";

//response报错码
export const codes = {
	"AT-TENANT_ID_EMPTY": "errorLogin.loginFailed",
	"AT-LOGIN_FAILED": "errorLogin.failed",
	"AT-LOGIN_CONTENT_TYPE_INVALID": "errorLogin.failed",
	"AT-TOKEN_GENERATE_FAILED": "errorLogin.loginFailed",
	"AT-AUTH_FAILED": "errorLogin.loginFailed",
	"AT-GET_USER_ID_EXCEPTION": "errorLogin.loginFailed",
	"AT-GET_USER_ID_FAILED": "errorLogin.loginFailed",
	"AT-GET_ACCESS_TOKEN_EXCEPTION": "errorLogin.loginFailed",
	"AT-GET_ACCESS_TOKEN_FAILED": "errorLogin.loginFailed",
	"T-GET_ACCESS_TOKEN_EXCEPTION": "errorLogin.loginFailed",
	"AT-AUTH_TOKEN_DISAPPEARED": "errorLogin.failed",
	"AT-AUTH_TOKEN_NOT_EXISTS": "errorLogin.loginFailed",
	"AT-AUTH_TOKEN_IP_ABNORMAL": "errorLogin.loginFailed",
	"AT-AUTH_TOKEN_CHECK_FAILE": "errorLogin.failed",
	"AT-AUTH_TOKEN_ACCESS_DENIED": "errorLogin.permissionFailed",
	"AT-INVALID_TOKEN": "errorLogin.loginFailed",
	"AT-EXT_LOGIN_PARAM_MISS": "errorLogin.failed",
	"AT-TENANT_ACCESS_DENIED": "errorLogin.permissionFailed",
	"AT-REQUEST_DINGTALK_FAILED": "errorLogin.failed",
	"AT-TENANT_NOT_EXISTS": "errorLogin.exists",
	"AT-USER_NOT_EXISTS": "errorLogin.failed",
	"FM-OSS_OBJECT_STORAGE_NOT_EXISTS": "errorForm.failed",
	"FM-NOT_EXIST": "errorForm.exist",
	"FM-MAP_EMP": "errorForm.empty",
	"FM-FIELD_N_EXIST": "errorForm.verification",
	"FM-FOLDER_ADD_FAILED": "errorForm.addFailed",
	"FM-FOLDER_HAS_SON_ELEMENTS": "errorForm.hasFailed",
	"FM-NOT_FOLDER_EXCEPTION": "errorForm.delFailed",
	"FM-FORM_UPDATE_FAILED": "errorForm.updateFailed",
	"FM-FORM_FOLDER_NOT_EXISTS": "errorForm.notExists",
	"FM-ILLEGAL_DATA_TYPE": "errorForm.failed",
	"FM-FORM_NOT_EXISTS": "errorForm.notForm",
	FM_DESIGNER_DELETE_SELF_ERROR: "errorForm.delDesignFail",
	"CM-SYSTEM_BUSY": "errorCm.failed",
	"CM-SYSTEM_TIMEOUT": "errorCm.maintenance",
	"CM-PARAM_EX": "errorCm.failed",
	"CM-SQL_EX": "errorCm.failed",
	"CM-NULL_POINT_EX": "errorCm.failed",
	"CM-LOAD_RESOURCES_ERROR": "errorCm.failed",
	"CM-BASE_VALID_PARAM": "errorCm.failed",
	"CM-OPERATION_EX": "errorCm.failed",
	"CM-SERVICE_MAPPER_ERROR": "errorCm.failed",
	"CM-CAPTCHA_ERROR": "errorCm.failed",
	"CM-JSON_PARSE_ERROR": "errorCm.failed",
	"CM-ENV_FLAG_ERROR": "errorCm.failed",
	"CM-DELETE_FAILED": "errorCm.failed",
	"CM-BAD_REQUEST": "errorCm.failed",
	"CM-UNAUTHORIZED": "errorCm.failed",
	"CM-NOT_FOUND": "errorCm.failed",
	"CM-METHOD_NOT_ALLOWED": "errorCm.failed",
	"CM-TOO_MANY_REQUESTS": "errorCm.failed",
	"CM-INTERNAL_SERVER_ERROR": "errorCm.failed",
	"CM-BAD_GATEWAY": "errorCm.failed",
	"CM-GATEWAY_TIMEOUT": "errorCm.failed",
	"CM-REQUIRED_FILE_PARAM_EX": "errorCm.failed",
	"CM-DATA_SAVE_ERROR": "errorCm.addFailed",
	"CM-DATA_UPDATE_ERROR": "errorCm.updateFailed",
	"CM-TOO_MUCH_DATA_ERROR": "errorCm.dataFailed",
	"CM-ADD_FAILED": "errorCm.addFailed",
	"DT-DING_ERROR_CODE": "errorDt.failed",
	"APP-NO_RELEASE_CONTENT": "errorApp.updateFailed",
	"APP-APP_DELETED1_ERROR": "errorApp.del1Failed",
	"APP-APP_DELETED2_ERROR": "errorApp.del2Failed",
	"APP-APP_COLLECTION_ERROR": "errorApp.collectionFailed",
	"APP-APP_EFFECT_NOW_ERROR": "errorApp.releaseFailed",

	"FLOW-AUTO_NODE_NEST": "errorFlow.releaseAutoFailed",
	"FLOW-FLOW_JSON_REMOVE": "errorFlow.failed",
	"FLOW-FLOW_FORM_DATA_REMOVE": "errorFlow.delFormFailed",
	"FLOW-FLOW_PROCESS_REMOVE": "errorFlow.configFailed",
	"FLOW-FLOW_EXIT": "errorFlow.verificationFailed",
	FLOW_OP_FAIL: "errorFlow.flowFailed",
	"FLOW-FLOW_ERROR_CODE": "errorFlow.failed",
	"FLOW-TASK_PICK_UP": "errorFlow.noTask",
	"FLOW-CURRENT_NO_TASK": "errorFlow.noTask",
	"FLOW-AUTHORITY_INSUFFICIENT": "errorFlow.insufficient",
	"FLOW-PROCESS_END": "errorFlow.isEnd",
	"CM-DATA_DELETE_CONTAIN_OWN_ERROR": "errorFlow.noDeleteSelf",
	"CM-DATA_APP_DESIGNER_ROLE_NOT_EXIST": "errorFlow.noExist",
	"CM-DATA_APP_ROLE_UPDATE_ERROR": "errorFlow.updateError",
	"FM-FORM_DELETED_EXISTS_REPORT": "errorForm.pDeleteError",
	"FM-ILLEGAL_SQL_EXECUTE_ERROR": "errorSql.failed",
	"REPORT-REPORT_SOURCE_NOT_EXISTS": "errorForm.dataSourceNotFound",
	FM_RELATION_FAIL: "errorRelation.faile",
	FM_RELATION_FAIL_FIELD: "errorRelation.failed",
	FM_RELATION_FAIL_FORM: "errorRelation.form",
	"APP-ROLE-DESIGNER-NOT-EXIST": "errorApp.designerFailed",
	"APP-ROLE-UPDATE-ERROR": "errorApp.roleFailed",
	FLOW_NO_DATA: "errorFlow.deleteFailed",
	CALENDAR_SQL_FAIL: "errorCalendar.fieldUndef",
};

const errCodes: any = setEnum(codes);

//错误码策略
export default class ErrorCode {
	public static result: TJson = {};
	public static timeout: null | number = null;

	public static errorRelation(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);
		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorApp(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorCalendar(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorSql(value: string, resp: Record<string, any>) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: `${msg}${resp.msg || ""} `,
				type: "warning",
			})
		);
	}

	public static errorFlow(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorDt(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorCm(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorForm(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
			})
		);
	}

	public static errorLogin(value: string) {
		let code = errCodes[value];
		let msg = (<any>i18n.t)(value);
		let loginType = window.localStorage.getItem("loginType");

		localStorage.clear();
		sessionStorage.clear();

		if (loginType == "guest") {
			return ErrorCode.debounce(() =>
				Message({
					message: "token过期,请重新扫码",
					type: "warning",
					onClose: () => {},
				})
			);
		}

		ErrorCode.debounce(() =>
			Message({
				message: msg,
				type: "warning",
				onClose: () => {
					location.href = `/#/tenants`;
					Promise.resolve().then(() => {
						window.location.reload();
					});
				},
			})
		);
	}

	public static debounce = (cb: () => void) => {
		if (ErrorCode.timeout) return;
		cb();
		ErrorCode.timeout = window.setTimeout(() => {
			ErrorCode.timeout = null;
		}, 600);
	};
	/**
	 * @description:
	 * @param {string} code 错误码
	 * @return {*}
	 */
	public static RespErr(resp: TJson): any {
		let { code, msg } = resp;
		// console.log(resp, "resp");
		if (String(code) == "0") return String(code);

		return function (this: unknown, cb: () => {}) {
			let value = errCodes[code];
			if (!value) return cb;
			let [method] = value.split(".");

			return (<TJson>ErrorCode)[method].call(this, value, resp);
		};
	}
}

// export default function RespErr<T>(code: T): any {
// 	if (String(code) == "0") return String(code);
// 	return function (this: unknown, cb: () => {}) {
// 		let value = errCodes[code];
// 		if (!value) return cb;
// 		let [method] = value.split(".");
// 		return (<TJson>ErrorCode)[method].call(this, value);
// 	};
// }
