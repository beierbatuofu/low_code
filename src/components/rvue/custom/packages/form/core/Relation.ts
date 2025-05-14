import { Base } from "./relationDef";
import { RCall } from "@/utils/RCall";
export default class Relation extends Base {
	public static ins() {
		return new Relation();
	}
	private vm: Vue = Object.create({});

	private getFormVals() {
		let result: Record<string, any> = {};
		let form = this.w.form;
		let { rowIdx } = this.w.parent.getTab();
		let tableId = this.w.tableId;
		rowIdx < 0 && (rowIdx = 0);
		let tableForm = tableId ? form[tableId].data[rowIdx] : {};

		for (let key in this.w.filter) {
			if (form.hasOwnProperty(key)) {
				form[key] != undefined && (result[key] = form[key]);
			} else if (tableForm.hasOwnProperty(key)) {
				tableForm[key] != undefined && (result[key] = tableForm[key]);
			}
		}

		return result;
	}

	public async execute(watcher: TFieldWatch) {
		this.w = watcher;
		if ((this.relation = this.w.rely.relation)) {
			this.vm = (this.w.parent.constructor as Record<string, any>).def.comp;
			await this.update();
		}
	}

	private async update() {
		let { appCode, formCode } = this.vm.$route.params;
		let values = this.getFormVals();

		let url = `/codeZero/app/${appCode}/form/${formCode}/relation3`;

		if (!Object.keys(values).length) return;
		let resp = await RCall.newIns()
			.serviceHandle(true)
			.post(url, {
				relationList: [this.relation],
				values,
				checkField: true,
			});

		//赋值 子表格
		if (this.w.type == "table") {
			return this.setTableForm(resp);
		}
		//赋值 子字段
		if (this.w.tableId) {
			return this.setTableField(resp);
		}
		// 赋值一级字段

		try {
			this.w.form[this.w.fieldId] = JSON.parse(resp.data[this.w.fieldId]);
		} catch (err) {
			resp.data && (this.w.form[this.w.fieldId] = resp.data[this.w.fieldId]);
		}
	}

	//赋值子字段
	private setTableField(resp: Record<string, any>) {
		let { data } = resp;
		if (!data) return;
		let value = data[this.w.fieldId];
		let { rowIdx, parentFieldId } = this.w.parent.getTab();
		let tableData = this.w.form[this.w.tableId];
		let formComp = (this.w.parent.constructor as Record<string, any>).def.comp;

		tableData.data.forEach((item: Record<string, any>, idx: number) => {
			/**
			 * 子字段联动子字段，联动字段行号不等于idx return
			 * 一级字段联动子字段，rowIdx == -1 赋值整个子表格中的子字段
			 */
			if (rowIdx !== idx && rowIdx !== -1) {
				return;
			}
			item[this.w.fieldId] = value;
			if (item.status == "D") return;
			item.status = formComp.formType == "add" || !item["id"] ? "C" : "U";
		});
	}

	private getDefForm(configList: Record<string, any>[]) {
		let form: Record<string, any> = {};
		configList.forEach((item: Record<string, any>) => {
			form[item.fieldId] = item.defVal;
		});
		return form;
	}

	//赋值子表格
	private setTableForm(resp: Record<string, any>) {
		let { data } = resp;
		if (!data) return;
		let respTabForm: Record<string, any>[] | null = data[this.w.fieldId];
		let oldTabForm = this.w.oldForm[this.w.fieldId].data;
		let formComp = (this.w.parent.constructor as Record<string, any>).def.comp;

		//旧的form status 设置为D
		let old = oldTabForm.map((ite: Record<string, any>) => ({
			...ite,
			status: "D",
		}));

		// response 子表格没有联动数据 ，子表格子字段设为初始值
		if (!respTabForm) {
			let tableDefForm = this.getDefForm(this.w.tableChildren);
			tableDefForm.status = "C";
			//新建旧form不需要赋值

			return (this.w.form[this.w.fieldId].data = [tableDefForm, ...(formComp.formType == "add" ? [] : old)]);
		}

		// response 和 旧form 合并，状态改为C
		let addForm: Record<string, any>[] = [];
		respTabForm.forEach((rf: Record<string, any>, idx: number) => {
			addForm.push({
				...oldTabForm[idx],
				...rf,
				index_: idx,
				status: "C",
			});
		});
		//新建子表格直接赋值
		if (formComp.formType == "add") return (this.w.form[this.w.fieldId].data = addForm);
		//非新建下 合并旧表和新表 再赋值
		this.w.form[this.w.fieldId].data = [...addForm, ...old];
	}
}
