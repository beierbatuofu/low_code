import { RelationDefine, Base } from "./relationDef";

class TypeConversion {
	public static ins() {
		return new TypeConversion();
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

class Assigned {
	public static ins() {
		if (Assigned.instance == null) {
			Assigned.instance = new Assigned();
		}
		return Assigned.instance;
	}

	public static instance: null | Assigned = null;

	public static execute(method: string, value: any) {
		let object: Assigned = Assigned.ins();
		if (Reflect.has(object, method)) {
			return object[<keyof Assigned>method].call(object, value);
		}
		return value;
	}

	public datetime(value: any) {
		let val = value;

		let date = new Date(typeof val == "object" ? Date.parse(val) : String(val).length > 4 ? Number(val) : String(val));
		return String(date) != "Invalid Date" ? this.convertDate(date) : "";
	}

	public number(value: any) {
		let val = value;

		if (val == "" || !val) {
			return undefined;
		}
		return val;
	}

	private convertDate(date: any) {
		if (!Reflect.has(date, "getDay")) return date;
		return (
			String(date.getFullYear()).substring(0, 4) +
			"-" +
			String(Number(date.getMonth()) + 1).padStart(2, "0") +
			"-" +
			String(date.getDate()).padStart(2, "0") +
			" " +
			String(date.getHours()).padStart(2, "0") +
			":" +
			String(date.getMinutes()).padStart(2, "0") +
			":" +
			String(date.getSeconds()).padStart(2, "0")
		);
	}

	public input(value: any) {
		if (typeof value == "object") {
			if (Reflect.has(value, "getDay")) {
				return this.convertDate(value);
			}
		}
		return String(value);
	}
}

export default class Formula extends Base {
	public static instance: Formula | null = null;
	public static ins() {
		if (Formula.instance == null) {
			Formula.instance = new Formula();
		}
		return Formula.instance;
	}

	public async execute(watcher: TFieldWatch) {
		this.w = watcher;

		if ((this.relation = this.w.rely.relation)) {
			await this.update();
		}
	}

	private valueConversion(watcherMethod: keyof TypeConversion, filterMethods: keyof TypeConversion, filterValue: any) {
		return TypeConversion.ins()[watcherMethod]({
			val: filterValue,
			targetType: filterMethods,
		});
	}

	private isTableLen(tabldId: string) {
		return tabldId && this.w.form[tabldId].data.length > 0;
	}

	private update() {
		let watch: TFieldWatch = this.w;
		let sFormula = this.relation.replace(/\$field_([0-9a-zA-Z_]+)\$/g, ($0: any, $1: string): any => {
			let filterWatch = watch.filter[$1];
			if (!filterWatch) return "";
			let val = filterWatch.value;

			//子字段赋给一级字段
			if (filterWatch.tableId && !this.w.tableId) {
				let _v = filterWatch.type == "number" ? 0 : "";
				this.w.form[filterWatch.tableId].data.forEach((_tform: Record<string, any>, idx: number) => {
					_v += this.valueConversion(filterWatch.type as keyof TypeConversion, this.w.type as keyof TypeConversion, _tform[filterWatch.fieldId] || "");
				});
				val = _v;
			}

			return this.valueConversion(watch.filter[$1].type as keyof TypeConversion, watch.type as keyof TypeConversion, val);
		});

		let result = RelationDefine.parser.parse(sFormula).result;

		if (result !== null) {
			this.w.value = Assigned.execute(this.w.type, result);
			let { rowIdx, parentFieldId } = this.w.parent.getTab();
			if (this.isTableLen(this.w.tableId) && rowIdx == -1) {
				this.w.form[this.w.tableId].data.forEach((tableForm: Record<string, any>, idx: number) => {
					return (tableForm[this.w.fieldId] = this.w.value);
				});
			}
		}
		return Promise.resolve();
	}
}
