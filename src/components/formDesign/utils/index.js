
export const stringify = (json) => {
	let count = 0;
	let list = [];
	let str = JSON.stringify(
		json,
		function (key, val) {
			if (typeof val === "function") {
				list.push(val + "");
				const result = "$code{" + count + "}$code";
				count = count + 1;
				return result;
			}
			return val;
		},
		2
	);
	let startCode = "$code{";
	let endCode = "}$code";
	list.forEach((ele, index) => {
		str = str.replace(startCode + index + endCode, startCode + ele + endCode);
	});
	for (let i = 0; i < count; i++) {
		str = str.replace('"' + startCode, "").replace(endCode + '"', "");
	}
	return str;
};



export const setEnum = (params)=>{
	let type = Object.prototype.toString.call(params).slice(8,-1).toLocaleLowerCase();
	if(!['array','object'].includes(type)) return params;
	let o = {};
	for(let k of Object.keys(params)){
		o[o[k]=params[k]]=k;
	}
	return o;
}