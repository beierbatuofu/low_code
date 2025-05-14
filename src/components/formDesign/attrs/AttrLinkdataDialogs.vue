<template>
	<rvue-dialog width="800px" :visible="visible" :modal="true" @close="$emit('close')">
		<!-- 头部 -->
		<div slot="title" class="dialog-title">
			<div class="dialog-title-font">{{ $l("formDesign.relation") }}</div>
			<div class="changMode" @click="changeMode">
				<span class="el-icon-sort"></span>
				<span>
					<span v-if="modeFlag">切换至高级模式</span>
					<span v-else>切换至普通模式</span>
				</span>
			</div>
		</div>

		<div class="wrap">
			<div class="part">
				<el-row :span="24" :gutter="10">
					<el-col :span="12">
						<!-- 应用选择 -->
						<RelationSelect
							:key="form.targetAppCode"
							:filterable="true"
							:val.sync="form.targetAppCode"
							:placeholder="$t('linkDataDialog.pleaseApp')"
							:options="appList"
							@change="getMenuList"
						></RelationSelect>
					</el-col>
					<el-col :span="12">
						<!-- 表单选择 -->
						<RelationSelect
							:key="form.targetFormCode"
							:val.sync="form.targetFormCode"
							:placeholder="$t('linkDataDialog.pleaseForm')"
							:options="menuList"
							@change="getStructrue"
							:filterable="true"
						></RelationSelect>
					</el-col>
				</el-row>
			</div>

			<!-- 联动条件 -->
			<p class="title">{{ $t("linkDataDialog.title2") }}</p>

			<matchRulesComp
				ref="matchRulesComp"
				:key="+new Date()"
				:modeFlag="modeFlag"
				:configlist="targetList"
				@change="matchChange"
				:matchRules="matchRules"
				:currentList="currentList"
			></matchRulesComp>

			<!-- 联动赋值 -->
			<div class="link-valuation">
				<p class="title">{{ $t("linkDataDialog.title3") }}</p>
				<el-row :span="24" :gutter="10">
					<el-col :span="2" style="line-height: 40px; text-align: center; font-size: 14px; font-weight: 600; color: #000">
						{{ $t("linkDataDialog.will") }}
					</el-col>

					<el-col :span="8">
						<RelationSelect
							:key="form.targetField"
							:val.sync="form.targetField"
							@change="getTableChild"
							:placeholder="$t('linkDataDialog.targetField')"
							:options="linkList"
						></RelationSelect>
					</el-col>
					<el-col :span="4" style="line-height: 40px; text-align: center; font-size: 14px; font-weight: 600; color: #000">
						{{ $t("linkDataDialog.assignTo") }}
					</el-col>
					<el-col :span="8">
						<el-input readonly disabled v-model="dataTitle"></el-input>
					</el-col>
				</el-row>
			</div>

			<!-- 子字段关联赋值 -->
			<div class="set-subfield" v-if="data.type == 'table'">
				<p class="title">{{ $t("linkDataDialog.title4") }}</p>
				<el-button size="small" @click="sonVisible = form.targetField ? true : false"> {{ $t("linkDataDialog.clickSettings") }} </el-button>
				<rvue-dialog append-to-body width="800px" :visible.sync="sonVisible" v-if="sonVisible">
					<div slot="title" class="dialog-title">
						<div class="dialog-title-line"></div>
						<div class="dialog-title-font">子字段关联设置</div>
					</div>
					<div v-for="item in sonTargetList" :key="item.fieldId" style="margin-bottom: 20px">
						<el-row :span="24" :gutter="10">
							<el-col :span="11">
								<RelationSelect
									:val.sync="form.subFieldMap[item.fieldId]"
									@change="
										(e) => {
											form.subFieldMap[item.fieldId] = e;
										}
									"
									:placeholder="$t('linkDataDialog.targetField')"
									:filterData="{ type: item.type }"
									:options="sonLinkList"
								>
								</RelationSelect>
							</el-col>
							<el-col :span="2" style="line-height: 40px; text-align: center">
								{{ $t("linkDataDialog.assignTo") }}
							</el-col>
							<el-col :span="11">
								<el-input readonly disabled v-model="item.title[lang]"></el-input>
							</el-col>
						</el-row>
					</div>

					<div slot="footer" class="dialog-footer">
						<el-button size="mini" @click="sonVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
						<el-button size="mini" type="primary" @click="setSubdata">{{ $t("linkDataDialog.confirm") }}</el-button>
					</div>
				</rvue-dialog>
			</div>
		</div>

		<!-- 底部 -->
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="handleClose">{{ $t("linkDataDialog.cancel") }}</el-button>
			<el-button size="mini" type="primary" @click="setLinkData">{{ $t("linkDataDialog.confirm") }}</el-button>
		</div>
	</rvue-dialog>
</template>

<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, PropSync } from "vue-property-decorator";
	import { getApps, getFormList, getFormSingle, getFormFields } from "@/api/form";
	import RelationSelect from "../components/relationSelect";
	import RelationCustom from "../components/relationCustom";
	import matchRules from "@/components/matchRules/";

	const rules = [
		[
			{
				dataType: 0,
			},
		],
	];

	const filInpType = ["input", "select", "radio", "textarea", "datetime", "selectMulti", "checkbox", "sn"];
	const filUserType = ["user", "userRadio", "dept", "deptRadio"];

	const blackList = ["separator", "uploadFile"];

	@Component({
		components: {
			RelationSelect,
			RelationCustom,
			matchRulesComp: matchRules,
		},
	})
	export default class linkdataDialog extends Vue {
		@Prop({
			type: Boolean,
			default: true,
		})
		visible!: Boolean; //此dialog组件的开关
		@Prop({
			type: Object,
			default: () => {},
		})
		data!: any; // 选中字段的配置
		@Prop({
			type: Array,
			default: () => [],
		})
		configList!: any; //当前表单所有配置数组
		@Prop({
			type: Object,
			default: () => {},
		})
		parentObj!: any; //若所选为子字段， 该对象为所选子字段的父级对象\

		private modeFlag: boolean = true; // 切换高级模式和普通模式  true：普通模式  false：高级模式
		private form: any = {}; //要提交的数据结构
		private appList: Array<Object> = []; // app选项下的数组
		private menuList: Array<Object> = []; // 表单选项下的数组
		private currentList: Array<Object> = []; //当前选项的数组
		private targetList: Array<Object> = []; //目标选项的数组
		private linkList: Array<object> = []; //联动赋值选项的数组
		private sonLinkList: Array<object> = []; //子表格子字段联动赋值当前选项的数组
		private sonTargetList: Array<object> = []; //子表格子字段联动赋值目标选项的数组
		private sonVisible: boolean = false; //是否打开子字段
		private lang: any = this.$utils.getLocalStorage("lang");
		private matchRules: Array<object> = []; //配置项数
		private copyRules: Array<object> = []; //复制初始化的配置项数组
		private targetAppCode: string = ""; //目标应用code
		private targetFormCode: string = ""; //目标表单code
		private hasTargetField: boolean = false;

		private get dataTitle() {
			return Object.keys(this.parentObj).length > 0 ? this.parentObj.title[this.lang] + "-" + this.data.title[this.lang] : this.data.title[this.lang];
		}

		protected created() {
			// 初始获取所有应用
			getApps().then((res: Record<string, any>) => {
				this.appList = res.data;
			});
			// 为表格字段时 获取对应映射的目标数组
			this.sonTargetList = this.data.children
				? this.$utils.deepClone(this.data.children)?.map((item: any) => {
						item.title.en = this.data.title.en + "-" + item.title.en;
						item.title.zh = this.data.title.zh + "-" + item.title.zh;
						item.parentId = this.data.fieldId;
						return item;
				  })
				: [];
			this.sonTargetList = this.sonTargetList.filter((item: any) => !blackList.includes(item.type));
		}

		@Watch("visible", {
			immediate: true,
		})
		visibleChange(flag: boolean) {
			if (this.data.rely.type == "relation" && flag) {
				this.targetList = [];
				let relation: any = this.$utils.deepClone(this.data.rely.relation);
				this.form = {};
				this.form = {
					...relation,
					...this.form,
				};
				let appFlag: any = this.appList.find((item: any) => item.code == this.form.targetAppCode);
				// 判断目标app是否删除 删除则其他选项都清除

				if (!appFlag) {
					this.matchRules = [];

					this.$set(this.form, "targetField", "");
					this.$set(this.form, "targetFormCode", "");
				}

				// 默认为普通模式
				this.modeFlag = this.form.hasOwnProperty("modeFlag") ? this.form.modeFlag : true;
				// 过滤出未填完整的matchRules

				this.matchRules = this.verification(relation.matchRules && relation.matchRules.length ? relation.matchRules : []);
				// this.copyRules = this.$utils.deepClone(this.matchRules);

				let { targetAppCode, targetFormCode } = this.form;
				targetAppCode &&
					getFormList(targetAppCode).then((res: Record<string, any>) => {
						this.menuList = res.data.filter((item: any) => item.isLeaf && item.type != "P" && item.code != this.$route.params.id);
					});
				this.targetAppCode = "";
				this.targetFormCode = "";

				this.form.targetAppCode &&
					targetFormCode &&
					getFormSingle(this.form.targetAppCode, targetFormCode)
						.then((res: any) => {
							this.publicGetFormSingle(res);
						})
						.catch((error: any) => {
							if (error.code == "FM-FORM_NOT_EXISTS") {
								let flag = this.menuList.find((item: any) => item.code == this.form.targetFormCode);
								//判断表单是否删除  删除了  把相关表单的关联全部清空
								if (!flag) {
									this.matchRules = [];
									this.$set(this.form, "targetField", "");
								}
							}
						});
			}
		}

    @Watch('sonVisible',{
      	immediate: true
    })
    sonVisibleChange(flag:boolean){
      if(flag){
        let e  = this.form.targetField
        let filLinkList: any =this.$utils.deepClone(this.linkList).find((item: any) => item.fieldId == e);
        this.sonLinkList = (filLinkList.children ? filLinkList.children : []).filter((item: any) => !blackList.includes(item.type));
        // 修改子字段title
        this.sonLinkList.forEach((item: Record<string, any>) => {
          if(e!='lv1'){
             Object.keys(item.title).forEach((l: string) => {
            item.title[l] = filLinkList.title[l] + "-" + item.title[l];
          });
          }
        });
        
      }
    }

		//获取应用下 表单的数组选项
		private getMenuList(code: string) {
			this.menuList = [];
			this.targetList = [];
			this.linkList = [];
			this.matchRules = [];
			this.form = {};
			this.targetAppCode = code;
			this.targetFormCode = "";
			this.$set(this.form, "targetAppCode", code); //根据所选的应用 将appCode赋值到form结构中
			this.$set(this.form, "targetFormCode", ""); //删除原有form中的formCode
			//根据所选app 获取表单列表
			getFormList(code).then((res: any) => {
				this.menuList = res.data.filter((item: any) => item.isLeaf && item.type != "P" && item.code != this.$route.params.id);
			});
		}

		//获取表单下 各字段的数组选项
		private getStructrue(code: string) {
			this.matchRules = [];
			this.targetAppCode = "";
			this.targetFormCode = "";
			this.$set(this.form, "targetFormCode", code);
			this.$set(this.form, "targetField", '');

			if (this.form.subFieldMap && Object.keys(this.form.subFieldMap).length > 0) {
				this.sonLinkList = [];
				for (const key in this.form.subFieldMap) {
					this.form.subFieldMap[key] = "";
				}
			}

			//根据所选appCode 和 formCode 查询其表单下面的字段
			getFormSingle(this.form.targetAppCode, code)
				.then((res: any) => {
					this.publicGetFormSingle(res);
				})
				.catch((error: any) => {
					if (error.code == "FM-FORM_NOT_EXISTS") {
						let flag = this.menuList.find((item: any) => item.code == this.form.targetFormCode);
						//判断表单是否删除  删除了  把相关表单的关联全部清空
						if (!flag) {
							this.matchRules = [];
							this.$set(this.form, "targetField", "");
						}
					}
				});
		}

		//当所选字段为子表格时 获取该子表格下面所有子字段的数组选项
		private getTableChild(e: any) {
			this.form.targetField = e;
			// let filLinkList: any = this.linkList.find((item: any) => item.fieldId == e);
			// this.sonLinkList = (filLinkList.children ? filLinkList.children : []).filter((item: any) => !blackList.includes(item.type));
			// //修改子字段title
			// this.sonLinkList.forEach((item: Record<string, any>) => {
			// 	Object.keys(item.title).forEach((l: string) => {
			// 		item.title[l] = filLinkList.title[l] + "-" + item.title[l];
			// 	});
			// });
			let obj: any = {};
			this.sonTargetList.forEach((item: any) => {
				obj[item.fieldId] = "";
			});
			this.$set(this.form, "subFieldMap", obj);
		}

		//获取matchRules的值
		private matchChange(rules: any) {
			this.matchRules = rules;
		}

		// 切换高级模式
		private changeMode() {
			this.modeFlag = !this.modeFlag;
			(<Record<"changModeList", () => void> & Vue>this.$refs.matchRulesComp).changModeList();
		}

		//关闭dialog
		private handleClose() {
			// this.matchRules = this.$utils.deepClone(this.copyRules);
			this.$emit("close");
		}

		// dialog 确认 赋值
		private setLinkData() {
			let isTable = this.form.subFieldMap ? (Object.keys(this.form.subFieldMap).length > 0 ? true : false) : false; //判断当前选中是否是子表格
			let inTable = Object.keys(this.parentObj).length > 0 ? true : false; //判断当前选中是否为 子表格子字段
			this.form["formCode"] = this.$route.params.id;
			this.form["appCode"] = this.$route.params.appCode;
			this.form["targetAppCode"] = this.targetAppCode;
			this.form["targetFormCode"] = this.targetFormCode;
			this.form["modeFlag"] = this.modeFlag;
			this.hasTargetField = false;
			if (inTable) {
				//relationType  数据联动的赋值类型
				this.form["relationType"] = "SUB"; // 一级字段对子字段
				this.form["currTableID"] = this.parentObj.fieldId; //当前字段的为子字段时 传入对应父级子表格的fieldId
				let obj: any = {};
				obj[this.data.fieldId] = this.form.targetField;
				this.form["fieldMap"] = obj;
			} else if (isTable && this.form.targetField != 'lv1') {
				this.form["relationType"] = "TABLE"; //子表格对子表格
				this.form["targetTableID"] = this.form.targetField; // 目标字段的为子表格时 传入对应子表格的fieldId
				this.form["currTableID"] = this.data.fieldId; //当前字段的为子表格传入当前子表格fieldId
			} else if(this.form.targetField == 'lv1'){
        this.form["relationType"] = "F2TABLE"
        this.form["targetTableID"] = this.targetFormCode; 
				this.form["currTableID"] = this.data.fieldId; //当前字段的为子表格传入当前子表格fieldId
      }else {
				this.form["relationType"] = "FIELD"; // 一级字段对一级字段
				let obj: any = {};
				obj[this.data.fieldId] = this.form.targetField;
				this.form["fieldMap"] = obj;
			}
			this.matchRules = this.verification(this.matchRules);
			let markFlag = true;
			if (this.matchRules.length > 0) {
				this.matchRules.forEach((item: any) => {
					let hasFlag = item.find((it: any) => it.dataType == "1");
					if (!hasFlag) {
						markFlag = false;
					}
				});
			} else {
				markFlag = false;
			}

			if (!markFlag) {
				return this.$Rmessage({
					message: this.$t("linkDataDialog.relationError"),
					type: "warning",
				});
			}

			// if ( !this.hasTargetField|| this.matchRules.length == 0 ){

			//   return this.$Rmessage({
			// 		message: this.$t("linkDataDialog.relationError"),
			// 		type: "warning",
			// 	});
			// }
			if (!this.form.targetField || this.form.targetField == "") {
				return this.$Rmessage({
					message: this.$t("linkDataDialog.targetFieldError"),
					type: "warning",
				});
			}

			this.$emit("ok", {
				...this.form,
				matchRules: this.matchRules,
			});
		}

		private setSubdata() {
			this.sonVisible = false;
		}

		//获取各选项数组的复用函数
		private publicGetFormSingle(res: any) {
			this.currentList = []; //当前选项的数组
			this.targetList = []; //目标选项的数组
			this.linkList = []; //联动赋值选项的数组
			let { data } = res;
			if (data.structure) {
				this.targetAppCode = data.appCode;
				this.targetFormCode = data.code;
				let dataList = data.structure.configList;

				// 赋值过滤后的目标表单字段  过滤：分割线、附件、表格、标签
				this.targetList = dataList.filter((item: any) => !["separator", "uploadFile", "table", "tab"].includes(item.type));

				this.matchRules.forEach((item: any) => {
					item.forEach((it: any) => {
						let flag = this.targetList.find((el: any) => el.fieldId == it.targetFieldCode);
						if (!flag) {
							it.targetFieldCode = "";
							// this.$message.error('error')
						}
					});
				});
				// 过滤出 除分割线和附件的字段
				let arrlist = this.configList.filter((item: any) => !blackList.includes(item.type));
				this.tiledFn(arrlist, this.currentList); //给字段为表格的子字段加上前缀并平铺 字段为标签的子字段平铺
				//过滤当前选项数组 中的 选中字段 判断是否为子字段  避免重复赋值造成混乱
				let findItem: any = this.currentList.find((item: any) => item.fieldId == this.data.fieldId);
				if (findItem && findItem.parentId) {
					this.currentList = this.currentList.filter((item: any) => {
						if (!item.parentId) {
							return true;
						} else if (item.parentId == findItem.parentId && item.fieldId != this.data.fieldId) {
							return true;
						} else {
							return false;
						}
					});
				} else if (!this.data.parentId) {
					this.currentList = this.currentList.filter((item: any) => !item.parentId);
				}
				// 过滤出 当前选项数组中的 匹配目标选中的字段
				this.currentList = this.currentList.filter((item: any) => !blackList.includes(item.type) && item.fieldId != this.data.fieldId);

				//过滤出符合当前字段的 目标表单数组
				const types = [["input", "select", "radio", "textarea", "sn"], ["number"], ["datetime"], ["userRadio"], ["user"], ["dept"], ["deptRadio"], ["selectMulti", "checkbox"], ["address"]];
				let result = types.find((item: any) => item.includes(this.data.type)) || [];
				if (this.data.type == "table") {
          let lv1List:any = {
            children:this.$utils.deepClone(this.targetList),
            title:{
              zh:'一级字段',
              en:'一级字段'
            },
            fieldId:'lv1'
          }

					this.linkList = dataList.filter((item: any) => item.type == "table" && item.fieldId != this.data.fieldId);
          this.linkList.unshift(lv1List)
					let filLinkList: any = this.linkList.find((item: any) => item.fieldId == this.form.targetField);
					this.sonLinkList = (filLinkList?.children ? filLinkList.children : []).filter((item: any) => !blackList.includes(item.type));
				} else {
					this.linkList = this.$utils.deepClone(this.targetList);
					this.linkList = this.linkList.filter((item: any) => result.includes(item.type));
				}
				let tarFlag = this.linkList.find((item: any) => item.fieldId == this.form.targetField);

				//目标表格对应字段删除  删除掉对应配置中的字段
				let filSonLinkList = this.sonLinkList.map((item: any) => item.fieldId);

				for (const key in this.form.subFieldMap) {
					if (!filSonLinkList.includes(this.form.subFieldMap[key])) {
						this.form.subFieldMap[key] = "";
					}
				}

				if (!tarFlag) {
					this.form.targetField = "";
					this.form.targetTableID = "";
					if (Object.keys(this.form.subFieldMap).length > 0) {
						for (const key in this.form.subFieldMap) {
							this.form.subFieldMap[key] = "";
						}
					}
				}

				//当前字段删除 对应配置里面为空

				let filCurrentList = this.currentList.map((item: any) => item.fieldId);

				this.matchRules.forEach((item: any) => {
					item.forEach((its: any) => {
						//dataType == 0不做处理
						if (its.dataType == 0) return;

						its.judgeValues = its.judgeValues.filter((it: any) => filCurrentList.includes(it));
					});
				});
			}
		}

		//给字段为表格的子字段加上前缀并平铺 字段为标签字段的子字段平铺 过滤函数
		private tiledFn(list: Array<any>, newList: Array<any>) {
			let cloneList = this.$utils.deepClone(list);
			cloneList.forEach((item: any) => {
				if (!item.children && !item.configList) {
					newList.push(item);
				} else {
					if (item.children) {
						item.children.forEach((it: any) => {
							it.title.en = item.title.en + "-" + it.title.en;
							it.title.zh = item.title.zh + "-" + it.title.zh;
							it.parentId = item.fieldId;
						});
						this.tiledFn(item.children, newList);
					} else if (item.configList) {
						this.tiledFn(item.configList, newList);
					}
				}
			});
		}

		//验证macthRules是否有空选项
		private verification(rules: any) {
			let aRules: any = [];

			rules.forEach((group: any) => {
				let aGroup: any = [];

				group.forEach((item: any) => {
					if (item.dataType == 1 && !this.hasTargetField) {
						this.hasTargetField = true;
					}

					if (item.method && item.targetFieldCode && item.judgeValues.length) {
						if (filInpType.includes(item.type)) {
							if (item.judgeValues[0].trim() !== "") {
								aGroup.push(item);
							}
						} else if (filUserType.includes(item.type)) {
							if (item.judgeValues.length != 0) {
								aGroup.push(item);
							}
						} else if (item.type == "number") {
							if (item.method == "between") {
								if (!isNaN(item.judgeValues[0]["0"]) && !isNaN(item.judgeValues[0]["1"])) {
									aGroup.push(item);
								}
							} else {
								if (item.dataType == "0" && String(item.judgeValues[0]) && !isNaN(item.judgeValues[0])) {
									aGroup.push(item);
								} else if (item.dataType == "1" && item.judgeValues[0]) {
									aGroup.push(item);
								}
							}
						}
					} else if (item.method && item.targetFieldCode && ["not_empty", "empty"].includes(item.method)) {
						aGroup.push(item);
					}
				});
				aGroup.length && aRules.push(aGroup);
			});

			return aRules;
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		.title {
			line-height: 1.5;
			margin-bottom: 5px;
			font-size: 16px;
			font-weight: 600;
			display: inline-block;
			color: #000;
			vertical-align: baseline;
		}
		.el-icon-delete {
			color: #409eff;
		}

		.set-subfield {
			margin-top: 20px;
		}

		// display: flex;
		.el-select > .el-input {
			margin-right: 10px;
		}

		.left {
			width: 40%;
			margin-right: 20px;
			padding: 15px 20px;
			border: 1px solid #ccc;

			.el-select {
				margin: 10px 0;
			}
		}

		.right {
			flex: 1;
			padding: 15px 20px;
			border: 1px solid #ccc;
		}

		.part {
			margin-bottom: 20px;
		}
	}

	.dialog-footer {
		@include JustityAndFlexWrap(flex, center, null, null);
	}

	.onerule {
		background: rgba(43, 52, 65, 0.05);
		padding: 10px 10px;
	}

	.changMode {
		margin-left: 30px;
		padding: 3px;
		display: inline-block;
		vertical-align: baseline;
		border: 1px solid #bec1c6;
		border-radius: 5px;
		color: #a5a9af;
		cursor: pointer;
		line-height: 25px;
		.el-icon-sort {
			transform: rotate(90deg);
		}

		> span {
			vertical-align: middle;
		}
	}

	.changMode:hover {
		border: 1px solid #4d81ff;
		color: #4d81ff;
	}

	::v-deep.el-select {
		width: 100%;
	}

	.dialog-title {
		position: relative;
		padding-left: 40px;
		padding-top: 15px;
		height: 50px;
		.dialog-title-font {
			font-size: 16px;
			font-weight: 600;
			display: inline-block;
			color: #000;
			vertical-align: baseline;
		}
	}
	.dialog-title::before {
		content: "";
		height: 29px;
		width: 5px;
		background: #6087fd;
		position: absolute;
		top: 40%;
		left: 0;
		transform: translateY(-50%);
	}
</style>
