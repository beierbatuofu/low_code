<template>
	<!-- 应用访问页面 -->
	<div>
		<m-header @passValue="passValue">
			<span />
			<template>
				<div class="header-app-name" v-route-auth="{ code: 'create' }" :title="curAppName">
					<i class="form-list-left-menu el-icon-menu" @click="handleShowMenu" />
					<AppIcon class="app-icon" />
					{{ curAppName }}
				</div>
			</template>
			<template v-slot:right>
				<!-- <router-link
					v-if="!isMobile && curPerm.isAppDesign && $route.params.formCode"
					:to="
						curFormType != 'P'
							? `/${$route.params.tenantId}/appd/${$route.params.appCode}/p/form/${$route.params.formCode}`
							: `/${$route.params.tenantId}/appd/${$route.params.appCode}/p/bi/${$route.params.formCode}/dashboard_design/`
					"
				>
					<el-tooltip placement="bottom">
						<div slot="content" style="text-align: center">{{ curFormType != "P" ? $t("Mheader.editForm") : $t("Mheader.editDashboard") }}</div>
						<rvue-button icon="el-icon-edit" class="nav-btn" type="primary" size="mini" circle> </rvue-button>
					</el-tooltip>
				</router-link> -->

				<router-link
					class="dev-apps"
					v-if="!isMobile && isCurPerm"
					v-notCanDevApps="$route.params.appCode"
					:to="{ path: curPerm.isAppDesign ? `/${$route.params.tenantId}/appd/${$route.params.appCode}/d/` : `/${$route.params.tenantId}/appd/${$route.params.appCode}/p/conf/role` }"
				>
					<el-tooltip placement="bottom">
						<div slot="content" style="text-align: center">{{ curPerm.isAppDesign ? "应用管理" : "应用设置" }}</div>
						<rvue-button icon="el-icon-setting" class="nav-btn" type="primary" size="mini" circle> </rvue-button>
					</el-tooltip>
				</router-link>
			</template>
		</m-header>
		<div class="form-list">
			<!-- 开关 -->
			<div :style="{ left: isCollapse ? '49px' : '201px', display: btnShow ? '' : 'none' }" class="iconR">
				<i class="iconSwitch" :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" @click="isCollapse = !isCollapse"></i>
			</div>
			<!-- 左侧 start -->
			<div class="form-list-left dark" :class="bShowMenu ? '' : 'formList'" :style="{ width: isCollapse ? '68px' : '220px', display: leftSideShow ? '' : 'none' }">
				<div class="app-flowcenter">
					<div class="flow-node" @click="go('/todo')">
						<div class="flow-content">
							<i class="iconfont icondeal" :style="{ fontSize: '20px', color: '#6087FD' }"></i>
							<span class="node-text">{{ $i18n.t("Dashboard.mytodolist") }}</span>
						</div>
					</div>
					<!-- <div class="flow-node" @click="go('/create')">
						<div class="flow-content">
							<i class="iconfont iconstart" :style="{ fontSize: '20px', color: '#409EFF' }"></i>
							<span class="node-text">{{ $i18n.t("Dashboard.mylaunch") }}</span>
						</div>
					</div>
					<div class="flow-node" @click="go('/transactors')">
						<div class="flow-content">
							<i class="iconfont iconhandle" :style="{ fontSize: '20px', color: '#409EFF' }"></i>
							<span class="node-text">{{ $i18n.t("Dashboard.myhandle") }}</span>
						</div>
					</div>
					<div class="flow-node">
						<div class="flow-content">
							<i class="el-icon-s-promotion" :style="{ fontSize: '20px', color: '#409EFF' }"></i>
							<span class="node-text">抄送我的</span>
						</div>
					</div> -->
					<div v-if="!isCollapse">
						<img class="searchImg customizeIcon" :src="imgOff ? `${publicPath}img/search.svg` : `${publicPath}img/cancel.svg`" />
						<el-select
							v-model="searchInfo"
							size="small"
							value-key="name"
							@change="handleInfo(searchInfo)"
							style="margin: 5px 10px; width: 90%"
							filterable
							remote
							no-match-text
							reserve-keyword
							:remote-method="remoteMethod"
							:loading="loading"
							placeholder="请输入搜索内容"
							@blur="leave"
						>
							<el-option v-for="item in newArr" :key="item.value" :label="item.name" :value="item"> </el-option>
						</el-select>
					</div>
					<div v-else>
						<div class="sketchImg" @click="isCollapse = !isCollapse">
							<img class="searchImg" :src="`${publicPath}img/search.svg`" />
						</div>
					</div>
				</div>
				<div class="left-scroll" :style="{ backgroundColor: themeStyle.navLeftBackground }">
					<!-- 展开时 -->
					<ul v-if="!isCollapse && searchInfo == ''" class="ae-entry-list">
						<li v-for="items in formMatrix2" :key="items.id" :id="infoVal.id" :class="items.type === 'S' ? 'group-pane' : 'item-pane'" ref="lilist">
							<template v-if="items.type === 'S'">
								<div class="item-group one-folder" @click="collapseFolder(items)" :class="`${items.checked ? 'theme2' : ''}`">
									<div class="item">
										<i class="header-icon" :class="items.checked ? 'el-icon-folder-opened' : 'el-icon-folder'" style="color: #6087fd; font-size: 18px"></i>
										<h3>{{ items | getNameLang }}</h3>
									</div>
								</div>
								<ul
									:style="{
										display: items.checked ? 'block' : 'none',
										backgroundColor: themeStyle.folderUnderBackground,
									}"
								>
									<li class="item-pane" :key="item.id" v-for="item in items.children">
										<div :class="`one-item ${item.code === $route.params.formCode ? 'focus theme1' : ''}`" @click="edit(item.code, item.type)">
											<div class="one-item-name">
												<div class="icon-container" :style="{ color: item.color }">
													<i
														:class="item.icon || 'el-icon-tickets'"
														:style="{
															fontSize: '18px',
															background: 'rgba(255,255,255,0)',
															marginTop: '3px',
														}"
													></i>
												</div>
												{{ item | getNameLang }}
											</div>
										</div>
									</li>
								</ul>
							</template>
							<div v-else :class="`one-item ${items.code === $route.params.formCode ? 'focus theme1' : ''}`">
								<div
									class="one-item-name"
									@click="
										edit(items.code, items.type);
										bShowMenu = false;
									"
								>
									<div class="icon-container" :style="{ color: items.color }">
										<i
											:class="items.icon || 'el-icon-tickets'"
											:style="{
												fontSize: '18px',
												background: 'rgba(255,255,255,0)',
												marginTop: '3px',
											}"
										></i>
									</div>
									{{ items | getNameLang }}
								</div>
							</div>
						</li>
					</ul>

					<!-- <ul v-if="!isCollapse&& searchInfo!=''" class="ae-entry-list">
						<li :title="infoVal.name" :class="infoVal.type === 'S' ? 'group-pane' : 'item-pane'">
							<div :class="`one-item ${infoVal.code === $route.params.formCode ? 'focus theme1' : ''}`">
								<div class="one-item-name" @click=" edit(infoVal.code)" bShowMenu = false;>
									<div class="icon-container" :style="{ color: infoVal.color }">
										<i :class="infoVal.icon || 'el-icon-tickets'" 
										   :style="{
												fontSize: '18px',
												background: 'rgba(255,255,255,0)',
												marginTop: '3px',
											}" ></i>
									</div>
									{{searchInfo | getNameLang}}
								</div>
							</div>
						</li>
					</ul> -->
					<!-- 折叠后 -->
					<ul v-else class="ae-entry-list">
						<li v-for="items in formMatrix2" :key="items.id" :id="items.id" :class="items.type === 'S' ? 'group-pane' : 'item-pane'">
							<template v-if="items.type === 'S' && items.children.length >= 0">
								<!-- <template v-if="items.type === 'S'"> -->
								<el-popover placement="right" width="100px" trigger="hover">
									<div slot="reference" class="item-group one-folder">
										<div class="item" style="padding-left: 3px">
											<i class="header-icon" :class="items.checked ? 'el-icon-folder-opened' : 'el-icon-folder'" style="color: #6087fd; font-size: 18px"></i>
											<h3>{{ items | getNameLang }}</h3>
										</div>
									</div>
									<ul>
										<li class="item-pane" :key="item.id" v-for="item in items.children">
											<div :class="`one-item ${item.code === $route.params.formCode ? 'focus theme1' : ''}`">
												<div
													class="one-item-name"
													@click="
														edit(item.code, item.type);
														bShowMenu = false;
													"
												>
													<div class="icon-container" :style="{ color: item.color }">
														<i
															:class="item.icon || 'el-icon-tickets'"
															:style="{
																fontSize: '18px',
																background: 'rgba(255,255,255,0)',
																marginTop: '3px',
															}"
														></i>
													</div>
													{{ item | getNameLang }}
												</div>
											</div>
										</li>
									</ul>
								</el-popover>
							</template>
							<div v-else>
								<rvue-tooltip v-if="isCollapse" popper-class="item-pane" effect="dark" :content="items | getNameLang" placement="right">
									<div
										:class="`one-item ${items.code === $route.params.formCode ? 'focus theme1' : ''}`"
										style="padding: 0 21px"
										@click="
											edit(items.code, items.type);
											bShowMenu = false;
										"
									>
										<div class="one-item-name">
											<!-- <rvue-tooltip v-if="isCollapse" popper-class="item-pane" effect="dark" :content="items | getNameLang" placement="right"> -->
											<div class="icon-container" :style="{ color: items.color }">
												<i
													:class="items.icon || 'el-icon-tickets'"
													:style="{
														fontSize: '18px',
														background: 'rgba(255,255,255,0)',
														marginTop: '3px',
													}"
												></i>
											</div>
											<!-- </rvue-tooltip> -->
											{{ items | getNameLang }}
										</div>
									</div>
								</rvue-tooltip>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!-- 左侧 end -->
			<div class="form-list-right" :style="{ backgroundColor: themeStyle.mainBackground }" :id="routePath">
				<transition name="fade" mode="out-in">
					<router-view :key="routePath"></router-view>
				</transition>
				<rvue-empty v-if="!$route.params.formCode">
					<div class="RvueNoData">请选择表单</div>
				</rvue-empty>
			</div>
		</div>
	</div>
</template>

<script>
	import { getFormList, getFormSingle, saveData, queryRecursiveTree } from "@/api/form";
	import { changeFlowState } from "@/api/flowcenter";
	import { FormModule } from "@/store/modules/form";
	import { UserModule } from "@/store/modules/user";
	import { PermissionModule } from "@/store/modules/permission";
	import MHeader from "@/components/m-header/m-header.vue";
	// import FormData from "@/views/form/form-data.vue";
	//	import FormRelationEvent from "@/utils/form/FormRelationEvent";
	import AppIcon from "./_components/appIcon.vue";
	import THEME from "./theme.json";
	import { bMobile } from "@/utils/global";
	export default {
		name: "App",
		components: {
			MHeader,
			// FormData,
			AppIcon,
		},
		data() {
			return {
				formMatrix2: [],
				form: {},
				option: { column: [] },
				value: "1",
				appName: window.sessionStorage.getItem("appName") || "",
				flowType: "",
				formName: "",
				reload: true,
				bShowMenu: true,
				key: 1,
				isCollapse: false,
				themeStyle: {},
				direction: "slide-right",
				routePath: "",
				searchInfo: "",
				infoVal: "",
				valId: "",
				loading: false,
				selectInfo: [],
				filterName: [],
				filterName2: [],
				arr: [],
				newArr: [],
				imgOff: true,
				leftSideShow: true, //左侧栏显示
				btnShow: true,
			};
		},
		created() {
			this.loadPage();
			this.themeStyle = THEME.theme1;

			if (localStorage.loginType == "guest") {
				this.leftSideShow = false;
				this.btnShow = false;
			}
			if (bMobile) {
				this.btnShow = false;
				if (this.$route.params.formCode) {
					this.leftSideShow = false;
				}
			}
		},
		computed: {
			isMobile() {
				return "ontouchend" in window;
			},
			curAppIcon() {
				const curApp = FormModule.curApp;
				const { icon, color } = curApp;
				return {
					icon,
					color,
				};
			},
			curAppName() {
				const curApp = FormModule.curApp;
				const lang = localStorage.getItem("lang") || "zh";

				return curApp.multiLanguage[lang] || curApp.multiLanguage["zh"];
			},
			curFormType() {
				return FormModule.curFormType;
			},
			isCurPerm() {
				return PermissionModule.isCurPerm;
			},
			curPerm() {
				return PermissionModule.curPerm;
			},
			isAppDesign() {
				return PermissionModule.isAppDesign;
			},
		},
		watch: {
			$route(newVal, oldVal) {
				this.routePath = newVal.params.formCode;

				if (newVal.params.appCode != oldVal.params.appCode) {
					this.appCode = newVal.params.appCode;
					this.getForm(newVal.params.appCode, newVal.params.formCode);
					this.getList();
				}
			},
		},
		methods: {
			leave() {
				this.imgOff = true;
			},
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
				this.newArr = [];
				this.selectInfo = [];
				if (query !== "") {
					this.imgOff = false;
					this.loading = true;
					this.fn(this.formMatrix2, this.selectInfo);
					this.loading = false;
					this.filterName = this.selectInfo.filter((item) => {
						return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
					});
					this.filterName2 = this.formMatrix2.filter((item) => {
						return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
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
				} else {
					this.imgOff = true;
					this.newArr = [];
					//this.selectInfo=[]
				}
			},
			handleInfo(el) {
				this.searchInfo = "";
				this.infoVal = el;
				this.imgOff = true;
				if (el.type == "S") {
					this.formMatrix2.forEach((item) => {
						if (item.id == el.id) {
							item.checked = true;
						} else {
							item.checked = false;
						}
					});
				} else {
					let test = this.formMatrix2.find((item) => {
						if (item.children) {
							let demo = item.children.map((it) => it.id);
							return demo.includes(el.id);
						}
					});

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
					this.edit(el.code, el.type);
				}
			},
			passValue(val) {
				this.bShowMenu = val;
			},
			handleShowMenu() {
				//this.bShowMenu = !this.bShowMenu;
				console.log("show");
			},
			loadPage() {
				this.appCode = this.$route.params.appCode;
				this.getList();
				// if (this.$route.params.formCode) {

				// 	this.getForm(this.appCode, this.$route.params.formCode);
				// }
			},
			getList() {
				/* getFormList(this.appCode).then((res) => {
					this.formList = res.data || [];
					FormModule.setFormList(res.data || []);
				}); */
				FormModule.queryFormsTree(this.appCode).then((result) => {
					this.updateList = [];
					this.formMatrix2 = result.map((item) => {
						return item.type == "S"
							? {
									...item,
									checked: false,
							  }
							: item;
					});
					// 文件夹展开收起初始化
					if (this.$route.params.formCode) {
						this.formMatrix2.forEach((items) => {
							if (items.children && items.children.some((v) => v.code === this.$route.params.formCode)) {
								this.collapseFolder(items.id);
							}
						});
					}
				});
				// queryRecursiveTree(this.appCode).then((response) => {
				// 	const res = response.data;
				// 	this._normalizeTree2(res);

				// 	// 文件夹展开收起初始化
				// 	if (this.$route.params.formCode) {
				// 		this.formMatrix2.forEach((items) => {
				// 			if (items.children && items.children.some((v) => v.code === this.$route.params.formCode)) {
				// 				this.collapseFolder(items.id);
				// 			}
				// 		});
				// 	}
				// });
			},
			collapseFolder(items) {
				this.formMatrix2.forEach((item) => {
					if (item.id == items.id) {
						item.checked = !item.checked;
					} else {
						item.checked = false;
					}
				});
				// for (let i = 0; i < this.formMatrix2.length; i++) {
				// 	if (this.formMatrix2[i].id === id) {
				// 		let checked = !this.formMatrix2[i].checked;
				// 		this.$set(this.formMatrix2[i], "checked", checked);
				// 		break;
				// 	}
				// }
			},
			_normalizeTree2({ idRecursiveTree, formMap }) {
				// idRecursiveTree = idRecursiveTree || [];
				// formMap = formMap || [];
				// const ret = [];
				// for (let i = 0; i < idRecursiveTree.length; i++) {
				// 	const id = idRecursiveTree[i].id;
				// 	//初始化给仪表盘类型
				// 	if (formMap[id]?.code && formMap[id].code == this.$route.params.formCode) {
				// 		console.log(this.appCode, formMap, id, formMap[id].type, 3333);
				// 		FormModule.setForm({
				// 			appCode: this.appCode,
				// 			formCode: formMap[id].code,
				// 			type: formMap[id].type,
				// 		});
				// 	}
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
				// 		code: formMap[item.id].code,
				// 		children: item.childList.filter((v) => formMap[v.id]).map((v) => createForm(v.id)),
				// 	};
				// }
				// function createForm(id) {
				// 	return {
				// 		id: id,
				// 		...formMap[id],
				// 	};
				// }
				// this.formMatrix2 = ret.map((item) => {
				// 	return item.type == "S"
				// 		? {
				// 				...item,
				// 				checked: false,
				// 		  }
				// 		: item;
				// });
			},
			getForm(appCode, formCode) {
				const that = this;
				if (!appCode || !formCode) return;

				getFormSingle(appCode, formCode).then((res) => {
					this.flowType = res.data?.type || "";
					this.formName = res.data?.name || "";

					const options = Object.keys(structure || {}).length == 0 ? { configList: [] } : structure;
					this.option = options;

					FormModule.setForm({
						options: this.option,
						name,
						type,
					});
				});
			},
			edit(code, type = "C") {
				let formType = {
					F: "form",
					C: "form",
					P: "bi_form",
					D: "date",
				}[type];

				this.formMatrix2.forEach((item) => {
					if (item.children) {
						let demo = item.children.map((it) => it.code);
						var k = demo.includes(code);
						if (k == false) {
							item.checked = false;
						}
					}
				});

				const { tenantId } = this.$route.params;

				FormModule.setForm({
					appCode: this.appCode,
					formCode: code,
					type,
				});

				if (this.$route.path === `/${tenantId}/app/${this.$route.params.appCode}/p/${formType}/${code}`) {
					return;
				}
				const bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
					navigator.userAgent
				);
				if (bMobile) {
					this.bShowMenu = false;
				}
				this.value = "1";
				this.form = {};
				FormModule.SET_QUERYFORM({});

				this.$router.push({
					path: `/${tenantId}/app/${this.$route.params.appCode}/p/${formType}/${code}`,
				});
				// this.getForm(this.appCode, code);
			},
			submit(form, done) {
				saveData(this.appCode, this.$route.params.formCode, form)
					.then((res) => {
						if (res.data) {
							this.$message({
								type: "success",
								message: this.$t("global.submitted", [this.$t("global.success")]),
								onClose: () => {
									done(); // 解除防重提交
									this.$refs.form.resetForm();
								},
							});
						} else {
							this.$message.error(res.msg);
						}
						// 流程表单 发起流程
						if (this.curFormType === "F") {
							changeFlowState({
								dataId: res.data,
								formCode: this.$route.params.formCode,
								status: -1,
								message: "批准",
							});
						}
					})
					.catch((err) => {
						this.$message.error(err.msg);
					})
					.finally(() => {
						//this.form = {};
					});
			},
			save() {
				const row = this.form;
				Reflect.ownKeys(row).forEach((key) => !row[key] && (row[key] = null));
				saveData(this.appCode, this.$route.params.formCode, row)
					.then((res) => {
						if (res.data) {
							this.$message.success("暂存成功");
						} else {
							this.$message.error(res.msg);
						}
					})
					.catch((err) => {
						this.$message.error(err.msg);
					})
					.finally(() => {
						this.$refs.form.resetForm();
						this.form = {};
					});
			},
			error(err) {
				console.log(err);
			},
			go(url) {
				const { tenantId, appCode } = this.$route.params;
				this.$router.push(`/${tenantId}/app/${appCode}/p/flow/todo`);
			},
		},
	};
</script>

<style lang="scss" scoped>
	.customizeIcon {
		position: absolute;
		right: 15px;
		top: 60px;
		z-index: 10;
		opacity: 0.5;
	}

	.sketchImg {
		margin: 5px 10px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		padding-top: 5px;
	}
	@media screen and (max-width: 480px) {
		.searchImg {
			margin-right: 25px !important;
		}
	}
	.searchImg {
		width: 22px;
		margin-right: 5px;
	}
	.header-app-name {
		display: inline-block;
		width: 40%;
		min-width: 250px;
		@include ExtraNotDisplayed();
	}
	.form-list {
		background: #fff;
		@include PositionAbsoulte(56px, 0, 0, 0);
		display: flex;

		.iconR {
			transition: all 0.8s cubic-bezier(0.46, 1, 0.23, 1) 0s;
			position: absolute;
			z-index: 1000;
			cursor: pointer;
			top: 40%;
		}
		.avue-empty {
			@include PositionAbsoulte(20%, null, null, 50%);
			transform: translateX(-50%);
		}
		.iconSwitch {
			background-color: rgba(76, 129, 255, 0.5);
			color: #fff;
			height: 50px;
			line-height: 45px;
			padding: 2px;
			border-radius: 3px;
			font-weight: bold !important;
		}
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
	.form-list-left {
		@include PositionRelative(280px, 100%);
		transition: all 0.8s cubic-bezier(0.46, 1, 0.23, 1) 0s;
		border-right: 1px solid #e0e0e0;
		overflow: hidden;
		.app-flowcenter {
			padding: 10px 0;
			overflow: hidden;
			border-bottom: 1px solid #e9e9e9;
			.flow-node {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40px;
				padding: 0 20px;
				cursor: pointer;
				&:hover {
					background-color: #d8e1ff;
				}
				.flow-content {
					display: flex;
					flex: 1 1 auto;
					align-items: center;
					line-height: 40px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					.node-text {
						flex: 1 1 auto;
						padding-left: 12px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.left-scroll {
			padding-bottom: 103px;
			width: 100%;
			height: 100%;
			background-color: #334054;
			color: #666;
			@include PositionAbsoulte();
			overflow-x: hidden;
			overflow-y: auto;
			font-size: 12px;
		}
	}
	.top-tab {
		display: block;
		@include PositionRelative(null, 40px);
		line-height: 40px;
		font-size: 14px;
		background: #fff;
		padding: 0 15px 0 20px;
	}
	.header-icon {
		margin-left: 20px;
		margin-right: 14px;
	}
	.one-item {
		position: relative;
		cursor: pointer;
		line-height: 38px;
		padding: 0 21px;
		font-size: 14px;
		@include JustityAndFlexWrap(flex, space-between, center, null);
		color: #666;
		&.focus {
			color: #f4f4f5;
			background-color: #515c6d;
			&.theme1 {
				color: #6087fd;
				background-color: #d8e1ff;
			}
			&:before {
				@include PositionAbsoulte(0, null, null, 0);
				bottom: auto;
				content: "";
				width: 3px;
				height: 38px !important;
				background: #6087fd;
				box-sizing: border-box;
			}
		}
		.one-item-name {
			width: 220px;
			text-align: left;
			@include ExtraNotDisplayed();
		}
	}
	.one-item:hover {
		background-color: #d8e1ff;
	}
	.theme2 {
		color: #6087fd;
		//background: #d8e1ff;
		background: #f0f7ff;
	}
	.form-list-right {
		// right: 0;
		flex: 1;
		overflow: auto;
		flex-direction: column;
		// .header {
		// 	border-bottom: solid 1px #e2e2e2;
		// }
		.entry-content {
			margin: 10px 0;
		}
	}
	// ::v-deep .el-input--small .el-input__inner{
	// 	text-align: center;
	// }
</style>

<style lang="scss">
	.RvueNoData {
		width: 100%;
		height: 100%;
		@include JustityAndFlexWrap(flex, center, center, null);
		font-weight: 700;
		font-size: 18px;
		color: #91a1b7;
		padding-top: 200px;
	}
	.form-list-right {
		.special-tabs {
			.el-tabs__nav {
				.el-tabs__item {
					padding: 0 15px;
				}
			}
		}
	}
	.form-list-right::-webkit-scrollbar {
		display: none;
	}
	.icon-container {
		@include PositionRelative(20px, 20px);
		display: inline-block;
		line-height: 20px;
		text-align: center;
		@include GlobalAvatar(null, null, 3px);
	}
	.el-collapse,
	.el-collapse-item__header,
	.el-collapse-item__wrap {
		border-bottom: none !important;
	}
	.el-collapse-item__arrow {
		display: none !important;
	}
	.ae-entry-list {
		width: 100%;
		// margin-top: 34px;
		// padding-left: 14px;
		.group-pane {
			overflow: visible;
			.item-group {
				line-height: 38px;
				&:hover {
					background-color: #d8e1ff;
				}
				.item {
					width: 100%;
					display: flex;
					align-items: center;
					padding-right: 19px;
					cursor: pointer;
					h3 {
						@include ExtraNotDisplayed();
						font-weight: 700;
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
					padding-left: 50px;
				}
			}
		}
		.item-pane {
			display: block;
			position: relative;
			overflow: visible;
			.one-item-name {
				.icon-container {
					margin-right: 9px;
				}
			}
		}
	}
	::v-deep .appPub-dialog {
		.el-dialog {
			margin-top: 10vh !important;
		}
		.el-dialog__body {
			border-bottom: none !important;
			height: calc(100vh - 20vh);
		}
	}
	// .radio-btn {
	// 	@include PositionRelative(100%, null);
	// 	z-index: 99;
	// 	i {
	// 		cursor: pointer;
	// 	}
	// }
	.el-tooltip__popper.is-dark.one-item-popper {
		width: auto !important;
	}
</style>
