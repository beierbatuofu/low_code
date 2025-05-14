/*
 * @Author: ben
 * @LastEditTime: 2022-06-27 18:07:24
 */
import { Vue, Component, Model, Prop, Watch, Emit } from "vue-property-decorator";
import GlobalConf from "./GlobalConf";
import RLog1 from "../../../utils/RLog";
import { bMobile } from "@/utils/global";

export const getComputed = {
	precision() {
		let config = (<any>this).config || (<any>this).data;
		if (config.hasOwnProperty("numFormat")) {
			let precision = config.numFormat.decimalDigitsNum;
			config.numRange.min && (config.numRange.min = Number(config.numRange.min).toFixed(precision));
			config.numRange.max && (config.numRange.max = Number(config.numRange.max).toFixed(precision));

			return precision;
		}

		return 0;
	},

	min: {
		get() {
			let config = (<any>this).config || (<any>this).data;

			if (config.numRange?.enable && config.numRange.min !== "undefined") {
				return isNaN(Number(config.numRange.min)) ? undefined : Number(config.numRange.min);
			}

			return undefined;
		},
		set(v: any) {
			let numRange = (<any>this).data.numRange;
			let num = !v ? v : v.toFixed((<any>this).precision);

			numRange.min = num;
			(<any>this).$set((<any>this).data, "numRange", numRange);
		},
	},

	max: {
		get() {
			let config = (<any>this).config || (<any>this).data;
			if (config.numRange?.enable && config.numRange.max !== "undefined") {
				return isNaN(Number(config.numRange.max)) ? undefined : Number(config.numRange.max);
			}
			return undefined;
		},
		set(v: any) {
			let numRange = (<any>this).data.numRange;
			let num = !v ? v : v.toFixed((<any>this).precision);
			numRange.max = num;
			(<any>this).$set((<any>this).data, "numRange", numRange);
		},
	},
	maxlength: {
		get() {
			let config = (<any>this).config || (<any>this).data;

			if (config.hasOwnProperty("textRange") && config.textRange.enable && config.textRange.max !== "undefined") {
				return config.textRange.max;
			}
			return undefined;
		},
		set(v: any) {
			let textRange = (<any>this).data.textRange;

			textRange.max = v;
			(<any>this).$set((<any>this).data, "textRange", textRange);
		},
	},
	minlength: {
		get() {
			let config = (<any>this).config || (<any>this).data;

			if (config.textRange.enable && config.textRange.min !== "undefined") {
				return config.textRange.min;
			}
			return undefined;
		},
		set(v: any) {
			let textRange = (<any>this).data.textRange;
			textRange.min = v;
			(<any>this).$set((<any>this).data, "textRange", textRange);
		},
	},
};

@Component({
	computed: {
		...getComputed,
		getRelationType: {
			get() {
				try {
					return (<any>this).config.rely.type;
				} catch (err) {
					return "custom";
				}
			},
		},
	},
})
export default class WidgetField extends Vue {
	@Prop({ type: Object, default: () => ({}) }) config!: TJson;
	//是否需要属性关联
	@Prop({ type: Boolean, default: false }) notSync!: boolean;

	// mode:表单模式
	// design: 设计器
	// preview: 预览
	// normal: 正常
	// edit 编辑
	@Prop({ type: String, default: "design" }) mode!: string;
	// @Prop({ type: Boolean, default: false }) isInTable!: boolean; //子表格内部的样式和普通样式不同
	@Model("input", { type: [String, Object, Number] }) text!: any;
	@Prop({ type: Object, default: () => ({}) }) form!: TJson;
	@Prop({ type: String, default: "" }) tableProp!: string;
	@Prop({ type: Number, default: 0 }) columnIndex!: number;
	//组件CompMode readonly edit query => string
	// @Prop({ type: String, default: "" }) prop!: string;
	@Prop({ type: Boolean, default: false }) allReadonly!: boolean;
	@Prop({ type: Boolean, default: false }) isTableDetail!: boolean; //是否是表格展开
	//组件样式默认default，组件样式详见各自组件
	@Prop({ type: String, default: "default" }) fieldStyle!: string;
	@Prop({ type: String, default: "left" }) align!: string;
	@Prop({ type: Object, default: () => ({}) }) widgetForm!: Record<string, any>;
	@Prop({ type: String, default: "normal" }) formType!: string;
	@Prop({ type: Object }) ext!: TJson;

	public GConf = GlobalConf;
	public RLog = RLog1;

	private getValueCount: number = 0; //记录表格组件编辑次数
	private firstValue: any; //记录表格组件第一次数值

	public get fieldId() {
		return this.config.fieldId;
	}

	public get sPlatform() {
		if (bMobile) return "mobile";
		return "pc";
	}

	public get value() {
		let { fieldId, type } = this.config;

		if (this.tableProp) {
			//表格回显
			this.getValueCount++;
			if (this.getValueCount === 1) {
				this.firstValue = this.form[this.tableProp]["data"][this.columnIndex][this.fieldId];
			}
			try {
				return this.form[this.tableProp]["data"][this.columnIndex][this.fieldId];
			} catch (error) {}
		} else {
			return this.form[fieldId];
		}
	}

	public set value(n: any) {
		let { fieldId } = this.config;

		if (this.tableProp) {
			this.$set(this.form[this.tableProp]["data"][this.columnIndex], this.fieldId, n);
		} else {
			this.$set(this.form, fieldId, n);
		}

		//	this.$emit("update", null, n, fieldId);
	}
	@Watch("columnIndex", { immediate: true })
	change(n: any, o: any) {}

	//初始化给form添加prop
	@Watch("config.defVal", { deep: true, immediate: true })
	onChangeValue(n: any) {
		let { fieldId } = this.config;
		if (this.config.type == "tab") return;
		//临时--因为没默认值--返回数据的时候不能进--新增
		if (this.config.type == "table" && !this.form[fieldId]) {
			this.$set(this.form, this.fieldId, {
				data: [],
				type: "sub",
			});
		}

		if (!Object.keys(this.form).includes(this.fieldId) || this.mode == "design") {
			let defaultValue = this.config.defVal;
			if (this.config.type == "table") {
				defaultValue = {
					data: [],
					tyep: "sub",
				};
			}
			this.config.type != "separator" && !this.tableProp && this.fieldId.length && this.$set(this.form, this.fieldId, defaultValue);

			//表格内部字段初始化添加默认值
			if (this.fieldId.length && this.tableProp) {
				if (!this.form[this.tableProp]) {
					this.$set(this.form, this.tableProp, {
						data: [{}],
						tyep: "sub",
					});
				}
				if (!this.form[this.tableProp]["data"][this.columnIndex][this.fieldId] || this.mode == "design") {
					this.$set(this.form[this.tableProp]["data"][this.columnIndex], this.fieldId, defaultValue);
				}
			}
		}
	}

	// public bindEvent(self: any, method: string, event: Event) {
	// 	// console.log("eee", method);
	// 	//表格修改状态为update --只有编辑状态 而且初始不是C的时候

	// 	if (this.form[this.tableProp] && this.form[this.tableProp]["data"][this.columnIndex]["status"] != "C" && this.tableProp) {
	// 		if (this.config.type === "number" && Number(this.firstValue) !== this.value) {
	// 			this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
	// 			//return;
	// 		}
	// 		if (this.config.type !== "number" && this.firstValue !== this.value && this.config.type !== "uploadFile") {
	// 			this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
	// 			//return;
	// 		}
	// 		this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
	// 	}

	// 	let type = Object.prototype.toString.call(self[method]).slice(8, -1).toLocaleLowerCase();
	// 	type == "function" && self[method].call(self, { value: self.value, column: self.column });

	// 	(<any>this).$emit && (<any>this).$emit(method, self.value, event, this.fieldId);
	// }

	// public handleFocus(event: Event) {
	// 	this.bindEvent(this, "focus", event);
	// }

	// public handleBlur(event: Event) {
	// 	this.bindEvent(this, "blur", event);
	// }

	// public handleInput(event: Event) {
	// 	this.bindEvent(this, "input", event);
	// }

	// public handleChange(event: any) {
	// 	this.bindEvent(this, "update", event);
	// 	this.bindEvent(this, "change", event);
	// }

	private tableEvent() {
		if (this.form[this.tableProp] && this.form[this.tableProp]["data"][this.columnIndex]["status"] != "C" && this.tableProp) {
			if (this.config.type === "number" && Number(this.firstValue) !== this.value) {
				this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
				//return;
			}
			if (this.config.type !== "number" && this.firstValue !== this.value && this.config.type !== "uploadFile") {
				this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
				//return;
			}
			this.$set(this.form[this.tableProp]["data"][this.columnIndex], "status", "U");
		}
	}

	public get maxInputLength() {
		return (<any>this).maxlength || this.config?.textRange?.maxInfinity;
	}
	//标题
	public get title() {
		return this.GConf.tc(this.config.title);
	}

	//是否可见
	public get visible() {
		return this.config.visible;
	}

	//是否可编辑
	public get disabled() {
		if (this.mode == "attr") return false;

		return !this.config.edit;
	}

	//是否只读
	public get readonly() {
		if (this.config.type == "table") {
		}
		return this.config.readyonly || this.allReadonly;
	}
	protected getDefineConf!: () => any;
	//field数据更新
	@Emit("update")
	public handleUpdate(value: any) {
		this.tableEvent();
	}

	@Emit("input")
	public handleInput(value: any) {
		this.tableEvent();
	}

	@Emit("blur")
	public handleBlur(value: any) {
		this.tableEvent();
	}
	@Emit("change")
	public handleChange(value: any) {
		this.tableEvent();
	}
}
