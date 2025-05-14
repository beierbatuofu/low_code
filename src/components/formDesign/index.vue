<template>
	<div class="form-designer">
		<el-container>
			<!-- 左侧字段 -->
			<el-aside :width="leftWidth" style="margin-left: 5px; border-radius: 10px">
				<div class="fields-list">
					<div v-for="(field, index) in widgetList" :key="index">
						<template v-if="field.list.find((f) => includeFields.includes(f.type))">
							<div class="field-title">
								{{ t("global." + field.title) }}
							</div>
							<draggable
								tag="ul"
								:list="field.list"
								:group="{
									name: 'form',
									pull: 'clone',
									put: false,
								}"
								ghost-class="ghost"
								:sort="false"
								:move="onMove"
								@start="start"
								@end="onEnd"
							>
								<template v-for="(item, index) in field.list">
									<li class="field-label" :class="item.type" v-if="includeFields.includes(item.type)" :key="index">
										<a @click="handleFieldClick(item)">
											<i class="icon" :class="`${item.icon.indexOf('el-') > -1 ? item.icon : 'iconfont ' + item.icon}`"></i>
											<!-- <span>{{ t('global.'+(item.title || item.label)) }}</span> -->
											<span>{{ t("Rfield." + item.type) }}</span>
										</a>
									</li>
								</template>
							</draggable>
						</template>
					</div>
				</div>
			</el-aside>
			<!-- 中间主布局 -->
			<el-container class="widget-container" style="margin: 0 5px; border: none; background: #fff; border-radius: 10px" direction="vertical">
				<el-header class="widget-container-header">
					<div style="display: block; width: 100%; text-align: right">
						<slot name="toolbar-left"></slot>
						<el-button v-if="toolbar.includes('preview')" size="small" @click="handlePreview">{{ t("global.preview") }}</el-button>
						<slot name="toolbar"></slot>
					</div>
				</el-header>
				<el-main
					:style="{
						background: widgetForm.configList && widgetForm.configList.length == 0 ? `url(${widgetEmpty}) no-repeat 50%` : '',
					}"
				>
					<!-- {{widgetForm}} -->
					<!--同步 -->
					<widget-form @selectBoxIdx="selectBoxIdx" ref="widgetForm" :widgetForm.sync="widgetForm" :select.sync="widgetFormSelect" @updateWidgetConfig="bindChangeWidgetConfig"></widget-form>
				</el-main>
			</el-container>
			<!-- 右侧配置 -->
			<el-aside class="widget-config-container" :width="rightWidth" style="margin-right: 5px; border-radius: 10px; padding: 10px">
				<!-- <el-tabs v-model="configTab" stretch>
					<el-tab-pane label="字段属性" name="widget" style="padding: 0 10px；color:#000;">
					
					</el-tab-pane>
					<el-tab-pane label="表单属性" name="form" lazy style="padding: 0 10px">
						<form-config :data="widgetForm"></form-config>
					</el-tab-pane>
				</el-tabs> -->

				<widget-config :config="widgetFormSelect" :oldOptions="oldOptions" :configList="widgetForm.configList" :key="widgetConfigIdx"></widget-config>
			</el-aside>
			<!-- 弹窗 -->
			<!-- 预览 -->
			<el-drawer :visible.sync="previewVisible" size="60%" append-to-body :before-close="handleBeforeClose">
				<rvue-form-box v-if="previewVisible" formType="add" ref="form" mode="preview" class="preview-form" :option="widgetFormPreview" v-model="widgetModels" @submit="handlePreviewSubmit">
				</rvue-form-box>

				<!-- <div class="drawer-foot">
					<el-button size="medium" type="primary" @click="handlePreviewSubmit"
						>确定</el-button
					>
					<el-button size="medium" type="danger" @click="handleBeforeClose"
						>取消</el-button
					>
				</div> -->
			</el-drawer>
		</el-container>
	</div>
</template>

<script>
	import beautifier from "./utils/json-beautifier";
	// import MonacoEditor from "./utils/monaco-editor";
	import widgetEmpty from "./assets/widget-empty.png";
	import history from "./core/history";
	import lang from "./core/lang";
	import Draggable from "vuedraggable";
	import WidgetForm from "./WidgetForm";
	import FormConfig from "./FormConfig";
	import WidgetConfig from "./WidgetConfig";
	import WidgetConfDef from "./commons/WidgetConfDef";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import { refreshJump } from "@/utils/global";
	import { clearTimeout, setTimeout } from "timers";
	const widgetList = WidgetConfDef.widgetList;

	export default {
		name: "FormDesign",
		components: {
			Draggable,
			// MonacoEditor,
			WidgetForm,
			FormConfig,
			WidgetConfig,
		},
		mixins: [history, lang],
		props: {
			options: {
				type: [Object, String],
				default: () => {
					return {
						configList: [],
					};
				},
			},
			oldOptions: {
				type: [Object],
				default: () => ({}),
			},
			storage: {
				type: Boolean,
				default: false,
			},
			asideLeftWidth: {
				type: [String, Number],
				default: "270px",
			},
			asideRightWidth: {
				type: [String, Number],
				default: "380px",
			},
			showGithubStar: {
				type: Boolean,
				default: true,
			},
			toolbar: {
				type: Array,
				default: () => {
					return ["import", "generate", "preview", "clear"];
				},
			},
			undoRedo: {
				type: Boolean,
				default: true,
			},
			includeFields: {
				type: Array,
				default: () => {
					const arr = [];
					widgetList.forEach((f) => {
						f.list.forEach((c) => {
							arr.push(c.type);
						});
					});

					return arr;
				},
			},
			customFields: {
				type: Array,
			},
		},
		watch: {
			options: {
				handler(val) {
					this.widgetForm = this.options;
					//this.oldOptions = JSON.parse(JSON.stringify(this.options));
					if (this.widgetForm.hasOwnProperty("configList") && this.widgetForm.configList.length) {
						this.widgetFormSelect = this.widgetForm.configList[0];
					}
				},
				immediate: true,
			},
			widgetFormSelect(newVal, oldVal) {
				// 表单设计器中切换组件时，验证当前控件属性值
				WidgetConfDef.validateWidgetConf(oldVal);
				this.$emit("submit", this.widgetForm);
				let fullPath = this.$route.fullPath;
				let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd/"));
				let jumpPath = supPath + "appd/" + this.$route.params.appCode + "/p/";
				console.log(jumpPath, "jumpPath");
				refreshJump(fullPath, this, jumpPath);
			},
		},
		destroyed() {
			// window.onbeforeunload()
		},
		computed: {
			leftWidth() {
				if (typeof this.asideLeftWidth == "string") {
					return this.asideLeftWidth;
				} else {
					return `${this.asideLeftWidth}px`;
				}
			},
			rightWidth() {
				if (typeof this.asideRightWidth == "string") {
					return this.asideRightWidth;
				} else {
					return `${this.asideRightWidth}px`;
				}
			},
		},
		data() {
			return {
				bWidgetFormSelect: true,
				widgetEmpty,
				widgetList: WidgetConfDef.widgetList,
				widgetConfigIdx: 0,
				timeout: null,
				widgetForm: {
					configList: [],
					labelPosition: "top",
					labelSuffix: "",
					labelWidth: 120,
					gutter: 0,
					menuBtn: true,
					submitBtn: true,
					submitText: "提交",
					emptyBtn: false,
					emptyText: "清空",
					menuPosition: "center",
				},
				widgetFormPreview: {},
				configTab: "widget",
				widgetFormSelect: {},
				previewVisible: false,
				generateJsonVisible: false,
				importJsonVisible: false,
				importJson: {},
				widgetModels: {},
				configOption: {
					generateType: "json",
					space: 2,
					quoteType: "single",
					dropQuotesOnKeys: true,
				},
				history: {
					index: 0, // 当前下标
					maxStep: 20, // 最大记录步数
					steps: [], // 历史步数
				},
				dragItem: "", //拖拽元素
				selectChildInfo: {},
			};
		},

		// mounted() {
		// 	window.onbeforeunload = null;
		// 	window.onpopstate = null;
		// },

		methods: {
			selectBoxIdx(info) {
				this.selectChildInfo = info;
			},
			bindChangeWidgetConfig(index) {
				this.widgetConfigIdx = new Date().getTime() * 1;
				this.widgetFormSelect = index == -1 ? {} : this.widgetForm.configList[index];
			},
			// 左侧字段点击
			handleFieldClick(newItem) {
				if (this.options.configList.findIndex((item) => item.type == "sn" && newItem.type == "sn") >= 0) {
					this.$message({
						type: "warning",
						message: "表单中仅可添加一个流水号字段",
					});
					return false;
				}
				let blackList = ["table", "separator", "tab", "sn"];
				let newIndex = this.widgetForm.configList.findIndex((c) => c.fieldId == this.widgetFormSelect.fieldId) + 1;
				if (Object.keys(this.selectChildInfo).length) {
					for (let idx = 0; idx <= this.widgetForm.configList.length - 1; idx++) {
						let item = this.widgetForm.configList[idx];
						if (item.fieldId == this.selectChildInfo.parentId && item.type == "tab") {
							//TODO rfieldTab 组件
							this.selectChildInfo.comp.$refs[`widgetFormTab_${this.selectChildInfo.groupIdx}`][0].handleWidgetAdd({
								newIndex: this.selectChildInfo.rowIdx + 1,
								newItem,
							});
						}
					}

					return;
				}

				if (newIndex === 0 && this.widgetForm.configList.length > 0) {
					if (blackList.includes(newItem.type)) return;
					//找子表格id
					let tableFieldId = "";
					let tableFieldIndex = 0;
					this.widgetForm.configList.map((item, index) => {
						item.children &&
							item.children.filter((ele) => {
								if (this.widgetFormSelect.fieldId == ele.fieldId) {
									tableFieldId = item.fieldId;
									tableFieldIndex = index;
								}
							});
					});
					//找选中的是第几个
					try {
						const newTableIndex = this.widgetForm.configList[tableFieldIndex].children.findIndex((c) => c.fieldId == this.widgetFormSelect.fieldId) + 1;
						this.$refs.widgetForm.$refs[tableFieldId][0].$refs[tableFieldId].$refs["widgetFormTable"].handleWidgetTableAdd(
							{ newIndex: newTableIndex, newItem },
							this.widgetForm.configList[tableFieldIndex]
						);
					} catch (err) {
						this.$refs.widgetForm.handleWidgetAdd({ newIndex, newItem });
					}
				} else {
					this.$refs.widgetForm.handleWidgetAdd({ newIndex, newItem });
				}

				//this.selectChildInfo = {};
			},
			// 预览 - 弹窗
			handlePreview() {
				if (!this.widgetForm.configList || this.widgetForm.configList.length == 0) return;
				else {
					this.transformToAvueOptions(this.widgetForm).then((data) => {
						const formPreview = Object.assign({}, data);

						formPreview.configList = formPreview.configList.map((item) => {
							const eventKeys = ["click", "change", "blur", "focus"];
							eventKeys.forEach((event) => {
								if (item[event]) item[event] = new Function("eventParams", item[event]);
							});
							return item;
						});

						formPreview["submitBtn"] = false;
						formPreview["submitText"] = "";

						let configList = formPreview.configList.map((item) => {
							let { tip, ...params } = item;
							return params;
						});

						formPreview.configList = configList;

						this.widgetFormPreview = formPreview;
						this.previewVisible = true;
						//设为编辑
						this.$nextTick(() => {
							this.$refs.form.resetAllReadonly();
						});
					});
				}
			},

			// 预览 - 弹窗 - 确定
			handlePreviewSubmit(tableList, done) {
				if (done) {
					// this.$alert(this.widgetModels)
					// 	.then(() => {
					// 		done();
					// 	})
					// 	.catch(() => {
					// 		done();
					// 	});
					//测试拿到表格数据
					let arr = [];
					arr = this.widgetFormPreview.configList[0].tableList.map((item) => {
						let obj = {};
						obj[Object.keys(item)[2]] = item[Object.keys(item)[2]];
						return item;
					});
					this.$alert(arr)
						.then(() => {
							done();
						})
						.catch(() => {
							done();
						});
				} else {
					this.$refs.form.validate((valid, done) => {
						if (valid)
							this.$alert(this.widgetModels)
								.then(() => {
									done();
								})
								.catch(() => {
									done();
								});
					});
				}
			},
			//设置表格对应数据
			setListHandler(list) {
				this.widgetFormPreview.configList.forEach((item) => {
					if (item.prop == list[0].parentProp) {
						item.tableList = list;
					}
				});
				console.log("在这打印数据", this.widgetFormPreview);
			},
			// 预览 - 弹窗 - 关闭前
			handleBeforeClose() {
				this.$refs.form.resetForm();
				this.widgetModels = {};
				this.previewVisible = false;
			},
			// 表单设计器配置项 转化为 Avue配置项

			transformToAvueOptions(obj) {
				return Promise.resolve(this.$utils.deepClone(obj));
			},

			async getData(type = "json") {
				return await this.transformToAvueOptions(this.widgetForm);
			},
			onMove(e, originalEvent) {
				if (this.options.configList.findIndex((item) => item.type == "sn") >= 0 && e.draggedContext.element.type == "sn") {
					if (this.timeout) return false;
					this.$message({
						type: "warning",
						message: "表单中仅可添加一个流水号字段",
					});
					this.timeout = setTimeout(() => {
						this.timeout = null;
					}, 1000);
					return false;
				}
				if (
					["tab", "sn"].includes(e.draggedContext.element.type) &&
					(e.relatedContext.component.$el.className == "widget-form-tab" || e.relatedContext.component.$el.className.indexOf("widget-form-table-content") > -1)
				) {
					return false;
				}

				//自己是表格并且扔到表格
				if (this.dragItem.indexOf(e.to.className) !== -1) {
					return false;
				}
				if ((this.dragItem.indexOf("table") > -1 || this.dragItem.indexOf("separator") > -1) && e.to.className.indexOf("widget-form-table-content") > -1) {
					return false;
				}
			},
			start(e) {
				this.dragItem = e.clone.className;
			},
			onEnd(e, originalEvent) {
				console.log(
					this.options.configList.findIndex((item) => item.type == "sn"),
					e,
					originalEvent
				);
				if (this.options.configList.findIndex((item) => item.type == "sn") >= 0) {
				}
				console.log("end");
			},
		},
	};
</script>

<style lang="scss">
	@import "./assets/index.scss";
	.form-designer {
		background: #eff4f7;
		height: calc(100vh - 56px) !important;
	}
	#tab-widget {
		color: #000;
	}
	.form-designer .fields-list .field-label {
		height: 32px;
	}
	.form-designer .fields-list .field-label a {
		height: 32px;
		line-height: 30px;
	}
	.el-tabs__content {
		// padding: 10px;
	}
	.el-input-number.is-without-controls .el-input__inner {
		text-align: left;
		padding-left: 30px;
		padding-right: 30px;
	}
	.preview-form {
		overflow-y: scroll;
		height: 83vh;
	}
</style>
<style lang="css">
	.icon-github:before {
		content: "\e677";
	}

	.icon-title:before {
		content: "\e760";
	}

	.icon-icon:before {
		content: "\e609";
	}

	.icon-array:before {
		content: "\e7a5";
	}

	.icon-url:before {
		content: "\e6f5";
	}

	.icon-img:before {
		content: "\e889";
	}

	.icon-group:before {
		content: "\e61f";
	}

	.icon-clear:before {
		content: "\e629";
	}

	.icon-copy:before {
		content: "\e67a";
	}

	.icon-dynamic:before {
		content: "\e6f4";
	}

	.icon-map:before {
		content: "\e6fe";
	}

	.icon-upload:before {
		content: "\e71a";
	}

	.icon-month:before {
		content: "\e61c";
	}

	.icon-week:before {
		content: "\e61d";
	}

	.icon-year:before {
		content: "\e61b";
	}

	.icon-time-range:before {
		content: "\e673";
	}

	.icon-datetime-range:before {
		content: "\e60e";
	}

	.icon-datetime:before {
		content: "\e6e4";
	}

	.icon-date-range:before {
		content: "\e6d4";
	}

	.icon-tree:before {
		content: "\e69b";
	}

	.icon-password:before {
		content: "\e62a";
	}

	.icon-date:before {
		content: "\e606";
	}

	.icon-link:before {
		content: "\e76f";
	}

	.icon-delete:before {
		content: "\e7a4";
	}

	.icon-oa:before {
		content: "\e619";
	}

	.icon-richtext:before {
		content: "\e647";
	}

	.icon-number:before {
		content: "\e654";
	}

	.icon-radio:before {
		content: "\e66f";
	}

	.icon-image:before {
		content: "\e626";
	}

	.icon-table:before {
		content: "\e650";
	}

	.icon-time:before {
		content: "\e614";
	}

	.icon-grid:before {
		content: "\e602";
	}

	.icon-checkbox:before {
		content: "\e752";
	}

	.icon-slider:before {
		content: "\e60d";
	}

	.icon-textarea:before {
		content: "\e68b";
	}

	.icon-switch:before {
		content: "\e683";
	}

	.icon-select:before {
		content: "\e64e";
	}

	.icon-star:before {
		content: "\e794";
	}

	.icon-color:before {
		content: "\e608";
	}

	.icon-input:before {
		content: "\e601";
	}
</style>
