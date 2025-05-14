<template>
	<div class="biTable-container">
		<el-table @sort-change="handleSortChange" border stripe highlight-current-row :height="height" :data="tableData" style="width: 100%">
			<el-table-column
				:sortable="filterList.indexOf(item.type) > -1 && formConfig.sourceType === 'form' ? 'custom' : false"
				align="center"
				class-name="form-data-cell"
				v-for="(item, index) in tableColumn"
				:key="index"
				show-overflow-tooltip
				min-width="120"
				:prop="item.fieldId"
			>
				<template slot="header">
					<span class="column-cell">
						<span :title="item | getLang">{{ item | getLang }}</span>
					</span>
				</template>
				<template slot-scope="scope">
					<div class="upload-box" v-if="item.type === 'uploadFile' && scope.row[item.fieldId]">
						<rvue-tooltip placement="top" v-for="(file, index) of scope.row[item.fieldId]" :key="index" :content="file.name">
							<span class="fileLogo">
								{{ file.name.split(".").reverse()[0] }}
							</span>
						</rvue-tooltip>
					</div>
					<span v-else>{{ parseContent(scope.row, item) }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="text-align: center; background: white; position: absolute; bottom: 2px; left: px; right: 0; width: 98%" v-if="tableData.length">
			<el-pagination
				:current-page="page.currentPage"
				:page-sizes="page.pageSizes"
				:page-size="page.pageSize"
				:total="page.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				@prev-click="handleCurrentChange"
				@next-click="handleCurrentChange"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
	import { getData } from "@/api/form";
	import { runSql } from "@/api/dataset";
	import { FList, CList } from "@/components/chartDesign/components/attr/CTdi/_core/di";
	import { tableDefaultConfig, tableDefaultData } from "./_config/tableDefaultData";
	import toDatetime from "@/core/toDatetime";
	@Component({})
	export default class biTable extends Vue {
		@Prop({
			type: Object,
			default: () => ({
				matchRules: [],
			}),
		})
		data!: any;
		@Prop({
			type: Object,
			default: () => {},
		})
		formConfig!: any;
		@Prop({ type: Number, default: 10 }) pageSize!: any;
		@Inject() readonly processStatusList!: TJson;
		private height: string = "null";
		private tableData: any = [];
		private blackList = ["table", "separator", "uploadFile"];
		private page: any = { currentPage: 1, pageSize: 10, pageSizes: [5, 10, 20, 50], total: null };
		private filterRule: any = { sorts: [{ asc: false, column: "create_time" }] };
		private filterList = ["input", "number", "datetime", "select", "radio", "create_time", "update_time", "process_status", "userRadio", "deptRadio"];
		private columnField: Record<string, any> = {};

		//列
		private get tableColumn() {
			let tableColumn = this.formConfig.configList.filter((item: TJson) => {
				return item.type != "separator" && item.type != "tab";
			});
			let sysList = [];
			if (this.formConfig.type && this.formConfig.type !== "sql") {
				if (this.formConfig.type === "C") {
					sysList = this.$utils.deepClone(CList);
				} else if (this.formConfig.type === "F") {
					sysList = [...this.$utils.deepClone(FList)];
				}
			}

			tableColumn = [...tableColumn, ...sysList];

			if (this.$route.params.id !== "new" && this.formConfig.configList.length == 0) {
				tableColumn = [];
			} else if (this.$route.params.id === "new" && this.formConfig.configList.length == 0) {
				tableColumn = tableDefaultConfig;
			}

			return tableColumn;
		}
		private set tableColumn(n: any) {
			this.formConfig.configList = n;
		}
		//单元格内部具体
		private parseContent(row: TJson, item: TJson) {
			let fieldId = item.fieldId;

			if (Object.keys(this.columnField).length) {
				Object.values(this.columnField).some((ite: Record<"fieldId" | "fieldIdAsName", string>[]) => {
					let conf: undefined | Record<"fieldId" | "fieldIdAsName", string> = ite.find(
						(it: Record<"fieldId" | "fieldIdAsName", string>) => fieldId == it.fieldId || fieldId == it.fieldIdAsName
					);
					if (conf) {
						fieldId = conf.fieldId;
					}
				});
			}

			try {
				let address = JSON.parse(row[fieldId]);
				if (address.hasOwnProperty("city")) {
					return address.province + address.district + address.city + address.detail;
				}
			} catch (err) {}

			if (Array.isArray(row[fieldId])) {
				return row[fieldId]
					.map((item: TJson) => {
						return item.name || item;
					})
					.join(",");
			} else {
				//表格类型
				if (item.type === "table") {
					return "详情页面查看";
				}

				//时间类型转换格式
				if (item.type === "datetime") {
					return row[fieldId] ? toDatetime.convert((<any>item).dateFormat, row[fieldId]) : "";
				}
				let key = "";
				if (this.formConfig.sourceType == "dataset") {
					key = fieldId;
				} else {
					key = item.code;
				}
				if (row[key] || key == "process_status") {
					if (row[key] instanceof Object) {
						return row[key].name;
					}
					if (key == "process_status") {
						return this.processStatusList[row[key]];
					}
					return row[key];
				}
				//数字组件初始清空0
				if (row[item.fieldId] && item.type === "number" && this.formConfig.sourceType !== "dataset" && !item.numFormat.allowDecimalDigits) {
					return Number(row[fieldId]);
					//添加小数位数
				} else if (row[fieldId] && item.type === "number" && this.formConfig.sourceType !== "dataset" && item.numFormat.allowDecimalDigits) {
					return parseFloat(row[fieldId]).toFixed(item.numFormat.decimalDigitsNum);
				}

				return row[fieldId];
			}
		}
		//页码改变
		private handleCurrentChange(val: number) {
			this.$set(this.page, "currentPage", val);
			this.fetchData(this.formConfig.appCode, this.formConfig.code, this.page.currentPage, this.page.pageSize, this.data);
		}
		//页size改变
		private handleSizeChange(val: number) {
			this.$set(this.page, "pageSize", val);
			this.$set(this.page, "currentPage", 1);

			this.fetchData(this.formConfig.appCode, this.formConfig.code, this.page.currentPage, this.page.pageSize, this.data);
		}
		//表格高度resize
		private resize(width: number, height: number) {
			this.height = height - 80 + "px";
		}
		//排序
		private handleSortChange({ prop, order }: any) {
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
			let data = {
				...this.filterRule,
				matchRules: this.data?.matchRules,
			};
			this.fetchData(this.formConfig.appCode, this.formConfig.code, this.page.currentPage, this.page.pageSize, data);
		}
		private get listenChange() {
			const { matchRules } = this.data;
			return { matchRules, formConfig: this.formConfig };
		}
		@Watch("listenChange", { deep: true })
		onChangeFormConfig(n: TJson) {
			let data = {
				...this.filterRule,
				matchRules: this.data?.matchRules,
			};
			this.fetchData(this.$route.params.appCode, n.formConfig.code, this.page.currentPage, this.page.pageSize, data);
		}

		private async fetchData(appCode: string, code: string, currentPage: number, pageSize: number, data: TJson) {
			if (!code) {
				return;
			}
			if (this.formConfig.sourceType === "form") {
				getData(appCode, code, this.page.currentPage, this.page.pageSize, data).then((res: TResponse) => {
					let result: any = [];

					this.tableData = res.data.records || [];
					this.columnField = {};

					this.tableData.forEach((item: any) => {
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

					this.tableData = result;

					this.page.total = res.data.total * 1;
				});
			} else {
				//获取数据集数据
				let params = {
					datasetCode: this.formConfig.code,
					appCode: this.formConfig.appCode,
					type: this.formConfig.type,
					correspond: this.formConfig.correspond,
					datasetSql: this.formConfig.datasetSql,
					displaySql: this.formConfig.displaySql,
				};
				this.tableData = [];
				let { data } = await runSql(params, this.page.pageSize, this.page.currentPage);
				data.datasetData?.forEach((item: any) => {
					let obj: any = {};
					for (const key in item) {
						obj = {
							...obj,
							...item[key],
						};
						for (const k in obj) {
							if (typeof obj[k] == "string" && /^\[.*\]$/.test(obj[k])) {
								obj[k] = JSON.parse(obj[k]);
							} else {
								obj[k] = obj[k];
							}
						}
					}
					this.tableData.push(obj);
				});

				this.columnField = data.columnField;

				this.page.total = data.total * 1;
			}
		}
		protected mounted() {
			if (this.$route.params.id === "new") {
				this.tableData = tableDefaultData;
			}
			this.$nextTick(() => {
				this.resize(0, (<any>this).$parent.$el.offsetHeight);
			});
		}
		@Watch("pageSize", { immediate: true })
		onChangePageSize() {
			this.$set(this.page, "pageSize", this.pageSize);
		}
	}
</script>

<style lang="scss" scoped>
	@import "./_style/bi_table.scss";
</style>
