<template>
	<div>
		<rvue-label v-if="!canUpdate" :label="$t('chartDesign.dv')" />
		<div class="margint10">
			<div class="flex marginb" style="width: 100%">
				<div class="fieldName" v-if="canUpdate">{{ fieldName }}</div>
				<rvue-input v-else class="name" placeholder="请输入名称" v-model="fieldName"></rvue-input>
				<rvue-select v-model="select" clearable @change="handleChange">
					<rvue-option :label="$t(`formDesign.${item.label}`)" :value="item.value" v-for="(item, index) in methodOptions" :key="index">{{ $t(`formDesign.${item.label}`) }}</rvue-option>
				</rvue-select>
			</div>

			<component
				@input="handleUpdate"
				:form="filterForm"
				@change="handleUpdate"
				@update="handleUpdate"
				:is="getComponent(config.type, config.component)"
				:config="config"
				:selectMode="true"
				mode="query"
				:key="timestamp"
			>
			</component>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import { ChartModule } from "@/store/modules/chart";
	import RfieldCore from "@/components/rfield/core/RfieldCore";
	import { Field, DatasetItem, FieldValue, FilterListItem, Rules, ReportListItem } from "./_type/index";
	import { getFormSingleTest } from "@/api/form";
	import { CList, FList } from "@/components/chartDesign/components/attr/CTfilter/sys";
	const initField: Field = {
		desc: "",
		edit: false,
		rely: {
			type: "input",
			relation: "",
		},
		type: "input",
		title: {
			en: "input",
			zh: "单行文本",
		},
		width: "100%",
		defVal: "",
		fieldId: "fieldId",
		visible: true,
		required: false,
		textRange: {
			max: "undefined",
			min: "undefined",
			enable: false,
		},
		titleShow: false,
		scanQrCode: {
			editable: false,
			allowScan: false,
		},
	};

	@Component({
		components: {},
	})
	export default class DefaultValue extends Vue {
		@Prop({ type: Object, default: () => {} }) data!: Record<string, any>;
		@Prop({ type: Object, default: () => {} }) item!: Record<string, any>;
		@Prop({ type: Object, default: () => {} }) filterForm!: Record<string, any>;
		@Prop({ type: String, default: "" }) id!: string; //筛选器code

		private timestamp = 1;
		//仪表盘页面还是报表设计页面
		private get canUpdate() {
			return this.$route.name == "BiDashboard" || this.$route.name == "canVisitApps";
		}
		private get select() {
			return this.data.config?.selectDefaultMethod;
		}
		private set select(n) {
			this.$set(this.data.config, "selectDefaultMethod", n);
		}
		get filterList() {
			console.log(ChartModule.filterList, "ChartModule.filterList");
			return ChartModule.filterList;
		}
		private get defConf() {
			if (!this.config.type) return;
			return RfieldCore.ins().fieldConsMap[this.config.type].fieldDef;
		}

		//方法option
		private get methodOptions() {
			if (!this.config.type) return;
			let methods = this.defConf.methods.map((item: any) => {
				return item.value;
			});

			if (!methods.includes(this.select) && this.select) {
				this.select = "";
			}
			if (this.config.type == "datetime") {
				methods = [{ label: "between", value: "between" }];
				return methods;
			}

			return this.defConf.methods;
		}

		private getComponent(type: string, component: string) {
			console.log(type, component, "component");
			if (!type) return;
			if (component == "empty") return "";
			if (component) return component;

			return `rfield-${type}`;
		}
		private getConfigList(configList: Field[]) {
			let list: any[] = [];
			configList.forEach((item: Field) => {
				if (!["separator", "tab", "table"].includes(item.type)) {
					list.push(item);
				}
				if (item.type == "table") {
					let { children, ...attr } = item;

					let child =
						children?.map((ite: Field) => ({
							...ite,
							title: {
								zh: item.title.zh + "." + ite.title.zh,
								en: item.title.en + "." + ite.title.en,
							},
							parent: attr,
						})) || [];
					list.push(...child);
				}
			});
			//访问页面添加系统字段
			if (this.canUpdate) {
				list = [...list, ...FList, ...CList];
			}
			return list;
		}

		private get lang() {
			return localStorage.getItem("lang") || "zh";
		}
		//默认组件的配置
		private get config(): Field | DatasetItem {
			//设定一个组件config
			// let config: Field | DatasetItem =
			// 	this.checkedReports &&
			// 	this.checkedReports[0]?.configList &&
			// 	(<any>this).$utils.deepClone(
			// 		this.getConfigList(this.checkedReports[0].configList).find((conf: Field) => {
			// 			return conf.fieldId == this.checkedReports[0].selectField;
			// 		})
			// 	);
			let config: any = {
				fieldId: this.data.config.fieldType,
				type: this.data.config.fieldType,
			};
			if (!config) return initField;
			if (config.type == "text") config.type = "input";

			//根据方法和类型确定自定义组件 this.data.config.selectDefaultMethod

			let queryField: Record<string, any> = RfieldCore.ins().createField({ type: config.type }, "query");

			//数据集类型

			// if ((<DatasetItem>config).oldTitle) {
			// 	let obj = {
			// 		...config,
			// 		type: config.type == "selectMulti" || config.type == "select" ? "input" : config.type,
			// 	};
			// 	if (config.type == "selectMulti" || config.type == "select") {
			// 		config = {
			// 			...(<TJson>RfieldCore.ins().createField({ type: "input" })).config,
			// 			...obj,
			// 		};
			// 	} else if (config.type == "number") {
			// 		config = {
			// 			...(<TJson>RfieldCore.ins().createField({ type: config.type })).config,
			// 			...obj,
			// 		};
			// 		config.defVal = {
			// 			"0": "undefined",
			// 			"1": "undefined",
			// 		};
			// 	} else if (config.type == "datetime" || config.type == "create_time" || config.type == "update_time") {
			// 		config = {
			// 			...(<TJson>RfieldCore.ins().createField({ type: config.type })).config,
			// 			formDesignConf: { dateFormat: "yyyy-MM-dd" },
			// 		};
			// 		if (config.type == "create_time" || config.type == "update_time") {
			// 			config.component = `rfield-datetime`;
			// 		}
			// 		config.defVal = [];
			// 	} else if (config.type == "number") {
			// 		if (this.data.config.selectDefaultMethod != "between") {
			// 			config.defVal = undefined;
			// 		} else {
			// 			config.defVal = { 0: "undefined", 1: "undefined" };
			// 		}
			// 	} else {
			// 		if (config.type == "text") {
			// 			config.type = "input";
			// 		}
			// 		config = { ...(<TJson>RfieldCore.ins().createField({ type: config.type })).config, ...obj };
			// 	}

			// 	return config;
			// }
			// if ((<DatasetItem>config).oldTitle) {
			config = {
				...queryField.config,
				...config,
			};
			// }
			let defVal = queryField?.config?.defVal;

			config.defVal = defVal;

			if ((config.type == "creater" || config.type == "userRadio") && this.data.config.selectDefaultMethod == "contain_one") {
				config.component = `rfield-user`;
			}
			if (config.type == "process_status") {
				config.component = `rfield-status-select`;
			}
			if (config.type == "select" || config.type == "radio") {
				config.component = `rfield-input`;
			}
			if (config.type == "selectMulti" || config.type == "checkbox") {
				config.component = `rfield-select-multi`;
				config.allowCreate = true;
			}

			if (config.type == "deptRadio" && this.data.config.selectDefaultMethod == "contain_one") {
				config.component = `rfield-dept`;
			}
			if (config.type == "create_time" || config.type == "update_time") {
				config.component = `rfield-datetime`;
			}
			if (config.type == "number") {
				if (this.data.config.selectDefaultMethod != "between") {
					config.defVal = undefined;
				} else {
					config.defVal = { 0: "undefined", 1: "undefined" };
				}
			}

			if (config.type == "datetime" || config.component == `rfield-datetime`) {
				config.formDesignConf = { dateFormat: config.dateFormat };
			}

			//回显
			config.defVal = this.data.config.filterForm?.[config.fieldId] ? this.data.config.filterForm[config.fieldId] : config.defVal;
			//不显示
			if (this.data.config.selectDefaultMethod == "empty" || this.data.config.selectDefaultMethod == "not_empty" || config.type == "uploadFile") {
				config.component = "empty";
			}

			return config;
		}
		//字段名称
		private set fieldName(n: string) {
			this.$set(this.data.config, "fieldName", n);
		}
		private get fieldName() {
			return this.data.config.fieldName;
		}
		//获取选中的报表
		private get checkedReports() {
			let list: any = [];

			if (!this.data?.config.reportLists) return [];
			this.data?.config?.reportLists.map((rItem: any) => {
				this.data.config.checkedReports.map((cItem: any) => {
					if (rItem.reportCode == cItem.reportCode) {
						list.push({
							...rItem,
							...cItem,
						});
					}
				});
			});

			return list;
		}
		//触发更新
		private async handleUpdate(val: FieldValue | null) {
			let context = this.filterForm[this.config.type];

			//todo this.config.defVal

			typeof context === "string" && (context = context.trim());

			if (!this.canUpdate) return;
			let newFilterList: FilterListItem[] = this.filterList.map((item: FilterListItem) => {
				//修改匹配规则
				if (
					item.matchRules.find((rule: Rules) => {
						return rule.id == this.id;
					})
				) {
					let matchRules = item.matchRules.map((ruleItem: Rules) => {
						if (ruleItem.id == this.id) {
							let rule: Rules = {
								dataType: 0,
								judgeValues: Array.isArray(context) ? context : String(context) && context != "undefined" ? [context] : [],
								method: this.data.config.selectDefaultMethod,
								targetFieldCode: ruleItem.targetFieldCode,
								type: this.config.type,
								id: this.id,
								sourceCode: ruleItem.sourceCode,
							};

							//赋值父id
							this.checkedReports.map((cItem: any) => {
								if (ruleItem.targetFieldCode == cItem.selectField) {
									if (cItem.parentFieldId) {
										rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
									}
								}
							});
							return rule;
						} else {
							return ruleItem;
						}
					});

					return {
						...item,
						matchRules,
					};
				} else {
					return item;
				}
			});

			//新建匹配规则
			let formCodeList = newFilterList.map((item: FilterListItem) => {
				return item.formCode;
			});

			this.checkedReports.map((item: ReportListItem) => {
				//报表code不存在的情况

				if (!formCodeList.includes(item.reportCode)) {
					let rule: Rules = {
						dataType: 0,
						judgeValues: Array.isArray(context) ? context : [context],
						method: this.data.config.selectDefaultMethod,
						targetFieldCode: item.selectField,
						type: this.config.type,
						id: this.id,
						sourceCode: item.sourceCode,
					};
					//赋值父id
					this.checkedReports.map((cItem: any) => {
						if (item.selectField == cItem.selectField) {
							if (cItem.parentFieldId) {
								rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
							}
						}
					});
					newFilterList.push({
						formCode: item.reportCode,
						matchRules: [rule],
					});
				}
				//同报表添加匹配规则--多个筛选器选同个报表
				newFilterList.map((itemFilter: FilterListItem) => {
					//同一个报表的
					if (itemFilter.formCode == item.reportCode) {
						let filterIdList = itemFilter.matchRules.map((rules: Rules) => {
							return rules.id;
						});
						//matchrules没有筛选器id就添加
						if (!filterIdList.includes(this.id)) {
							let rule: Rules = {
								dataType: 0,
								judgeValues: Array.isArray(context) ? context : [context],
								method: this.data.config.selectDefaultMethod,
								targetFieldCode: item.selectField,
								type: this.config.type,
								id: this.id,
								sourceCode: item.sourceCode,
							};
							//赋值父id
							this.checkedReports.map((cItem: any) => {
								if (item.selectField == cItem.selectField) {
									if (cItem.parentFieldId) {
										rule.parentSubFormTargetFieldCode = cItem.parentFieldId;
									}
								}
							});

							itemFilter.matchRules.push(rule);
						}
					}
				});
			});

			ChartModule.SET_List(newFilterList); // 请求筛选
		}
		//选择方法
		private handleChange() {
			let val: any = null;

			let fieldConf: Record<string, any> = RfieldCore.ins().createField({ type: this.config.type }, "query");
			this.filterForm[this.config.fieldId] = val = fieldConf.config.defVal;
			if (this.config.fieldId == "number") {
				//TODO 暂时解决bug 2009
				val = this.select == "between" ? { 0: "undefined", 1: "undefined" } : "undefined";
				// {0: 'undefined', 1: 'undefined'}
				this.filterForm[this.config.fieldId] = val;
			}

			this.canUpdate && this.handleUpdate(val);
		}
	}
</script>

<style lang="scss" scoped>
	.margint10 {
		margin-top: 10px;
	}
	.marginb {
		margin-bottom: 10px;
	}
	::v-deep {
		.el-select {
			display: block;
			width: 200px;
		}
	}
	::v-deep .name {
		margin-bottom: 10px;
		text-overflow: ellipsis;
		overflow: hidden;
		flex: 1;
		white-space: nowrap;

		margin-right: 3px;
		input {
			height: 36px !important;
		}
	}
	.fieldName {
		text-overflow: ellipsis;
		overflow: hidden;
		padding-right: 5px;
		white-space: nowrap;
		line-height: 36px;
		max-width: 120px;
	}
	.flex {
		display: flex;
	}
	.design-content {
		// display: flex;
		// align-items: center;
		// justify-content: center;
		// height: calc(100vh - 110px);
	}
</style>
