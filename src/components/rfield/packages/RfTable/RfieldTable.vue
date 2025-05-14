<template>
	<div>
		<!-- 设计模式 -->
		<div class="design-container" v-if="mode === 'design'">
			<div
				class="widget-form-table"
				:key="config.fieldId"
				:class="{
					active: selectWidget.fieldId == config.fieldId,
				}"
			>
				<widget-form-table
					@selectTabField="selectTabField"
					:tab="tab"
					ref="widgetFormTable"
					:widgetForm="widgetForm"
					:tableConfig="config"
					:index="index"
					:select.sync="selectWidget"
				></widget-form-table>
			</div>
		</div>
		<!-- 编辑模式 -->

		<div class="edit-container" v-else>
			<div @blur="handleBlur" tabIndex="0" hidefocus="true">
				<rvue-table-edit
					ref="tableEdit"
					:configList="columnConfig"
					:widgetConfig="config"
					:form="form"
					:timestamp="timestamp"
					:tableList="tableList"
					@validB="handleBlurV"
					:tableProp="fieldId"
					:tableTitle="getTitle"
					:allReadonly="readonly || disabled"
					:mode="mode"
					@delfile="handleDelfile"
					:closeForm="closeForm"
					:customError="customError"
					:tab="tab"
					:formType="formType"
					:key="tableKey"
					:tableConfig="config"
				>
				</rvue-table-edit>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { isMobile } from "@/utils/global";
	import RuleConfig from "../../../rvue/custom/packages/form/RuleConfig";
	import WidgetField from "../../core/WidgetField";
	import WidgetFormTable from "../../../formDesign/WidgetFormTable.vue";
	import "./_core/RfTable";

	import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
	@Component({
		components: {
			WidgetFormTable,
		},
	})
	export default class RfieldTable extends WidgetField {
		@Prop({ default: () => ({}) }) rules!: any;
		@Prop({ type: Object, default: () => ({}) }) select!: any;
		@Prop({ type: Object, default: () => ({}) }) widgetForm!: any;
		@Prop({ type: Number, default: () => 0 }) index!: number;
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;
		@Prop({ type: Object, default: () => ({}) }) customError!: Record<string, any>;
		@Prop({ type: String, default: "" }) tab!: string;

		private isMobile = isMobile;
		private tableKey = 1;
		private columnConfig: TJson = [];

		private get tableList() {
			try {
				return this.form[this.fieldId]["data"];

				// let arr = this.form[this.fieldId]["data"].filter((item: any) => {
				// 	Object.keys(item).map((ele: any) => {
				// 		if (ele.indexOf("isSameError_") < 0 && ele != "id" && ele != "status" && typeof item["isSameError_" + ele] === "undefined") {
				// 			item["isSameError_" + ele] = false;
				// 		}
				// 	});

				// 	return item.status !== "D";
				// });

				// return arr;
			} catch (err) {
				return [];
			}
		}

		private get getTitle() {
			return this.config.title[<string>localStorage.getItem("lang")];
		}
		@Watch("form", { deep: true })
		onChangeTableList(n: any) {
			this.initData();
		}

		private selectTabField(conf: Record<string, any>, colIdx: number) {
			this.$emit("selectTableIdx", this.config.fieldId, 0, colIdx, this);
		}

		private handleDelfile(file: Record<string, string>) {
			this.$emit("delfile", file);
		}

		private get selectWidget() {
			return this.select;
		}

		private set selectWidget(n: TJson) {
			this.$emit("update:select", n);
		}

		//检验表格中是否重复值
		public noSameVal = (filedId: string) => ({
			validator: (rule: any, value: string, cb: (params?: any) => any) => {
				//判断当前这个值在这个数组里面有多少个
				let sameNum = 0;
				this.form[this.config.fieldId].data.forEach((item: TJson) => {
					console.log(item, filedId, value);
					if (item[filedId] == value && value) {
						sameNum++;
					}
				});
				if (sameNum > 1) {
					return cb(new Error((<any>this.$t)("global.errNoSameVal")));
				}
				return cb();
			},
			trigger: "blur",
		});

		private initData() {
			if (this.mode == "design") return;
			this.config.children.forEach((item: TJson, indexP: number) => {
				//给列规则和初始化表格数据
				if (item.visible && item.edit) {
					let ruleConfig = new RuleConfig();
					(<any>ruleConfig).rules = item;
					(<any>ruleConfig).rules.length && (item.rule = (<any>ruleConfig).rules);
					if (item.noSameVal) {
						item.rule.push(this.noSameVal(item.fieldId));
					}
				} else {
					item.rule = {
						required: false,
					};
				}
			});

			//给表格验证加规则
			if (this.config.visible && this.config.required && this.config.type === "table") {
				this.$set(this.rules, this.config.fieldId, new RuleConfig().formIsEmpty(this.form[this.config.fieldId].data));
			}
		}

		private handleBlurV(event: Event) {
			this.$emit("validB", this.config.fieldId);
		}

		protected mounted() {
			this.$nextTick(() => {
				this.mode !== "design" && this.form[this.fieldId]?.data?.length === 0 && !this.disabled && (<any>this).$refs.tableEdit.addRow();
			});

			this.initData();
		}

		@Watch("selectWidget", { deep: true })
		onChangeSelectWidget(n: TJson) {
			this.$emit("update:select", n);
		}
		@Watch("select", { deep: true })
		onChangeSelect(n: TJson) {
			this.selectWidget = n;
		}

		@Watch("readonly", { immediate: true })
		onChangeReadonly(n: boolean) {
			if (!n) {
				let list = [...this.config.children];
				this.columnConfig = this.config.children;
			} else {
				this.columnConfig = this.config.children;
			}
		}
	}
</script>

<style scoped lang="scss">
	.delete-table-btn {
		color: red;
		border: 1px solid red;
		&:hover {
			background: red !important;
			border: 1px solid transparent !important;
		}
	}
	::v-deep .edit-container .el-table {
		.el-form-item {
			width: 100%;
			.dept-chose {
				padding: 0 10px !important;
			}
		}
		.el-select-dropdown__item {
			display: block;
		}
		.cell {
			padding-left: 10px;
			padding-right: 10px;
		}
	}
	::v-deep .design-container .el-table {
		th {
			padding: 6px 0;
		}
	}
	@media screen and (max-width: 768px) {
		.table-edit {
			overflow: inherit;
		}
	}
</style>
