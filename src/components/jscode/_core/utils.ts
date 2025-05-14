export module Utils {
	export const comp = Symbol();
	export function setFieldVal(form: Record<string, any>, fieldId: string, value: any) {
		Promise.resolve().then(() => {
			if (form.hasOwnProperty(fieldId)) {
				form[fieldId] = value;
			}
			Object.keys(form).forEach((key: string) => {
				if (Object.prototype.toString.call(form[key]) == "[object Object]") {
					form[key]?.data.forEach((item: Record<string, any>) => {
						if (item.hasOwnProperty(fieldId)) {
							item[fieldId] = value;
						}
					});
				}
			});
		});
	}

	export function setFieldAttr(configList: Record<string, any>[], fieldId: string, attr: string, value: any) {
		let conf = configList.find((item: Record<string, any>) => item.fieldId == fieldId);

		conf && (conf[attr] = value);

		configList.forEach((item: Record<string, any>) => {
			if (item.type == "table") {
				let tableChildConf = item.children.find((item: Record<string, any>) => item.fieldId == fieldId);
				tableChildConf && (tableChildConf[attr] = value);
			}
			if (item.type == "tab") {
				item.children.forEach((ite: Record<string, any>) => {
					let tabChildConf = ite.configList.find((item: Record<string, any>) => item.fieldId == fieldId);
					tabChildConf && (tabChildConf[attr] = value);
				});
			}
		});
	}
}
