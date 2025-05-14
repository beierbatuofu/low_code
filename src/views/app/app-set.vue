<template>
	<!-- 应用设置页面 -->
	<div>
		<m-header>
			<span />
			<template v-slot:bread>
				<div v-route-auth="{ code: 'create' }" class="header-app-name">
					<AppIcon />
					{{ curAppName }}
				</div>
			</template>
			<div slot="right">
				<!-- <span v-if="updateList.length > 0">
					<span style="color: red"> {{ $i18n.t("Mheader.appversionreleasetip") }}</span>
					<el-button class="nav-btn" type="danger" size="mini" plain round @click.stop="versionUp" :disabled="versionUpdating">
						<p style="padding: 1.5px 0; margin: 0 10px">{{ $i18n.t("Mheader.appversionrelease") }}</p>
					</el-button>
				</span> -->

				<el-tooltip placement="bottom">
					<div slot="content" style="text-align: center">{{ $i18n.t("Mheader.goappview") }}</div>
					<rvue-button icon="el-icon-document" class="nav-btn" type="primary" size="mini" circle @click.stop="gotoView"> </rvue-button>
				</el-tooltip>
			</div>
		</m-header>
		<div class="form-list">
			<div class="form-list-left light">
				<div class="left-scroll">
					<div class="top-tab">
						<el-dropdown trigger="click" class="btn-create" @command="handleCommandCreate">
							<el-button type="primary" icon="el-icon-plus"> {{ $t("appedit.create") }}</el-button>
							<el-dropdown-menu slot="dropdown" style="width: 238px">
								<el-dropdown-item command="a"> {{ $t("appedit.createDir") }}</el-dropdown-item>
								<el-dropdown-item command="b">{{ $t("appedit.createForm") }}</el-dropdown-item>
								<el-dropdown-item command="c">{{ $t("appset.createDashboard") }}</el-dropdown-item>
								<el-dropdown-item command="d">{{ $t("appset.createFulldate") }}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<div>
						<img class="customizeImg" :src="imgOff ? `${publicPath}img/search.svg` : `${publicPath}img/cancel.svg`" />
						<el-select
							v-model="searchInfo"
							size="small"
							value-key="name"
							@change="handleInfo(searchInfo)"
							style="margin: 5px 15px; margin-left: 20px; display: block"
							filterable
							remote
							no-match-text
							:remote-method="remoteMethod"
							placeholder="请输入搜索内容"
							@blur="leave"
						>
							<el-option v-for="item in newArr" :key="item.id" :label="item.label" :value="item"> </el-option>
						</el-select>
					</div>
					<el-tree
						ref="tree"
						class="custom-tree"
						:data="formMatrix2"
						node-key="id"
						@node-drag-start="handleDragStart"
						@node-drag-end="handleDragEnd"
						@node-drop="handleDrop"
						draggable
						highlight-current
						:allow-drop="allowDrop"
						:allow-drag="allowDrag"
					>
						<div></div>
						<div class="custom-tree-node" slot-scope="{ node, data }">
							<div v-if="data.type === 'S'" class="item-group one-folder" :style="node.expanded ? 'background:#f0f7ff' : ''">
								<div class="item" @click="if (!node.childNodes.length) node.expanded = !node.expanded;">
									<h3>
										<i class="header-icon" :class="node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'" style="color: #6087fd; font-size: 16px"></i>
										{{ data | getNameLang }}
									</h3>
									<i class="header-icon-arrow" :class="node.expanded ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" style="color: #6087fd; font-size: 14px"></i>
								</div>
								<div class="one-folder-edit" @click.stop>
									<el-dropdown trigger="click" @command="handleCommandFolder">
										<span class="el-dropdown-link">
											<i class="el-icon-s-tools" style="color: #6087fd"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item :command="data">{{ $i18n.t("appset.modifyform") }}</el-dropdown-item>
											<el-dropdown-item
												:command="{
													b: data.code,
													name: data.name,
													children: data.children,
												}"
												style="color: #d84636"
												>{{ $i18n.t("appset.deletefolder") }}</el-dropdown-item
											>
										</el-dropdown-menu>
									</el-dropdown>
								</div>
							</div>
							<div v-else class="one-item">
								<div
									class="one-item-name"
									:class="{
										'one-item-name__created': String(data.versionState).toLowerCase() == 'c',
										'one-item-name__modified': String(data.versionState).toLowerCase() == 'u',
										'one-item-name__deleted': String(data.versionState).toLowerCase() == 'd',
									}"
									@click="edit(data.code, data.type)"
								>
									<div class="icon-container" :style="{ color: data.color }">
										<i
											:class="data.icon || 'el-icon-tickets'"
											:style="{
												fontSize: '18px',
												background: 'rgba(255,255,255,0)',
												marginTop: '3px',
											}"
										></i>
									</div>
									{{ data | getNameLang }}
									<template v-if="['c', 'd', 'u'].includes(String(data.versionState).toLowerCase())">
										<span class="one-item-name-tootip"
											>|
											<template v-if="String(data.versionState).toLowerCase() == 'c'">{{ $i18n.t("appformlist.created") }} </template>

											<template v-else-if="String(data.versionState).toLowerCase() == 'u'">
												{{ $i18n.t("appformlist.modified") }}
											</template>

											<template v-else>
												{{ $i18n.t("appformlist.deleted") }}
											</template>
										</span>
									</template>
								</div>

								<el-dropdown v-if="String(data.versionState).toLowerCase() !== 'd'" class="one-item-edit" trigger="click" @command="handleCommand">
									<span class="el-dropdown-link">
										<i class="el-icon-s-tools" style="color: #6087fd"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item
											:command="{
												...data,
												handleType: 'set',
											}"
											>{{ $i18n.t("appset.modifyform") }}</el-dropdown-item
										>
										<el-dropdown-item
											:command="{
												code: data.code,
												id: data.id,
												name: data.name,
												multiLanguage: data.multiLanguage,
												parentId: null,
												type: data.type,
												handleType: 'del',
											}"
											style="color: #d84636"
											>{{ $l("global.deletion") }}</el-dropdown-item
										>
									</el-dropdown-menu>
								</el-dropdown>
							</div>
						</div>
					</el-tree>
				</div>
			</div>
			<div class="form-list-right">
				<el-row>
					<el-col :span="6" :offset="9">
						<el-button type="primary" @click="toAppSet">{{ $t("appedit.appSet") }}</el-button>
					</el-col>
				</el-row>
			</div>
			<!-- 页面end -->
			<!-- <appset-drawer :drawer="drawerVisible" :appCode="appCode" :id="curAppId" @close="drawerVisible = false"> </appset-drawer> -->

			<!-- 创建文件夹 -->
			<rvue-dialog :title="$t('appedit.createDir')" :visible.sync="dialogFolderVisible" width="580px" :before-close="handleCloseCreate">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $l("appedit.createDir") }}</div>
				</div>
				<el-form ref="folderForm" :model="folder" class="appForm" label-width="150px">
					<el-form-item :label="$t('appedit.dirName')" prop="name" :rules="[{ required: true, message: $l('rules.requiredFields'), trigger: 'blur' }]">
						<el-input v-model="folder.name" maxlength="100" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="handleCloseCreate">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="editFolderName('folderForm')">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 创建表单 -->
			<rvue-dialog :close-on-click-modal="false" destroy-on-close :title="$t('appedit.createForm')" :visible.sync="dialogFormCreateVisible">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $l("appedit.createForm") }}</div>
				</div>
				<el-form v-if="dialogFormCreateVisible" :model="form" class="appForm" label-width="120px">
					<el-form-item :label="$t('appedit.formType')">
						<el-radio-group v-model="form.type">
							<el-radio label="F" border>{{ $t("appedit.processSheet") }}</el-radio>
							<el-radio label="C" border>{{ $t("appedit.generalForm") }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item :label="$t('appedit.formIcon')">
						<icon-set :default="form" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="$t('appedit.formName')">
						<!-- <el-input v-model="form.name" autocomplete="off" style="width: 60%"></el-input> -->
						<RvueLangInput class="el-form-item" :maxlength="100" :field="form.multiLanguage" @change="handleChange" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="dialogFormCreateVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="saveForm">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 修改表单名称、图标 -->
			<rvue-dialog :close-on-click-modal="false" @close="baseConfigCloseHandler" :title="$t('appedit.formSet')" :visible.sync="dialogFormVisible" destroy-on-close>
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font" v-if="form.type == 'P'">{{ $l("appedit.dashboardSet") }}</div>
					<div class="dialog-title-font" v-else>{{ $l("appedit.formSet") }}</div>
				</div>
				<el-form :model="form" v-if="dialogFormVisible" label-width="120px">
					<el-form-item :label="$t('appedit.icon')">
						<icon-set :default="form" :key="form.code" @editIcon="editIcon"></icon-set>
					</el-form-item>
					<el-form-item :label="form.type == 'P' ? $t('appedit.dashboardName') : $t('appedit.formName')">
						<!-- <el-input v-model="form.name" autocomplete="off" style="width: 60%"></el-input> -->
						<RvueLangInput class="el-form-item" :maxlength="100" :field="form.multiLanguage" style="width: 76%" @change="handleChange" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="dialogFormVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="editFormName">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>

			<!--修改文件夹名称 -->
			<rvue-dialog :close-on-click-modal="false" :title="$t('appedit.formSet')" :visible.sync="dialogFolderNameVisible" destroy-on-close>
				<div slot="title" class="dialog-title">
					<!-- <div class="dialog-title-font" v-if="form.type == 'P'">{{ $l("appedit.dashboardSet") }}</div> -->
					<div class="dialog-title-font">{{ $l("appedit.folderSet") }}</div>
				</div>
				<el-form :model="form" v-if="dialogFolderNameVisible" label-width="120px">
					<el-form-item label="文件夹名称">
						<RvueLangInput class="el-form-item" :maxlength="100" :field="form.multiLanguage" style="width: 76%" @change="handleChange" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="dialogFolderNameVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="editfolderName">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 应用发布 -->
			<rvue-dialog :label="$t('appedit.appPub')" :visible.sync="releaseVisible" class="appPub-dialog">
				<div slot="title" class="dialog-title">
					<div class="dialog-title-font">{{ $t("appedit.appPub") }}</div>
				</div>

				<el-table :data="updateList" stripe height="500" max-height="500" style="padding: 0 20px 0">
					<el-table-column property="name" :label="$t('appedit.formName')" min-width="100"></el-table-column>
					<el-table-column property="type" :label="$t('appedit.type')" min-width="100">
						<template slot-scope="scope">
							<el-tag :type="getFormType(scope)" disable-transitions v-if="getFormText(scope)">
								{{ getFormText(scope) }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column property="versionState" :label="$t('appedit.changeContent')" min-width="100">
						<template slot-scope="scope">
							<el-tag :type="getReleaseType(scope)" disable-transitions> {{ getReleaseText(scope) }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column property="createTime" :label="$t('appedit.time')" min-width="160"></el-table-column>
					<el-table-column property="updateTime" :label="$t('appedit.updateTime')" min-width="160"></el-table-column>
				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="releaseCancel">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="releaseSubmit">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>
			<!-- 新建仪表盘 -->
			<rvue-dialog title="创建仪表盘" :visible.sync="dialogChartCreateVisible" width="580px">
				<div slot="title" class="dialog-title" style="border: none">
					<div class="dialog-title-font">创建仪表盘</div>
				</div>
				<el-form ref="chartForm" :model="form" class="appForm" label-width="150px">
					<el-form-item label="仪表盘名称" required>
						<RvueLangInput class="el-form-item" placeholder="请输入" :maxlength="100" :field="form.multiLanguage" @change="handleChange" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="mini" @click="dialogChartCreateVisible = false">{{ $t("linkDataDialog.cancel") }}</el-button>
					<el-button size="mini" type="primary" @click="createChartForm('chartForm')">{{ $t("linkDataDialog.confirm") }}</el-button>
				</div>
			</rvue-dialog>

			<!-- 创建日历图 -->
			<create-fulldate :visible.sync="dialogFulldateCreateVisible"></create-fulldate>
		</div>
	</div>
</template>

<script>
	import draggable from "vuedraggable";
	import { FormModule } from "@/store/modules/form";
	import MHeader from "@/components/m-header/m-header.vue";
	import IconSet from "@/components/iconSet/icon.vue";
	import AppIcon from "./_components/appIcon.vue";
	import { getLocalStorage } from "@/utils/storage";
	//默认流程json
	import { defaultRequrest } from "./_core/defaultRequest";
	import { getNameLang } from "@/core/filters";
	import CreateFulldate from "./_components/createFulldate";
	import {
		getFormList,
		removeFormSingle,
		getData,
		updateFormName,
		saveFormSingle,
		updateVersionRelease,
		queryRecursiveTree,
		saveRecursiveTree,
		addFolder,
		delFolder,
		updateFolder,
		getFormSingle,
		getFormSingleTest,
	} from "@/api/form";
	export default {
		name: "AppSet",
		components: {
			MHeader,
			draggable,
			IconSet,
			AppIcon,
			"create-fulldate": CreateFulldate,
		},
		props: {},
		data() {
			return {
				nodeKey: "",
				formMatrix2: [],
				ghostForm: {
					id: -999,
				},
				dialogFulldateCreateVisible: false,
				dialogFormCreateVisible: false,
				dialogFolderVisible: false,
				dialogFormVisible: false,
				dialogFolderNameVisible: false,
				dialogChartCreateVisible: false,
				versionUpdating: false,
				releaseVisible: false,
				folder: {
					name: "",
				},
				form: {
					name: "",
					multiLanguage: {
						zh: "",
						en: "",
					},
				},
				folderName: {
					name: "",
				},
				updateList: [],
				appName: window.sessionStorage.getItem("appName") || "",
				activeNames: [1],
				collapseComponentData: {
					on: {
						input: this.inputChanged,
					},
					props: {
						value: this.activeNames,
					},
				},
				drag: false,
				drawerVisible: false,
				dialogType: "form", //区分dialog类型
				searchInfo: "",
				selectInfo: [],
				filterName: [],
				filterName2: [],
				arr: [],
				newArr: [],
				imgOff: true,
				filterRule: {
					isDeleted: false,
					matchRules: [[]],
					createTimeBegin: "",
					createTimeEnd: "",
					creater: "",
					sorts: [
						{
							asc: false,
							column: "create_time",
						},
					],
				},
				page: {
					currentPage: 1,
					pageSize: 10,
					pageSizes: [5, 10, 20, 50],
				},
				aCode: this.$route.params.appCode,
				formLength: "",
				folderCode: "",
			};
		},
		watch: {
			$route: function () {
				this.loadPage();
				this.drawerVisible = false;
			},
			dialogFolderVisible: function () {
				this.folder = {
					name: "",
				};
			},
			dialogChartCreateVisible: function () {
				this.folder = {};
			},
		},
		created() {
			this.loadPage();
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: "description",
					disabled: false,
					ghostClass: "ghost",
				};
			},
			curAppName() {
				const curApp = FormModule.curApp;
				const lang = localStorage.getItem("lang");
				return curApp.multiLanguage[lang] || curApp.multiLanguage["zh"];
			},
			curAppId() {
				const curApp = FormModule.curApp;
				return curApp.id;
			},
		},
		methods: {
			leave() {
				this.imgOff = true;
			},
			handleCloseCreate() {
				this.dialogFolderVisible = false;
				this.$refs.folderForm.resetFields();
			},
			// handleFolderNameCreate(){
			// 	this.dialogFolderNameVisible=false;
			// 	this.$refs.folderName.resetFields();
			// 	console.log(this.$refs.folderName);
			// },
			fn(list, newList) {
				let cloneList = this.$utils.deepClone(list);
				cloneList.forEach((item) => {
					if (!item.children) {
						newList.push(item);
					} else {
						this.fn(item.children, newList);
					}
				});
			},
			remoteMethod(query) {
				this.selectInfo = [];
				this.newArr = [];
				if (query !== "") {
					this.imgOff = false;
					this.fn(this.formMatrix2, this.selectInfo);
					//console.log(this.selectInfo, "00000");
					this.filterName = this.selectInfo.filter((item) => {
						if (item.name != undefined) {
							return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
						}
					});
					this.filterName2 = this.formMatrix2.filter((item) => {
						if (item.name != undefined) {
							return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
						}
					});
					this.arr = this.filterName.concat(this.filterName2);
					for (var item1 of this.arr) {
						let flag = true;
						for (var item2 of this.newArr) {
							if (item1.id == item2.id) {
								flag = false;
							}
						}
						if (flag) {
							this.newArr.push(item1);
						}
					}
					// this.unqueArr(this.arr);
				} else {
					this.imgOff = true;
					this.newArr = [];
				}
			},
			handleInfo(el) {
				this.searchInfo = "";
				this.imgOff = true;
				if (el.type == "S") {
					var trees = this.$refs.tree.store.nodesMap;
					//this.nodeKey=el.id;
					Object.keys(trees).forEach((item) => {
						if (el.id == item) {
							trees[item].expanded = true;
						} else {
							trees[item].expanded = false;
						}
					});
				} else {
					this.edit(el.code, el.type); //按钮生成
				}
				console.log(el, "222");
				let test = this.formMatrix2.find((item) => {
					if (item.children) {
						let demo = item.children.map((it) => it.id);
						return demo.includes(el.id);
					}
				});
				//console.log(test, 999999);
				if (test != undefined) {
					this.formMatrix2.forEach((item) => {
						if (item.id == test.id) {
							item.checked = true;
						} else {
							item.checked = false;
						}
					});
				} else {
					this.formMatrix2.forEach((item) => {
						item.checked = false;
					});
				}
			},
			loadPage() {
				// document.title = this.curAppName;
				this.appCode = this.$route.params.appCode;
				//UserModule.SET_ENC_MODE("test");
				this.getList();
			},
			handleChange(multiLanguage) {
				this.form.multiLanguage = multiLanguage;
				console.log(multiLanguage, "multiLanguage");
				const lang = getLocalStorage("lang") || "zh";
				this.form.name = multiLanguage[lang] || Object.values(multiLanguage)[0] || (this.form.name ? this.form.name.trim() : "");
			},
			toAppSet() {
				//this.drawerVisible = true;
				const { appCode, tenantId } = this.$route.params;
				// /:tenantId/appd/:appCode/:flag/conf/
				this.$router.push({
					path: `/${tenantId}/appd/${appCode}/p/conf/`,
				});
			},
			inputChanged(val) {
				this.activeNames = val;
			},
			// 新增文件夹
			editFolderName(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (!(this.folder.name && this.folder.name.trim())) return;
						addFolder(this.appCode, {
							name: this.folder.name.trim(),
						}).then((res) => {
							this.$message.success("新增成功！");
							this.dialogFolderVisible = false;
							this.getList();
						});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			//创建仪表盘
			createChartForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (!(this.form.name && this.form.name.trim())) {
							this.$message.error("请输入仪表盘名称");
							return;
						}
						// //如果
						// if (!this.form.multiLanguage["zh"]) this.form.multiLanguage["zh"] = "默认名字";
						// if (!this.form.multiLanguage["en"]) this.form.multiLanguage["en"] = "默认名字";
						saveFormSingle(this.appCode, {
							...this.form,
							name: this.form.name.trim(),
							isLeaf: 1,
						}).then((res) => {
							if (res.data) {
								this.edit(res.data, "P");
								defaultRequrest.call(this, res.data);
							}
						});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			handleCommandCreate(command) {
				// 创建文件夹
				switch (command) {
					case "a":
						this.dialogFolderVisible = true;
						this.folder = {};
						break;
					case "c":
						//创建仪表盘
						this.dialogChartCreateVisible = true;
						this.form = {
							...this.form,
							type: "P",
						};
						break;
					case "d":
						this.dialogFulldateCreateVisible = true;

						break;
					default:
						this.form = {
							...this.form,
							type: "F",
						};

						this.dialogFormCreateVisible = true;
						break;
				}
				/*
		            if (command === "a") {
		                this.dialogFolderVisible = true;
		                this.folder = {};
		            } else if (command === "c") {
		                //创建仪表盘
		                this.dialogChartCreateVisible = true;
		                this.form = {
		                    ...this.form,
		                    type: "P",
		                };
		            } else if () {
		            } else {
		                // 创建表单
		                // this.addFlow()
		                this.form = {
		                    type: "F",
		                    ...this.form
		                };
		                this.dialogFormCreateVisible = true;
		            }*/
			},
			editIcon(obj) {
				console.log(this.form);
				this.form = {
					...this.form,
					icon: obj.icon,
					color: obj.color,
				};
			},
			saveForm() {
				if (!(this.form.name && this.form.name.trim())) {
					this.$message.error("请输入表单名称");
					return;
				}
				saveFormSingle(this.appCode, {
					...this.form,
					name: this.form.name.trim(),
					isLeaf: 1,
				}).then(async (res) => {
					if (res.data) {
						this.edit(res.data);
						//TODO
						defaultRequrest.call(this, res.data);
					}
				});
			},
			getList() {
				// 0-无变化，c-create,新建，u-update:，更新，d-delete，删除
				/* getFormList(this.appCode).then((res) => {
			       	this.formList = res.data || [];
			       	this.updateList = [];
			       	this.formList.forEach(item => {
			       		if(item.versionState != "0") {
			       			this.updateList.push(item);
			       		}
			       	})
			       	FormModule.setFormList(res.data || []);
			       }).catch(err => {
			       	this.$message.error(err.msg)
			       }); */
				FormModule.queryFormsTree(this.appCode).then((result) => {
					this.updateList = [];
					this.formMatrix2 = result.concat([this.ghostForm]);
				});
				/*
						queryRecursiveTree(this.appCode).then((response) => {
							const res = response.data;
							this._normalizeTree2(res);
							// if (res.formMap) {
							// 	const formMap = res.formMap;
							// 	console.log(formMap, "res");
							// 	Object.keys(formMap).forEach((item) => {
							// 		if (formMap[item].versionState != "0" && item != "-10000") {
							// 			this.updateList.push(formMap[item]);
							// 		}
							// 	});
							// }
						});
			               */
			},
			collapseFolder(id) {
				for (let i = 0; i < this.formMatrix2.length; i++) {
					if (this.formMatrix2[i].id === id) {
						this.formMatrix2[i].checked = !this.formMatrix2[i].checked;
						break;
					}
				}
				this.$forceUpdate();
			},
			handleDragStart(node, ev) {
				console.log("drag start", node);
			},
			handleDragEnter(draggingNode, dropNode, ev) {
				// console.log('tree drag enter: ', dropNode.label);
			},
			handleDragLeave(draggingNode, dropNode, ev) {
				// console.log('tree drag leave: ', dropNode.label);
			},
			handleDragOver(draggingNode, dropNode, ev) {
				// console.log('tree drag over: ', dropNode.label);
			},
			handleDragEnd(draggingNode, dropNode, dropType, ev) {
				console.log("tree drag end: ", dropNode && dropNode.label, dropType);
			},
			handleDrop(draggingNode, dropNode, dropType, ev) {
				console.log("tree drop: ", dropNode, dropType);
				saveRecursiveTree(this.appCode, {
					idRecursiveTree: this._normalizeIdTree2(this.formMatrix2),
				}).then((res) => {
					if (!res.data) {
						this.$message.error("移动失败！");
					}
				});
			},
			allowDrop(draggingNode, dropNode, type) {
				if (dropNode.data.id === -999) {
					return type === "prev";
				} else if (draggingNode.data.type === "S") {
					return type !== "inner" && dropNode.level === 1; // 文件夹不可拖进文件夹
				} else if (type === "inner") {
					return dropNode.data.type === "S" && dropNode.level === 1; // 表单只能拖进一级文件夹
				} else {
					return true;
				}
			},
			allowDrag(draggingNode) {
				return draggingNode.data.id !== -999;
			},
			// 后端 -> 前端展示
			_normalizeTree2({ idRecursiveTree, formMap }) {
				// if (!idRecursiveTree) return;
				// const ret = [];
				// for (let i = 0; i < idRecursiveTree.length; i++) {
				// 	const id = idRecursiveTree[i].id;
				// 	if (formMap[id] && !formMap[id].parentId) {
				// 		if (formMap[id] && formMap[id].type === "S") {
				// 			ret.push(createFolder(idRecursiveTree[i]));
				// 		} else if (formMap[id] && formMap[id].type) {
				// 			ret.push(createForm(id));
				// 		}
				// 	}
				// }
				// function createFolder(item) {
				// 	return {
				// 		id: item.id,
				// 		type: "S",
				// 		name: formMap[item.id].name || "文件夹",
				// 		label: formMap[item.id].name || "文件夹",
				// 		code: formMap[item.id].code,
				// 		children: item.childList.filter((v) => formMap[v.id]).map((v) => createForm(v.id)),
				// 	};
				// }
				// function createForm(id) {
				// 	return {
				// 		id: id,
				// 		label: formMap[id].name,
				// 		...formMap[id],
				// 	};
				// }
				// this.formMatrix2 = ret.concat([this.ghostForm]);
				// console.log(this.formMatrix2, "this.formMatrix2");
			},
			// 前端展示 -> 后端
			_normalizeIdTree2(formMatrix) {
				const ret = [];
				formMatrix.forEach((item) => {
					if (item.id !== -999) {
						ret.push({
							id: item.id,
							childList:
								item.children &&
								item.children.map((v) => {
									return {
										id: v.id,
										childList: [],
									};
								}),
						});
					}
				});
				return ret;
			},
			// 拖动表单、文件夹回调
			onChange2(e) {
				// e有3个值，moved, added, removed
				if (e.removed) return;
				saveRecursiveTree(this.appCode, {
					idRecursiveTree: this._normalizeIdTree2(this.formMatrix2),
				}).then((res) => {
					if (!res.data) {
						this.$message.error("移动失败！");
					}
				});
			},
			//move回调方法
			onMove(e) {
				// console.log(e)
				// 拖拽的文件夹&&停靠的文件夹
				if (e.draggedContext.element.type === "S" && e.to.className !== "ae-entry-list") return false;
				return true;
			},
			addFlow() {
				// this.$router.push({
				//     path: `${this.$route.path}/flow`
				// })
				saveFormSingle(this.appCode, {
					name: "未命名流程",
					type: "F",
					isLeaf: 1,
				}).then((res) => {
					if (res.data) {
						this.edit(res.data);
					}
				});
			},
			add() {
				saveFormSingle(this.appCode, {
					name: "未命名表单",
					type: "C",
				}).then((res) => {
					if (res.data) {
						this.edit(res.data);
					}
				});
			},
			edit(code, type) {
				const { tenantId, appCode } = this.$route.params;
				const sType = type === "P" ? "bi" : "form";
				const query = type === "P" ? "biDashboard" : "edit";
				let path = `/${tenantId}/appd/${this.appCode}/p/form/${code}/`;
				FormModule.setForm({
					appCode: this.appCode,
					formCode: code,
				});

				switch (type) {
					case "P":
						path = `/${tenantId}/appd/${appCode}/p/bi/${code}/dashboard_design/`;
						break;
					case "D":
						path = `/${tenantId}/appd/${appCode}/p/fulldate/${code}/fulldate_design/`;
						break;
				}

				// const path = type == "P" ? `/${tenantId}/appd/${appCode}/p/bi/${code}/dashboard_design/` : `/${tenantId}/appd/${this.appCode}/p/form/${code}/`;
				this.$router.push({
					path,
					replace: true,
				});
			},
			async deleteForm({ code, id, parentId, type }) {
				const formMatrix = this.formMatrix2;
				//删除确认是否存在仪表盘报表
				if (type == "P") {
					let resL = await getFormSingleTest(this.$route.params.appCode, code);
					if (resL.data.structure?.layout.length > 0) {
						this.$message.error("当前仪表盘下存在报表，不能删除");
						return;
					}
				}
				removeFormSingle(this.appCode, code, {
					idRecursiveTrees: this._normalizeIdTree2(formMatrix),
				}).then((res) => {
					if (parentId) {
						for (let i = 0; i < formMatrix.length; i++) {
							if (formMatrix[i].id === parentId) {
								for (let j = 0; j < formMatrix[i].children; j++) {
									if (formMatrix[i].children[j].id === id) {
										delete formMatrix[i].children[j];
										break;
									}
								}
								break;
							}
						}
					} else {
						for (let i = 0; i < formMatrix.length; i++) {
							if (formMatrix[i] && formMatrix[i].id === id) {
								delete formMatrix[i];
								break;
							}
						}
					}
					if (res.data) {
						this.$message({
							message: "删除成功！",
							type: "success",
						});
						this.getList();
					}
				});
			},
			// 表单修改名称图标/删除
			handleCommand(command) {
				console.log(command);
				if (command.handleType == "del" && command.type == "D") {
					this.$prompt(`如确定删除,请输入名称`, `您确定要删除${command.name}吗？`, {
						type: "warning",
						center: true,
					}).then(({ value }) => {
						if (value === command.name) {
							this.deleteForm(command);
						} else {
							this.$message.error("输入错误！");
						}
					});
					return;
				}
				command.handleType == "del" &&
					command.type != "P" &&
					getData(this.aCode, command.code, this.page.currentPage, this.page.pageSize, this.filterRule).then((res) => {
						this.formLength = res.data.records.length;
						const name = getNameLang(command);
						const title = command.type === "P" ? "仪表盘" : "表单";
						this.$prompt(`当前表单下存在${this.formLength}条有效数据,如确定删除,请输入${title}名称`, `您确定要删除'${name}'${title}吗？`, {
							type: "warning",
							center: true,
						}).then(({ value }) => {
							if (value === name) {
								this.deleteForm(command);
							} else {
								this.$message.error("输入错误！");
							}
						});
					});
				//仪表盘删除
				if (command.handleType == "del" && command.type == "P") {
					this.deleteForm(command);
				}
				// 打开表单设置弹窗
				if (command.id && command.handleType == "set") {
					//仪表盘没有多语言空白bug
					if (command.type == "P" && !command.multiLanguage["en"]) {
						command.multiLanguage.en = "dashboard";
					}
					this.dialogFormVisible = true;
					this.form = {
						...command,
						multiLanguage: { ...command.multiLanguage },
					};
				}
			},
			handleCommandFolder(command) {
				if (command.b) {
					if (command.children && command.children.length) {
						this.$message.warning("文件夹下有表单，不能删除！");
						return;
					}
					this.$confirm(`您确定要删除'${command.name}'文件夹吗？`, "提示", {
						type: "warning",
						center: true,
					}).then(() => {
						const formMatrix = this.formMatrix2;
						for (let i = 0; i < formMatrix.length; i++) {
							if (formMatrix[i].code === command.b) {
								delete formMatrix[i];
								break;
							}
						}
						delFolder(this.appCode, command.b, {
							idRecursiveTrees: this._normalizeIdTree2(formMatrix),
						}).then((res) => {
							if (res.data) {
								this.$message.success("删除成功！");
								this.getList();
							} else {
								this.$message.errer(res.msg);
							}
						});
					});
				} else {
					this.folderCode = command.code;
					this.form.name = command.name;
					this.form = {
						...command,
						multiLanguage: { ...command.multiLanguage },
					};
					this.form.multiLanguage.zh = this.form.name;
					this.dialogFolderNameVisible = true;
				}
			},
			// 修改表单名称 +icon+color
			editFormName() {
				if (!(this.form.name && this.form.name.trim())) {
					this.$message.error("请输入表单名称");
					return;
				}
				updateFormName(this.appCode, this.form.code, {
					...this.form,
					name: this.form.name.trim(),
					isLeaf: true,
				}).then((res) => {
					if (res.data) {
						this.dialogFormVisible = false;
						this.$message.success("修改成功！");
						this.getList();
					}
				});
			},
			//修改文件夹名称
			editfolderName() {
				if (!(this.form.name && this.form.name.trim())) {
					this.$message.error("请输入文件夹名称");
					return;
				}
				updateFolder(this.appCode, this.folderCode, {
					name: this.form.name.trim(),
				}).then((res) => {
					if (res.data) {
						this.dialogFolderNameVisible = false;
						this.$message.success("修改成功！");
						this.getList();
					} else {
						this.$message.errer(res.msg);
					}
				});
			},
			async versionUp() {
				this.releaseVisible = true;
			},
			async gotoView() {
				let { tenantId, appCode } = this.$route.params;
				if (this.updateList.length > 0) {
					this.$message({
						message: "应用有修改，请发布应用",
						type: "warning",
					});
					this.$router.push({
						path: `/${tenantId}/app/${appCode}/p/`,
					});
					// this.$prompt("应用有修改，请先发布应用", "提示", {
					// 	type: "warning",
					// 	center: true,
					// 	showConfirmButton: true,
					// 	showCancelButton: false,
					// 	showInput: false,
					// });
				} else {
					this.$router.push({
						path: `/${tenantId}/app/${appCode}/p/`,
					});
				}
			},
			releaseCancel() {
				this.releaseVisible = false;
				this.$message.info("用户取消发布");
			},
			releaseSubmit() {
				updateVersionRelease(this.appCode)
					.then((resp) => {
						this.$message.success("发布成功");
						this.releaseVisible = false;
						this.getList();
					})
					.catch((err) => {
						this.$message.error(err.msg);
						this.releaseVisible = false;
					});
			},
			filterTag(value, row) {
				return row.tag === value;
			},
			getReleaseType(scope) {
				const versionState_temp = scope.row.versionState ? scope.row.versionState.toLowerCase() : "";
				if (versionState_temp === "c") {
					return "success";
				} else if (versionState_temp === "d") {
					return "danger";
				} else if (versionState_temp === "u") {
					return "primary";
				}
			},
			getReleaseText(scope) {
				const versionState_temp = scope.row.versionState != null ? scope.row.versionState.toLowerCase() : "";
				if (versionState_temp === "c") {
					return "创建";
				} else if (versionState_temp === "d") {
					return "删除";
				} else if (versionState_temp === "u") {
					return "更新";
				}
			},
			getFormType(scope) {
				const formType_temp = scope.row.type != null ? scope.row.type.toLowerCase() : "'";
				if (formType_temp === "c") {
					return "info";
				} else if (formType_temp === "f") {
					return "warning";
				} else {
					return "";
				}
			},
			getFormText(scope) {
				const formType_temp = scope.row.type != null ? scope.row.type.toLowerCase() : "";
				if (formType_temp === "p") {
					return "仪表盘";
				} else if (formType_temp === "c") {
					return "普通表单";
				} else if (formType_temp === "f") {
					return "流程表单";
				} else if (formType_temp === "s") {
					return "文件夹";
				} else {
					return "";
				}
			},
			/**
			 * @description: 基础设置dialog关闭回调 清空名字 防止点击新建残留
			 * @param {*}
			 * @return {*}
			 */
			baseConfigCloseHandler() {
				this.form.multiLanguage.zh = "";
				this.form.multiLanguage.en = "";
				this.form.name = "";
			},
		},
	};
</script>

<style>
	.mce-content-body {
		padding: 10px !important;
	}
</style>

<style lang="scss" scoped>
	.customizeImg {
		width: 24px;
		margin-right: 5px;
		position: absolute;
		right: 20px;
		top: 84px;
		z-index: 10;
		opacity: 0.5;
	}
	.btnTool {
		width: 20px;
		height: 15px;
		vertical-align: bottom;
		margin-right: 10px;
		margin-left: 5px;
	}
	.btnTitle {
		display: inline-block;
		margin-right: 10px;
		vertical-align: text-top;
	}
	.form-list {
		background: #fff;
		@include PositionAbsoulte(56px, 0, 0, 0);
	}
	.light {
		@include PositionAbsoulte(0, null, null, 0);
		width: 280px;
		height: 100%;
		border-right: 1px solid #e0e0e0;
		overflow: hidden;
		z-index: 9;
		background-color: #fff;
		.left-scroll {
			width: 280px;
			height: 100%;
			@include PositionAbsoulte(0, 0, 0, 0);
			overflow-x: hidden;
			overflow-y: auto;
		}
	}
	.top-tab {
		display: block;
		position: relative;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		background: #fff;
		padding: 0 15px 0 20px;
		margin: 30px auto 10px;
		.btn-create,
		.btn-create .el-button {
			width: 100%;
		}
	}
	.one-item {
		cursor: pointer;
		line-height: 38px;
		padding: 0 30px;
		font-size: 14px;
		@include JustityAndFlexWrap(flex, space-between, center, null);
		.one-item-name {
			width: 220px;
			text-align: left;
			@include ExtraNotDisplayed();
			&-tootip {
				font-size: 12px;
			}
			&__created {
				color: #67c23a;
			}
			&__modified {
				color: #6087fd;
			}
			&__deleted {
				color: #f56c6c;
				text-decoration: line-through;
			}
		}
		.one-item-edit {
			display: none;
		}
	}
	.one-item:hover {
		background-color: #f2f6fc;
		.one-item-edit {
			display: inline-block;
		}
	}
	.form-list-right {
		@include PositionAbsoulte(0, 0px, 0, 280px);
		overflow: auto;
		background: #eff4f7;
	}
	.el-row {
		margin: 50px auto;
	}
	.flip-list-move {
		transition: transform 0.5s;
	}
	.no-move {
		transition: transform 0s;
	}
	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
	}
	.list-group {
		display: flex;
		flex-direction: column;
		min-height: 38px;
	}
	.list-group-item {
		cursor: move;
	}
	.list-group-item i {
		cursor: pointer;
	}
	.header-icon {
		margin-left: 20px;
		margin-right: 15px;
	}
	.header-icon-point {
		display: none;
		@include PositionAbsoulte(10px, null, null, 0);
	}
	.one-folder {
		width: 100%;
		@include JustityAndFlexWrap(flex, space-between, null, null);
		&:hover {
			.one-folder-edit {
				display: inline-block;
			}
		}
		.one-folder-edit {
			display: none;
			margin-right: 10px;
		}
	}
	.icon-container {
		@include PositionRelative(20px, 20px);
		display: inline-block;
		line-height: 20px;
		text-align: center;
		@include GlobalAvatar(null, null, 3px, null); //注释: workbench 选择el-icon-menu图片为白色
		.el-icon-menu {
			// color: #fff !important;
		}
	}
	.ae-entry-list {
		margin-top: 34px;
		padding-left: 14px;
		.group-pane {
			overflow: visible;
			.item-group {
				line-height: 38px;
				box-sizing: border-box;
				.item {
					width: 90%;
					@include JustityAndFlexWrap(flex, space-between, center, null);
					padding: 0 10px;
					cursor: pointer;
					h3 {
						@include ExtraNotDisplayed();
						font-weight: 700;
						font-size: 12px;
					}
				}
			}
			> ul {
				&.list-enter-active,
				&.list-leave-active {
					transition: all 0.1s;
				}
				&.list-enter,
				&.list-leave-to {
					height: 0;
				}
				.one-item {
					padding-left: 68px;
				}
			}
		}
		.item-pane {
			display: block;
			position: relative;
			overflow: visible;
			.one-item-name {
				.icon-container {
					margin-right: 14px;
				}
			}
		}
	}
	::v-deep .appForm {
		//padding: 0 40px;
		.el-form-item {
			.el-form-item__label {
				//padding-right: 40px;
				text-align: center !important;
				padding: 0px !important;
			}
			.el-form-item__content {
				padding-right: 50px;
			}
		}
	}
	::v-deep .el-dialog__body {
		padding-top: 20px !important;
	}
	::v-deep .appPub-dialog {
		.el-dialog {
			//bug 0001206
			margin-top: 10vh !important;
			min-width: 800px !important;
		}
		.el-dialog__body {
			border-bottom: none !important;
			height: calc(100vh - 40vh);
		}
	}
	.el-form-item__content {
		margin-left: 100px;
	}
</style>

<style lang="scss">
	.el-tree.custom-tree {
		&.is-dragging {
			.one-item:hover .one-item-edit,
			.one-folder:hover .one-folder-edit {
				opacity: 0;
			}
		}
		.el-tree-node__content > .el-tree-node__expand-icon {
			padding: 0;
			font-size: 0;
			height: 38px;
			transform: none;
		}
		.el-tree-node > .el-tree-node__content,
		.el-tree-node > .el-tree-node__children .el-tree-node {
			height: 38px;
		}
		> .el-tree-node:nth-last-child(2) > .el-tree-node__content {
			visibility: hidden;
		}
		.custom-tree-node {
			height: 38px;
			flex: 1;
			.item-group {
				line-height: 38px;
				box-sizing: border-box;
				width: 100%;
				@include JustityAndFlexWrap(flex, space-between, null, null);
				.item {
					@include PositionRelative(90%, null);
					@include JustityAndFlexWrap(flex, space-between, center, null);
					padding: 0 13px;
					cursor: pointer;
					h3 {
						width: 220px;
						@include ExtraNotDisplayed();
						font-weight: 700;
						font-size: 12px;
					}
				}
			}
			.one-folder {
				&:hover {
					background-color: #f2f6fc;
					.one-folder-edit {
						display: inline-block;
					}
				}
				.one-folder-edit {
					display: none;
					margin-right: 10px;
				}
			}
			.one-item {
				.one-item-name {
					.icon-container {
						margin-right: 14px;
					}
				}
			}
		}
		.el-tree-node__children .one-item .one-item-name {
			width: 195px;
			margin-left: 17px;
		}
		.el-tree-node.is-drop-inner > .el-tree-node__content {
			outline: #6087fd dashed 1px;
			outline-offset: -2px;
		}
		.el-tree__drop-indicator {
			transform: translateX(30px);
		}
		.one-folder-edit,
		.one-item-edit {
			.button-style,
			.el-button--primary:hover,
			.el-button--primary:active,
			.el-button--primary:focus,
			.el-button--primary:focus:not(.focusing),
			.el-dropdown-selfdefine:focus:active {
				background-color: transparent !important;
			}
		}
	}
</style>
