<template>
	<el-drawer size="100%" custom-class="drawer" :visible.sync="drawer" direction="btt" :before-close="handleClose" :show-close="false" destroy-on-close @open="open">
		<div class="header">
			<div class="tabs">
				<div class="tab-item" :class="{ active: active === 1 }" @click="active = 1">
					{{ $t("appset.modifyform") }}
				</div>
				<!-- <div class="tab-item" :class="{ active: active === 2 }" @click="active = 2">
					{{ $t("appset.applicationAdministrator") }}
				</div> -->
				<div class="tab-item" :class="{ active: active === 3 }" @click="active = 3">
					{{ $t("appset.applyAccess") }}
				</div>
				<!-- <div class="tab-item" :class="{ active: active === 4 }" @click="active = 4">
					{{ $t("appset.userGroup") }}
				</div> -->
				<!-- <div class="tab-item" :class="{ active: active === 5 }" @click="active = 5">
					{{ $t("appset.ApplicationDesigner") }}
				</div> -->
				<!-- <div class="tab-item" :class="{ active: active === 6 }" @click="active = 6">
					{{ $t("appset.dataSet") }}
				</div> -->
			</div>
			<i class="el-icon-close close" @click="handleClose"></i>
		</div>
		<!-- 基础设置 -->
		<div v-if="active === 1" class="content">
			<div class="head">
				{{ $t("appset.modifyform") }}
				<el-button class="btn-save" size="mini" type="primary" @click="updateAppInfo">{{ $t("global.save") }}</el-button>
			</div>
			<div class="cont-wrap">
				<el-form :model="app" class="appForm" label-width="120px">
					<el-form-item :label="$t('appedit.editForm')">
						<icon-set :round="true" :default="app" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="$t('appset.appName')">
						<!-- <el-input v-model="app.name" autocomplete="off"></el-input> -->
						<RvueLangInput class="el-form-item" :maxlength="100" :field="app.multiLanguage" @change="handleChange" style="width: 76%" />
					</el-form-item>
					<el-form-item :label="$t('appset.appDesc')">
						<el-input placeholder="应用描述" :maxlength="255" v-model="app.description" autocomplete="off" type="textarea" style="width: 70%"> </el-input>
					</el-form-item>
					<el-form-item :label="$t('appset.effectiveSettings')">
						<el-radio-group v-model="app.effectNow">
							<el-radio :label="1">{{ $t("appset.immediately") }}</el-radio>
							<el-radio :label="0">{{ $t("appset.releasedEffect") }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div>
					<el-button class="button-del" size="mini" type="danger" icon="el-icon-error" @click="deleteApp(app)" v-isAdmin="'canDeleteApps'">{{ $t("appset.deleteApp") }}</el-button>
				</div>
				
			</div>
		</div>
		<!-- 应用管理员 -->
		<!-- 应用管理员人数限制： N = 30； -->
		<div v-if="active === 2" class="content">
			<div class="head">
				{{ $t("appset.permissionSetting") }}
				<!-- <el-button class="btn-save" type="primary">{{ $t("global.save") }}</el-button> -->
			</div>
			<div class="cont-wrap">
				{{ $t("appset.applicationAdministrator") }}
				<ul class="select-list">
					<li class="select-item add-item" @click="showDeptDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#6087FD',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addApplicationAdministrator") }}
					</li>
					<li class="select-item" :key="item.id" v-for="item in tadminList">
						<i v-if="item.dtUserId !== selfUserId" class="el-icon-close close-btn" @click="delTAdmin(item.id)"></i>
						<div class="user-avatar">
							<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
							<i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#6087FD', color: '#fff', borderRadius: '50%' }"></i>
						</div>
						<div>
							{{ item.name }}
						</div>
					</li>
				</ul>
				<el-checkbox v-model="tadmin.canManageData" @change="updateTAdmin">{{ $t("appset.dataManagementAuthority") }} </el-checkbox>
			</div>
		</div>
		<!-- 应用访问权限 -->
		<div v-if="active === 3" class="content">
			<div class="head">{{ $t("appset.applyAccess") }}</div>
			<div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item visit-item add-item" @click="visitdialogVisible = true">
						{{ tvisitList.length ? $t("global.edit") : $t("global.add") }}
					</li>
					<li class="select-item visit-item" :key="item.id" v-for="item in tvisitList">
						<div class="user-avatar">
							<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
							<i v-if="!item.avatar" class="el-icon-s-grid" style="color: #fa0"></i>
						</div>
						<span class="msg">{{ item.name }}</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- 用户组 -->
		<div v-if="active === 4" class="content">
			<div class="head">{{ $t("appset.userGroup") }}</div>
			<div class="cont-wrap">
				<ul class="select-list">
					<li class="select-item add-item" @click="showDialog">
						<i
							class="el-icon-circle-plus-outline"
							:style="{
								fontSize: '22px',
								color: '#6087FD',
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
		</div>

		<!-- 应用设计者 -->
		<div v-if="active === 5" class="content">
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
								color: '#6087FD',
								marginRight: '6px',
							}"
						></i>
						{{ $t("appset.addApplicationDesigner") }}
					</li>
					<!-- <li class="select-item" :key="item.id" v-for="item in tadminList">
						<i
							v-if="item.dtUserId !== selfUserId"
							class="el-icon-close close-btn"
							@click="delTAdmin(item.id)"
						></i>
						<div class="user-avatar">
							<img v-if="item.avatar" class="avatar-image" :src="item.avatar" />
							<i v-else class="el-icon-user-solid" :style="{ fontSize: '22px', background: '#409EFF', color: '#fff', borderRadius: '50%' }"></i>
						</div>
						<div>
							{{ item.name }}
						</div>
					</li> -->
				</ul>
			</div>
		</div>

		<!-- 数据集 -->
		<div v-if="active === 6" class="content">
			<div class="head">
				{{ $t("appset.dataSet") }}
			</div>
		</div>

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
	</el-drawer>
</template>

<script lang="ts">
	import Vue from "vue";
	import IconSet from "@/components/iconSet/icon.vue";
	import { queryApp, delApp, updateApp } from "@/api/form";
	import { FormModule } from "@/store/modules/form";
	import { UserModule } from "@/store/modules/user";
	import { getAppUserGroup, saveAppUserGroup, delAppUserGroup, getAppAdminList, saveAppAdmin, delAppAdmin, updateAppAdmin, queryAppVisit, saveAppVisit, createAppVisit } from "@/api/tenant";
	import { getLocalStorage } from "@/utils/storage";
	import { getNameLang } from "@/core/filters";
	export default Vue.extend({
		name: "AppsetDrawer",
		components: {
			IconSet,
		},
		props: {
			drawer: Boolean,
			appCode: String,
			id: String,
		},
		data() {
			return {
				active: 1,
				app: {
					effectNow: 1,
				},
				tadmin: {},
				tadminList: [], // 应用管理者
				tvisit: {},
				tvisitList: [], // 应用访问者
				agroupList: [], // 用户组
				tags: [],
				group: {},
				dialogVisible: false, // 新增用户组dialog里添加 部门成员dialog
				dialogGroupVisible: false, // 新增用户组dialog
				deptInfo: {}, // 部门、角色、成员信息
				admindialogVisible: false, // 添加应用管理员 部门成员dialog
				visitdialogVisible: false, // 添加应用访问者 部门成员dialog
				applicationdialogVisible: false, //添加应用设计者 成员dialog
				selfUserId: UserModule.userInfo.userId,
			};
		},
		methods: {
			open() {
				let currApp = FormModule.curApp;
				let id = this.id || currApp.id;
				queryApp(id).then((res: any) => {
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
			},
			handleChange(form: any) {
				(this.app as any).multiLanguage = form;
				let lang = getLocalStorage("lang") || "zh";
				(this.app as any) = {
					...this.app,
					name: form[lang],
				};
			},
			// 获取应用管理员
			getAppAdmin() {
				getAppAdminList(this.appCode).then((res) => {
					let { appAdmin, users } = res.data;
					this.tadminList = users || [];
					this.tadmin = appAdmin || {
						appCode: this.appCode,
						canManageData: true,
						userIds: [],
					};
				});
			},
			// 获取应用访问者
			getAppVisit() {
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
			},
			// 保存应用访问者
			bindGetTagsVisit(tags: any) {
				saveAppVisit({
					...this.tvisit,
					structure: tags,
				}).then((res) => {
					if (res.data) {
						this.tvisitList = tags;
						this.$message.success("添加成功！");
					}
				});
			},
			calcAvatar(arr: any, id: any) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].id === id) {
						return arr[i].avatar;
					}
				}
			},
			// 获取用户组
			getGroup() {
				getAppUserGroup(this.appCode).then((res) => {
					let { appUserGroupPoList, authRoles, deptInfos, userInfos } = res.data;
					this.agroupList = appUserGroupPoList;
					this.deptInfo = {
						authRoles,
						deptInfos,
						userInfos,
					};
				});
			},
			saveGroup() {
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
			},
			delGroup(id: any) {
				delAppUserGroup(this.appCode, id).then((res) => {
					if (res.data) {
						this.$message.success("删除成功！");
						this.getGroup();
					}
				});
			},
			deleteApp(app: object) {
				let name = getNameLang(app);
				this.$prompt("如确定删除,请输入应用名称", `您确定要删除'${name}'应用吗？`, {
					type: "warning",
					center: true,
					inputValidator: (v) => v === name,
					inputErrorMessage: "输入错误！",
				}).then((value: any) => {
					if (value.value == name) {
						delApp({
							ids: this.id,
						})
							.then((res: any) => {
								if (res.data) {
									this.$message.success("删除成功！");
									this.$router.replace({
										path: "/dashboard",
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
			},
			updateAppInfo() {
				updateApp(this.app).then((res: any) => {
					if (res.data) {
						this.$message.success("保存成功！");
					}
				});
			},
			editIcon(obj: any) {
				(<any>this.app) = {
					...this.app,
					icon: obj.icon,
					color: obj.color,
				};
			},
			showDeptDialog() {
				this.admindialogVisible = true;
			},
			//LK8.4 添加应用设计者 dialog开关
			showAddApctDialog() {
				this.applicationdialogVisible = true;
				console.log("打开应用设计者dialog");
			},
			showDialog() {
				this.dialogGroupVisible = true;
			},
			// 添加应用管理者
			bindGetTagsAdmin(tags: any) {
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
			},

			//添加应用设计者
			bindGetTagsApplicationDesigner() {
				console.log("应用设计者");
			},

			// 删除应用管理者
			delTAdmin(userId: any) {
				this.$confirm("确认删除？").then(() => {
					delAppAdmin(this.appCode, userId).then((res) => {
						if (res.data) {
							this.$message.success("删除成功！");
							this.getAppAdmin();
						}
					});
				});
			},
			// 修改应用管理者数据权限
			updateTAdmin(checked: boolean) {
				updateAppAdmin({
					...this.tadmin,
					canManageData: checked,
				}).then((res) => {
					if (res.data) {
						this.$message.success("修改成功！");
					}
				});
			},
			bindGetTags(tags: any) {
				console.info(tags);
				this.tags = tags;
			},
			handleClose() {
				this.$emit("close");
			},
			handleClick(e: any) {},
		},
	});
</script>

<style lang="scss">
	.drawer {
		background-color: #efeff6;

		.header {
			@include PositionRelative(null, 50px);
			background-color: rgba(70, 76, 91, 1);

			.tabs {
				height: 100%;
				display: flex;
				color: #fff;

				.tab-item {
					width: 140px;
					height: 100%;
					line-height: 50px;
					text-align: center;
					cursor: pointer;

					&.active {
						color: #6087fd;
						border-bottom: 3px solid #6087fd;
					}
				}
			}

			.close {
				@include PositionAbsoulte(15px, 20px, null, null);
				font-size: 20px;
				color: #fff;
				cursor: pointer;
			}
		}

		.el-drawer__header {
			margin-bottom: 0 !important;
		}

		.content {
			.head {
				margin: 20px;
				font-size: 24px;

				.btn-save {
					float: right;
				}
			}

			.cont-wrap {
				margin: 50px;
				padding: 30px;
				@include GlobalAvatar(null, null, 3px, #fff);

				.select-list {
					display: flex;
					flex-flow: row wrap;

					.select-item {
						@include PositionRelative(250px, 60px);
						display: flex;
						align-items: center;
						padding-left: 15px;
						margin: 10px;
						border: 1px solid #eee;

						&.visit-item {
							width: 150px;
							height: 40px;
						}

						@at-root .user-avatar {
							margin-right: 14px;
							@include VertivalAlign(inline-block, middle, 30px, 30px);
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
			}
		}
	}

	.button-del {
		color: white !important;
		border-color: white !important;
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
		// padding-left: 40px;

		.el-form-item {
			.el-form-item__label {
				padding-right: 40px;
				min-width: 92px;
			}
		}
	}
</style>
