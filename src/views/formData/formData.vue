<template>
	<div style="height: 100%">
		<div class="form-data" v-loading="loading" v-if="showTure">
			<header class="form-name">
				<span class="titleName">{{ formName }}</span>
				<span class="titleName">切换权限组:</span>
				<el-select v-model="selectRightId" @change="selectRightChange">
					<el-option v-for="item in rightList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<div class="btnSwitch">
					<rvue-button size="mini" plain @click="exhibit()" :icon="lg ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"> </rvue-button>
					<router-link v-if="!isMobile && curPerm.isAppDesign && $route.params.formCode" :to="`/${$route.params.tenantId}/appd/${$route.params.appCode}/p/form/${$route.params.formCode}`">
						<el-tooltip placement="bottom">
							<div slot="content" style="text-align: center">{{ curFormType != "P" ? $t("Mheader.editForm") : $t("Mheader.editDashboard") }}</div>
							<rvue-button icon="el-icon-edit" plain class="nav-btn"> </rvue-button>
						</el-tooltip>
					</router-link>
				</div>
			</header>

			<form-query :style="{ display: lg ? 'block' : 'none' }" ref="form" :key="keyFlage" :formQueryData="formQueryData" @search="formSearch" @reset="formReset"></form-query>
			<button-list :style="{ display: showTure ? '' : 'none' }" :btnList="buttonList" @add="addDialogVisible = true"></button-list>
			<form-table
				:configlist="configlist"
				@selectChange="(v) => (selects = v)"
				:tableList="tableList"
				:data="data"
				:page="page"
				@open="openDetails"
				@change="pageChange"
				@sort="sortChange"
			></form-table>

			<add-list-dialog :addDialog.sync="addDialogVisible" :columnConfig="option" :appCode="appCode" :formCode="formCode" :formName="formName" :flowType="flowType" @updateTable="updateTable" />

			<js-code
				:option="{
					...jsOptions,
					selects,
					query: $refs.form,
				}"
				source="query"
				v-if="Object.keys(jsOptions).length"
				ref="jscode"
			></js-code>
		</div>
		<div v-else class="noInfo">找不到该页面</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Provide } from "vue-property-decorator";
	import FormQuery from "./_components/formQuery.vue";
	import ButtonList from "./_components/buttonList.vue";
	import FormTable from "./_components/formTable.vue";
	import AddListDialog from "@/views/form/addListDialog";
	import FormDetail from "@/components/formDetail/formDetail.vue";
	import { getQueryConf } from "@/api/flowcenter";
	import { getFormSingle, getData, getRightList, saveData, updateData, getFormSingleTest, getRightNewList } from "@/api/form";
	import { FormModule } from "@/store/modules/form";
	import { PermissionModule } from "@/store/modules/permission";
	import dataFilter from "@/core/dataFilter";
	import toDatetime from "@/core/toDatetime";

	import { isMobile } from "@/utils/global";
	import Jscode from "@/components/jscode/jscode";

	let queryData: any;
	@Component({
		components: {
			FormQuery,
			ButtonList,
			FormTable,
			AddListDialog,
			FormDetail,

			"js-code": Jscode,
		},
	})
	export default class FormData extends Vue {
		@Provide() formCode = this.$route.params.formCode;
		@Provide() appCode = this.$route.params.appCode;
		private loading: boolean = true;
		private formQueryData: any = [];
		private lg: boolean = false; //条件查询显示开关
		private bDetailVisible: boolean = false;
		private dataId = 0;
		private addDialogVisible: boolean = false;
		private option: any = {};
		private formName: string = "";
		private flowType: string = "";
		private tableList: any = {};
		private buttonList: any = [];
		private data: any = new Array(1);
		private page: any = { currentPage: 1, pageSize: 10, pageSizes: [5, 10, 20, 50] };
		private filterRule: any = { isDeleted: false, matchRules: [[]], createTimeBegin: "", createTimeEnd: "", creater: "", sorts: [{ asc: false, column: "create_time" }] };
		private layout: any = []; //仪表盘数据数组
		private layoutM: any = []; //仪表盘数据数组-移动
		private theme: string = "blue";
		private formDetailKey = new Date().getTime();
		private mode: string = isMobile() ? "mobile" : "pc";
		private jsOptions: Record<string, any> = {};
		private selects: Record<string, any>[] = [];
		private showTure: any = true;
		private showForm: any = false;
		private arrType: any = [];
		private selectRightId = "";
		private rightList: any = [];
		private getFormSingleData: any = {};
		private keyFlage: number = 1;

		private configlist: Record<string, any>[] = [];
		private get FormName() {
			return FormModule.curFormName;
		}

		private get isMobile() {
			return "ontouchend" in window;
		}

		private get isCurPerm() {
			return PermissionModule.isCurPerm;
		}

		private get curFormType() {
			return FormModule.curFormType;
		}

		private get curPerm() {
			return PermissionModule.curPerm;
		}

		protected async created() {
			let formCode = this.$route.params.formCode;
			let appCode = this.$route.params.appCode;

			let { data: rData } = await getRightNewList(appCode, formCode);
			this.rightList = rData.filter((item: any) => item.type != "0");

			this.selectRightId = this.rightList[0].id || "";

			rData.forEach((item: any) => {
				this.arrType.push(item.type);
			});
			if (this.arrType.includes("8")) {
				this.showForm = true;
			}
			//getFormSingle换
			let values = await getFormSingle(this.appCode, this.formCode);
			this.getFormSingleData = values.data;
			this.configlist = this.getFormSingleData.structure?.configList || [];

			this.formName = this.getFormSingleData.name;
			this.flowType = this.getFormSingleData.type;

			if (localStorage.loginType == "guest" && this.showForm != true) {
				this.showTure = false;
			}
			this.getList(this.selectRightId);
			this.$nextTick(() => {
				(<any>this.$refs).form.bindSearchForm(FormModule.queryForm);
			});
			// 初始化检索条件
			// this.filterRule = this._initFilterRule(this.formQueryData, this.tableList);
			// this.getTableList();
		}

		private getList(id: string) {
			let selcetObj: any = this.rightList.find((item: any) => item.id == id);

			//仪表盘
			let { type, structure, dstructure } = this.$utils.deepClone(this.getFormSingleData);
			//其他
			let { viewStructure } = selcetObj || { viewStructure: null };

			this.option = {
				...structure,
				configList: structure && this.$utils.deepClone(dstructure.configList),
			};

			let { newQueryData } = dataFilter(structure, viewStructure, type === "F");

			queryData = this.$utils.deepClone(newQueryData.queryList);
			this.formQueryData = newQueryData.queryList;
			this.tableList = newQueryData.tableList;
			this.buttonList = newQueryData.buttonList;

			this.page.pageSize = +this.tableList.pageSize || 10;
			this.filterRule["sorts"] = [
				{
					column: this.tableList.sortCondition,
					asc: this.tableList.sortOrder === "asc",
				},
			];

			this.jsOptions = viewStructure || {};
			this.keyFlage++;
		}

		private selectRightChange(value: string) {
			this.getList(value);
			(this as any).$refs.form.resetForm();
		}

		private _initFilterRule(formQueryData: any, tableList: any) {
			let rule: any = { isDeleted: false, matchRules: [[]] };
			formQueryData.forEach((item: any) => {
				if (item.fieldId === "create_time") {
					if (item.queryStyle === "default") {
						rule["createTimeBegin"] = item.defVal[0] ?? "";
						rule["createTimeEnd"] = item.defVal[1] ?? "";
					} else {
						let t = toDatetime.dispath(item.defVal);
						rule["createTimeBegin"] = t[0] ?? "";
						rule["createTimeEnd"] = t[1] ?? "";
					}
				} else if (item.fieldId === "update_time") {
					if (item.queryStyle === "default") {
						rule["updateTimeBegin"] = item.defVal[0] ?? "";
						rule["updateTimeEnd"] = item.defVal[1] ?? "";
					} else {
						let t = toDatetime.dispath(item.defVal);
						rule["updateTimeBegin"] = t[0] ?? "";
						rule["updateTimeEnd"] = t[1] ?? "";
					}
				} else if (item.fieldId === "creater") {
					rule["creater"] = item.defVal[0];
				} else if (item.fieldId === "process_status") {
					rule["processStatus"] = item.defVal;
				} else {
					if (item.defVal.length > 0) {
						let jValue: any = [];
						// 日期时间动态值转换string-->array
						if (item.type === "datetime" && item.queryStyle === "select") {
							jValue = toDatetime.dispath(item.defVal);
						}
						// 部门/人员只需要id
						if (Array.isArray(item.defVal)) {
							item.defVal.forEach((element: any) => {
								if (element.id) {
									jValue.push(element.id);
								} else {
									jValue.push(element);
								}
							});
						}
						rule["matchRules"][0].push({
							dataType: 0,
							type: item.type,
							method: item.linkVal || "eq",
							targetFieldCode: item.fieldId,
							judgeValues: Array.isArray(item.defVal) ? (jValue.join("") ? jValue : []) : [item.defVal],
							parentSubFormTargetFieldCode: item.parentId ?? "",
						});
					}
				}
			});
			// sort
			let { sortCondition, sortOrder, pageSize } = tableList;
			this.page.pageSize = +pageSize || 10;
			if (sortCondition) {
				rule["sorts"] = [
					{
						asc: sortOrder === "asc",
						column: sortCondition,
					},
				];
			}

			return rule;
		}

		private exhibit() {
			this.lg = !this.lg;
		}

		//获取表格数据
		private getTableList(filterRule = this.filterRule, currentPage = this.page.currentPage, pageSize = this.page.pageSize) {
			this.loading = true;
			if (!this.formCode) {
				return;
			}
			getData(this.appCode, this.formCode, currentPage, pageSize, filterRule)
				.then((res: TJson) => {
					let result: any = [];
					this.data = res.data.records || [];
					this.data.forEach((item: any) => {
						let o: any = {};
						Object.keys(item).forEach((k) => {
							let v = item[k];
							if (typeof v == "string" && /^\[.*\]$/.test(v)) {
								o[k] = JSON.parse(v);
							} else {
								o[k] = v;
							}
						});
						result.push(o);
					});
					this.data = result;
					this.page.total = +res.data.total;
					this.loading = false;
				})
				.catch((err: TJson) => {
					console.log(err.msg);
					this.loading = false;
				});
		}

		// 打开详情页
		private openDetails(row: any) {
			let { tenantId, appCode, formCode } = this.$route.params;
			this.dataId = Number(row.id);
			// /:tenantId/app/:appCode/:flag/form/:formCode/:dataId
			this.$router.push({
				path: `/${tenantId}/app/${appCode}/p/form/${formCode}/${this.dataId}`,
			});
			//	this.bDetailVisible = true;
			this.formDetailKey = new Date().getTime();
		}

		// table page/size change
		private pageChange(current: any, size: any) {
			this.page.currentPage = current;
			this.page.pageSize = size;
			this.getTableList(this.filterRule, current, size);
		}

		// table sort change
		private sortChange(prop: any, order: any) {
			if (!order) {
				this.filterRule["sorts"] = [
					{
						column: this.tableList.sortCondition,
						asc: this.tableList.sortOrder === "asc",
					},
				];
				//delete this.filterRule["sorts"];
			} else {
				this.filterRule["sorts"] = [
					{
						column: prop,
						asc: order === "ascending",
					},
				];
			}
			this.getTableList();
		}

		// 重置检索条件
		private formReset() {
			this.formQueryData = this.$utils.deepClone(queryData);
			// 初始化检索条件
			this.filterRule = this._initFilterRule(this.formQueryData, this.tableList);

			this.getTableList();
		}

		private isFormEmpty(data: any) {
			if (Object.prototype.toString.call(data) == "[object String]") {
				return Boolean(data.length);
			}

			if (Object.prototype.toString.call(data) == "[object Array]") {
				return Boolean(data.length);
			}

			if (Object.prototype.toString.call(data) == "[object Object]") {
				return Boolean(Object.keys(data).length);
			}
			return false;
		}

		// 点查询按钮回调
		private formSearch(searchForm: any) {
			let form = JSON.parse(JSON.stringify(searchForm));

			// 处理检索条件, 将formQueryData和form合并成matchRules
			let formQueryData = this.formQueryData;

			let sysFields = ["creater", "create_time", "update_time", "process_status"];

			let filterRule: any = {};
			if (form["creater"] && form["creater"][0]) {
				filterRule.creater = form["creater"][0].id;
			}

			if (form["create_time"]) {
				form["create_time"] = Array.isArray(form["create_time"]) ? form["create_time"] : toDatetime.dispath(form["create_time"]);
				filterRule.createTimeBegin = form["create_time"][0];
				filterRule.createTimeEnd = form["create_time"][1];
			}

			if (form["update_time"]) {
				form["update_time"] = Array.isArray(form["update_time"]) ? form["update_time"] : toDatetime.dispath(form["update_time"]);
				filterRule.updateTimeBegin = form["update_time"][0];
				filterRule.updateTimeEnd = form["update_time"][1];
			}

			if (form["process_status"]) {
				filterRule.processStatus = form["process_status"];
			}

			let match: any = [];

			formQueryData.forEach((item: Record<string, any>) => {
				let { fieldId, type, linkVal, parentId } = item;

				let formValue = type == "uploadFile" ? linkVal : form[fieldId];

				if (!sysFields.includes(type) && this.isFormEmpty(formValue)) {
					console.log(formValue, linkVal, type);
					// //TODO
					// if (["datetime", "update_time", "create_time"].includes(type)) {
					// 	/^[a-z]*$/i.test(String(formValue)) && (linkVal = "dynamic");
					// }
					console.log(parentId, item, "item");
					match.push({
						dataType: 0,
						type,
						method: linkVal || "",
						targetFieldCode: fieldId,
						judgeValues: Array.isArray(formValue) ? formValue : [formValue],
						parentSubFormTargetFieldCode: parentId ?? "",
					});
				}
			});

			// for (let i = 0; i < formQueryData.length; i++) {
			// 	console.log(formQueryData, key);
			// 	if (formQueryData[i].fieldId === key) {
			// 		// 日期时间动态值转换string-->array
			// 		if (formQueryData[i].type === "datetime" && formQueryData[i].queryStyle === "select") {
			// 			form[key] = toDatetime.dispath(form[key]);
			// 		}
			// 		// 过滤掉未输入的数字类型

			// 		match.push({
			// 			dataType: 0,
			// 			type: formQueryData[i].type,
			// 			method: formQueryData[i].linkVal || "",
			// 			targetFieldCode: formQueryData[i].fieldId,
			// 			judgeValues: Array.isArray(form[key]) ? (form[key].join("") ? form[key] : []) : [form[key]],
			// 			parentSubFormTargetFieldCode: formQueryData[i].parentId ?? "",
			// 		});
			// 		break;
			// 	}
			// }

			this.filterRule = {
				sorts: this.filterRule.sorts,
				...filterRule,
				matchRules: [match],
			};
			this.page.currentPage = 1;

			this.getTableList();
		}

		private handleClose() {
			this.bDetailVisible = false;
			this.getTableList();
		}

		private updateTable() {
			this.getTableList();
		}
	}
</script>
<style lang="scss" scoped>
	.titleName {
		color: #666666;
		font-size: 15px;
		margin-right: 10px;
	}
	.btnSwitch {
		display: inline-block;
		float: right;

		button {
			padding: 3px;
			border-color: $color;
			background: $color;
			color: #fff;
		}
	}
	.btnTitle {
		display: inline-block;
		margin-left: 10px;
		vertical-align: text-top;
	}
	.form-data {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: relative;
		overflow: hidden;
		.form-name {
			padding: 8px 10px;
			font-size: 18px;
			background-color: #fff;
			margin: 5px 5px;
		}
	}
	::v-deep .el-dialog__header {
		background-color: #4c81ff;
		.el-dialog__title,
		.el-dialog__headerbtn .el-dialog__close {
			color: #fff;
		}
	}
	::v-deep .el-dialog {
		margin-bottom: 0px;
		height: 100vh;
	}
	::v-deep .el-dialog__wrapper .el-dialog__body {
		height: calc(100vh - 60px);
	}
	::v-deep .addListDialog {
		.el-dialog__body {
			overflow-y: scroll;
		}
	}
	::v-deep .detail-dialog {
		.el-dialog__body {
			padding: 0;
		}
	}
	::v-deep .el-button--mini {
		padding: 0.3rem 0.6rem;
		margin-right: 10px;
	}
	/* ::v-deep .vue-grid-layout {
		min-width: auto !important;
	} */
</style>
