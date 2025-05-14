<script lang="tsx">
	import { Component, Watch, Vue, Prop, Provide } from "vue-property-decorator";
	import RfieldCore from "@/components/rfield/core/RfieldCore";

	@Component
	export default class Row extends Vue {
		@Prop({ type: Array, default: () => [] }) options!: Record<string, any>[];
		@Prop({ type: Object, default: () => ({}) }) row!: Record<string, any>;
		@Prop({ type: Array, default: () => [] }) group!: Record<string, any>[];

		private typeFilter = ["create_time", "datetime", "update_time"];

		private get defConf() {
			return RfieldCore.ins().fieldConsMap[this.row.type].fieldDef;
		}

		private get methodOptions() {
			// if(this.typeFilter.includes(this.defConf.type)){
			//   return this.defConf.chartMethods;
			// }else{
			//   return this.defConf.methods;
			// }
			return this.defConf.chartMethods;
		}

		private handleChangeFieldId(fieldId: string) {
			let conf: Record<string, any> = this.options.find((item: Record<string, any>) => item.fieldId == fieldId) || { type: "" };

			this.row.targetFieldCode = fieldId;
			this.row.type = conf.type;
			this.row.judgeValues = [];
			this.row.parentSubFormTargetFieldCode = "";
			this.row.method = "";
			conf.hasOwnProperty("parent") && (this.row.parentSubFormTargetFieldCode = conf.parent.fieldId);
			// console.log(this.row);
		}

		private handleChangeMethods(value: string) {
			this.row.method = value;
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
		private getForm(queryConf: Record<string, any>) {
			if (!this.row.targetFieldCode) return {};
			let defVal: any = "";
			let value = "";
			if (queryConf) {
				defVal = queryConf.config.defVal;
				value = Array.isArray(defVal) ? this.row.judgeValues : this.row.judgeValues[0];
				if (this.row.method !== "between" && this.row.type == "number") {
					defVal = this.row.judgeValues[0] ? this.row.judgeValues[0] : undefined;
				}

				if (!String(this.row.judgeValues[0]) || String(this.row.judgeValues[0]).length == 0 || Object.keys(String(this.row.judgeValues[0])).length == 0) {
					value = defVal;
				}

				if (this.typeFilter.includes(this.row.type) && this.row.method == "dynamic") {
					queryConf.config.queryStyle = "select";
					defVal = this.row.judgeValues[0] ? this.row.judgeValues[0] : "";
					value = defVal;
				} else if (this.typeFilter.includes(this.row.type) && this.row.method == "between") {
					queryConf.config.queryStyle = "default";
				} else if (this.typeFilter.includes(this.row.type) && this.row.method !== "between" && this.row.method !== "dynamic") {
					queryConf.config.queryStyle = "default";
					defVal = this.row.judgeValues[0] ? this.row.judgeValues[0] : "";
				}
			}

			return { [this.row.targetFieldCode]: value };
		}
		private val = "";

		private get comp() {
			let formDesignConf: Record<string, any> | undefined = this.options.find((item: Record<string, any>) => item.fieldId == this.row.targetFieldCode);
			if (["not_empty", "empty"].includes(this.row.method)) return <div></div>;
			if (formDesignConf) {
				let queryDesignConf: Record<string, any> = RfieldCore.ins().createField({ type: formDesignConf.type }, "query");
				let form = this.getForm(queryDesignConf);
				console.log(form, 3333);
				//根据method和type确定类型
				let comp: string = `rfield-${this.row.type.replace("_", "-")}`;
				try {
					comp = RfieldCore.ins().fieldConsMap[this.row.type].getQueryCop(this.row.method, RfieldCore.ins().fieldConsMap[this.row.type].fieldDef.ins().queryComp);
				} catch (error) {}
				let tag = comp;
				let dicData = formDesignConf?.dicData;
				//数字要用form
				if (formDesignConf.type == "number") queryDesignConf.config = formDesignConf;
				//附件不显示
				if (formDesignConf.type == "uploadFile") return <div></div>;

				return (
					<tag
						props={{
							config: {
								...formDesignConf,
								...queryDesignConf.config,
								fieldId: formDesignConf.fieldId,
								dicData,
							},
							mode: "query",
							selectMode: true,
							form,
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
					<div class="component">{this.comp}</div>
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
	.row {
		display: flex;
		align-items: center;
		position: relative;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	.component {
		width: 450px;
	}
	::v-deep {
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
			min-height: 36px !important;
		}
		.el-textarea__inner {
			height: 36px !important;
			line-height: 36x !important;
		}
	}
</style>
