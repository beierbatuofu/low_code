<!--
 * @Author: ben
 * @LastEditTime: 2022-05-18 10:05:51
-->
<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :tip="title.tip" :label="title.label" />

		<rvue-select v-model="selectValue" style="margin-bottom: 10px">
			<rvue-option
				:label="t('formDesign.' + item)"
				:value="item"
				v-for="(item, index) in newOptions"
				:disabled="(data.isInTable && item === 'formula') || (data.isInTable && item === 'relation')"
				:key="index"
			></rvue-option>
		</rvue-select>
		<slot name="custom" v-if="selectValue == 'custom'"></slot>
		<el-button v-if="selectValue === 'relation'" style="width: 100%" @click="handleOpenDialog">{{ t("formDesign.setFilterCriteria") }}</el-button>
		<el-button v-if="selectValue === 'formula'" style="width: 100%" @click="handleOpenDialog">{{ t("formDesign.setFormula") }}</el-button>
		<template v-if="selectValue === 'otherFormData'">
			<other-form-data :curField="data" v-if="selectValue === 'otherFormData'" @change="setOtherFormData" :defOpts="data.rely.relation"></other-form-data>
		</template>
		<RvueFormulaEdit
			ref="formual"
			:fieldList="fieldList"
			@change="handleFormulaComfire"
			v-if="selectValue == 'formula'"
			:visible.sync="visible"
			:defaultFormula="data.rely.relation"
			:curField="data"
			:parentConf="parentConf"
		/>
		<AttrLinkdataDialogs v-if="selectValue == 'relation'" :parentObj="parentObj" :visible="visible" :data="data" :configList="configList" @close="visible = false" @ok="setRelation" />
	</div>
</template>
<script>
	import { create } from "../utils/create";
	import { setEnum } from "../utils/index";
	import Datetime from "@/core/Datetime";
	import otherFormData from "./otherFormData";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	const name = "AttrDefaultValue";

	const components = {
		"other-form-data": otherFormData,
	};

	const methods = {
		handleOpenDialog() {
			this.visible = true;
		},

		setRelation(relation) {
			this.data.rely.relation = relation;
			this.visible = false;
		},
		handleFormulaComfire(formula) {
			this.visible = false;
			this.data.rely.relation = formula;
		},
		setOtherFormData(d) {
			this.data.rely.relation = d;
		},
	};

	const computed = {
		title() {
			if (["selectMulti", "select", "radio", "checkbox"].includes(this.data.type)) {
				return {
					tip: this.t("widgetConfig.attrTitleTip"),
					label: this.t("formDesign.dicDesc"),
				};
			}
			return {
				tip: this.t("widgetConfig.attrDefaultValue"),
				label: this.t("global.defaultValue"),
			};
		},
		selectValue: {
			get() {
				return this.data.rely?.type || "custom";
			},
			set(n) {
				this.data.defVal = RfieldCore.ins().createField({ type: this.data.type }).config.defVal;
				this.data.rely.relation = {};
				this.data.rely.type = n;

				this.$emit("updateType", n);
			},
		},
		fieldList: {
			get() {
				return this.configList.filter((item) => item.fieldId != this.data.fieldId);
			},
		},
		setOptions() {
			let options = this.$utils.deepClone(this.options);

			if (this.parentType == "table") {
				for (var index = options.length - 1; index >= 0; index--) {
					if (options[index] == "relation" || options[index] == "formula") {
						options.splice(index, 1);
					}
				}
			}
			return options;
		},
	};

	const props = {
		options: {
			type: Array,
			default: () => ["custom", "relation", "formula"],
		},
		parentType: {
			type: String,
		},
	};
	export default create({
		props,
		name,
		methods,
		computed,
		components,
		data() {
			return {
				visible: false,
				newOptions: [],
				parentConf: {},
			};
		},
		beforeDestroy() {
			//销毁store
			try {
				this.$refs.formual.unregisterStore();
			} catch (err) {}
		},
		mounted() {
			this.newOptions = this.options.concat();
			let parentConf = RfieldCore.ins().getFieldParent(this.data.fieldId, this.configList);
			this.parentConf = parentConf;
			//初始没有值（刷新页面）

			if (!this.data.rely.type) this.$set(this.data.rely, "type", "custom");

			// 数据联动未设置成功 ，在不选中该字段后，则恢复自定义选项
			if (Object.keys(this.data.rely.relation).length == 0 && this.data.rely.type !== "now") this.$set(this.data.rely, "type", "custom");
			if (this.data.type == "table") {
				this.newOptions = ["relation"];
				this.$set(this.data.rely, "type", "relation");
			}
			// if (this.parentType == "table") {
			// 	for (var index = this.newOptions.length - 1; index >= 0; index--) {
			// 		if (this.newOptions[index] == "relation" || this.newOptions[index] == "formula") {
			// 			this.newOptions.splice(index, 1);
			// 		}
			// 	}
			// }
		},
	});
</script>
