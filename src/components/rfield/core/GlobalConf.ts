/*
 * @Author: your name
 * @Date: 2021-04-21 17:59:05
 * @LastEditTime: 2021-05-10 10:10:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-zero-ui/src/components/formFields/core/GlobalConf.ts
 */
// 全局设置
export default class GlobalConf {
	// TODO 用户切换语言时请同步修改
	public static lang = localStorage.getItem("lang") || "zh";

	// 客户端浏览器环境：PC, Mobile, DingTalkMobile等
	// TODO 初始化时设置
	public static env = "PC";
	public static isMobile() {
		return GlobalConf.env === "Mobile";
	}
	public static isPC() {
		return GlobalConf.env === "PC";
	}
	public static isDingTalkMobile() {
		return GlobalConf.env === "DingTalkMobile";
	}

	// 获取用户动态定义的语言文本
	//  msg格式:{
	//              zh:"数字",
	//              en:"Number",
	//          }
	public static tc(msg: any) {
		// 获取参数msg的原型类型
		let msgType: string = Object.prototype.toString.call(msg).slice(8, -1).toLocaleLowerCase();
		// console.log("msg type==", msgType);

		let value: any = "";
		switch (msgType) {
			// 对象类型， 取zh/en下的对应文字
			case "object":
				if (!msg.hasOwnProperty(GlobalConf.lang)) {
					value = Object.keys(msg).find((k) => msg[k]) || "";
				} else {
					value = msg[GlobalConf.lang];
				}
				break;
			case "string":
				value = msg;
				break;

			// 传入undefined/null以及其他类型时， 直接返回msg本身;
			// 如果类型不对，属于代码传参错误,暴露给前端以便查错
			default:
				value = msg;
				break;
		}

		return value;
	}

	// public static tc1(msg:any) {

	//     // 获取参数msg的原型类型
	//     let msgType:string = Object.prototype.toString.call(msg).slice(8,-1).toLocaleLowerCase();
	//     console.log("msg type==", msgType);

	//     let value:string = "";
	//     switch(msgType){
	//         // 传入undefined/null时， 直接返回空字符串
	//         case "null":
	//         case "undefined":
	//                 value = "";
	//                 break;

	//         // 对象类型， 取zh/en下的对应文字
	//         case "object":
	//             if(!msg[GlobalConf.lang]){
	//                 value = "";
	//             } else {
	//                 value = msg[GlobalConf.lang];
	//             }
	//             break;

	//         // 基础类型，返回其字符串格式
	//         case "number":
	//         case "boolean":
	//             value = JSON.stringify(msg);
	//             break;
	//         case "string":
	//             value = msg;
	//             break;

	//         // 其他类型，全部返回空字符串
	//         default:
	//             value = "";
	//             break;

	//     }
	//     return value;
	// }
}
