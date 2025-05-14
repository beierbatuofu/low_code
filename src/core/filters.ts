/*
 * @Author: ben
 * @LastEditTime: 2021-06-03 15:50:44
 */

export const formatDate = (time: number) => {
	const date = new Date(time * 1000);
	const YYYY = date.getFullYear();
	const MM = String(date.getMonth() + 1).padStart(2, "0");
	const DD = String(date.getDate()).padStart(2, "0");
	const hh = String(date.getHours()).padStart(2, "0");
	const mm = String(date.getMinutes()).padStart(2, "0");
	const ss = String(date.getSeconds()).padStart(2, "0");

	return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
};

/**
 * @description:
 * @param {Object} item
 * @param {Object} data
 * @return {*}
 */
export const getLang = (item: any): any => {
	try {
		let lang = localStorage.getItem("lang") || "zh";
		let text = item.title[lang];
		return text || item.title["zh"];
	} catch (err) {
		return item.prop || item;
	}
};

export const getName = (item: any): any => {
	try {
		let lang = localStorage.getItem("lang") || "zh";
		let text = item.name[lang];
		return text || item.name["zh"];
	} catch (err) {
		return item.prop || item;
	}
};

export const getNameLang = (item: any): any => {
	try {
		let text = item.multiLanguage[localStorage.getItem("lang") || "zh"];
		return text || item.multiLanguage["zh"];
	} catch (err) {
		return item.name;
	}
};

export const getTitle = (item: any): any => {
	try {
		let lang = localStorage.getItem("lang") || "zh";
		let text = item[lang];
		return text || item["zh"];
	} catch (err) {}
};
