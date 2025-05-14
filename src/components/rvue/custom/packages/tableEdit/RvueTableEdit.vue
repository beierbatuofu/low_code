<template>
	<div style="overflow-x: auto">
		<div ref="table" v-infinite-scroll="load" infinite-scroll-distance="1" class="table-edit" style="display: inline-block" :style="{ height: this.tableFilterData.length > 3 ? '300px' : 'auto' }">
			<div class="table-row catch-head">
				<div class="table-add-row">
					<rvue-button v-if="!allReadonly" @click="addRow()" type="primary" size="mini" icon="el-icon-plus" circle></rvue-button>
				</div>
				<template v-for="(column, index2) in configList">
					<!-- 表头 -->
					<div v-if="column.visible" class="table-thead cell" :style="{ width: Number(column.width == '100%' ? 200 : column.width) + 'px' }" :key="index2">
						<span v-if="column.titleShow" style="color: red">{{ column.required ? "*" : "" }}</span>
						<div v-if="column.titleShow" class="title">{{ column.title["zh"] }}</div>
					</div>
				</template>
			</div>

			<template v-if="tableFilterData != 0">
				<div v-for="(row, index) in tableFilterData" class="table-row" :key="index">
					<div
						v-if="row.status != 'D'"
						class="table-button"
						:class="Object.prototype.toString.call(isMobile) === '[object Null]' ? 'hover' : 'mb'"
						:style="{ 'pointer-events': allReadonly ? 'none' : 'auto' }"
					>
						<div class="table-edit-btn" v-if="!row.status || row.status !== 'D'" :class="Object.prototype.toString.call(isMobile) !== '[object Null]' && !allReadonly ? 'mrt' : ''">
							<el-button @click="delRow(index)" class="delete-table-btn" size="mini" icon="el-icon-delete" circle></el-button>
							<el-button @click="expandRow(index)" size="mini" icon="el-icon-edit-outline" circle></el-button>
						</div>

						<div class="table-edit-btn-text" @click="mbClick(index)" :class="Object.prototype.toString.call(isMobile) !== '[object Null]' && !allReadonly ? '' : ''">
							{{ row.index_ || Number(index + 1) }}
						</div>
					</div>

					<template v-for="(column, index2) in configList">
						<div class="cell" v-if="column.visible" :style="{ 'flex-shrink': 0, width: Number(column.width == '100%' ? 200 : column.width) + 'px' }" :key="index2">
							<el-form-item
								:key="key"
								v-if="row.status != 'D'"
								:error="customError[column.fieldId + `_$${index}`]"
								class="table-cell-form"
								:prop="setTableProp(column.fieldId, index)"
								:rules="getRules(column, row[column.fieldId])"
							>
								<component
									:timestamp="timestamp"
									:key="index2"
									ref="temp"
									:is="`rfield-${column.type}`"
									:config="column"
									:form="form"
									:tableProp="tableProp"
									:columnIndex="index"
									:fieldId="column.fieldId"
									@delfile="handleDelfile"
									@validB="(value, fieldId) => handleValide(fieldId, value, index)"
									@input="(value) => handleUpdate(index, column.fieldId)"
									@change="(value) => handleUpdate(index, column.fieldId)"
									@update="(value) => handleValide(column.fieldId, value, index)"
									:allReadonly="allReadonly"
									:mode="mode"
									:closeForm="closeForm"
									:formType="formType"
								>
								</component>
							</el-form-item>
						</div>
					</template>
				</div>
			</template>
			<div class="flex" :style="{ width: emptyWidth + 'px' }" v-else>请添加行</div>
		</div>
		<!-- 行详细查看 -->
		<column-detail
			:rowIdx="rowIdx"
			:customError="customError"
			:tableTitle="tableTitle"
			:allReadonly="allReadonly"
			v-if="!allReadonly"
			:tableList="tableList"
			:form="form"
			:configList="configList"
			ref="columnDetail"
			:tableProp="tableProp"
			:isMobile="isMobile"
		></column-detail>
	</div>
</template>
<script lang="ts">
	// import column from "./column";
	import columnDetail from "./column-detail";
	import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
	import { isMobile } from "@/utils/global";
	import RuleConfig from "@/components/rvue/custom/packages/form/RuleConfig";

	import RelationCore from "@/components/rvue/custom/packages/form/core/relationCore";
	import { RelationDefine } from "@/components/rvue/custom/packages/form/core/relationDef";
	const LENGTH: number = 5;
	@Component({
		components: {
			// column,
			columnDetail,
		},
	})
	export default class RvueTableEdit extends Vue {
		@Prop({ type: Array, default: () => [] }) tableList!: any;
		@Prop({ type: Array, default: () => [] }) configList!: any;
		@Prop({ type: Object, default: () => ({}) }) form!: any;
		@Prop({ type: Object, default: () => ({}) }) copyForm!: any;
		@Prop({ type: String, default: "" }) tableProp!: string;
		@Prop({ type: String, default: "" }) mode!: string;
		@Prop({ type: String, default: "" }) tableTitle!: string;
		@Prop({ type: Boolean, default: false }) allReadonly!: boolean; //是否只读--总
		@Prop({ type: Number, default: 0 }) timestamp!: number;
		@Prop({ type: Boolean, default: true }) closeForm!: boolean;
		@Prop({ type: Object, default: () => ({}) }) customError!: Record<string, any>;
		@Prop({ type: String, default: "normal" }) formType!: string;
		@Prop({ type: Object, default: () => ({}) }) tableConfig!: Record<string, any>;

		private listLength: number = LENGTH;

		private defaultRowData: any = {};

		private width: string = "auto";

		private emptyWidth: number = 100;

		private errorCode: any = "";

		private isMobile: any = isMobile();
		private rowIdx: number = 0;
		private key = 1;

		private handleDelfile(file: Record<string, string>) {
			this.$emit("delfile", file);
		}

		protected created() {
			// 初始化数据
			this.dataInit();
		}

		private dataInit() {
			//初始化序列#的参数
			this.tableList.forEach((ele: TJson, index: number) => {
				// ele["index_"] = index;
			});
		}

		private handleUpdate(colIdx: number, fieldId: string) {
			this.$set(this.customError, fieldId + `_$${colIdx}`, "");
			RuleConfig.tableFieldConf = this.configList[colIdx];

			RelationCore.def.evtData = {
				parentFieldId: this.tableProp,
				rowIdx: colIdx,
			};

			RelationCore.ins().onEvent(fieldId);
		}

		@Watch("timestamp", { immediate: true })
		private onChangeTimestamp() {
			this.key++;
		}

		//编辑 只读切换时 清空
		@Watch("allReadonly", { deep: true })
		onChangeallReadonly(n: TJson) {
			this.listLength = LENGTH;
		}

		private setErrorCode() {
			this.errorCode = Math.random() + "";
			this.$nextTick(() => {
				this.errorCode = "该字段不允许重复值";
			});
		}

		private handler(row: any) {
			return row["index_"];
		}

		private get findChildrenRelation(): Record<string, any>[] {
			let list: Record<string, any>[] = [];
			this.tableConfig.children.forEach((item: Record<string, any>) => {
				if (item.rely.type !== "custom") {
					list.push(item);
				}
			});

			return list;
		}

		public rowAdd(row: Record<string, any> = {}) {
			let len = this.tableList.length;

			this.listLength != 200 && (this.listLength = 200);
			if (len === 200) {
				this.$message.error((<any>this).$i18n.t("table.noMoreThen200"));
				return;
			}

			let formDefault = this.formInitVal(this.configList, len).tableForm;
			let tableForms = this.form[this.tableProp]["data"];
			row = (<any>this).$utils.deepClone(Object.assign(formDefault));
			//子字段非自定义，复制上一项的值赋值给子字段
			let findItems: Record<string, any>[] = [];
			let rowIdx = RelationCore.def.evtData.rowIdx ?? -1;

			//TODO 子表子字段对子表子字段有问题
			//注释：新建后一级对子表联动后的值无法复制
			// if ((findItems = this.findChildrenRelation) && tableForms.length > 0 && rowIdx < 0) {
			// 	let len = tableForms.length;
			// 	let defRow = (<any>this).$utils.deepClone(tableForms[len - 1]);
			// 	console.log(defRow, "defRowdefRow", tableForms, len, findItems);
			// 	findItems.forEach((ite: Record<string, any>) => {
			// 		row[ite.fieldId] = defRow[ite.fieldId];
			// 	});
			// }

			row["status"] = "C";

			this.form[this.tableProp] && this.form[this.tableProp]["data"].push(row);

			this.$nextTick(() => {
				if ((<any>this).$refs.table) {
					(<any>this).$refs.table.scrollTop = (<any>this).$refs.table.scrollHeight;
				}
				RelationCore.def.evtData.rowIdx = this.form[this.tableProp]["data"].length - 1;
				// Object.keys(row).forEach((key: string) => {
				// 	RelationCore.ins().tableRowAdd(key);
				// });
			});
		}

		private addRow() {
			this.rowAdd();
		}

		private handleValide(fieldId: string, value: any, columnIndex: number = 0) {
			//非新建下，修改数据后status == U

			if (this.formType !== "add" && !this.form[this.tableProp].data[columnIndex]["status"]) {
				this.form[this.tableProp].data[columnIndex]["status"] = "U";
			}

			RelationCore.ins().onEvent(fieldId);
			this.$set(this.form[this.tableProp].data[columnIndex], fieldId, value);
		}

		//手机编辑打开
		private mbClick(index: number) {
			if (!this.allReadonly && Object.prototype.toString.call(this.isMobile) !== "[object Null]") {
				this.expandRow(index);
			}
		}

		private formInitVal = (list = [], len: number) => {
			if (Object.keys(this.defaultRowData).length) {
				this.defaultRowData["index_"] = len;
				return {
					tableForm: this.defaultRowData,
				};
			}

			this.defaultRowData = {
				status: "C",
			};

			list.forEach((ele: any) => {
				//设置组件默认值
				if (ele.fieldId == "index_") {
					return;
				}
				//改变defVal
				let defualtValue = ele.defVal;
				if (ele.type == "number") {
					defualtValue = defualtValue || "";
				}

				this.defaultRowData[ele.fieldId] = defualtValue;
				this.defaultRowData["isSameError_" + ele.fieldId] = false;
			});
			this.defaultRowData["index_"] = len;

			return {
				tableForm: this.defaultRowData,
			};
		};

		//展开表格数据
		private expandRow(index: number) {
			//调用弹出
			this.rowIdx = index;
			RelationCore.def.evtData.rowIdx = index;
			(<any>this).$refs.columnDetail.visibleHandler(index);
			//手动校验一次弹出的
		}
		//删除表格数据
		private delRow(index: number) {
			//编辑--修改状态  新增--直接删除
			RelationCore.def.evtData = {
				parentFieldId: this.tableProp,
				rowIdx: -1,
			};
			Object.keys(this.customError).forEach((key: string) => {
				let reg = new RegExp(`\\$${index}$`);
				if (reg.test(key) && this.customError[key]) {
					this.customError[key] = "";
				}
			});

			if (this.form[this.tableProp]["data"][index]["id"]) {
				this.$set(this.form[this.tableProp]["data"][index], "status", "D");
				this.$set(this.tableList[index], "status", "D");
			} else {
				this.form[this.tableProp]["data"].splice(index, 1);
			}

			this.key++;
		}

		private get tableFilterData() {
			let count = 1;

			return this.tableList.slice(0, this.listLength).map((item: Record<string, any>) => {
				if (item.status != "D") {
					item["index_"] = count++;
					return item;
				}
				return item;
			});
		}

		private load() {
			this.listLength += 3;
		}

		private getRules(column: TJson, cellVal: TJson) {
			return column.rule;
		}

		private setTableProp(fieldId: string, index: string | number) {
			return this.tableProp + ".data" + "." + index + "." + fieldId;
		}

		protected mounted() {
			this.width = (<any>this).$refs.table.scrollWidth + "px";
			this.configList.map((item: TJson) => {
				this.emptyWidth += item.width;
			});
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep.el-drawer__header {
		font-weight: 600 !important;
	}

	::v-deep.table-edit {
		.is-circle {
			border-radius: 30px;
			height: 30px;
			width: 30px;
			padding: 0;
			margin: 0 3px;
		}
		overflow: auto;
		.table-row {
			display: flex;
			position: relative;
		}
		.catch-head {
			position: sticky;
			top: 0;
			z-index: 222;
			background: white;
		}
		.table-add-row {
			width: 100px;
			@include JustityAndFlexWrap(flex, center, center, null);
			flex-shrink: 0;
			position: sticky;
			left: 0;
			background: white;
			z-index: 111;
			height: 52px;
			top: 0;
			border: 1px solid #eee;
		}

		.table-button {
			text-align: center;
			width: 100px;
			flex-shrink: 0;
			position: sticky;
			left: 0px;
			background: white;
			z-index: 111;
			border: 1px solid #eee;
			border-top: 0;
			padding-top: 20px;
			padding-bottom: 10px;

			.table-edit-btn {
				padding-top: 5px;
				@include JustityAndFlexWrap(none, center, center, null);
			}
			.table-edit-btn-text {
				@include JustityAndFlexWrap(flex, center, center, null);
			}
		}
		.hover:hover {
			.table-edit-btn {
				display: flex;
			}
			.table-edit-btn-text {
				display: none;
			}
		}
		.mb {
			.table-edit-btn {
				display: none;
			}
			.table-edit-btn-text {
				display: flex;
			}
		}
		.mrb {
			display: flex !important;
		}
		.mrt {
			display: none !important;
		}
		div::-webkit-scrollbar {
			height: 10px;
		}
		div::-webkit-scrollbar-thumb {
			@include GlobalAvatar(null, null, 10px, #c0c4cc);
		}
		.table-thead {
			@include JustityAndFlexWrap(flex, center, center, null);

			border: 1px solid #e5e5e5;
			border-left: 0;
			flex-shrink: 0;
			background: white;
			.title {
				@include ExtraNotDisplayed();
			}
		}
		.table-cell-form {
			padding: 20px 10px;
			width: 100%;
			flex: 0 1 auto;

			> div::-webkit-scrollbar {
				height: 0 !important;
			}
		}
		.flex {
			@include JustityAndFlexWrap(flex, center, null, null);
		}
		.cell {
			border-bottom: 1px solid #eee;
			border-right: 1px solid #eee;
			display: flex;
			align-items: center;
			justify-content: center;
			// width: 100%;
		}
		@media screen and (max-width: 768px) {
			.table-edit .is-circle {
			}
		}
	}
</style>
