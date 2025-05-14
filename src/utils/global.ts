import Vue from "vue";
import * as dd from "dingtalk-jsapi";

export const getPlatform = () => {
	if (dd.env.platform !== "notInDingTalk") {
		return "dd";
	}
	return "normal";
};

export const throttle = (cb: () => {}, wait: number) => {
	let timer: any = null;
	return () => {
		if (!timer) {
			timer = setTimeout(() => {
				cb();
				timer = null;
			}, wait);
		}
	};
};

/**
 * 深度克隆
 * @param {Object} params
 * @return {Object}
 */
export const clone = (params: any) => {
	let type = Object.prototype.toString.call(params).slice(8, -1).toLowerCase();
	return type == "object" || type == "array" ? JSON.parse(JSON.stringify(params)) : params;
};

/**
 * 移动端判断
 * @return {Boolean}
 */
export const isMobile = () =>
	navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);

export const bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);

export const getObjType = (obj: any) => {
	var toString = Object.prototype.toString;
	var map: TJson = {
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regExp",
		"[object Undefined]": "undefined",
		"[object Null]": "null",
		"[object Object]": "object",
	};
	if (obj instanceof Element) {
		return "element";
	}
	return map[toString.call(obj)];
};

export const deepClone = (data: any) => {
	var type = getObjType(data);
	var obj: any;
	if (type === "array") {
		obj = [];
	} else if (type === "object") {
		obj = {};
	} else {
		// 不再具有下一层次
		return data;
	}
	if (type === "array") {
		for (var i = 0, len = data.length; i < len; i++) {
			data[i] = (() => {
				if (data[i] === 0) {
					return data[i];
				}
				return data[i];
			})();
			if (data[i]) {
				delete data[i].$parent;
			}
			obj.push(deepClone(data[i]));
		}
	} else if (type === "object") {
		for (var key in data) {
			if (data) {
				delete data.$parent;
			}
			obj[key] = deepClone(data[key]);
		}
	}
	return obj;
};

export function validatenull(val: any) {
	// 特殊判断
	if (val && parseInt(val) === 0) return false;
	const list = ["$parent"];
	if (val instanceof Date || typeof val === "boolean" || typeof val === "number") return false;
	if (val instanceof Array) {
		if (val.length === 0) return true;
	} else if (val instanceof Object) {
		val = deepClone(val);
		list.forEach((ele) => {
			delete val[ele];
		});
		for (var o in val) {
			return false;
		}
		return true;
	} else {
		if (val === "null" || val == null || val === "undefined" || val === undefined || val === "") {
			return true;
		}
		return false;
	}
	return false;
}

export const vaildData = (val: any, dafult: any) => {
	if (typeof val === "boolean") {
		return val;
	}
	return !validatenull(val) ? val : dafult;
};

/**
 * 设置px像素
 */
export const setPx = (val: any, defval = "") => {
	if (validatenull(val)) val = defval;
	if (validatenull(val)) return "";
	val = val + "";
	if (val.indexOf("%") === -1) {
		val = val + "px";
	}
	return val;
};

export const $uploadFun = function (column: any = {}, safe: any) {
	safe = safe || Vue;
	let list = ["uploadPreview", "uploadBefore", "uploadAfter", "uploadDelete", "uploadError", "uploadExceed"];
	let result: any = {};
	if (column.type === "upload") {
		list.forEach((ele) => {
			if (!column[ele]) {
				result[ele] = safe[ele];
			}
		});
	} else {
		list.forEach((ele) => {
			result[ele] = safe[ele];
		});
	}
	return result;
};

export function setEnum<T>(params: T): T {
	let type = Object.prototype.toString.call(params).slice(8, -1).toLocaleLowerCase();
	if (!["array", "object"].includes(type)) return params;
	let o: any = {};
	for (let k of Object.keys(params)) {
		o[(o[(<TJson>params)[k]] = k)] = (<TJson>params)[k];
	}
	return o;
}

export function isJsonString(str: any) {
	try {
		if (typeof JSON.parse(str) == "object") {
			return true;
		}
	} catch (e) {}
	return false;
}

// 防抖函数
export function debounce(fn: any, t: number) {
	let delay = t || 500;
	let timer: any;
	return function () {
		let args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			timer = null;
			fn(args);
		}, delay);
	};
}

//数组对象去重
export function deteleObject(obj: any) {
	var uniques: any = [];
	var stringify: any = {};
	for (var i = 0; i < obj.length; i++) {
		var keys = Object.keys(obj[i]);
		keys.sort(function (a, b) {
			return Number(a) - Number(b);
		});
		var str = "";
		for (var j = 0; j < keys.length; j++) {
			str += JSON.stringify(keys[j]);
			str += JSON.stringify(obj[i][keys[j]]);
		}
		if (!stringify.hasOwnProperty(str)) {
			uniques.push(obj[i]);
			stringify[str] = true;
		}
	}
	uniques = uniques;
	return uniques;
}
//富文本图片添加点击链接
export function addImgHref(str: string) {
	let imgs = str.match(/<img[^>]+>/g);
	imgs &&
		imgs.forEach((element: string) => {
			if (element.split('data-href="').length > 1) {
				//拿到url
				let url = decodeURIComponent(element.split('data-href="')[1].split('"')[0]);
				//插入的值
				let addStr = `style="cursor:pointer" onclick="javascript:location.href='${url}'"`;
				str = str.slice(0, str.indexOf(element.split('data-href="')[1].split('"')[0]) - 12) + addStr + str.slice(str.indexOf(element.split('data-href="')[1].split('"')[0]) - 12);
			}
		});
	return str;
}

export function getTitle(title: TJson) {
	return title[<string>localStorage.getItem("lang")];
}

//全局设计页面修改返回弹窗
export function refreshJump(path: any, vm: Vue, newPath: any) {
	//注册
	window.onbeforeunload = function (evt: any) {
		evt = evt || window.event;
		let dialogText = "";
		// returnvalue 报错
		try {
			evt.returnValue = dialogText;
		} catch (err) {}
		window.onbeforeunload = null;
		return dialogText;
	};
	window.onpopstate = (evt: any) => {
		evt = evt || window.event;
		let dialogText = "离开此页面将无法保存当前内容";

		try {
			evt.returnValue = dialogText;
		} catch (err) {}
		if (confirm(dialogText)) {
			window.onpopstate = null;
			window.onbeforeunload = null;
			vm.$router.push({
				path: newPath,
			});
			return true;
		} else {
			vm.$router.push({
				path: vm.$route.fullPath,
			});
			return false;
		}
	};
}

//对比
export function compare(origin:any, target:any){
	if (typeof target === 'object') {
		if (typeof origin !== 'object') return false;
		if (Object.keys(origin).length !== Object.keys(target).length) return false;
		for (let key in target)
			if (!compare(origin[key], target[key])) return false;
		return true;
	} else return origin === target;
}

//生成uid
export function guid() {
	return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

//组件configList平铺
export function configListFlag(configLsit: any) {
	let allList: any = [];
	configLsit.forEach((item: Record<string, any>) => {
		if (!["separator", "tab", "table"].includes(item.type)) {
			allList.push(item);
		}
		if (item.type == "table") {
			let { children, ...attr } = item;
			let child = children.map((ite: Record<string, any>) => ({
				...ite,
				title: {
					zh: item.title.zh + "." + ite.title.zh,
					en: item.title.en + "." + ite.title.en,
				},
				parent: attr,
			}));
			allList.push(...child);
		}
	});
	return allList;
}
