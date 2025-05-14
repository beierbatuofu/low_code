<template>
	<div>
		<div class="form-title">{{ formName }}</div>
		<template>
			<div calss="search-form-box">
				<!--查询-->
				<el-form ref="searchForm" :model="searchForm" label-width="120px" class="search-form-item" v-if="allData.viewStructure && allData.viewStructure.queryList.length > 0">
					<el-row :gutter="15">
						<template v-for="(column, cindex) in allData.viewStructure.queryList">
							<el-col v-if="column.visible" class="search-form-col" :span="8" :key="cindex" style="display: inline-block; float: none; vertical-align: top">
								<el-form-item :prop="column.prop" :label="column | getLang">
									<component
										@input="(val) => $set(searchForm, column.prop, val)"
										@update="(val) => handlerUpdate(column.prop, val)"
										@change="(val) => $set(searchForm, column.prop, val)"
										:is="getComponent(column.type, column.component, column)"
										:config="column"
										:form="searchForm"
										mode="query"
										:prop="column.prop"
									></component>
								</el-form-item>
							</el-col>
						</template>
					</el-row>
					<el-row :gutter="10" class="search-form-btns">
						<el-col :span="8" :offset="8">
							<el-form-item>
								<el-button size="mini" type="primary" @click="bindSearchForm()">{{ $t("global.search") }}</el-button>
								<el-button size="mini" @click="resetForm()">{{ $t("global.reset") }}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
				<!--查询 end-->
			</div>
			<div class="table-box">
				<div v-if="allData.viewStructure && allData.viewStructure.tabList[0].checkListTb.length > 0">
					<el-row :gutter="10">
						<el-col :span="6" style="padding: 15px">
							<el-button type="primary" size="small" icon="el-icon-plus" @click="addTableList">
								{{ $t("global.add") }}
							</el-button>
						</el-col>
					</el-row>
				</div>
				<!-- 按钮 end -->

				<!--表格-->
				<el-table
					:data="data"
					class="form-data"
					:default-sort="{
						prop: tabSelect,
						order: tabRadio == 1 ? 'ascending' : 'tabRadio',
					}"
					@row-click="openDetails"
					@sort-change="sortChange"
					v-if="allData.viewStructure && allData.viewStructure.tabList[0].checkListTb.length > 0"
				>
					<el-table-column type="selection" fixed width="50" align="center"> </el-table-column>

					<!-- <el-table-column width="100" label="编号" prop="id" align="center">
					</el-table-column> -->
					<el-table-column
						v-for="(col, index) in allData.viewStructure.tabList[0].checkListTb"
						:key="index"
						align="center"
						class-name="form-data-cell"
						:sortable="sortList.indexOf(col.prop) >= 0 ? true : false"
						:label="col | getLang"
						width="200"
					>
						<template slot-scope="scope">
							<div v-if="!Array.isArray(scope.row[col.prop])">
								<span v-if="(col.prop == 'creater' || col.prop == 'updater') && scope.row[col.prop]">
									{{ scope.row[col.prop]["name"] || "" }}
								</span>
								<span v-else-if="col.type == 'process_status' && scope.row[col.prop] != null">
									<!-- 进行中 -->
									<span v-if="scope.row[col.prop] == 0">
										{{ $t("flow.doing") }}
									</span>
									<span v-if="scope.row[col.prop] == 1">
										{{ $t("flow.flowSuccess") }}
									</span>
									<span v-if="scope.row[col.prop] == 2">
										{{ $t("flow.flowFail") }}
									</span>
									<span v-if="scope.row[col.prop] == 8">
										{{ $t("flow.stopFlow") }}
									</span>
									<!-- <span v-if="scope.row[col.prop] == 9">
										{{ $t("flow.draft") }}
									</span> -->
								</span>
								<span v-else-if="!aHideTh.includes(col.type)" v-bind="{ type: col.type }"> {{ dataConver(scope.row, col.prop) }} </span>
							</div>
							<div v-if="Array.isArray(scope.row[col.prop])">
								<div v-for="(item, index) of scope.row[col.prop]" :key="index">
									{{ item.name || item }}
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<!--表格 end-->
				<!-- 页码 -->
				<div class="block" v-if="allData.viewStructure && allData.viewStructure.tabList[0].checkListTb.length > 0">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="page.currentPage"
						:page-sizes="page.pageSizes"
						:page-size="page.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="page.total"
					>
					</el-pagination>
				</div>
				<!-- 页码 end-->
				<!-- 无数据 -->
				<div v-if="!allData.viewStructure || allData.viewStructure.tabList[0].checkListTb.length == 0" style="text-align: center; font-size: 12px; color: #999">
					{{ $t("global.noData") }}
				</div>
				<!-- 无数据 end-->
			</div>
		</template>
		<FlowDialog
			@updateTable="updateTable"
			:formCode="curFormCode"
			:dataId="dataId"
			:visible.sync="visible"
			:detail="detail"
			:flowType="flowType"
			:nodeDetail="nodeDetail"
			:processStatus="processStatus"
			:noSameValList="noSameValList"
			:dateTimePropList="dateTimePropList"
		/>

		<AddListDialog
			v-if="allData.viewStructure"
			:addDialog.sync="addDialogVisible"
			:columnConfig="option"
			:appCode="appCode"
			:flowType="flowType"
			:formCode="curFormCode"
			:formName="formName"
			@updateTable="updateTable"
		/>
	</div>
</template>

<script>
	import { FormModule } from "@/store/modules/form";
	import { getFormSingle, getData, saveData, updateData } from "@/api/form";
	import FormRelationEvent from "@/utils/form/FormRelationEvent";
	import FlowDialog from "../flowcenter/_components/flowDialog";
	import FormTemp from "@/components/rvue/custom/components/formTemp.vue"; //根据type 解析成对应的input、radio、select……
	import { testDetail, getNodeDetail, postAllData } from "@/api/flowcenter";
	import AddListDialog from "./addListDialog";
	import { getRightList } from "@/api/form";
	import { defaultViewStructure } from "../app/_core/defaultJson.ts";
	import Datetime from "@/core/Datetime";

	export default {
		name: "FormData",
		components: {
			FlowDialog,
			AddListDialog,
			FormTemp,
		},
		data() {
			return {
				aHideTh: ["separator", "table", "uploadFile"],
				appCode: this.$route.params.appCode,
				search: {},
				page: { currentPage: 1, pageSize: 10, pageSizes: [5, 10, 20, 50] },
				params: {},
				loading: false,
				data: [],
				option: {
					column: FormModule.form.options && FormModule.form.options.column,
				},
				slots: [],
				visible: false,
				dataId: "",
				detail: {},
				nodeDetail: [],
				searchForm: {
					create_time: [],
				},
				addDialogVisible: false,
				searchData: [], //应该是用不到了
				allData: {
					viewStructure: null,
				},
				random: 0, //随机数，用于重置组件
				tabRadio: "", //1升序    2降序
				tabSelect: "",
				oAllData: {},
				formCodeId: "",
				processStatus: -1,
				sortList: "",
				noSameValList: [],
				sysQuery: {
					createTimeBegin: "",
					createTimeEnd: "",
					creater: "",
					processStatus: "",
				},
				dateTimePropList: [],
				reloadForm: true,
			};
		},
		// props: ["flowType", "formName", "load"],
		props: {
			flowType: String,
			formName: String,
			loadData: {
				type: Boolean,
				default: false,
			},
		},
		watch: {
			flowType() {
				this.flowType = this.flowType;
			},
			loadData() {
				return this.loadData;
			},
		},
		computed: {
			curFormCode() {
				return this.$route.params.formCode;
			},
		},
		filters: {
			presentText(arr) {
				if (!arr) return "";
				let temp = [];
				arr.forEach((item) => {
					temp.push(item.name || item);
				});
				return String(temp);
			},
		},
		methods: {
			handlerUpdate(prop, value) {
				if (prop == "create_time") {
					this.searchForm["create_time"] = value;
					this.$forceUpdate();
				} else {
					this.$set(this.searchForm, prop, value);
				}
			},
			//动态组件
			getComponent(type, component, column) {
				if (component) return component;
				return `rfield-${type}`;
			},
			//
			sortChange(column, prop, order) {
				// console.log("排序", column, prop, order);
				this.allData.viewStructure.tabList[0].sequenceData.some((item) => {
					if (column.column.label == item.label) {
						this.tabSelect = item.value;
					}
				});

				this.tabRadio = this.tabRadio == 1 ? 2 : 1;
				this.getList([], "", false);
			},
			addTableList() {
				//点击新增
				this.addDialogVisible = true;
			},
			//重置表单
			resetForm() {
				//重置查询条件
				this.reloadForm = false;
				for (let key in this.sysQuery) {
					this.sysQuery[key] = "";
				}
				for (let key in this.searchForm) {
					let itemM = this.oAllData.viewStructure.queryList.find((item) => {
						return item.prop == key;
					});
					switch (Object.prototype.toString.call(itemM.value.custom).slice(8, -1).toLowerCase()) {
						case "object":
							this.searchForm[key] = this.$utils.deepClone(itemM.value.custom);

							break;
						case "array":
							this.searchForm[key] = itemM.value.custom.concat();
							break;
						default:
							this.searchForm[key] = itemM.value.hasOwnProperty("custom") ? itemM.value.custom : itemM.value;
							break;
					}
				}
				this.aHideTh.forEach((item) => {
					this.deleteItem(item, this.allData.viewStructure.tabList[0].checkListTb);
				});
			},
			//查询提交
			bindSearchForm() {
				// 处理查询条件--cc新增空value清空key
				// console.log("原始查询条件=>", this.searchForm);
				let matchRules = [];
				for (let key in this.searchForm) {
					let isArr = Array.isArray(this.searchForm[key]);

					let itemM = this.allData.viewStructure.queryList.filter((item) => {
						return item.prop == key;
					});
					itemM.some((ite) => {
						if (ite.prop == "process_status") {
							ite.dicData.some((it) => {
								if (it.label == this.searchForm[key]) {
									this.searchForm[key] = it.value;
								}
							});
							this.sysQuery["processStatus"] = this.searchForm[key];
						} else if (ite.prop == "create_time") {
							if (Array.isArray(this.searchForm[key])) {
								this.sysQuery["createTimeBegin"] = this.searchForm["create_time"][0];
								this.sysQuery["createTimeEnd"] = this.searchForm["create_time"][1];
							} else {
								// this.sysQuery["createTimeBegin"] = this.searchForm[key];
								// this.sysQuery["createTimeEnd"] = this.searchForm[key];
							}
						} else if (ite.prop == "creater") {
							this.sysQuery["creater"] = this.searchForm["creater"][0] ? this.searchForm["creater"][0]["id"] : "";
						} else if (ite.prop == "update_time") {
							this.sysQuery["update_time"] = this.searchForm[key];
						}
					});

					let judgeValues = isArr ? this.getArrayId(this.searchForm[key]) : [this.searchForm[key]];

					//TODO number字段 大小转换
					if (itemM[0]?.type == "number" && itemM[0]?.method == "between") {
						let { max, min } = judgeValues[0];

						let nMinValue = Math.min(max, min);
						let nMaxValue = Math.max(max, min);
						judgeValues = nMinValue && nMinValue ? [nMinValue, nMaxValue] : [];
						this.searchForm[key].min = isNaN(nMinValue) ? "undefined" : nMinValue;
						this.searchForm[key].max = isNaN(nMaxValue) ? "undefined" : nMaxValue;
					}

					let obj = {
						dataType: 0,
						targetFieldCode: key,
						targetFieldName: "",
						judgeValues,
						method: itemM[0]?.method || "",
						type: itemM[0]?.type || "",
					};
					let sysQuery = ["process_status", "creater", "create_time", "update_time"];
					if (this.searchForm[key] && this.searchForm[key].length !== 0 && !sysQuery.includes(obj.type)) {
						matchRules.push(obj);
					}
				}

				console.log("查询条件=>", matchRules);
				this.getList(matchRules, "search");
			},
			//页码改变;
			handleSizeChange(val) {
				this.page.currentPage = 1;
				this.page.pageSize = val;
				this.getList([], "", true, val);
			},
			//目标页码改变
			handleCurrentChange(val) {
				//改变表格page
				this.page.currentPage = val;
				this.getList();
			},
			//打开详情页
			openDetails(row) {
				//点击表格行
				// console.log("row", row);
				this.processStatus = row.process_status;
				this.dataId = row.id;
				this.getTest();
			},
			updateTable() {
				//   更新表格数据
				this.getList();
				this.resetForm();
			},
			getTest() {
				testDetail(this.curFormCode, this.dataId).then((resp) => {
					this.noSameValList = [];
					this.detail = { ...resp.data, dataId: this.dataId };
					this.detail.form.structure.column.forEach((item) => {
						if (item.hasOwnProperty("noSameVal")) {
							this.noSameValList.push(item.prop);
						}
					});

					this.visible = true;

					// console.log("noSameValList==>", this.noSameValList);
				});
				if (this.flowType == "F") {
					//流程表单才有节点信息
					getNodeDetail({
						formCode: this.curFormCode,
						dataId: this.dataId,
					}).then((res) => {
						if (res.code == 0) {
							this.nodeDetail = res.data;
						}
					});
				}
			},
			//获取表格数据
			getList(filter = [], from = "", setSort = true, pageSize) {
				// 获取数据

				this.loading = true;
				console.log(1);
				filter = {
					isDeleted: false,
					matchRules: [filter],
					processStatus: this.processStatus,
					sorts: [
						{
							asc: this.tabRadio == 1 ? true : false,
							column: this.tabSelect == "replaceDate" ? "update_time" : this.tabSelect,
						},
					],
					...this.sysQuery,
				};
				if (!this.$route.params.formCode) {
					return;
				}
				getData(this.appCode, this.$route.params.formCode, this.page.currentPage, this.page.pageSize, filter)
					.then((res) => {
						let result = [];

						this.data = res.data.records || [];

						this.data.forEach((item) => {
							let o = {};
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

						let list = ["separator", "table", "uploadFile"]; //不显示分割线，子表格，上传附件
						list.forEach((item) => {
							this.deleteItem(item, this.allData.viewStructure.tabList[0].checkListTb);
						});
						this.page.total = +res.data.total;
						this.loading = false;
					})
					.catch((err) => {
						console.log(err.msg);
						// this.$message.error();
					});
			},
			//获取表单设计配置
			getFormStructrue() {
				//获取json解构
				let that = this;
				this.loading = true;
				getFormSingle(this.appCode, this.curFormCode).then((res) => {
					if (res.data == null) return;
					console.log(res.data, "redda.data");

					const options = res.data.structure;
					if (options && options.column) {
						this.slots = options.column;
					}

					if (options && options.relation) {
						let appCode = this.appCode;
						let formCode = this.curFormCode;
						const formRelationEvent = new FormRelationEvent(
							appCode,
							formCode,
							// 表单关联规则数据
							options.relation,
							// 在请求数据后会回调这个方法
							(resp, formRelations) => {
								if (resp.code === "0") {
									let row = resp.data;
									Reflect.ownKeys(row).forEach((key) => row[key] && (row[key] = row[key][0]));
									that.form = row;
								}
							},
							// 这个方法是用来取表单值的
							(fieldCodes) => {
								const json = {};
								fieldCodes.forEach((v) => {
									json[v] = that.form[v];
								});
								return json;
							}
						);
						options.column = options.column.map((column) => {
							function a() {
								formRelationEvent.excuteEvent(column.prop);
							}
							column["blur"] = a;
							return column;
						});
					}

					this.option = {
						column: options && options.column,
					};

					if (this.allData.viewStructure == null) {
						let str = "input,number,datetime,select,radio"; //手动添加排序字段
						// console.log("column==>", this.option.column);
						this.allData.viewStructure = JSON.parse(JSON.stringify(defaultViewStructure(this.flowType)));

						this.allData.viewStructure.tabList[0].checkListTb = [...this.option.column, ...this.allData.viewStructure.tabList[0].checkListTb];

						this.oAllData = JSON.parse(JSON.stringify(this.allData));
						this.allData.viewStructure.tabList[0].sequenceData.forEach((item) => {
							this.sortList += item.value + ",";
						});
						this.allData.viewStructure.tabList[0].checkListTb.forEach((ite) => {
							if (str.indexOf(ite.type) >= 0) {
								this.sortList += ite.prop + ",";
							}
						});
						let list = ["separator", "table", "uploadFile"]; //不显示分割线，子表格，上传附件
						list.forEach((item) => {
							this.deleteItem(item, this.allData.viewStructure.tabList[0].checkListTb);
						});
					} else {
						// 配置 queryList删除
						let arrQuery = [];
						this.allData.viewStructure.queryList
							.filter((itd) => {
								if (/\d/.test(itd.prop)) {
									return itd;
								}
							})
							.forEach((item) => {
								let testQuery = this.slots.find((it) => it.prop == item.prop);
								!testQuery && arrQuery.push(item);
							});

						if (arrQuery.length > 0) {
							let mapArrQuery = arrQuery.map((item) => item.prop);
							this.allData.viewStructure.queryList = this.allData.viewStructure.queryList.filter((item) => !mapArrQuery.includes(item.prop));
						}

						// 配置 TableList删除
						let arrTable = [];
						this.allData.viewStructure.tabList[0].checkListTb
							.filter((itd) => {
								if (/\d/.test(itd.prop)) {
									return itd;
								}
							})
							.forEach((item) => {
								let testTable = this.slots.find((it) => it.prop == item.prop);
								!testTable && arrTable.push(item);
							});

						if (arrTable.length > 0) {
							let mapArrTable = arrTable.map((item) => item.prop);
							this.allData.viewStructure.tabList[0].checkListTb = this.allData.viewStructure.tabList[0].checkListTb.filter((item) => !mapArrTable.includes(item.prop));
							this.allData.viewStructure.upQueryList = this.allData.viewStructure.upQueryList.filter((item) => !mapArrTable.includes(item.prop));
						}

						//配置新增
						let newupQueryList = this.allData.viewStructure.upQueryList?.filter((item) => {
							if (/\d/.test(item.prop)) {
								return item;
							}
						});

						let addList = [];
						this.slots
							.filter((item) => {
								if (/\d/.test(item.prop) && item.type != "uploadFile" && item.type != "table" && item.type != "separator") {
									return item;
								}
							})
							.forEach((itd) => {
								let newList = newupQueryList.find((it) => it.prop == itd.prop);
								!newList && addList.push(itd);
							});
						if (addList.length > 0) {
							// 过滤系统字段
							let newSystemList = this.allData.viewStructure.tabList[0].checkListTb?.filter((item) => {
								if (!/\d/.test(item.prop)) {
									return item;
								}
							});
							this.allData.viewStructure.tabList[0].checkListTb = [...this.slots, ...newSystemList];
						}

						// 修改配置名称
						this.allData.viewStructure.tabList[0].checkListTb.forEach((item) => {
							this.option.column.forEach((it) => {
								if (item.prop == it.prop) {
									if (it.title.zh != item.title.zh || it.title.en != item.title.en) {
										item.title.zh = it.title.zh;
										item.title.en = it.title.en;
									}
								}
							});
						});

						this.allData.viewStructure.queryList.forEach((item) => {
							this.option.column.forEach((it) => {
								if (item.prop == it.prop) {
									if (it.title.zh != item.title.zh || it.title.en != item.title.en) {
										item.title.zh = it.title.zh;
										item.title.en = it.title.en;
									}
								}
							});
						});

						if (this.allData?.viewStructure) {
							this.page.pageSizes = [];
							this.allData.viewStructure.tabList[0].pageData.forEach((item) => {
								this.page.pageSizes.push(Number(item.value));
							});

							//传入pageSize 区分使用初始值还是页码修改后的值
							this.page.pageSize = Number(this.allData.viewStructure.tabList[0].pageSelect);

							//手动点击排序返回的还是这个
							// setSort && (this.tabRadio = this.allData.viewStructure.tabList[0].tabRadio);
							// setSort && (this.tabSelect = this.allData.viewStructure.tabList[0].tabSelect);
							this.tabRadio = this.allData.viewStructure.tabList[0].tabRadio;
							this.tabSelect = this.allData.viewStructure.tabList[0].tabSelect;
						}

						let list = ["separator", "table", "uploadFile"]; //不显示分割线，子表格，上传附件
						list.forEach((item) => {
							this.deleteItem(item, this.allData.viewStructure.tabList[0].checkListTb);
						});
						this.allData.viewStructure.queryList.forEach((item) => {
							//搜索条件赋默认值
							if (item.type == "create_time") {
								this.searchForm["create_time"] = item.value.custom ? item.value.custom : item.value.range;
							} else if (item.type == "creater" && this.searchForm[item.prop].length == 0) {
								//提交人没有就等于当前的人
								// this.$set(this.searchForm[item.prop], 0, {
								// 	avatar: this.$store.state.user.userInfo.avatar,
								// 	dtUserId: this.$store.state.user.userInfo.userId,
								// 	id: this.$store.state.user.userInfo.id,
								// 	name: this.$store.state.user.userInfo.userName,
								// 	type: "2",
								// });
							} else if (item.type == "radio" || item.type == "select") {
								this.$set(this.searchForm, item.prop, this.searchForm[item.prop].custom || "");
							} else {
								this.searchForm[item.prop] = item.value.custom ?? item.value;
							}

							console.log(item, "searchForm", this.searchForm);
						});

						this.allData.viewStructure.tabList[0].checkListTb.forEach((item) => {
							//如果datetime为空字符串，则赋值为null
							if (item.type == "datetime") {
								this.dateTimePropList.push(item.prop);
							}
						});
					}

					this.getList();
					this.loading = false;
				});
			},
			//删除对应数组元素
			deleteItem(key, arr) {
				for (let i = 0; i < arr.length; i++) {
					if (key == arr[i].type) {
						arr.splice(i, 1);
						this.deleteItem(key, arr);
						break;
					}
				}
				// console.log(arr);
				return arr;
			},

			//获取列表设计配置
			getAllData() {
				let { formCode } = this.$route.params;

				postAllData(formCode).then((resp) => {
					if (resp.code == "0") {
						if (resp.data && resp.data.viewStructure) {
							console.log(resp.data.viewStructure, "resp.data.viewStructure");
							this.allData = resp.data;

							//TODO

							this.oAllData = this.$utils.deepClone(this.allData);
							this.allData.viewStructure.tabList[0].sequenceData.forEach((item) => {
								this.sortList += item.value + ",";
							});
						} else {
							this.allData = {
								viewStructure: null,
							};
						}

						this.getFormStructrue();
					}
				});
			},
			getArrayId(arr) {
				if (arr.length > 0 && arr[0].id && arr[0].id.length > 0) {
					arr = arr.map((item) => {
						return item.id;
					});
				}
				return arr;
			},
			findColField(prop) {
				let field = {};
				const recursion = (list) => {
					list &&
						list.some((item) => {
							if (item.children && item.children.length) {
								recursion(item.children);
							}
							if (item.prop == prop) {
								field = item;
								return true;
							}
						});
				};

				recursion(this.option.column);
				return field;
			},
			dataConver(row, prop) {
				let config = this.findColField(prop);
				let { type } = config;
				// console.log(row, type, prop);

				if (type == "number") {
					let { numFormat } = config;
					let num = row[prop];
					let decimalDigitsNum = numFormat.allowDecimalDigits ? numFormat.decimalDigitsNum : 0;
					let val = num ? Number(num).toFixed(decimalDigitsNum) : num;
					return val;
				} else if (type == "datetime") {
					let { dateFormat } = config;
					let date = row[prop];
					let newDate = Datetime.convert(date, dateFormat.format);
					return newDate;
				}
				return row[prop];
			},
		},
		watch: {
			$route: {
				handler: async function () {
					await this.getAllData(this.$route.params.formCode);
					// await this.getList();
					// this.searchForm = {};
					// this.sysQuery = {
					// 	createTimeBegin: "",
					// 	createTimeEnd: "",
					// 	creater: "",
					// 	processStatus: "",
					// };
				},
				immediate: true,
			},
		},
	};
</script>
<style lang="scss" scoped>
	.form-title {
		min-height: 42px;
		line-height: 42px;
		font-size: 22px;
		color: #333;
		max-width: 400px;
		font-weight: 700;
		padding-bottom: 15px;
		@include ExtraNotDisplayed();
	}
	.search-form-col {
		max-width: 400px;
	}
	.el-form-item__label {
		@include ExtraNotDisplayed();
	}
	.block {
		text-align: center;
		padding-top: 15px;
	}
	.form-data {
		div::-webkit-scrollbar {
			width: 100% !important;
			height: 10px;
		}
		div::-webkit-scrollbar-thumb {
			@include GlobalAvatar(null, null, 10px, #c0c4cc);
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			// border-radius: 10px;
			// background-color: #c0c4cc !important;
		}
	}
	.form-data-cell {
		width: 200px;
		@include ExtraNotDisplayed();
		& * {
			width: auto;
			@include ExtraNotDisplayed();
		}
	}
	.table-box {
		tr,
		td,
		th {
			font-weight: 500 !important;
			color: #000;
			padding: 10px 0;
		}
		th {
			border-top: 1px solid #e5e5e5;
			background-color: #f8f8f9;
			.cell {
				font-weight: 700;
				color: #808185;
			}
		}
		tr:nth-child(even) {
			// background: #f1f1f1 !important;
		}
	}
</style>

<style lang="scss" scoped>
	::v-deep .search-form-item {
		.el-form-item {
			.el-form-item__label {
				font-weight: 700;
				max-width: 110px;
				@include ExtraNotDisplayed();
			}
		}
	}

	::v-deep .el-table th > .cell {
		text-overflow: ellipsis !important;
		white-space: nowrap !important;
	}
</style>
