<template>
	<div class="table-design">
		<div class="autht-list">
			<el-button type="info" circle icon="el-icon-plus" @click="addAuthFlag = true"></el-button>
			<ul>
				<li v-for="item in authList" :key="item.id" @click="selectAuth(item.code, item.id)" :class="{ selectBg: selectBg == item.id }">
					<!-- <el-button type="primary" icon="el-icon-s-order"></el-button> -->
					<el-tooltip class="item" effect="dark" :content="item.name" placement="right" popper-class="auth-tool">
						<div>
							<span class="auth-del" @click.stop="authDel(item.code)">x</span>
							<i class="el-icon-s-order"></i>
						</div>
					</el-tooltip>
				</li>
			</ul>
		</div>
		<div class="index">
			<Header :jscode="jscode" :rightList="rightList" ref="Header" :parent="parent" :tableObj="tableObj" :queryList="getQueryList" :buttonList="getButtonList" @setRightList="setRightList" >
				<el-button size="small" class="jscode" @click="jsvisible = true">JS</el-button>
			</Header>
			<div class="container">
				<div class="design">
					<Query :getQueryList.sync="getQueryList" @newQueryList="newQueryList" :fieldId="fieldId">
						<div class="title" slot="top">
							<el-button plain type="primary" class="add-icon el-icon-plus" size="small" @click="handleAddQuery"> {{ $t("tableDesign.addQueryCriteria") }}</el-button>
						</div>
					</Query>
					<Table :getTabTitleList="getTabTitleList" :tableObj="tableObj" :pageSize="tableObj.pageSize" @confChange="confChange">
						<!-- 添加操作按钮 插槽 -->
						<template #top>
							<el-button plain type=" primary" size="small" class="add-icon el-icon-plus" @click="handleAddBtns"> {{ $t("tableDesign.handleButton") }}</el-button>

							<div class="hanlde-btns" v-if="getButtonList.length > 0">
								<div
									class="TD-formItem"
									:class="[fieldId == item.fieldId ? 'TD-on' : '']"
									@click="handleSelectItem(item)"
									v-for="(item, index) in getButtonList"
									:key="index"
									style="display: inline-block; padding: 5px; width: auto; margin-right: 10px"
								>
									<component :is="`TD${item.type}`" />
								</div>
							</div>
						</template>
					</Table>
				</div>
				<Attr
					:attrList.sync="attrConf"
					:toggle="toggle"
					:rightList.sync="rightList"
					:authList="authList"
					:authVal="authVal"
          :roleList="roleList"
					@confChange="confChange"
					:getTabTitleList="getTabTitleList"
					:key="attrConf.fieldId"
					:isProcess="isProcess"
          :isCustom="isCustom"
				></Attr>
			</div>
		</div>
		<rvue-drawer size="80%" :visible.sync="jsvisible" direction="ltr">
			<js-editor v-if="jsvisible" :value.sync="jscode"></js-editor>
		</rvue-drawer>
		<Dialog
			:visible.sync="dialogVisible"
			:checkList="checkList"
			:titleName="titleName"
			:allList="allList"
			@defineCheckList="defineCheckList"
			:config="[...getQueryList, ...getButtonList]"
		></Dialog>

		<rvue-dialog title="创建列表设计" :visible.sync="addAuthFlag" append-to-body custom-class="auth-dialog" center @close="canelAddAuth">
			<div slot="title" class="dialog-title">
				<div class="dialog-title-line"></div>
				<div class="dialog-title-font">创建列表设计</div>
			</div>
			<div class="auth-radio">
				<label style="margin-right: 45px">权限组类型</label>
				<rvue-radio v-model="addAuthType" label="1" border >自定义组</rvue-radio>
				<rvue-radio v-model="addAuthType" label="8" border :disabled="isGuest">访问者组</rvue-radio>
			</div>
			<div class="auth-input">
				<label>列表设计名称</label>
				<rvue-input placeholder="请输入列表设计名称"  v-model="authVal"></rvue-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<!-- :disabled="isGuest" :type="isGuest?'info plain':''" :style="{border:isGuest?'#ccc':'',color:isGuest?'#fff':''}"  -->
				<el-button size="mini" @click="canelAddAuth">{{ $t("linkDataDialog.cancel") }}</el-button>
        <el-button size="mini"  type="primary" style=" border:'#ccc' ; color: '#fff'" @click="addAuth">{{
					$t("crud.filter.submitBtn")
				}}</el-button>
				<!-- <el-button size="mini" :disabled="isGuest" :type="isGuest ? 'info plain' : 'primary'" :style="{ border: isGuest ? '#ccc' : '', color: isGuest ? '#fff' : '' }" @click="addAuth">{{
					$t("crud.filter.submitBtn")
				}}</el-button> -->
			</div>
		</rvue-dialog>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";
	import Header from "./headers";
	import Query from "./querys";
	import Table from "./tables";
	import Attr from "./attrs";
	import Dialog from "./components/dialogs";
	import { getFormSingle, getRightList, saveList, deleteRightList } from "@/api/form";
  import { queryAppDesignerList} from "@/api/tenant";
	import JsEditor from "@/components/jscode/jsEditor";
	import dataFilter from "@/core/dataFilter.ts";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import { refreshJump } from "@/utils/global";
	import { registerUpdateLifecycle } from "echarts";
	import { filter } from "jszip";

	@Component({
		components: {
			Header,
			Query,
			Table,
			Attr,
			Dialog,
			"js-editor": JsEditor,
		},
	})
	export default class TableDesigns extends Vue {
		@Provide("parent") parent = this;
		@Prop({ type: Object }) callbacks!: TJson;

		private fieldId = "";
		private jscode: string = "";
		private jsvisible: boolean = false;

		private AllFormList: any[] = []; //表单设计配置数组
		private allQueryList: any[] = []; //所有的查询数组
		private getQueryList: any[] = []; //选中的查询数组

		private jsplaceholder: string = `// export function didMount 包含上下文this 
// didMount 参数$(jquery 3.6.0)                       
export function didMount($){

}
                `;

		private allButtonList: any[] = [
			{
				type: "add",
				fieldId: "add",
				title: {
					zh: "新增",
					en: "add",
				},
			},
			{
				type: "delete",
				fieldId: "delete",
				title: {
					zh: "删除",
					en: "delete",
				},
			},
			{
				type: "printQrCode",
				fieldId: "printQrCode",
				title: {
					zh: "打印二维码",
					en: "print",
				},
			},
		]; //所有的按钮数组
		private getButtonList: any[] = []; //选中的按钮数组
		private allTabTitleList: any[] = []; //所有的表头数组
		private getTabTitleList: any[] = []; //选中的表头数组
		private tableObj: any = {}; //表格的配置对象
		private isProcess: boolean = false; //是否为流程表单
		private dialogVisible = false;
		private allList: any[] = [];
		private checkList: any[] = [];
		private rightList: any = {};
		private authList: any[] = [];
		private mode = "query";
		private flagContrast: boolean = true;
		private addAuthFlag: boolean = false;
		private addAuthType: string = "1";
		private authVal: string = "";
		private authCode: string = "";
		private isGuest: boolean = false;
		private selectBg: string = "";
		private toggle: boolean = false;
		private attrConf: any = {};
		private titleName = "";
    private isCustom = false
    private roleList:[] = []

		// beforeRouteLeave(to: any, from: any, next: any) {
		// 	let buttonNewList: any = [];
		// 	let tabNewList: any = [];
		// 	let queryNewList: any = [];
		// 	if (this.rightList.viewStructure) {
		// 		buttonNewList = this.rightList.viewStructure.buttonList;
		// 		tabNewList = this.rightList.viewStructure.tabList;
		// 		queryNewList = this.rightList.viewStructure.queryList;
		// 	}

		// 	let { tableHeader, ...opt } = tabNewList;
		// 	let { tableHeader: tableHeaders, ...opts } = this.tableObj;

		// 	let flag = this.ifCompare(opt, opts);

		// 	if (
		// 		flag &&
		// 		JSON.stringify(tableHeader) == JSON.stringify(tableHeaders) &&
		// 		JSON.stringify(buttonNewList) == JSON.stringify(this.getButtonList) &&
		// 		JSON.stringify(queryNewList) == JSON.stringify(this.getQueryList)
		// 	) {
		// 		next();
		// 		return;
		// 	}
		// 	this.$confirm((<any>this).$t("global.isSaveTablemDesign"), "", {
		// 		confirmButtonText: (<any>this).$t("global.confirm"),
		// 		cancelButtonText: (<any>this).$t("global.cancel"),
		// 		type: "warning",
		// 	})
		// 		.then(() => {
		// 			(<any>this).$refs.Header.saveHandle();
		// 			next();
		// 		})
		// 		.catch(() => {
		// 			next();
		// 		});
		// }

		@Watch("addAuthFlag", { immediate: true })
		private addAuthFlagChange(val: boolean) {
			let flag = this.authList.find((item: any) => item.type == "8");
      this.addAuthType = flag ? '1' :'8'
			this.isGuest = flag ? true : false;
		}
		private mounted() {
			let fullPath = this.$route.fullPath;
			let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd/"));
			let jumpPath = supPath + "appd/" + this.$route.params.appCode + "/p/";
			refreshJump(fullPath, this, jumpPath);
		}

		private confirm(cb: () => void = function () {}) {
			let buttonNewList: any = [];
			let tabNewList: any = [];
			let queryNewList: any = [];
			let jsCode: any = "";
			if (this.rightList.viewStructure) {
				buttonNewList = this.rightList.viewStructure.buttonList;
				tabNewList = this.rightList.viewStructure.tabList;
				queryNewList = this.rightList.viewStructure.queryList;
				jsCode = this.rightList.viewStructure.jscode;
			}

			let { tableHeader, ...opt } = tabNewList;
			let { tableHeader: tableHeaders, ...opts } = this.tableObj;

			let flag = this.ifCompare(opt, opts);

			if (
				flag &&
				JSON.stringify(tableHeader) == JSON.stringify(tableHeaders) &&
				JSON.stringify(buttonNewList) == JSON.stringify(this.getButtonList) &&
				JSON.stringify(queryNewList) == JSON.stringify(this.getQueryList) &&
				JSON.stringify(jsCode) == JSON.stringify(this.jscode)
			) {
				cb();
				return;
			}
			this.$confirm((<any>this).$t("global.isSaveTablemDesign"), "", {
				confirmButtonText: (<any>this).$t("global.confirm"),
				cancelButtonText: (<any>this).$t("global.cancel"),
				type: "warning",
			})
				.then(async () => {
					await (<any>this).$refs.Header.saveHandle("auth");
					cb();
					// Promise.resolve().then(()=>cb())
				})
				.catch(() => {
					cb();
				});
		}

		// 对象对比
		private ifCompare(object1: any, object2: any) {
			let o1keys = Object.keys(object1);
			let o2keys = Object.keys(object2);
			if (o2keys.length !== o1keys.length) return false;
			for (let i = 0; i <= o1keys.length - 1; i++) {
				let key = o1keys[i];
				if (!o2keys.includes(key)) return false;
				if (object2[key] !== object1[key]) return false;
			}
			return true;
		}

		// 双向绑定 查询数组
		private newQueryList(val: any) {
			this.getQueryList = val;
		}

		// 表头切换设置
		private setTableTitleList(arr: any) {
			this.getTabTitleList = arr;
			this.tableObj.tableHeader = (<any>this).getTabTitleList;
		}

		//不筛选重置所有表头
		private resetTitleList() {
			this.getTabTitleList = this.allTabTitleList;
		}

		//设置添加的参数
		private resetData(params: TJson) {
			let { mode, checkList, allList, titleName } = params;
			this.mode = mode;
			this.checkList = checkList;
			this.allList = allList;
			this.titleName = titleName;
			this.dialogVisible = true;
		}

		private setQueryData(params: TJson) {
			let { check, allList } = params;

			allList.forEach((item: any) => {
				let sameItem = this.getQueryList.map((item: any) => item.fieldId);
				let checkFlag = check.find((it: any) => item.fieldId == it.fieldId);
				let idx = sameItem.indexOf(item.fieldId);
				if (checkFlag && !sameItem.includes(checkFlag.fieldId)) {
					this.getQueryList.push(checkFlag);
				} else if (!checkFlag && idx > -1) {
					this.getQueryList.splice(idx, 1);
				}
			});

			this.allQueryList = allList;
		}

		private setButtonData(params: TJson) {
			let { check, allList } = params;
			this.getButtonList = check;
			this.allButtonList = allList;
		}

		private setTableData(params: TJson) {
			let { check, allList } = params;
			let sameItem = this.getTabTitleList.map((item: any) => item.fieldId);
			let cloneGetTabTitleList = this.$utils.deepClone(this.getTabTitleList);

			allList.forEach((item: any) => {
				let checkFlag = check.find((it: any) => it.fieldId == item.fieldId);
				let idx = sameItem.indexOf(item.fieldId);
				if (checkFlag && !sameItem.includes(checkFlag.fieldId)) {
					cloneGetTabTitleList.push(checkFlag);
				} else if (!checkFlag && idx > -1) {
					cloneGetTabTitleList.splice(idx, 1, "1");
				}
			});
			this.getTabTitleList = cloneGetTabTitleList.filter((item: any) => item != "1");
			this.allTabTitleList = allList;
		}

		// 添加查询条件 按钮
		private handleAddQuery() {
			this.resetData({
				mode: "setQueryData",
				checkList: this.getQueryList,
				allList: this.allQueryList,
				titleName: "addQueryCriteria",
			});
		}

		//添加操作按钮
		private handleAddBtns() {
			this.resetData({
				mode: "setButtonData",
				checkList: this.getButtonList,
				allList: this.allButtonList,
				titleName: "handleButton",
			});
		}

		private handleAddTable() {
			this.resetData({
				mode: "setTableData",
				checkList: this.getTabTitleList,
				allList: this.allTabTitleList,
			});
		}

		// 筛选出当前选中模块的id和配置
		private filterConfig(conf: TJson) {
      if(!conf) return
			this.fieldId = conf.fieldId;
			this.attrConf = conf;
		}

		//按钮触发事件
		private handleSelectItem(conf: TJson) {
			this.filterConfig(conf);
		}

		// 联动表格的配置
		private confChange(val: any) {
			this.tableObj = {
				pageSize: val.pageSize,
				sortOrder: val.sortOrder,
				sortCondition: val.sortCondition,
				headerFilter: val.headerFilter,
				tableHeader: this.tableObj.tableHeader,
			};
		}

		// 公共封装  点击dialog确认按钮 获取对应的选中数组
		private defineCheckList(val: any) {
			let mode = this.mode;
			(<any>this)[mode](val);
		}

		private async getFormSingle(appCode: string, formCode: string, authCode: string) {
			let { data, code } = await getFormSingle(appCode, formCode);
			if (code == "0") {
				this.isProcess = data.type == "F" ? true : false;
				this.AllFormList = data.structure;
				let { code: rCode, data: rData } = await getRightList({ formCode });
				this.authList = rData;
				this.authList = this.authList.filter((item: any) => {
					return item.type != "0";
				});
				// 当没有访问者组时，新建设计 默认选择访问者组
				let visitFlag = this.authList.find((item: any) => item.type == "8");
				if (!visitFlag) {
					this.addAuthType = "8";
				}

				if (authCode == "default") {
					this.rightList = this.authList.find((item: any) => item.type == "9");
				} else {
					this.rightList = this.authList.find((item: any) => item.code == authCode);
				}

				this.jscode = this.rightList?.viewStructure?.jscode || "";

				this.authCode = this.rightList.code;

				// 过滤筛选数据结构
				let { fCAll, newFormData, newQueryData } = dataFilter(this.AllFormList, this.rightList.viewStructure, this.isProcess);

				this.allQueryList = fCAll
					.filter((item: Record<string, any>) => item.type)
					.map((item: any) => {
						let defConf = (<TJson>RfieldCore.ins().createField(item, "query")).config;
						defConf.title = item.title;
						item.dicData && (defConf.dicData = item.dicData);
						item.parentId && (defConf.parentId = item.parentId);
						return defConf;
					});
				this.allTabTitleList = newFormData.map((item: any) => {
					let obj =
						item.type == "number"
							? {
									numFormat: item.numFormat,
									type: item.type,
									title: item.title,
									fieldId: item.fieldId,
							  }
							: {
									type: item.type,
									title: item.title,
									fieldId: item.fieldId,
							  };
					return obj;
				});

				// 初始化设置表头
				this.confChange(newQueryData.tableList);
				this.setTableTitleList(newQueryData.tableList.tableHeader);
				//  console.log(this.allTabTitleList);

				this.getQueryList = newQueryData.queryList;
				this.getButtonList = newQueryData.buttonList;
				this.selectBg = this.rightList.id;
        this.isCustom = this.rightList.type != '1' ? true :false

        !this.isCustom && this.getroleOptions()
			}
		}
		private async setRightList(data: any) {      
			let { appCode, id: formCode } = this.$route.params;
		  await	this.getFormSingle(appCode, formCode, this.authCode);
      this.filterConfig([...this.getButtonList,...this.getQueryList].find((item:any)=>item.fieldId == this.fieldId) )
		}

    //查找角色组
    private async getroleOptions(){
      let { data } = await queryAppDesignerList(this.$route.params.appCode , '1')
      this.roleList = data
    }

		//添加权限组
		private addAuth() {
			if (this.authVal.trim() == "") {
				this.$message.error("请输入完整");
				return;
			}
			this.confirm(() => {
				let { formCode } = this.rightList;
				saveList({
					formCode,
					name: this.authVal,
					perms: [],
					type: this.addAuthType,
				}).then((res: any) => {
					let { data } = res;
					this.addAuthFlag = false;
					this.authVal = "";
					this.addAuthType = "99";
					let { appCode } = this.$route.params;

					this.getFormSingle(appCode, formCode, data.code);
				});
			});
		}

		//取消添加权限组
		private canelAddAuth() {
			this.addAuthFlag = false;
			this.authVal = "";
		}

		//删除权限组
		private async authDel(code: string) {
			let { appCode, id: formCode } = this.$route.params;
			let flag = this.authList.find((item: any) => item.type == "9");
			if (flag.code == code) {
				this.$message.error("不能删除所有人组");
			} else {
				this.$confirm("是否确定删除此权限组?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						deleteRightList({ formCode, code: code }).then((res: any) => {
							if (res.code == "0") {
								this.$message.success("删除成功");
								this.addAuthType = "8";
								this.getFormSingle(appCode, formCode, "default");
							} else {
								this.$message.error("删除失败");
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			}
		}

		//选择权限组
		private selectAuth(code: string, id: string) {
			if (this.rightList.id == id) {
				return;
			}
			this.toggle = !this.toggle;
			this.confirm(() => {
				let { appCode, id: formCode } = this.$route.params;
				this.selectBg = id;
				this.attrConf = {};
				this.getFormSingle(appCode, formCode, code);
			});
		}

		protected created() {
			let { appCode, id: formCode } = this.$route.params;
			this.getFormSingle(appCode, formCode, "default");
			this.callbacks["tab"] = this.confirm;
		}
	}
</script>
<style lang="scss" scoped>
	@import "./styles/index.scss";
</style>
