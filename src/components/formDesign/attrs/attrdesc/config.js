//自定义菜单配置 ["fontSize", "bold", "italic", "underline", "foreColor", "backColor", "image"];
export const menus = ["fontSize", "bold", "italic", "underline", "foreColor", "backColor"];

//关闭配置全屏
export const showFullScreen = false;
// export const showLinkImg  = false;

//关闭粘贴
export const pasteFilterStyle = true;

//设置语言
export const lang = (() => {
	let l = localStorage.getItem("lang") || "zh";
	return l == "zh" ? "zh-CN" : l;
})();

//设置高度
export const height = 200;

export const linkImgCheck = (imgSrc, alt, href) => {
	console.log(imgSrc, alt, href);
	return true;
};
export const linkImgCallback = (url) => {
	console.log(url);
};

export const linkCheck = (text, link) => {
	console.log(text, link);
	return true;
};
