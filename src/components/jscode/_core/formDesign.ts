import { RCall } from "@/utils/RCall";
import { Utils } from "./utils";
import Base from "./base";

interface TAttrs {
	visible: boolean;
	edit: boolean;
	width: string;
	titleShow: boolean;
	desc: string;
	defVal: string;
}

export default class FormDesign extends Base {
	public static instance: FormDesign | null = null;
	private [Utils.comp]: Vue | null = null;
	public configList: Record<string, any>[] = [];
	public form: Record<string, any> = {};
	public axios = RCall.newIns().request;
	public parent = Object.create(null);

	public static ins() {
		if (!FormDesign.instance) {
			FormDesign.instance = new FormDesign();
		}
		return FormDesign.instance;
	}

	public int(opts: Record<"comp", any>) {
		this[Utils.comp] = opts.comp;
		this.form = opts.comp.option.form;

		//TODO
		let parent = opts.comp;
		while (parent && !parent.hasOwnProperty("addSubmit")) {
			parent = parent.$parent;
		}
		this.parent = parent;

		opts.comp.option?.configList && (this.configList = opts.comp.option.configList);
		return this;
	}

	public submitForm(callback: () => void = () => {}) {
		if (!this.parent) return console.log("addSubmit is undefined");
		return this.parent.addSubmit(1, callback);
	}

	private findFieldId(form: Record<string, any>, fieldId: string, value: any) {
		//	console.log(fieldId, form, ">>>>>23");
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
	}

	public getValue(fieldId: string) {
		console.log(this.form, "this.form");
		return this.form[fieldId];
	}

	public setValue(fieldId: string, value: any) {
		Utils.setFieldVal(this.form, fieldId, value);
	}

	public setAttr(fieldId: string, attr: keyof TAttrs, value: any) {
		Utils.setFieldAttr(this.configList, fieldId, attr, value);
	}
}
