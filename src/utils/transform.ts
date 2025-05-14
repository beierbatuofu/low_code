export const transDlToAt = (data: any) => {
	let newData = JSON.stringify(data).replace(/\"\$/g, '"@');
	return JSON.parse(newData);
};

export const transAtToDl = (data: any) => {
	let newData = JSON.stringify(data).replace(/\"\@/g, '"$');
	return JSON.parse(newData);
};

export const transToTree = (array: any) => {
	let arr: any = [];
	array.forEach((item: any) => {
		if (!item.isApp) {
			arr.push({
				...item,
				children: [],
			});
		}
	});
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < array.length; j++) {
			if (arr[i].id === array[j].parentId) {
				arr[i].children.push(array[j]);
			}
		}
	}
	return arr.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
};

// dashboard页 给应用加isCollect标签，arr-所有应用，refer-收藏应用
export const calcCollect = (arr: any, refer: any) => {
	for (let i = 0; i < refer.length; i++) {
		for (let j = 0; j < arr.length; j++) {
			if (refer[i].id === arr[j].id) {
				arr[j].isCollect = true;
			}
		}
	}
	return arr;
};

// export const deelTableData = (form: TJson) => {
// 	//处理数据--暂时待修改

// 	let tempObj = {};
// 	for (const key in form) {
// 		//过滤不要的数据
// 		if (Object.prototype.hasOwnProperty.call(form, key) && key.indexOf("-") < 0) {
// 			tempObj = { ...tempObj, [key]: form[key] };
// 		}

// 		// //默认值添加
// 		// if (Array.isArray(form[key])) {
// 		// 	form[key].forEach((element: any) => {
// 		// 		for (const keyInside in element) {
// 		// 			if (form[keyInside]) {
// 		// 				element[keyInside] = form[keyInside];
// 		// 			}
// 		// 		}
// 		// 	});
// 		// }
// 	}

// 	return tempObj;
// };
