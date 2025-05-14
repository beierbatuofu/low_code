<!--
 * @Author: ben
 * @LastEditTime: 2022-06-10 13:40:23
-->
<template>
	<div style="padding: 0 15px 10px" class="rvue-form">
		<el-form ref="form" @submit.native.prevent :model="form" :key="key" :rules="formRules">
			<el-row :gutter="10" style="display: flex; flex-wrap: wrap; align-content: flex-start; margin-bottom: 50px">
				<template v-for="(config, cindex) in configList">
					<el-col
						v-bind="{ fieldId: config.fieldId }"
						v-if="config.visible"
						:key="cindex"
						:span="setWidth(config) - 1"
						:md="setWidth(config)"
						style="position: relative; vertical-align: top"
						:style="{
							float: config.width != '100%' ? 'none' : 'left',
							display: config.width != '100%' ? 'inline-block' : 'block',
							width: bMobile ? '100%' : config.width,
						}"
					>
						<!-- key会重复渲染 先注释 <el-form-item :prop="config.fieldId" :error="customError[config.fieldId]" :key="customError[config.fieldId]"> -->
						<el-form-item :prop="config.fieldId" :error="customError[config.fieldId]">
							<div v-if="config.titleShow" class="form-item" :class="{ 'form-required': config.required }" style="font-size: 14px; color: #606266">
								{{ config | getLang }}
							</div>

							<div class="widget-config-desc" v-html="config.desc" />

							<form-temp
								:formType="formType"
								:config="config"
								:ref="config.fieldId"
								:fieldId="config.fieldId"
								v-bind="{ fieldId: config.fieldId }"
								@change="handlerSetForm"
								@validB="handleValide"
								@delfile="handleDelfile"
								:mode="mode"
								:form="form"
								:rules="formRules"
								:allReadonly="allReadonly"
								:key="config.fieldId"
								:timestamp="timestamp"
								:closeForm="closeForm"
								:customError="customError"
							>
							</form-temp>
						</el-form-item>
					</el-col>
				</template>

				<form-menu v-if="mode == 'normal' && !bMenu">
					<template slot-scope="scope" slot="menuForm">
						<slot name="menuForm" v-bind="scope"></slot>
					</template>
				</form-menu>
				<slot v-else name="menu" />
			</el-row>
		</el-form>
		<js-code :option="{ ...option, form }" source="form" v-if="Object.keys(option).length" ref="jscode"></js-code>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop, Watch, Provide, PropSync } from "vue-property-decorator";
	import formTemp from "../../components/formTemp.vue";
	import formMenu from "./menu";
	import RuleConfig from "./RuleConfig.ts";
	import RelationCore from "./core/relationCore";
	import { VNode } from "vue";
	import { RCall } from "@/utils/RCall";
	import Jscode from "@/components/jscode/jscode";
	import { setTimeout, clearTimeout } from "timers";

	@Component({
		components: {
			formTemp,
			formMenu,
			"js-code": Jscode,
		},
	})
	export default class RvueForm extends Vue {
		@Prop({ type: Object, default: () => ({}) }) option!: any;
		@Prop({ type: Boolean, default: true }) reset!: boolean;
		@Prop({ type: Object, default: () => ({}) }) value!: any;
		@Prop({ type: String, default: "normal" }) mode!: string;
		@Prop({ type: Object, default: () => ({}) }) form!: any;
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;
		@Prop({ type: Array, default: () => [] }) dStructure!: Record<string, any>[];
		@Prop({ type: String, default: "normal" }) formType!: string;
		@Provide() formSafe = this;

		private self = this;
		private customError: TJson = {};
		private labelWidth = 90;
		private allReadonly = true;
		private tableOption = {};
		private bMobile: boolean = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
			navigator.userAgent
		);
		private rules = {};
		private key = 1;
		private oldForm: TJson = {};
		private timeout: any = null;
		private delfiles: Record<string, string>[] = [];

		private setError(fieldId: string) {
			if (this.customError.hasOwnProperty("fieldId")) return this.customError[fieldId];
			return "";
		}

		@Watch("formRules", { deep: true })
		onChangeFormRules(n: any) {
			this.clearValidate();
		}

		@Watch("form", { deep: true })
		onChangeForm(n: any) {
			this.$emit("update", this.form);
		}

		private handleDelfile(file: Record<string, string>) {
			this.delfiles.push(file);
		}

		private setTableError(tableField: string, index: number, key: string) {
			this.$set(this.form[tableField]["data"][index], "a", 1);

			(<any>this.$refs)[tableField][0].$refs.temp.$refs.tableEdit.setErrorCode();
			delete this.form[tableField]["data"][index]["a"];
		}
		private handlerSetForm(value: any, fieldId: string, type: string = "") {
			if (!fieldId) return;
			this.$set(this.form, fieldId, value);
			this.$emit("change", {
				fieldId,
				value,
			});

			value && (<Partial<Record<string, any>>>this.$refs.form)?.clearValidate(fieldId);
		}

		private get bMenu() {
			try {
				return Boolean((<any>this).$slots.menu.length);
			} catch (err) {
				return true;
			}
		}

		private setWidth(column: TJson) {
			return column.width ? (column.width.replace("%", "") / 100) * 24 : 24;
		}

		private get configList() {
			return this.option.column || this.option.configList || [];
		}

		private get formRules() {
			let result: TJson = {};

			this.configList.forEach((ele: TJson) => {
				if (ele.visible && ele.edit && ele.type != "table") {
					let ruleConfig = new RuleConfig();

					ruleConfig.rules = ele;

					ruleConfig.rules.length && (result[ele.fieldId] = ruleConfig.rules);
				}
			});

			return result;
		}

		private setFormDefaultValue() {
			let list = RelationCore.ins().flatConfigList(this.option.column || this.option.configList || []);

			list.forEach((item: TJson) => {
				let fieldId = item.prop || item.fieldId;
				let bool = fieldId && item.visible;
				//过滤不需要提交的字段
				let filters = ["separator", "tab"];

				if (bool && !filters.includes(item.type)) {
					let defVal = this.form[fieldId] ?? item.defVal;
					if (defVal == "undefined") defVal = undefined;
					//TODO 全局类型转换
					if (!item.pid) {
						this.$set(this.form, fieldId, defVal);

						this.$set(this.customError, fieldId, "");
					}
				}
			});

			this.oldForm = this.$utils.deepClone(this.form);
			console.log(this.form);
		}

		private clearValidate(list = []) {
			this.$nextTick(() => {
				(<any>this.$refs.form).clearValidate(list);
			});
		}

		private validateCellForm() {
			return new Promise((resolve) => {
				(<any>this.$refs.form).validate((valid: boolean, msg: TJson) => {
					resolve(msg);
				});
			});
		}

		private validateNotSame(fieldIds: string[], cb: () => void) {
			(<any>this.$refs.form).validate(fieldIds, cb);
		}

		private validate(callback: (v: boolean, m?: TJson) => void) {
			(<any>this.$refs.form).validate((valid: boolean, msg: TJson) => {
				callback(valid);
			});
		}

		private resetForm() {
			this.clearValidate();
			for (let k in this.form) {
				this.form[k] = this.oldForm[k];
			}
			if (this.reset) {
				this.key++;
				this.setFormDefaultValue();
			}
			this.delfiles = [];
			this.$emit("input", this.form);
			this.$emit("reset-change");
		}

		public setAllReadonly() {
			this.allReadonly = true;
		}

		public resetAllReadonly() {
			this.allReadonly = false;
		}

		private deleteFile(file: any) {
			//执行删除
			let url: string = `/codeZero/oss/remove/${this.$route.params.formCode}/${file.objectName}`;
			RCall.newIns()
				.request({ url: url, method: "post" })
				.then((resp) => {
					//console.log(resp);
				});
		}

		private removeUndefined(data: any) {
			let type = Object.prototype.toString.call(data).slice(8, -1).toLocaleLowerCase();

			let formData: any;

			if (type === "array") {
				formData = [];
				for (var i = 0, len = data.length; i < len; i++) {
					formData.push(this.removeUndefined(data[i]));
				}
			} else if (type === "object") {
				formData = {};
				for (var key in data) {
					formData[key] = this.removeUndefined(data[key]);
				}
			} else {
				if (data == "undefined" || data == "null") return "";
				return data ?? "";
			}

			return formData;
		}

		private submit() {
			let bSubmit = true;
			let form: TJson = {};
			let idx = 0;
			let errIdx = -1;
			let isMobile = this.$utils.bMobile;

			let formItems: Element[] | undefined = (<Record<string, any>>this.$refs.form).$el?.querySelector(".el-row").querySelectorAll(".el-col");

			for (let key in this.form) {
				(<any>this).$refs.form.validateField(key, (errorMessage: string) => {
					bSubmit && (bSubmit = !errorMessage);

					if (errIdx == -1 && errorMessage && formItems) {
						errIdx = idx;
						let errItem: Record<string, any> | undefined = Array.from(formItems).find((item: Record<string, any>) => item && item.getAttribute("fieldId") == key);

						if (!errItem) return;
						isMobile ? window.scrollTo(0, errItem.offsetTop) : (<Vue & Record<string, any>>this.$refs).form.$parent.$el.parentNode.scrollTo(0, errItem.offsetTop);
					}
				});
				idx++;
			}

			try {
				(<any>this).$refs.form.validate((valid: any) => {
					bSubmit = valid;
				});
			} catch (error) {
				console.log(error);
			}

			//删除文件
			if (bSubmit) {
				this.delfiles.forEach((file: Record<string, string>) => {
					this.deleteFile(file);
				});
			}

			let noUndefForm = this.removeUndefined(this.$utils.deepClone(this.form));

			if (this.formType !== "add") {
				// 过滤sn
				let { sn, ...newForm } = noUndefForm;
				noUndefForm = newForm;
			}

			this.$emit("submit", {
				valid: bSubmit,
				form: noUndefForm,
			});

			return Promise.resolve({
				valid: bSubmit,
				form: noUndefForm,
			});
		}
		private regiserFieldEvent(events: any[]) {
			let refs: TJson = (<any>this).$refs;

			const findFields = (aList: any[]) => {
				aList.forEach((item: any) => {
					if (item.children && item.children.length) {
						return findFields(item.children);
					}
					let { fieldId } = item;
					if (/[\d_]+/g.test(fieldId)) {
						events.forEach((event: (param: TJson) => any) => {
							event(item);
						});
					}
				});
			};

			this.option.configList && findFields(this.option.configList);
		}

		private relationEvent(config: TJson): any {
			let trigger = "update";
			if (!(<any>this).$refs[config.fieldId] || !(<any>this).$refs[config.fieldId][0]) return;
			let timer: any = null;
			(<any>this).$refs[config.fieldId][0].$on("update", () => {
				RelationCore.def.evtData = {
					parentFieldId: undefined,
					rowIdx: -1,
				};
				console.log("update 1");
				RelationCore.ins().onEvent(config.fieldId);
			});
		}

		//手动校验
		private handleValide(prop: string) {
			(<any>this).$refs.form?.validateField(prop);
		}

		public load() {
			this.rules = (<any>this).$utils.deepClone(this.formRules);

			this.$nextTick(() => {
				this.tableOption = this.option;

				//this.setFormDefaultValue();
			});
		}

		protected created() {
			RuleConfig.vm = this;
			this.load();
		}

		protected mounted() {}

		@Watch("option", { immediate: true, deep: true })
		private watchOption() {
			this.setFormDefaultValue();
		}
		@Watch("allReadonly", { immediate: true })
		private watchAllReadonly() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				!this.allReadonly && RelationCore.ins().init(this, this.formType == "add");
				!this.allReadonly && this.regiserFieldEvent([(<any>this).relationEvent]);
			});
		}
	}
</script>
<style lang="scss">
	.rvue-form {
		.el-form-item__label {
			padding: 0 !important;
			float: none;
		}
		.form-required {
			&::before {
				content: "*";
				color: #f56c6c;
				margin-right: 4px;
			}
		}
	}
</style>
