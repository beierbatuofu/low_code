<template>
	<div>
		<m-header></m-header>
		<div class="dashboard">
			<div class="dashboard-content">
				<el-row :gutter="20">
					<el-col :xs="24" :span="8">
						<div class="grid-content my-todo">
							<div class="todo-wrapper" @click="go('/todo')">
								<div class="image-wrapper">
									<i
										class="iconfont icondeal"
										:style="{
											fontSize: '54px',
											color: '#6087FD',
										}"
									></i>
								</div>
								<div class="todo-count">
									<div class="todo-count-text">
										{{ $i18n.t("Dashboard.mytodolist") }}
									</div>
									<div class="todo-count-number">{{ taskCount }}</div>
								</div>
							</div>
						</div>
					</el-col>
					<el-col :xs="24" :span="16">
						<div class="grid-content flow-steps">
							<div class="step-wrapper" @click="go('/create')">
								<i
									class="iconfont iconstart"
									:style="{
										fontSize: '34px',
										color: '#6087FD',
									}"
								></i>
								<div class="step-text">{{ $i18n.t("Dashboard.mylaunch") }}</div>
							</div>
							<div class="step-wrapper" @click="go('/transactors')">
								<i
									class="iconfont iconhandle"
									:style="{
										fontSize: '34px',
										color: '#6087FD',
									}"
								></i>
								<div class="step-text">{{ $i18n.t("Dashboard.myhandle") }}</div>
							</div>
							<!-- <div class="step-wrapper" @click="go('/ccUsers')">
								<i
									class="iconfont iconsend"
									:style="{
										fontSize: '34px',
										color: '#409EFF',
									}"
								></i>
								<div class="step-text">抄送我的</div>
							</div> -->
							<!-- <div class="step-wrapper" @click="go('/draft')">
								<i
									class="iconfont iconnew"
									:style="{
										fontSize: '34px',
										color: '#409EFF',
									}"
								></i>
								<div class="step-text">
									{{ $i18n.t("Dashboard.launchnewflow") }}
								</div>
							</div> -->
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="list-main">
							<div class="app-header">
								<div class="app-title">
									{{ $i18n.t("Dashboard.totalapps") }}
									<i
										class="el-icon-s-tools"
										@click="
											() => {
												dialogGroupVisible = true;
												this.sortAppList = JSON.parse(JSON.stringify(this.appList));
											}
										"
										v-isAdmin
									></i>
								</div>
								<!-- <el-button
									class="btn-create"
									type="primary"
									size="small"
									round
									icon="el-icon-plus"
									@click="showAdd(false)"
									>{{ $i18n.t("Dashboard.newgroup") }}</el-button
								> -->
								<el-dropdown trigger="click" class="btn-create" @command="handleCommandCreate" v-isAdmin="'canCreateAppGroups'">
									<el-button class="button-style" size="small" type="primary" icon="el-icon-plus"> {{ $t("dashboard.create") }} </el-button>

									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="a" v-isAdmin>{{ $l("Dashboard.newgroup") }}</el-dropdown-item>
										<el-dropdown-item command="b">{{ $l("Dashboard.newapp") }}</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
							<div class="content">
								<div class="group-list" :key="item.id" v-for="item in appList">
									<h4 class="group-name">
										<span v-if="['other', 'favorite'].includes(item.code)">{{ $t(`global.${item.code}`) }}</span>
										<span v-else>{{ item.name }}</span>
										<el-dropdown
											v-if="item.id > 0 && item.code !== 'other' && beMobile != true"
											trigger="click"
											size="small"
											placement="top"
											v-isAdmin
											@command="handleCommandGroup"
										>
											<span class="el-dropdown-link">
												<i class="el-icon-s-tools"></i>
											</span>
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item :command="item">{{ $i18n.t("Dashboard.modifyname") }}</el-dropdown-item>
												<el-dropdown-item
													style="color: #d84636"
													:command="{
														id: item.id,
														name: item.name,
														deletable: !(item.children && item.children.length),
													}"
													>{{ $i18n.t("Dashboard.deletegroup") }}</el-dropdown-item
												>
											</el-dropdown-menu>
										</el-dropdown>
									</h4>
									<!-- <el-button
										class="btn-create-app"
										type="primary"
										size="mini"
										plain
										round
										icon="el-icon-plus"
										@click="showAdd(true, item.id)"
										>{{ $i18n.t("Dashboard.newapp") }}</el-button
									> -->

									<div class="app-list">
										<div v-bind="{ appcode: ite.code }" :key="ite.id" v-for="ite in item.children">
											<div :class="`app-item ${ite.showDesign ? 'open' : ''}`" @mouseenter="itemEnter(ite)" @mouseleave="itemLeave(ite)">
												<div class="app-mine" style="background: #fff" @click.stop="toApp(ite)">
													<div class="app-visit-area">
														<div class="icon-wrapper color-cover-5" :style="{ background: ite.color }">
															<i
																:class="ite.icon || 'el-icon-s-management'"
																:style="{
																	fontSize: '24px',
																	color: '#FFF',
																	marginTop: '8px',
																}"
															></i>
														</div>
														<div class="app-title">
															<p>{{ ite | getNameLang }}</p>
															<p style="font-size: 14px; color: #aaa">
																{{ ite.desc }}
															</p>
														</div>
													</div>
													<div class="app-collect" style="position: absolute; right: 3px; top: 3px">
														<i
															v-if="ite.isCollect"
															class="el-icon-star-on"
															:style="{
																fontSize: '24px',
																color: 'orange',
																visibility: 'visible',
															}"
															@click.stop="collect(ite.id, false)"
														></i>
														<i v-else class="el-icon-star-off" @click.stop="collect(ite.id, true)"></i>
													</div>
													<div v-isAdmin v-notCanDevApps="ite.code" class="app-collect" @click.stop="AppEdit(ite)" style="position: absolute; right: 5px; bottom: 5px">
														<i class="el-icon-s-tools"></i>
													</div>
													<!-- <div class="app-design">
														<div
															@click="toAppEdit(ite)"
															style="position:absolute;left:10px;right: inherit;"
														>
															<el-button size="mini" plain round
																>{{ $i18n.t("Dashboard.modifyapp") }}</el-button
															>
														</div>
														<el-dropdown
															trigger="click"
															size="small"
															placement="top"
															@command="handleCommand"
															@visible-change="itemEnter(ite)"
														>
															<span class="el-dropdown-link">
																<i class="el-icon-s-tools"></i>
															</span>
															<el-dropdown-menu slot="dropdown">
																<el-dropdown-item :command="{...ite, cmd: 'icon'}"
																	>{{ $i18n.t("Dashboard.modifyicon") }}</el-dropdown-item
																>
																<el-dropdown-item :command="ite"
																	>{{ $i18n.t("Dashboard.modifyname") }}</el-dropdown-item
																>
																<el-dropdown-item
																	style="color: #d84636"
																	:command="ite.id"
																	>{{ $i18n.t("Dashboard.deleteapp") }}</el-dropdown-item
																>
															</el-dropdown-menu>
														</el-dropdown>
													</div> -->
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>

			<!-- <el-dialog :title="'创建新' + modeText" :visible.sync="dialogFormVisible" width="30%" destroy-on-close>
				<el-form :model="app">
					<el-form-item :label="modeText + '名称'" label-width="100px">
						<el-input v-model="app.name" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button type="primary" @click="addAppName">{{ $t("crud.filter.submitBtn") }}</el-button>
				</div>
			</el-dialog> -->

			<!-- 新建应用组 -->
			<rvue-dialog :title="$l('dashboard.createGroup')" :visible.sync="showAddGroup" width="650" destroy-on-close append-to-body class="appDialog">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $l("dashboard.createGroup") }}</div>
				</div>
				<el-form :model="app" class="appForm" label-width="120px" hide-required-asterisk>
					<el-form-item :label="$l('dashboard.groupName')" prop="name" :rules="[{ required: true, message: $l('rules.requiredFields'), trigger: 'blur' }]">
						<el-input v-model="app.name" autocomplete="off" maxlength="100"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="handleCancelAppName">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="addAppName">{{ $t("crud.filter.submitBtn") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 新建应用 -->
			<rvue-dialog :title="$l('dashboard.createApp')" :visible.sync="showAddApp" width="650" destroy-on-close append-to-body class="appDialog">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $l("dashboard.createApp") }}</div>
				</div>
				<el-form :model="app" class="appForm" label-width="150px">
					<el-form-item :label="$t('appedit.editForm')" style="margin-bottom:0px;!important">
						<icon-set :round="true" :default="app" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="$l('dashboard.appName')">
						<RvueLangInput class="el-form-item" :maxlength="100" style="width: 74%" :field="app.multiLanguage" @change="handleChange" />
					</el-form-item>
					<el-form-item :label="$l('dashboard.chooseGroup')">
						<el-select filterable v-model="app.parentId" :placeholder="$l('dashboard.plz')" style="width: 74%" :popper-append-to-body="false">
							<el-option
								v-for="item in canCreateAppGroups"
								:key="item.id"
								:label="item.code == 'other' ? $t('global.' + item.code) : item.name"
								:value="item.id"
								:disabled="item.id === '-1'"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$l('appset.ApplicationDesigner')">
						<div class="dept-chose" style="width: 74%" @click="applicationdialogVisible = true">
							<p class="chose-text">{{ app.users && app.users.length ? "已配置" : "点击配置" }}</p>
						</div>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="handleCancelAppName">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="addAppName">{{ $t("crud.filter.submitBtn") }}</el-button>
				</div>
			</rvue-dialog>
			<RvueDepartmentMembers :defaultTags="app.users || []" :dialogVisible.sync="applicationdialogVisible" @closeDialog="bindGetTagsApplicationDesigner" :hide="[0, 1]" :multiple="true" />

			<!-- 应用设置 -->
			<rvue-dialog :visible.sync="showUpdateApp" width="650" destroy-on-close append-to-body class="appDialog">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">基础配置</div>
				</div>
				<el-form v-if="showUpdateApp" :model="app" class="appForm" label-width="150px">
					<el-form-item :label="$t('appedit.editForm')" style="margin-bottom:0px;!important">
						<icon-set :round="true" :default="app" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="$l('dashboard.appName')">
						<RvueLangInput class="el-form-item" :maxlength="100" style="width: 74%" :field="app.multiLanguage" @change="handleChange" />
					</el-form-item>
					<el-form-item :label="$l('dashboard.chooseGroup')">
						<el-select filterable v-model="app.parentId" :placeholder="$l('dashboard.plz')" style="width: 74%" :popper-append-to-body="false">
							<el-option
								v-for="item in canCreateAppGroups"
								:key="item.id"
								:label="item.code == 'other' ? $t('global.' + item.code) : item.name"
								:value="item.id"
								:disabled="item.id === '-1'"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$l('appset.ApplicationDesigner')">
						<div class="dept-chose" style="width: 74%" @click="applicationdialogVisible = true">
							<p class="chose-text">{{ app.users && app.users.length ? "已配置" : "点击配置" }}</p>
						</div>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="handleCancelAppName">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="handleUpdateApp">{{ $t("crud.filter.submitBtn") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 分组设置 -->
			<rvue-dialog class="appDialog max-height" :title="$l('Dashboard.modifygroupname')" :visible.sync="dialogGroupVisible" append-to-body destroy-on-close>
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $l("Dashboard.modifygroupname") }}</div>
				</div>
				<el-form label-position="top" class="groupForm">
					<el-form-item :label="$l('dashboard.groupSort')" label-width="120px">
						<draggable v-model="sortAppList" group="people" @start="drag = true" @end="drag = false" draggable=".drag-item">
							<template v-for="element in sortAppList">
								<div :key="element.id" class="drag-item" v-if="element.id > 0 && element.code != 'other'">
									{{ element.name }}
								</div>
							</template>
						</draggable>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" v-if="sortAppList.length">
					<el-button size="mini" @click="dialogGroupVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="sortGroup">{{ $t("crud.filter.submitBtn") }}</el-button>
				</div>
			</rvue-dialog>
		</div>
	</div>
</template>
<script>
	import draggable from "vuedraggable";
	import { getCollectApp, getAppTree, addApp, delApp, updateApp, getTaskCount, saveAppCollection, delAppCollection, sortAppGroup } from "../../api/form";
	import { FormModule } from "@/store/modules/form";
	import MHeader from "@/components/m-header/m-header.vue";
	import IconSet from "@/components/iconSet/icon.vue";
	import { transToTree, calcCollect } from "@/utils/transform";
	import { getLocalStorage } from "@/utils/storage";
	import { UserModule } from "@/store/modules/user";
	import { queryAppDesignerList, updateAppDesigner } from "@/api/tenant";
	import { getTask } from "@/api/flowcenter";

	/* 不是二维数组
	 appList = [
	     {
	         xxx:'',
	         children: [
	             {
	                 xxx: ''
	             }
	         ]
	     }
	 ] */
	export default {
		name: "Dashboard",
		components: {
			MHeader,
			draggable,
			IconSet,
		},
		data() {
			return {
				dialogVisible: false,
				dialogFormVisible: false,
				dialogIconVisible: false,
				dialogGroupVisible: false,
				app: {},
				isApp: false,
				appList: [],
				taskCount: null,
				showAddGroup: false,
				showAddApp: false,
				sortAppList: {},
				beMobile: /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent),
				applicationdialogVisible: false,
				showUpdateApp: false,
				app: {},
				data: {},
			};
		},
		created() {
			this.getTree();
			getTask({ type: 1 }).then((res) => {
				if (res.code == "0") {
					if (res.data) {
						this.taskCount = res.data?.total?.todo;
						if (this.taskCount == undefined || null) {
							this.taskCount = 0;
						}
					}
				}
			});
			//FormModule.getAllApps();
		},
		computed: {
			canCreateAppGroups() {
				const { canCreateAppGroups, isAdmin } = UserModule.appPerm;

				const appList = this.appList;
				if (isAdmin) {
					return appList;
				}
				if (!isAdmin && canCreateAppGroups.length > 0) {
					return this.appList.filter((item) => canCreateAppGroups.includes(item.code) || item.code == "other");
				}

				return [];
			},
			modeText() {
				return this.isApp ? "应用" : "分组";
			},
			apps() {
				return FormModule.apps;
			},
		},
		methods: {
			handleCancelAppName() {
				this.app.name = "";
				this.app.multiLanguage = {};
				this.showAddApp = false;
				this.showAddGroup = false;
				this.showUpdateApp = false;
			},
			handleChange(form) {
				this.app.multiLanguage = form;
				const lang = getLocalStorage("lang") || "zh";
				this.app.name = form[lang] || "";
			},
			async collect(appId, flag) {
				let res;
				if (flag) {
					res = await saveAppCollection(appId);
				} else {
					res = await delAppCollection(appId);
				}
				if (res.data) {
					this.$message.success(flag ? "收藏成功！" : "取消收藏成功！");
					this.getTree();
				} else {
					this.$message.error(res.msg);
				}
			},
			toApp(item) {
				const { name, code } = item;
				const { tenantId } = this.$route.params;
				// sessionStorage.setItem("currApp", JSON.stringify(item));
				// window.sessionStorage.setItem("appName", name);

				this.$router.push(`/${tenantId}/app/${code}/p`);
			},
			toAppEdit(item) {
				FormModule.setApp(item);
				const { name, code } = item;
				// sessionStorage.setItem("currApp", JSON.stringify(item));
				// window.sessionStorage.setItem("appName", name);
				//this.$router.push(`/app/${code}/edit`);
			},
			AppEdit(item) {
				this.app = { ...item };
				queryAppDesignerList(item.code, "0").then((res) => {
					this.data = res.data[0] || {};
					this.app.users = this.data.users || [];
					this.showUpdateApp = true;
				});
			},
			handleUpdateApp() {
				if (this.isApp && !(this.app.name && this.app.name.trim() && this.app.parentId)) {
					return;
				}
				Promise.all([
					updateApp(this.app),
					updateAppDesigner(this.app.code, this.data.code, {
						type: "0",
						name: this.data.name,
						operateTypes: this.data.operateTypes,
						users: this.app.users,
					}),
				]).then((res) => {
					this.$message.success("Success！");
					this.showUpdateApp = false;
					this.getTree();
				});
			},
			async getTree() {
				const res1 = await getCollectApp();
				await FormModule.getAllApps();
				const permApps = this.apps;
				const collectAppList = res1.data;
				const calcAppList = calcCollect(permApps, collectAppList);
				const apptree = transToTree(calcAppList);
				let collect = [];
				if (collectAppList.length) {
					collect = [
						{
							id: "-1",
							parentId: null,
							code: "favorite",
							name: "我的收藏",
							children: collectAppList,
						},
					];
				}
				this.appList = collect.concat(apptree);
				FormModule.setAppList(this.appList);
			},
			/* showAdd(isApp, v) {
	     	this.isApp = isApp;
	     	this.dialogFormVisible = true;
	     	if (isApp) {
	     		this.app = {
	     			parentId: v,
	     		};
	     	} else {
	     		this.app = {};
	     	}
	     }, */
			// 新增分组或应用
			addAppName() {
				if (!this.isApp && !(this.app.name && this.app.name.trim())) {
					return;
				}
				if (this.isApp && !(this.app.name && this.app.name.trim() && this.app.parentId)) {
					return;
				}
				addApp({
					...this.app,
					name: this.app.name.trim(),
					isApp: this.isApp,
				}).then(() => {
					this.$message({
						message: "新增成功！",
						type: "success",
					});
					this.showAddApp = false;
					this.showAddGroup = false;
					this.app = {};
					this.getTree();
					UserModule.getAppPerm();
				});
			},
			editAppName() {
				updateApp(this.app).then(() => {
					this.$message({
						message: "修改成功！",
						type: "success",
					});
					this.dialogVisible = false;
					this.getTree();
				});
			},
			editAppIcon() {
				if (this.app.id) {
					updateApp(this.app).then(() => {
						this.$message({
							message: "修改成功！",
							type: "success",
						});
						this.dialogIconVisible = false;
						this.getTree();
					});
				} else {
					this.dialogIconVisible = false;
				}
			},
			// app组排序
			sortGroup() {
				// updateApp({...this.app, isApp: false })
				const arr = this.sortAppList.map((value) => value.code);
				sortAppGroup({
					sortCodes: arr,
				}).then(() => {
					this.$message.success("修改成功！");
					this.dialogGroupVisible = false;
					this.getTree();
				});
			},
			itemEnter(item) {
				item.showDesign = true;
				!this.$utils.bMobile && this.$forceUpdate();
			},
			itemLeave(item) {
				item.showDesign = false;
				!this.$utils.bMobile && this.$forceUpdate();
			},
			handleCommandGroup(command) {
				// 删除应用组
				console.log(command, "command");
				if (command.hasOwnProperty("deletable")) {
					if (!command.deletable) {
						this.$message.warning("分组下有应用，不可删除");
						return;
					} else {
						this.$prompt("如确定删除,请输入分组名称", `您确定要删除'${command.name}'分组吗？`, {
							inputValidator: (v) => v === command.name,
							inputErrorMessage: "输入错误！",
							type: "warning",
							center: true,
						}).then((value) => {
							if (value.value == command.name) {
								delApp({
									ids: command.id,
								})
									.then((res) => {
										if (res.data) {
											this.$message.success("删除成功！");
											this.getTree();
										}
									})
									.catch((err) => {
										this.$message.error(err.msg);
									});
							}
						});
					}
				} else {
					// 分组设置
					// this.dialogGroupVisible = true;
					// this.app = command;
					this.$prompt("", "修改分组名称", {
						inputValue: command.name,
						inputValidator: (v) => v.length <= 100,
						inputErrorMessage: "超出最大长度100",

						center: true,
						iconClass: "edit-group-name",
					})
						.then(({ value }) => {
							if (value.trim() && value !== command.name) {
								updateApp({
									...command,
									name: value.trim(),
									isApp: false,
								}).then((res) => {
									if (res.data) {
										this.$message.success("修改成功！");
									}
									this.getTree();
								});
							} else {
								//this.$message.info("修改失败！");
							}
						})
						.catch(() => {
							this.$message.info("取消修改！");
						});
				}
			},
			handleCommand(command) {
				if (typeof command === "object") {
					if (command.cmd === "icon") {
						// 修改图标
						this.app = command;
						this.dialogIconVisible = true;
					} else {
						// 修改名称
						this.app = command;
						this.dialogVisible = true;
					}
				} else {
					// 删除应用
					this.$confirm("确认删除？").then(() => {
						delApp({
							ids: command,
						})
							.then((res) => {
								if (res.data) {
									this.$message({
										message: "删除成功！",
										type: "success",
									});
									this.getTree();
								}
							})
							.catch((err) => {
								this.$message.error(err.msg);
							});
					});
				}
			},
			handleCommandCreate(command) {
				this.app = {};
				if (command === "a") {
					this.showAddGroup = true;
					this.isApp = false;
				} else {
					this.showAddApp = true;
					this.isApp = true;
				}
			},
			goEditFormList(item) {
				FormModule.setApp(item);
				this.$router.push("/app/" + item.code);
			},
			go(url) {
				const { tenantId } = this.$route.params;
				console.log(`/${tenantId}/flow${url}`);
				this.$router.push(`/${tenantId}/flow${url}`);
			},
			editIcon(obj) {
				this.app = {
					...this.app,
					icon: obj.icon,
					color: obj.color,
				};
			},
			bindGetTagsApplicationDesigner(tags) {
				this.app.users = tags;
			},
		},
	};
</script>
<style lang="scss">
	.dashboard {
		overflow-y: auto;
		background: $bgColor;
		height: calc(100vh - 56px);
		transform: translate3d(0, 0, 0);

		.notVisit {
			position: relative;

			&::after {
				content: "";
				@include PositionAbsoulte(0, null, null, 0);
				width: 0px;
				height: 0px;
				line-height: 0;
				overflow: hidden;
				font-size: 0;
				border: 6px solid #18b875;
				border-right: 6px solid transparent;
				border-bottom: 6px solid transparent;
			}
		}
	}

	.dashboard-content {
		margin: auto 120px;
		padding: 24px 0 24px;

		.el-col {
			margin-bottom: 20px;
			border-radius: 4px;
		}
	}

	.grid-content {
		@include GlobalAvatar(null, 144px, 6px, #fff);
	}

	.my-todo {
		padding: 12px 20px;
		border-radius: 6px;
	}

	.todo-wrapper {
		@include GlobalAvatar(null, 100%, 6px, null);
		@include JustityAndFlexWrap(flex, center, center, null);
		cursor: pointer;
		justify-content: space-around;
	}

	.todo-wrapper:hover {
		background-color: rgb(236, 245, 255);
	}

	.image-wrapper {
		//margin-right: 56px;
	}

	.todo-count-text {
		font-size: 18px;
		line-height: 24px;
		// height: 24px;
		font-weight: 500;
		margin-bottom: 5px;
	}

	.todo-count-number {
		height: 36px;
		font-size: 36px;
		line-height: 36px;
		font-weight: 700;
		text-align: center;
	}

	.flow-steps {
		padding: 12px 28px;
		@include JustityAndFlexWrap(flex, space-around, center, null);
	}

	.step-wrapper {
		text-align: center;
	}

	@media screen and (min-width: 768px) {
		.step-wrapper {
			padding: 20px 30px;
			cursor: pointer;
		}

		.step-wrapper:hover {
			@include GlobalAvatar(null, null, 8px, rgb(236, 245, 255));
		}
	}

	.step-text {
		margin-top: 16px;
		font-size: 16px;
		line-height: 22px;
		height: 22px;
	}

	.list-main {
		min-height: 236px;
		padding-top: 10px;
		padding-bottom: 10px;
		border-radius: 6px;

		// background-color: #fff;
		.app-header {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.app-title {
				float: left;
				font-weight: 500;
				font-size: 18px;
				line-height: 32px;
				color: #1f2329;
			}

			.btn-create {
				// @include PositionAbsoulte(0, 20px, null, null);
			}
		}

		.content {
			.group-list {
				position: relative;
				padding-bottom: 10px;
				margin: 20px;
				border-radius: 6px;

				.btn-create-app {
					@include PositionAbsoulte(10px, 40px, null, null);
				}
			}

			.group-name {
				padding: 14px;
				font-size: 16px;
				color: #646a73;
			}

			.app-list {
				width: 100%;
				@include JustityAndFlexWrap(grid, null, null, wrap);
				margin: 0 auto;
				padding: 4px 16px 0;
				box-sizing: border-box;
				grid-template-columns: repeat(4, 24%);
				gap: 10px;
			}

			.el-card {
				margin: 0px;
				margin-bottom: 10px;
				border: none;
			}

			.app-item {
				@include PositionRelative(100%, 80px);
				float: left;
				cursor: pointer;
				border-radius: 5px;
				box-shadow: 0 3px 10px 0 rgb(31 35 41 / 4%);

				&:hover {
					box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
				}

				&.open {
					.app-collect {
						visibility: visible;
					}

					.app-design {
						transform: translate(0, -34px);
						background-color: #f3f3f3;
					}
				}

				> a {
					display: block;
					position: relative;
					overflow: hidden;
				}

				.app-visit-area {
					display: flex;
					align-items: center;
					padding: 20px 15px;

					// display: inline-block;
					// width: 194px;
					// height: 144px;
					@at-root .icon-wrapper {
						@include PositionRelative(40px, 40px);
						display: inline-block;
						text-align: center;
						border-radius: 20px;
					}
				}

				.app-collect {
					cursor: pointer;
					visibility: hidden;
				}

				.app-design {
					@include PositionAbsoulte(144px, null, null, 0);
					transform: translate(0, 0);
					transition: all 218ms;
					width: 194px;
					height: 35px;
					line-height: 35px;

					> a {
						@include PositionAbsoulte(null, null, null, 10px);
					}

					> div {
						@include PositionAbsoulte(null, 20px, null, null);
						cursor: pointer;
					}
				}
			}

			.app-title {
				font-weight: 500;
				font-size: 14px;
				margin-left: 12px;
				color: #1f2329;
				overflow: hidden;
				flex: 1;

				p:first-child {
					@include ExtraNotDisplayed();
					line-height: 20px;
				}
			}
		}
	}

	.icon-edit-wrapper {
		@include JustityAndFlexWrap(flex, center, flex-end, null);
		margin-bottom: 20px;

		.icon-wrapper {
			margin-top: 0;
		}
	}

	.drag-item {
		line-height: 30px;
		margin-bottom: 5px;
		padding-left: 3px;
		border: 1px solid #ddd;
		@include GlobalAvatar(300px, null, 5px, null);
		cursor: move;
	}

	.color-cover-1 {
		background-image: -webkit-linear-gradient(#f4cf54, #e89121);
	}

	.color-cover-2 {
		background-image: -webkit-linear-gradient(#fd927e, #f25127);
	}

	.color-cover-3 {
		background-image: -webkit-linear-gradient(#82e89e, #18b875);
	}

	.color-cover-4 {
		background-image: -webkit-linear-gradient(#7dd3fa, #4298d8);
	}

	.color-cover-5 {
		background-image: -webkit-linear-gradient(#71bafc, #2873f3);
	}

	.color-cover-6 {
		background-image: -webkit-linear-gradient(#d69ef8, #8b49ba);
	}

	.appDialog {
		.el-dialog {
			width: 650px;
		}

		.el-dialog__body {
			.groupForm {
				width: 300px;
				margin: 0 auto;
				padding: 0;

				.el-form-item {
					.el-form-item__label {
						padding: 0;
						@include JustityAndFlexWrap(flex, center, center, null);
						font-size: 18px;
						font-weight: 700;
						color: #000;
						min-width: 70px;
					}

					.el-form-item__content > div > div {
						text-align: center;
					}
				}
			}
			.appForm {
				padding: 0 40px;
				.el-form-item {
					.el-form-item__label {
						padding-right: 40px;
					}
				}
			}
		}
	}

	.max-height {
		.el-dialog__body {
			max-height: 500px;
			overflow-y: auto;
		}
	}

	.el-select-dropdown {
		max-width: 243px;
	}

	.appForm {
		.el-select-dropdown__item {
			//   display: inline-block;
			display: block;
			min-width: 100%;
		}
	}
	.edit-group-name {
		display: inline-block !important;
		width: 4px;
		height: 25px;
		background: #e66363 !important;
		vertical-align: top !important;
		margin-right: 5px;
		transform: translateY(5px) !important;
	}
</style>
