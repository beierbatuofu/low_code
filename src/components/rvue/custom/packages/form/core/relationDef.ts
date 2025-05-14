export abstract class Base {
	protected relation: string = "";
	protected w: TFieldWatch = Object.create(null);
	abstract execute(watcher: TFieldWatch): void;
}

export module RelationDefine {
	export let uid = 1;
	//引用公式库
	export const parser: Readonly<Record<string, any>> = new (require("hot-formula-parser").Parser)();
	//匹配fieldId
	export const reg: Readonly<RegExp> = /\$field_([0-9a-zA-Z_]+)\$/g;
	//当前计算节点最大循环次数
	export const maxCount: Readonly<number> = 2;
	//当前vue component 对象
	export let comp: TComp = null;
	//存储字段事件额外信息
	export let evtData: Partial<TEvtData> = {};
	export let oldForm: Record<string, any> = {};

	export let relationConfig: Record<string, any> = {};

	const parseError: Readonly<string> = "#ERROR!";

	export const initUid = () => {
		uid = 1;
	};

	//注册自定义公式
	{
		parser.setFunction("TIMESTAMP", function (params: any[]) {
			if (!params[0]) return "";
			let timestamp = new Date(params[0]).getTime();
			if (isNaN(timestamp)) return "";
			return timestamp;
		});
	}

	/**
	 * @description://获取节点类型
	 * @param {*} fieldId 字段id
	 * @return {*}
	 */
	export const getFieldType: (fieldId: string) => keyof TFieldValType = (fieldId) => {
		let fieldData: Record<string, any> = {};
		const findFieldType = (clist: any[]) => {
			clist.some((item: TJson) => {
				if (item.type == "table" && item.children.length) {
					return findFieldType(item.children);
				}
				if (item.type == "tab" && item.children.length) {
					item.children.map((ite: Record<string, any>) => {
						findFieldType(ite.configList);
					});
				}
				if (item.fieldId == fieldId) {
					fieldData = item;
					return true;
				}
			});
		};
		if (RelationDefine.comp?.configList) {
			findFieldType(RelationDefine.comp.configList);
		}
		return fieldData.type;
	};

	/**
	 * @description:修改form对应的fieldId 的value
	 * @param {*} result 公式计算后返回的值
	 * @param {*} targetFieldType 目标字段类型
	 * @param {*} relationItem relationItem类
	 * @return {*}
	 */
	export const setValue: (result: any, targetFieldType: string, relationItem: Record<string, any>) => void = (result, targetFieldType, relationItem) => {
		let value: any = result;
		let form = RelationDefine.comp?.form ? RelationDefine.comp.form : {};
		let fieldId = relationItem.fieldId;
		value = String(result);
		if (relationItem.pid) {
			let rowIdx = RelationDefine.evtData.rowIdx;
			if (rowIdx !== undefined && rowIdx > -1) {
				form = form[relationItem.pid].data[rowIdx];
			} else {
				RelationDefine.comp?.form[relationItem.pid].data.forEach((item: Record<string, any>) => {
					item[fieldId] = value;
				});
				return;
			}
		}

		if (targetFieldType == "datetime" && value) {
			const date = new Date(Number(value));
			value =
				String(date) == "Invalid Date"
					? value
					: date.getFullYear() + "-" + (Number(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		}

		if (form && form.hasOwnProperty(fieldId)) {
			form[fieldId] = value;
		}
	};

	export class ConvertValue {
		public static instance: ConvertValue | null = null;
		public static ins() {
			if (!(ConvertValue.instance instanceof ConvertValue)) {
				ConvertValue.instance = new ConvertValue();
			}
			return ConvertValue.instance;
		}
		private baseDept(params: TConvertValue) {
			let { val } = params;
			let arr: any[] = [];

			if (typeof val == "string") {
				val = val.replace(/\[\]/g, "").replace(/\]\[/g, ",");
			}

			if (!Array.isArray(val) && val) {
				val = JSON.parse(val);
			}
			if (!val) return "''";
			val.forEach((item: any) => arr.push(item.name));
			if (arr.length == 0) return "''";
			return `'${arr.join(" ")}'`;
		}

		public address(params: TConvertValue) {
			let { val } = params;
			if (typeof val == "string") return `'${val}'`;
			return `'${val.province}${val.city}${val.district}${val.detail}'`;
		}

		public number(params: TConvertValue) {
			let { val, targetType } = params;

			if (targetType == "number" && !val) return "";
			if (!val) return "";
			return isNaN(val) ? 0 : val;
		}
		public input(params: TConvertValue) {
			let { val } = params;

			if (!val) return "";
			return `'${String(val)}'`;
		}

		public datetime(params: TConvertValue) {
			let { val, targetType } = params;

			if (targetType == "number") return new Date(val).getTime();
			return `'${val}'`;
		}

		public textarea(params: TConvertValue) {
			let { val } = params;
			if (!val) return "";
			return `'${String(val)}'`;
		}

		public dept(params: TConvertValue) {
			return this.baseDept(params);
		}

		public user(params: TConvertValue) {
			return this.baseDept(params);
		}

		public userRadio(params: TConvertValue) {
			return this.baseDept(params);
		}

		public deptRadio(params: TConvertValue) {
			return this.baseDept(params);
		}

		public sn(params: TConvertValue) {
			if (!params.val) return "";
			return `'${params.val}'`;
		}
		public radio(params: TConvertValue) {
			let { val } = params;
			if (!val) return "";
			return `'${String(val)}'`;
		}

		public select(params: TConvertValue) {
			let { val } = params;
			if (!val) return "";
			return `'${String(val)}'`;
		}

		public checkbox(params: TConvertValue) {
			let { val, targetType } = params;
			let v = val;
			if (typeof val == "string") [(v = JSON.parse(val))];
			if (v.length == 0) return "";
			return `'${v.join(",")}'`;
		}

		public selectMulti(params: TConvertValue) {
			let { val } = params;
			let v = val;
			if (typeof val == "string") [(v = JSON.parse(val))];
			if (v.length == 0) return "";
			return `'${v.join(",")}'`;
		}
	}

	export class AssignedValue {
		public static ins() {
			if (AssignedValue.instance == null) {
				AssignedValue.instance = new AssignedValue();
			}
			return AssignedValue.instance;
		}

		public static instance: null | AssignedValue = null;

		public static execute(method: string, value: any) {
			let object: AssignedValue = AssignedValue.ins();
			if (Reflect.has(object, method)) {
				return object[<keyof AssignedValue>method].call(object, value);
			}
			return value;
		}

		public datetime(value: any) {
			let val = value;

			let date = new Date(typeof val == "object" ? Date.parse(val) : String(val).length > 4 ? Number(val) : String(val));
			return String(date) != "Invalid Date"
				? String(date.getFullYear()).substring(0, 4) + "-" + (Number(date.getMonth()) + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
				: "";
		}

		public number(value: any) {
			let val = value;

			if (val == "" || !val) {
				return undefined;
			}
			return val;
		}
	}
}
