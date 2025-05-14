/*
 * @Author: your name
 * @Date: 2021-04-21 11:44:30
 * @LastEditTime: 2021-12-03 10:54:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-zero-ui/src/components/formDesign/utils/create.js
 */
import mixinLang from "../core/lang";
import { getComputed } from "@/components/rfield/core/WidgetField.ts";

export const baseProps = {
	data: {
		type: Object,
		default: () => ({}),
	},
	placeholder: {
		type: String,
		default: "",
	},
	configList: {
		type: Array,
		default: () => [],
	},
	ext: {
		type: Object,
		default: () => ({}),
	},
	parentType: {
		type: String,
		default: "",
	},
	parentObj: {
		type: Object,
		default: () => ({}),
	},
	oldOptions: {
		type: Object,
		default: () => ({}),
	},
};

export const baseMixins = [mixinLang];

export const baseComputed = {
	num: {
		get() {
			if (!this.data.defVal) return undefined;
			return this.data.defVal;
		},
		set(v) {
			let num = Number(v).toFixed(this.precision);
			let { maxInfinity, minInfinity } = this.data.numRange;
			if (Number(num) >= Number(maxInfinity)) num = maxInfinity;
			if (Number(num) <= Number(minInfinity)) num = minInfinity;

			this.data.defVal = Number(num);
		},
	},
	...getComputed,
};

export const baseWatch = {
	"data.numRange": {
		handler(n, o) {
			// if (this.data.hasOwnProperty("numRange")) {
			// 	this.num < this.data.numRange.min && (this.num = this.data.numRange.min);
			// 	this.num > this.data.numRange.max && (this.num = this.data.numRange.max);
			// }
		},
		deep: true,
		immediate: true,
	},
};

export const create = (comp) => {
	comp.props = Object.assign(comp.props || {}, baseProps);
	comp.computed = Object.assign(comp.computed || {}, baseComputed);
	comp.watch = Object.assign(comp.watch || {}, baseWatch);
	comp.mixins = (comp.mixins || []).concat(baseMixins);
	return comp;
};
