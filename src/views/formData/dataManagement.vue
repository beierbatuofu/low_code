<template>
	<div class="form-data" v-loading="loading">
		<form-query ref="form"></form-query>
		<!-- <form-query ref="form" @search="formSearch" @reset="formReset"></form-query> -->
		<button-list v-if="flowType !== 'P'" :btnList="buttonList" @imports="importsVisible = true" @delete="deleteFormBtn" @deleteAll="deleteAllFormBtn" @add="addDialogVisible = true"></button-list>
		<form-table
			@open="openDetails"
			v-if="flowType !== 'P'"
			@selectChange="(v) => (selects = v)"
			:tableList="tableList"
			:data="data"
			:page="page"
			@change="pageChange"
			@sort="sortChange"
		></form-table>
		<import-dialog :importsVisible="importsVisible" @visible="closeImportVisible"></import-dialog>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Provide } from "vue-property-decorator";
	import FormQuery from "./_components/formQuery.vue";
	import ButtonList from "./_components/buttonList.vue";
	import FormTable from "./_components/formTable.vue";
	import importDialog from "./_components/importDialog.vue";
	import { getQueryConf } from "@/api/flowcenter";
	import { getFormSingle, getData, saveData, updateData, getFormSingleTest, deleteForm, deleteAllForm } from "@/api/form";
	import dataFilter from "@/core/dataFilter";
	import { FormModule } from "@/store/modules/form";
	import { Utils } from "@/components/jscode/_core/utils";

	let queryData: any;
	@Component({
		components: {
			FormQuery,
			ButtonList,
			FormTable,
			importDialog,
		},
	})
	export default class DataManagement extends Vue {
		@Provide() formCode = this.$route.params.id;
		@Provide() appCode = this.$route.params.appCode;
		private loading: boolean = true;
		private formQueryData: any = [];
		private flowType: string = "";
		private formName: string = "";
		private layout: any = []; //仪表盘数据数组
		private option: any = {};
		private tableList: any = {};
		private buttonList: any = [];
		private dataId = 0;
		private data: any = new Array(1);
		private formDetailKey = new Date().getTime();
		private selects: Record<string, any>[] = [];
		private filterRule: any = { isDeleted: false, matchRules: [[]], createTimeBegin: "", createTimeEnd: "", creater: "", sorts: [{ asc: false, column: "create_time" }] };
		private page: any = { currentPage: 1, pageSize: 10, pageSizes: [5, 10, 20, 50] };
		private [Utils.comp]: Record<string, any> | null = null;
		private formId: any;
		private maps: any = [];
		private importsVisible: boolean = false;

		private mounted() {
			window.onbeforeunload = null;
			window.onpopstate = null;
		}
		protected async created() {
			//只获取表单数据
			Promise.all([getFormSingle(this.appCode, this.formCode)]).then((values) => {
				let { type, structure, dstructure } = values[0].data;
				this.flowType = type;
				console.log("走到这");
				//仪表盘
				if (this.flowType === "P") {
					this.layout = structure?.layout;
					this.loading = false;
					return;
				}
				//其他
				let { viewStructure } = values[0].data || { viewStructure: null };
				//console.log(values[0].data, "values[0].data");
				this.option = {
					...structure,
					configList: structure && this.$utils.deepClone(dstructure.configList),
				};
				let { newQueryData } = dataFilter(structure, viewStructure, type === "F");

				queryData = this.$utils.deepClone(newQueryData.queryList);
				this.formQueryData = newQueryData.queryList;
				this.tableList = newQueryData.tableList;
				this.buttonList = newQueryData.buttonList.filter((item: { fieldId: string; type: string }) => item.type != "add");
				let delate = { type: "delete", title: { en: "delete", zh: "删除" }, fieldId: "delete" };
				let delateAll={type: "deleteAll", title: { en: "deleteAll", zh: "全部删除" }, fieldId: "deleteAll"}
        // let imports = {type:'imports',title:{en:'imports',zh:'导入'},fieldId:"imports"}
				if (this.buttonList.length < 2) {
					this.buttonList.push(delate,delateAll);
					// this.buttonList.push(delate,delateAll,imports);
				}
			});
			this.getTableList();

			// Promise.all([getQueryConf(this.formCode), getFormSingle(this.appCode, this.formCode)]).then((values) => {

			// 		//其他
			// 		let { viewStructure } = values[0].data || { viewStructure: null };

			// 		// let res = await getQueryConf(this.formCode);
			// 		// let { viewStructure } = res.data;

			// 		// let res1 = await getFormSingle(this.appCode, this.formCode);
			// 		// let { name, type, structure } = res1.data;

			// 		this.option = {
			// 			...structure,
			// 			configList: structure && this.$utils.deepClone(dstructure.configList),
			// 		};

			// 		let { newQueryData } = dataFilter(structure, viewStructure, type === "F");
			// 		console.log(newQueryData, "newQueryDatanewQueryData");
			// 		//this.jsOptions = viewStructure || {};
			// 		queryData = this.$utils.deepClone(newQueryData.queryList);
			// 		this.formQueryData = newQueryData.queryList;
			// 		this.tableList = newQueryData.tableList;
			// 		this.buttonList = newQueryData.buttonList;

			// 		this.page.pageSize = +this.tableList.pageSize || 10;
			// 		this.filterRule["sorts"] = [
			// 			{
			// 				column: this.tableList.sortCondition,
			// 				asc: this.tableList.sortOrder === "asc",
			// 			},
			// 		];
			// 		this.$nextTick(() => {
			// 			(<any>this.$refs).form.bindSearchForm();
			// 		});
			// 	});
		}

		//获取表格信息
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

		//全部删除按钮
		private deleteAllFormBtn() {
			const token = localStorage.getItem("token");
			console.log(token, "token");
			// this.$alert("您点击了全部删除按钮",'提示',{
			// 	cancelButtonText:"好的",
			// 	type:"info",
			// 	showClose:false
			// })
			this.$confirm("若确认全部删除，请点击确定按钮", "确定是否全部删除数据？", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
				center: true,
			})
				.then(() => {
					let appCode = this.$route.params.appCode;
					let formCode = this.$route.params.id;
					console.log(this.selects, "this.selects");

					console.log(this.$route.params, "this.$route.params");
					this.$message({
						type: "success",
						message: "全部删除成功！",
					});

					deleteAllForm(appCode, formCode).then((res: TResponse) => {
						console.log(res);
						const totalPage = Math.ceil((this.page.currentPage - 1) / this.page.pageSize);
						this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage;
						this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage;
						this.getTableList(this.filterRule, this.page.currentPage, this.page.pageSize);
					});
				})
				.catch(() => {
					this.maps = [];
					this.$message({
						type: "info",
						message: "已取消全部删除。",
					});
				});
		}
		private deleteFormBtn() {
			this.selects.forEach((item) => {
				this.maps.push({ formCodeId: item.id });
			});
			if (this.maps.length < 1) {
				this.$alert("您当前未选中任何数据", "提示", {
					cancelButtonText: "确定",
					type: "info",
					showClose: false,
				});
			} else {
				this.$confirm("您当前选中了" + this.maps.length + "条数据，若确认删除，请点击确定", "确定删除您所选的数据吗？", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
					center: true,
				})
					.then(() => {
						let appCode = this.$route.params.appCode;
						let formCode = this.$route.params.id;
						this.$message({
							type: "success",
							message: "删除成功！",
						});
						deleteForm(appCode, formCode, this.maps).then((res: TResponse) => {
							this.maps = [];
							const totalPage = Math.ceil((this.page.currentPage - 1) / this.page.pageSize);
							this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage;
							this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage;
							this.getTableList(this.filterRule, this.page.currentPage, this.page.pageSize);
						});
					})
					.catch(() => {
						this.maps = [];
						this.$message({
							type: "info",
							message: "已取消删除。",
						});
					});
			}
		}

		private closeImportVisible(flag: boolean = false) {
			this.importsVisible = false;
			if (flag) {
				this.page.currentPage = 1;
				this.getTableList(this.filterRule, this.page.currentPage, this.page.pageSize);
			}
		}

		// 打开详情页
		private openDetails(row: any) {
			let { tenantId, appCode, id: formCode } = this.$route.params;
			this.dataId = Number(row.id);
			// /:tenantId/app/:appCode/:flag/form/:formCode/:dataId
			// if (!row.creater)
			// 	return this.$message({
			// 		message: "该条数据是导入的数据",
			// 		type: "warning",
			// 	});

			this.$router.push({
				path: `/${tenantId}/app/${appCode}/p/manage_detail/${formCode}/${this.dataId}`,
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
				delete this.filterRule["sorts"];
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
		@Watch("data", { immediate: true, deep: true })
		off() {
			let delate = { type: "delete", title: { en: "delete", zh: "删除" }, fieldId: "delete" };
			if (this.buttonList.length < 2) {
				let idx = this.buttonList.findIndex((item: Record<string, any>) => item.type == "delete");

				idx == -1 && this.buttonList.push(delate);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.form-data {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: relative;
		overflow: hidden;
	}
</style>
