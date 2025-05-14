<script lang="tsx">
	import { Component, Watch, Vue, Prop, Inject } from "vue-property-decorator";
	import RelationSelect from "@src/components/formDesign/components/relationSelect.vue";
	import RfieldCore from "@/components/rfield/core/RfieldCore";

	enum EMethodsType {
		"form" = "methods",
		"echarts" = "chartMethods",
	}

	@Component({
		components: {
			RelationSelect,
		},
	})
	export default class Row extends Vue {
		@Prop({ type: Array, default: () => [] }) options!: Record<string, any>[];
		@Prop({ type: Array, default: () => [] }) currentList!: any;
		@Prop({ type: Object, default: () => ({}) }) row!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) group!: Record<string, any>[];

		@Inject("conf") readonly conf!: Record<string, any>;

		private get dataType() {
			if (this.row.type == "datetime" || this.row.type == "number") {
				if (this.row.method == "between") {
					this.row.dataType = 0;
					return [
						{
							label: "custom",
							value: 0,
						},
					];
				}
			}

			return [
				{
					label: "custom",
					value: 0,
				},
				{
					label: "CurrentFormField",
					value: 1,
				},
			];
		}

		private get defConf() {
			// console.log(this.row);
			return RfieldCore.ins().fieldConsMap[this.row.type].fieldDef;
		}

		private get methodOptions() {
			let map: Record<keyof typeof EMethodsType, string> = {
				form: "methods",
				echarts: "chartMethods",
			};

			return this.defConf[map[this.conf.methodsType as keyof typeof EMethodsType]];
		}

		private handleChangeFieldId(fieldId: string) {
			let conf: Record<string, any> = this.options.find((item: Record<string, any>) => item.fieldId == fieldId) || { type: "" };
			this.row.parentSubFormTargetFieldCode = "";
			this.row.dataType = 0;
			this.row.targetFieldCode = fieldId;
			this.row.type = conf.type;
			this.row.judgeValues = [];
			this.row.method = "";
			conf.hasOwnProperty("parent") && (this.row.parentSubFormTargetFieldCode = conf.parent.fieldId);
		}

		private handleChangeMethods(value: string) {
			this.row.method = value;
			this.row.dataType = 0;

			if (this.row.type == "number") {
				this.row.judgeValues = [undefined];
				if (value == "between") {
					this.row.judgeValues = [{ 0: "undefined", 1: "undefined" }];
				}
			} else {
				this.row.judgeValues = [];
			}
		}

		private handleChangeJudge(value: any) {
			this.row.judgeValues = [value];
		}

		private handleChangeDataType(value: number | string) {
			this.row.dataType = value;
			if (this.row.type == "number") {
				this.row.judgeValues = [undefined];
				if (value == "between") {
					this.row.judgeValues = [{ 0: "undefined", 1: "undefined" }];
				}
			} else {
				this.row.judgeValues = [];
			}
		}

		private handleUpdate(v: any) {
			this.row.judgeValues = Array.isArray(v) ? v : [v];
		}

		private get form() {
			if (!this.row.targetFieldCode) return {};

			let queryField: Record<string, any> = RfieldCore.ins().createField({ type: this.row.type }, "query");
			let defVal = queryField.config.defVal;

			let value = Array.isArray(defVal) ? this.row.judgeValues : this.row.judgeValues[0];
			if (queryField) {
				if (this.row.method !== "between" && this.row.type == "number") {
					defVal = this.row.judgeValues[0] ? this.row.judgeValues[0] : undefined;
				}
				if (!String(this.row.judgeValues[0]) || String(this.row.judgeValues[0]).length == 0 || Object.keys(String(this.row.judgeValues[0])).length == 0) {
					value = defVal;
				}
			}

			return { [this.row.targetFieldCode]: value };
		}
		private val = "";

		private get comp() {
			let conf: Record<string, any> | undefined = this.options.find((item: Record<string, any>) => item.fieldId == this.row.targetFieldCode);
			if (["not_empty", "empty"].includes(this.row.method)) return <div></div>;

			if (conf) {
				let fieldConf: Record<string, any> = RfieldCore.ins().createField(conf);
				let tag = `rfield-${this.row.type}`;
				let config = {
					...fieldConf.config,
					formDesignConf: fieldConf.config,
				};

				return (
					<tag
						props={{
							form: this.form,
							config,
							mode: "query",
							selectMode: true,
							ruleMethod: this.row.method,
						}}
						on={{
							input: this.handleUpdate,
							change: this.handleUpdate,
							update: this.handleUpdate,
						}}
					></tag>
				);
			}
			return (
				<rvue-input
					props={{ value: this.val }}
					on={{
						change: (v: string) => {
							this.val = v;
						},
					}}
				></rvue-input>
			);
		}

		protected render() {
			let lang = localStorage.getItem("lang") || "zh";

			if (this.options.length && this.options.findIndex((item) => item.fieldId == this.row.targetFieldCode) == -1) {
				this.row.targetFieldCode = "";
			}
			//console.log(this.options, "this.options");

			return (
				<div class="row">
					<div class="targetFieldCode">
						<rvue-select
							props={{
								value: this.row.targetFieldCode,
							}}
							on={{
								change: this.handleChangeFieldId,
							}}
						>
							{this.options.map((item: Record<string, any>) => (
								<rvue-option
									key={item.fieldId}
									props={{
										label: item.title[lang],
										value: item.fieldId,
									}}
								></rvue-option>
							))}
						</rvue-select>
					</div>
					<div class="methods">
						<rvue-select
							props={{
								value: this.row.method,
							}}
							on={{
								change: this.handleChangeMethods,
							}}
						>
							{this.methodOptions.map((item: Record<string, any>) => (
								<rvue-option
									key={item.value}
									props={{
										label: this.$t(`formDesign.${item.label}`),
										value: item.value,
									}}
								></rvue-option>
							))}
						</rvue-select>
					</div>
					{this.conf.isDataTypeComp && (
						<div class="dataType">
							{this.row.method.indexOf("empty") != -1 ? (
								<div></div>
							) : (
								<rvue-select
									props={{
										value: this.row.dataType,
									}}
									on={{
										change: this.handleChangeDataType,
									}}
								>
									{this.dataType.map((item: any) => (
										<rvue-option
											key={item.value}
											props={{
												label: this.$t(`formDesign.${item.label}`),
												value: item.value,
											}}
										></rvue-option>
									))}
								</rvue-select>
							)}
						</div>
					)}

					<div class="component">
						{this.row.method.indexOf("empty") != -1 ? (
							<div></div>
						) : this.row.dataType == 1 ? (
							<RelationSelect
								key={this.row.judgeValues + ""}
								placeholder={this.$t("linkDataDialog.currentField")}
								props={{
									val: this.row.judgeValues,
									options: this.currentList,
									filterData: this.row,
								}}
								on={{
									change: this.handleChangeJudge,
								}}
							></RelationSelect>
						) : (
							this.comp
						)}
					</div>
					<div
						class="el-icon-delete"
						on={{
							click: () => this.$emit("del"),
						}}
					></div>
				</div>
			);
		}
	}
</script>
<style lang="scss" scoped>
	// .row {
	// 	display: flex;
	// 	align-items: center;
	// 	position: relative;
	// 	justify-content: space-between;
	// 	margin-bottom: 10px;
	// }
	.row {
		position: relative;
		display: flex;
		margin-bottom: 10px;
		> div {
			margin-right: 8px;
		}
		div:last-child {
			margin-right: 0px;
			line-height: 36px;
			color: #409eff;
		}
	}
	.targetFieldCode {
		flex: 1;
	}
	.methods {
		flex: 1;
	}
	.dataType {
		width: 150px;
	}

	.component {
		width: 300px;
	}
	::v-deep {
		.el-icon-date {
			display: none;
		}
		.el-select {
			display: block !important;
		}
		.el-input__inner {
			height: 36px !important;
			line-height: 36x !important;
		}
		.el-input-number {
			height: 36px !important;
			line-height: 36px !important;
		}
		.rvue-form-group {
			height: 36px !important;
		}
		.el-textarea__inner {
			height: 36px !important;
			line-height: 36x !important;
		}
	}
</style>
