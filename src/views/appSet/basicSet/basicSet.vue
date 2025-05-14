<template>
	<div class="drawer">
		<!-- 基础设置 -->
		<div v-if="active === 1" class="content">
			<div class="title">
				<span class="titleWord">{{ $t("appset.modifyform") }}</span>
				<!-- {{ $t("appset.modifyform") }} -->
				<el-button class="btn-save" size="medium" type="primary" @click="updateAppInfo">{{ $t("global.save") }}</el-button>
			</div>
			<div class="cont-wrap">
				<el-form :model="app" class="appForm" label-width="120px">
					<el-form-item :label="$t('appedit.editForm')">
						<icon-set :round="true" :default="app" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="$t('appset.appName')">
						<!-- <el-input v-model="app.name" autocomplete="off"></el-input> -->
						<RvueLangInput class="el-form-item" :maxlength="100" :field="app.multiLanguage" @change="handleChange" style="width: 70%" />
					</el-form-item>
					<el-form-item :label="$t('appset.appDesc')">
						<el-input placeholder="应用描述" :maxlength="255" v-model="app.description" autocomplete="off" type="textarea" style="width: 68.5%"> </el-input>
					</el-form-item>
					<el-form-item :label="$t('appset.effectiveSettings')">
						<el-radio-group v-model="app.effectNow">
							<el-radio :label="1">{{ $t("appset.immediately") }}</el-radio>
							<!-- <el-radio :label="0">{{ $t("appset.releasedEffect") }}</el-radio> -->
						</el-radio-group>
					</el-form-item>
          <el-form-item label="应用TOKEN"> 
            <el-input v-model="tokenCode" disabled style="width: 52.5%"></el-input>
            <span class="el-icon-circle-plus-outline token-icon add-token" @click="addToken" :style="[{backgroundColor:(tokenCode?'#ccc':'#fff')},{cursor:(tokenCode?'not-allowed':'pointer')}]"></span>
            <span class="el-icon-copy-document token-icon copy-token btn" @click="copyToken"  :data-clipboard-text="tokenCode"></span>
            <el-tooltip :content="!disToken?'已开启':'已禁用'" placement="top">
               <el-switch v-model="disToken" @change="disabledToken"></el-switch>
            </el-tooltip>
          </el-form-item>
				</el-form>
				<div class="button-location">
					<el-button class="button-del" size="medium" type="danger" icon="el-icon-error" @click="deleteApp(app)">{{ $t("appset.deleteApp") }}</el-button>
				</div>
			</div>
		</div>
		<!-- 应用管理员 -->
		<!-- 应用管理员人数限制： N = 30； -->
		<!-- <div v-if="active === 2" class="content">
			<div class="head">
				{{ $t("appset.permissionSetting") }}
		
			</div>
			<div class="cont-wrap">
				{{ $t("appset.applicationAdministrator") }}
				<ul class="select-list">
					<li class="select-item add-item" @click="showDeptDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#409EFF',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addApplicationAdministrator") }}
					</li>
					<li class="select-item" :key="item.id" v-for="item in tadminList">
						<i v-if="item.dtUserId !== selfUserId" class="el-icon-close close-btn" @click="delTAdmin(item.id)"></i>
						<div class="user-avatar">
							<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
							<i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#409EFF', color: '#fff', borderRadius: '50%' }"></i>
						</div>
						<div>
							{{ item.name }}
						</div>
					</li>
				</ul>
				<el-checkbox v-model="tadmin.canManageData" @change="updateTAdmin">{{ $t("appset.dataManagementAuthority") }} </el-checkbox>
			</div>
		</div> -->
		<!-- 应用访问权限 -->
		<!-- <div v-if="active === 3" class="content">
			<div class="head">{{ $t("appset.applyAccess") }}</div>
			<div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item visit-item add-item" @click="visitdialogVisible = true">
						{{ tvisitList.length ? $t("global.edit") : $t("global.add") }}
					</li>
					<li class="select-item visit-item" :key="item.id" v-for="item in tvisitList">
						<div class="user-avatar">
							<img v-if="item.type === '2'" class="avatar-image" :src="item.avatar" />
							<i v-if="item.type === '0'" class="el-icon-s-grid" style="color: #fa0"></i>
						</div>
						<span class="msg">{{ item.name }}</span>
					</li>
				</ul>
			</div>
		</div> -->

		<!-- 用户组 -->
		<!-- <div v-if="active === 4" class="content">
			<div class="head">{{ $t("appset.userGroup") }}</div>
			<div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item add-item" @click="showDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#409EFF',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addUserGroup") }}
					</li>
					<li class="select-item select-group-item" :key="item.id" v-for="item in agroupList">
						<i class="el-icon-close close-btn" @click="delGroup(item.id)"></i>
						<div class="name">{{ item.name }}</div>
						<div class="avatar-wrapper">
							<div class="user-avatar" :key="i.id" v-for="i in item.typeAndIds">
								<i v-if="i.type === '0'" class="el-icon-s-grid" style="color: #fa0"></i>
								<img v-if="i.type === '2'" class="avatar-image" :src="calcAvatar(deptInfo.userInfos, i.id)" />
							</div>
							<div class="user-count">{{ item.typeAndIds.length }}</div>
						</div>
					</li>
				</ul>
			</div>
		</div> -->

		<!-- 应用设计者 -->
		<!-- <div v-if="active === 5" class="content">
			<div class="head">
				{{ $t("appset.ApplicationDesigner") }}
			</div>
			<div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item add-item" @click="showAddApctDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#409EFF',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addApplicationDesigner") }}
					</li>
				
				</ul>
			</div>
		</div> -->

		<!-- 数据集 -->
		<!-- <div v-if="active === 6" class="content">
			<div class="head">
				{{ $t("appset.dataSet") }}
			</div>
		</div> -->

		<!-- 添加用户组 -->
		<rvue-dialog title="新建用户组" :visible.sync="dialogGroupVisible" append-to-body>
			<el-form :model="group">
				<el-form-item label="用户组名称" label-width="120px">
					<el-input v-model="group.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户组成员" label-width="120px">
					<div>
						<i class="el-icon-circle-plus-outline" :style="{ fontSize: '22px' }" @click="dialogVisible = true"></i>
					</div>
					<div class="user-avatar" :key="item.id" v-for="item in tags">
						<img v-if="item.type === '2'" class="avatar-image" :src="item.avatar" />
						<i v-if="item.type === '0'" class="el-icon-s-grid" style="color: #fa0"></i>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="dialogGroupVisible = false">取 消</el-button>
				<el-button size="mini" type="primary" @click="saveGroup">确 定</el-button>
			</div>
		</rvue-dialog>

		<!-- 应用管理员 成员 -->
		<RvueDepartmentMembers :defaultTags="[]" :dialogVisible.sync="admindialogVisible" @closeDialog="bindGetTagsAdmin" :hide="[0, 1]" :multiple="false" />

		<!-- 应用设计者 成员  LK -->
		<RvueDepartmentMembers :defaultTags="[]" :dialogVisible.sync="applicationdialogVisible" @closeDialog="bindGetTagsApplicationDesigner" :hide="[0, 1]" :multiple="false" />

		<!-- 用户组 部门、成员 -->
		<RvueDepartmentMembers :defaultTags.sync="tags" :dialogVisible.sync="dialogVisible" @closeDialog="bindGetTags" />

		<!-- 应用访问者 部门、成员 -->
		<RvueDepartmentMembers :defaultTags.sync="tvisitList" :dialogVisible.sync="visitdialogVisible" @closeDialog="bindGetTagsVisit" />
	</div>
</template>

<script lang="ts">
	import IconSet from "@/components/iconSet/icon.vue";
	import { queryApp, delApp, updateApp } from "@/api/form";
	import { FormModule } from "@/store/modules/form";
    import Clipboard from 'clipboard'
	import { UserModule } from "@/store/modules/user";
  	import { debounce } from "@/utils/global";
	import { getAppUserGroup, saveAppUserGroup, delAppUserGroup, getAppAdminList, saveAppAdmin, delAppAdmin, updateAppAdmin, queryAppVisit, saveAppVisit, createAppVisit,createAppToken,getTokens,removeAppToken,disableAppToken } from "@/api/tenant";
	import { getLocalStorage } from "@/utils/storage";
	import { getNameLang } from "@/core/filters";
	import { Component, Vue, Watch, Prop, Provide, ProvideReactive } from "vue-property-decorator";

	@Component({
		components: {
			IconSet,
		},
	})
	export default class basicSet extends Vue {
		private get appCode() {
			return (<any>this).$route.params.appCode;
		}

		private active = 1;
		private app = {
			effectNow: 1,
		};
		private tadmin = {};
    private tokenCode = ''
    private disToken = false
		private tadminList = []; // 应用管理者
		private tvisit = {};
		private tvisitList = []; // 应用访问者
		private agroupList = []; // 用户组
		private tags = [];
		private group = {};
		private dialogVisible = false; // 新增用户组dialog里添加 部门成员dialog
		private dialogGroupVisible = false; // 新增用户组dialog
		private deptInfo = {}; // 部门、角色、成员信息
		private admindialogVisible = false; // 添加应用管理员 部门成员dialog
		private visitdialogVisible = false; // 添加应用访问者 部门成员dialog
		private applicationdialogVisible = false; //添加应用设计者 成员dialog
		private selfUserId = UserModule.userInfo.userId;

		private get curApp() {
			return FormModule.curApp;
		}

		//TODO 异步会导致id不匹配，暂时先监听id变化
		@Watch("curApp", { immediate: true, deep: true })
		private watchCurApp() {
			let currApp = this.curApp;
			let id: any = currApp.id;
			queryApp(id).then((res: TResponse) => {
				const data = res.data;
				this.app = {
					...data,
					effectNow: data.effectNow ? 1 : 0,
					multiLanguage: data.multiLanguage ? data.multiLanguage : {},
				};
			});
			this.getGroup();
			this.getAppAdmin();
			this.getAppVisit();
		}

		protected created() {
      this.getToken()
    }

  //禁用token
  private disabledToken(){
   disableAppToken(this.$route.params.appCode,this.tokenCode,this.disToken).then((res:any)=>{
     !this.disToken ? this.$message.success('已开启') : this.$message.success('已禁用') 
   })
  }

  //查询token
    private getToken(){
      getTokens(this.$route.params.appCode).then((res:any)=>{
        this.tokenCode = res.data[0].appToken
        this.disToken = res.data[0].isDisabled
      })
    }

    //复制token
    private copyTokenApi(){
      let that= this
      if(that.tokenCode !=''){
        let clipboard = new Clipboard(".btn")
        clipboard.on("success",e=>{
          clipboard.destroy()
          that.$message.success('复制成功')
        })
        clipboard.on("error",e=>{
          that.$message.error('复制失败')
          clipboard.destroy()
        });
      }else{
        that.$message.error('请先生成token')
      }
      
    }
    
    private copyToken = debounce(()=>{
      this.copyTokenApi()
    },300)

     //创建token的api
    private addTokenApi(){
      if(this.tokenCode== ''){
        createAppToken(this.$route.params.appCode).then((res:any)=>{
          this.tokenCode = res.data.appToken
          this.$message.success('token已生成')
        })
      }
      // else{
      //   this.$message.warning('已经生成token，请勿重复生成')
      // }
    }
    //创建token
    private addToken = debounce(()=>{
      this.addTokenApi()
    },300)

		private handleChange(form: any) {
			(this.app as any).multiLanguage = form;
			let lang = getLocalStorage("lang") || "zh";
			(this.app as any) = {
				...this.app,
				name: form[lang],
			};
		}

		private getAppAdmin() {
			getAppAdminList(this.appCode).then((res) => {
				let { appAdmin, users } = res.data;
				this.tadminList = users || [];
				this.tadmin = appAdmin || {
					appCode: this.appCode,
					canManageData: true,
					userIds: [],
				};
			});
		}

		private getAppVisit() {
			queryAppVisit(this.appCode).then((res) => {
				if (!res.data) {
					createAppVisit(this.appCode).then((r) => {
						this.tvisitList = r.data.structure || [];
						this.tvisit = r.data;
					});
				} else {
					this.tvisitList = res.data.structure || [];
					this.tvisit = res.data;
				}
			});
		}

		private bindGetTagsVisit(tags: any) {
			saveAppVisit({
				...this.tvisit,
				structure: tags,
			}).then((res) => {
				if (res.data) {
					this.tvisitList = tags;
					this.$message.success("添加成功！");
				}
			});
		}

		private calcAvatar(arr: any, id: any) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].id === id) {
					return arr[i].avatar;
				}
			}
		}
		// 获取用户组
		private getGroup() {
			getAppUserGroup(this.appCode).then((res) => {
				let { appUserGroupPoList, authRoles, deptInfos, userInfos } = res.data;
				this.agroupList = appUserGroupPoList;
				this.deptInfo = {
					authRoles,
					deptInfos,
					userInfos,
				};
			});
		}
		private saveGroup() {
			saveAppUserGroup(this.appCode, {
				...this.group,
				appCode: this.appCode,
				structures: this.tags,
			}).then((res) => {
				if (res.data) {
					this.$message.success("新建成功！");
					this.dialogGroupVisible = false;
					this.getGroup();
				}
			});
		}
		private delGroup(id: any) {
			delAppUserGroup(this.appCode, id).then((res) => {
				if (res.data) {
					this.$message.success("删除成功！");
					this.getGroup();
				}
			});
		}
		private deleteApp(app: object) {
			let name = getNameLang(app);
			this.$prompt("如确定删除,请输入应用名称", `您确定要删除'${name}'应用吗？`, {
				type: "warning",
				center: true,
				inputValidator: (v) => v === name,
				inputErrorMessage: "输入错误！",
			}).then((value: any) => {
				if (value.value == name) {
					delApp({
						ids: FormModule.curApp.id,
					})
						.then((res: any) => {
							if (res.data) {
								this.$message.success("删除成功！");
								this.$router.replace({
									path: "/",
								});
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch((err: any) => {
							//this.$message.error(err.msg);
						});
				}
			});
		}
		private updateAppInfo() {
			updateApp(this.app).then((res: any) => {
				if (res.data) {
					this.$message.success("保存成功！");
				}
			});
		}
		private editIcon(obj: any) {
			(<any>this.app) = {
				...this.app,
				icon: obj.icon,
				color: obj.color,
			};
		}
		private showDeptDialog() {
			this.admindialogVisible = true;
		}
		//LK8.4 添加应用设计者 dialog开关
		private showAddApctDialog() {
			this.applicationdialogVisible = true;
			console.log("打开应用设计者dialog");
		}
		private showDialog() {
			this.dialogGroupVisible = true;
		}
		// 添加应用管理者
		private bindGetTagsAdmin(tags: any) {
			(this.tadmin as any).userIds.push(tags[0].id);
			if (!(this.tadmin as any).appAdminId) {
				saveAppAdmin(this.tadmin).then((res) => {
					if (res.data) {
						this.$message.success("添加成功！");
						this.getAppAdmin();
					}
				});
			} else {
				updateAppAdmin(this.tadmin).then((res) => {
					if (res.data) {
						this.$message.success("添加成功！");
						this.getAppAdmin();
					}
				});
			}
		}
		//添加应用设计者
		private bindGetTagsApplicationDesigner() {
			console.log("应用设计者");
		}

		// 删除应用管理者
		private delTAdmin(userId: any) {
			this.$confirm("确认删除？").then(() => {
				delAppAdmin(this.appCode, userId).then((res) => {
					if (res.data) {
						this.$message.success("删除成功！");
						this.getAppAdmin();
					}
				});
			});
		}
		// 修改应用管理者数据权限
		private updateTAdmin(checked: boolean) {
			updateAppAdmin({
				...this.tadmin,
				canManageData: checked,
			}).then((res) => {
				if (res.data) {
					this.$message.success("修改成功！");
				}
			});
		}
		private bindGetTags(tags: any) {
			//@ts-ignore
			this.tags = tags;
		}
		private handleClose() {
			this.$emit("close");
		}
		private handleClick(e: any) {}
	}
</script>

<style lang="scss">
	.el-button--medium {
		font-size: 12px;
	}
	.titleWord {
		margin-left: 40px;
	}
	.drawer {
		background-color: #efeff6;
		height: calc(100vh - 40px);

		.el-drawer__header {
			margin-bottom: 0 !important;
		}

		.content {
			overflow: hidden;

			.cont-wrap {
				margin: 50px;
				margin-top: 30px;
				padding: 30px;
				@include GlobalAvatar(null, null, 3px, #fff);

				.select-list {
					@include JustityAndFlexWrap(flex, null, null, row-wrap);
					.select-item {
						@include PositionRelative(250px, 60px);
						@include JustityAndFlexWrap(flex, null, center, null);
						padding-left: 15px;
						margin: 10px;
						border: 1px solid #eee;

						&.visit-item {
							width: 150px;
							height: 40px;
						}

						@at-root .user-avatar {
							@include VertivalAlign(inline-block, middle, 30px, 30px);
							margin-right: 14px;
							line-height: 30px;

							.avatar-image {
								@include GlobalAvatar(100%, 100%, 50%);
							}
						}

						.name {
							font-size: 16px;
							margin-bottom: 10px;
						}

						.email {
							font-size: 12px;
						}

						.close-btn {
							@include PositionAbsoulte(5px, 5px, null, null);
							cursor: pointer;
						}
					}

					.select-group-item {
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;

						.avatar-wrapper {
							width: 100%;

							.user-count {
								float: right;
								margin-right: 5px;
								line-height: 20px;
								text-align: center;
								font-size: 12px;
								border: 1px solid #ccc;
								@include GlobalAvatar(20px, 20px, 50%, null);
							}
						}

						.user-avatar {
							margin-right: 12px;
							@include VertivalAlign(inline-block, middle, 20px, 20px);
							line-height: 20px;

							.avatar-image {
								@include GlobalAvatar(100%, 100%, 50%);
							}
						}
					}

					.add-item {
						cursor: pointer;
					}
				}
        .token-icon{
          width: 30px;
          height: 30px;;
          font-size: 20px;
          color: #409EFF;
          line-height: 30px;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          border:1px solid #ccc ;
        }
        .add-token{
          margin-left: 10px;
          border-right: none;
        }
        .copy-token{
          margin-right: 10px;
        }
			}
		}
	}
	.button-location{
		//text-align: right;
	}

	.button-del {
		color: white !important;
		border-color: white !important;
		//margin-left: 22px;
	}

	.button-del:hover,
	.button-del:active,
	.button-del:focus,
	.button-del:focus:not(.focusing) {
		color: white !important;
		border-color: rgba(230, 99, 99, 0.7) !important;
		background-color: rgba(230, 99, 99, 0.7) !important;
	}

	.appForm {
		 padding-left: 20px;

		.el-form-item {
			.el-form-item__label {
				padding-right: 40px;
				min-width: 92px;
				font-weight: 600;
			}
		}
	}
</style>
